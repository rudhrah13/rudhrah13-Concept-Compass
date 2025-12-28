'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mic, Pause, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Concept } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { evaluateConcept } from '@/ai/flows/evaluate-concept';
import { startConversation } from '@/ai/flows/start-conversation-flow';
import { continueConversation } from '@/ai/flows/continue-conversation-flow';

const mockConcept: Concept = {
  id: 'sci1',
  name: 'Photosynthesis',
  status: 'Not Started',
};

type SessionState = 'idle' | 'recording' | 'paused' | 'processing' | 'submitting' | 'denied' | 'error';

export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  
  const [conceptData, setConceptData] = useState<Concept | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store transcripts for final submission
  const [firstAnswer, setFirstAnswer] = useState('');
  const [secondAnswer, setSecondAnswer] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  useEffect(() => {
    setConceptData(mockConcept);
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSessionState('denied');
        setError('Your browser does not support voice recognition. Please use Chrome or Firefox.');
      }
    }
    // Cleanup on unmount
    return () => {
      stopRecording(true);
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }
    };
  }, [id]);

  const playAudio = (src: string, onEnded: () => void) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.oncanplaythrough = () => {
        audioRef.current?.play().catch(e => {
            setError('There was an error playing the audio.');
            onEnded();
        });
      };
      audioRef.current.onended = onEnded;
      audioRef.current.onerror = () => {
        setError('There was an error playing the audio.');
        onEnded();
      };
    }
  };

  const startSession = async () => {
    if (!conceptData) return;
    setSessionState('processing');
    setError(null);
    try {
      const { audioDataUri, questionText } = await startConversation({ conceptName: conceptData.name });
      setQuestions([questionText]);
      playAudio(audioDataUri, startRecording);
    } catch (e) {
      setError('Could not start the conversation. Please try again.');
      setSessionState('idle');
    }
  };

  const startRecording = () => {
    if (sessionState === 'recording') return;

    setSessionState('recording');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      resetSilenceTimeout();
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        if(transcript) {
            handleTranscript(transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setSessionState('denied');
      } else {
        setSessionState('error');
        setError(`Speech recognition error: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
        // The conversation flow will restart it if needed.
    };

    recognition.start();
    resetSilenceTimeout();
  };

  const stopRecording = (isCleanup = false) => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
    }
    if (!isCleanup) {
        setSessionState('idle');
    }
  };

  const handleTranscript = (transcript: string) => {
    stopRecording(); // Stop listening while processing
    setSessionState('processing');

    if (isFirstQuestion) {
        setFirstAnswer(transcript);
        setIsFirstQuestion(false);
        handleContinueConversation(transcript);
    } else {
        setSecondAnswer(transcript);
        // This was the second answer, end the conversation.
        // We need to use the state from the moment of calling, so we pass it directly
        endConversation(transcript);
    }
  };
  
  const handleContinueConversation = async (answer: string) => {
    if (!conceptData) return;
    try {
        const { audioDataUri, aiResponseText } = await continueConversation({
            conceptName: conceptData.name,
            firstAnswer: answer,
        });
        setQuestions(prev => [...prev, aiResponseText]);
        // Ask the second question, then start recording again
        playAudio(audioDataUri, startRecording);
    } catch(e) {
        setError('There was an error continuing the conversation.');
        setSessionState('error');
    }
  };

  const endConversation = async (finalAnswer?: string) => {
    stopRecording();
    setSessionState('submitting');
    
    const finalSecondAnswer = finalAnswer || secondAnswer;

    if (!conceptData || !firstAnswer || !finalSecondAnswer) {
      setError('Could not submit because one of the answers was missing.');
      setSessionState('error');
      return;
    }
    
    try {
      await evaluateConcept({
        studentId: 'S123',
        conceptId: id,
        questions: questions,
        answers: [firstAnswer, finalSecondAnswer]
      });
      router.push(`/student/feedback/${id}`);
    } catch (e) {
      setError('There was an error submitting your answers. Please try again.');
      setSessionState('error');
    }
  };

  const togglePause = () => {
    if (sessionState === 'recording') {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }
        setSessionState('paused');
    } else if (sessionState === 'paused') {
        startRecording();
    }
  }

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
        if (sessionState === 'recording' && recognitionRef.current) {
            setError("We couldn’t hear you clearly. Please speak louder or try again.");
            stopRecording();
            setSessionState('error');
        }
    }, 10000); // 10 seconds of silence
  };
  
  const handleTryAgain = () => {
    setError(null);
    setSessionState('idle');
    setFirstAnswer('');
    setSecondAnswer('');
    setQuestions([]);
    setIsFirstQuestion(true);
  };
  
  const renderControls = () => {
    switch(sessionState) {
        case 'idle':
            return (
                <Button onClick={startSession} size="lg" className="rounded-full w-28 h-28 flex flex-col items-center">
                    <Mic className="h-10 w-10 mb-1" />
                    Start Speaking
                </Button>
            );
        case 'recording':
        case 'paused':
            return (
                <div className="flex items-center justify-center space-x-4">
                    <Button onClick={togglePause} variant="outline" size="lg" className="rounded-full w-24 h-24 flex flex-col items-center">
                        {sessionState === 'recording' ? <Pause className="h-8 w-8 mb-1" /> : <Mic className="h-8 w-8 mb-1" />}
                        {sessionState === 'recording' ? 'Pause' : 'Resume'}
                    </Button>
                    <Button onClick={() => endConversation()} variant="destructive" size="lg" className="rounded-full w-24 h-24 flex flex-col items-center">
                        <Square className="h-8 w-8 mb-1" />
                        End
                    </Button>
                </div>
            );
        case 'processing':
            return (
                 <div className="flex flex-col items-center text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground mt-2">Processing...</p>
                </div>
              );
        case 'submitting':
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-semibold">Understanding your explanation...</p>
                    <p className="text-muted-foreground">Please wait a moment.</p>
                </div>
            );
        case 'error':
             return (
                <Button onClick={handleTryAgain} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            );
        case 'denied':
            return null; // The alert is already shown
        default:
            return null;
    }
  }

  if (!conceptData) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading concept...</div>;
  }
  
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <audio ref={audioRef} className="hidden" />
      <Button asChild variant="outline" className="mb-4">
        <Link href="/student/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts</Link>
      </Button>

      <header className="mb-8 text-center">
        <p className="text-lg font-semibold text-primary">{conceptData.name}</p>
        <h1 className="text-3xl font-bold">Speak freely. There are no right or wrong answers.</h1>
        <p className="text-muted-foreground">Just explain what you understand. The app is only listening.</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px] p-6">
        
        {sessionState === 'denied' && (
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Microphone Access Denied</AlertTitle>
            <AlertDescription>
                Please allow microphone access in your browser settings to continue.
            </AlertDescription>
            </Alert>
        )}

        {error && sessionState === 'error' && (
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something Went Wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        <div className="flex items-center justify-center pt-4">
            {renderControls()}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
