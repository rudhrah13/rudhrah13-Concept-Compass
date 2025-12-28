'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mic, Square, AlertTriangle, RefreshCw, Volume2 } from 'lucide-react';
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

type RecordingState = 'idle' | 'recording' | 'processing' | 'speaking' | 'denied' | 'error';
type ConversationTurn = 'initial' | 'second_question' | 'submitting' | 'done';

export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  
  const [conceptData, setConceptData] = useState<Concept | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [conversationTurn, setConversationTurn] = useState<ConversationTurn>('initial');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [firstAnswer, setFirstAnswer] = useState('');
  const [secondQuestion, setSecondQuestion] = useState('');
  
  const [transcript, setTranscript] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setConceptData(mockConcept);
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecordingState('denied');
        setError('Your browser does not support voice recognition. Please use Chrome or Firefox.');
      }
    }
  }, []);

  const handleStartConversation = async () => {
    if (!conceptData) return;
    setRecordingState('processing');
    try {
      const { audioDataUri, questionText } = await startConversation({ conceptName: conceptData.name });
      setFirstQuestion(questionText);
      playAudio(audioDataUri, () => setRecordingState('idle'));
    } catch (e) {
      setError('Could not start the conversation. Please try again.');
      setRecordingState('idle');
    }
  };

  const playAudio = (src: string, onEnded: () => void) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.oncanplaythrough = () => {
        setRecordingState('speaking');
        audioRef.current?.play();
      };
      audioRef.current.onended = onEnded;
      audioRef.current.onerror = () => {
        setError('There was an error playing the audio.');
        onEnded();
      };
    }
  };

  const startRecording = () => {
    setTranscript('');
    setRecordingState('recording');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (const result of event.results) {
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      setTranscript(prev => finalTranscript || prev);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setRecordingState('denied');
      } else {
        setRecordingState('error');
      }
    };
    
    recognition.onend = () => {
        if (recognitionRef.current) {
            stopRecording();
        }
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setRecordingState('processing');

      // Use a timeout to ensure final transcript is processed
      setTimeout(() => {
        setTranscript(currentTranscript => {
            if (currentTranscript.trim()) {
                if (conversationTurn === 'initial') {
                    setFirstAnswer(currentTranscript);
                    handleContinueConversation(currentTranscript);
                } else if (conversationTurn === 'second_question') {
                    handleSubmit(currentTranscript);
                }
            } else {
                setRecordingState('error');
            }
            return currentTranscript;
        });
      }, 500);
    }
  };

  const handleContinueConversation = async (answer: string) => {
    if (!conceptData) return;
    setConversationTurn('second_question');
    try {
        const { audioDataUri, aiResponseText } = await continueConversation({
            conceptName: conceptData.name,
            firstAnswer: answer,
        });
        setSecondQuestion(aiResponseText);
        playAudio(audioDataUri, () => setRecordingState('idle'));
    } catch(e) {
        setError('There was an error continuing the conversation.');
        setRecordingState('idle');
    }
  };

  const handleSubmit = async (secondAnswer: string) => {
    if (!conceptData) return;
    setConversationTurn('submitting');
    
    const conversationPayload = [
        { role: 'ai', content: firstQuestion },
        { role: 'student', content: firstAnswer },
        { role: 'ai', content: secondQuestion },
        { role: 'student', content: secondAnswer },
    ];
    
    try {
      await evaluateConcept({
        studentId: 'S123',
        conceptId: id,
        questions: [firstQuestion, secondQuestion],
        answers: [firstAnswer, secondAnswer]
      });
      router.push(`/student/feedback/${id}`);
    } catch (e) {
      setError('There was an error submitting your answers. Please try again.');
      setConversationTurn('second_question'); 
    }
  };

  const handleTryAgain = () => {
    setTranscript('');
    setError(null);
    setRecordingState('idle');
  };

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

      {conversationTurn === 'submitting' ? (
         <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Understanding your explanation...</p>
            <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px] p-6">
            
            {recordingState === 'denied' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Microphone Access Denied</AlertTitle>
                <AlertDescription>
                  Please allow microphone access in your browser settings to continue.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Something Went Wrong</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {transcript && (
              <div className="w-full p-4 border rounded-md bg-muted/50 text-center space-y-2">
                <Label className="font-semibold">What we heard:</Label>
                <p className="text-muted-foreground italic">&quot;{transcript}&quot;</p>
                 <p className="text-xs text-muted-foreground/80 pt-2">You don’t need perfect English. Speak naturally.</p>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4 pt-4">
              {!firstQuestion ? (
                <Button onClick={handleStartConversation} size="lg" disabled={recordingState !== 'idle'}>
                  {recordingState === 'processing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="mr-2 h-4 w-4" />
                  )}
                  Start Conversation
                </Button>
              ) : (
                <>
                  {recordingState === 'idle' && (
                    <Button onClick={startRecording} size="lg" className="rounded-full w-24 h-24 flex flex-col items-center">
                      <Mic className="h-8 w-8 mb-1" />
                      Start Speaking
                    </Button>
                  )}

                  {recordingState === 'recording' && (
                    <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full w-24 h-24 flex flex-col items-center">
                      <Square className="h-8 w-8 mb-1" />
                      Stop
                    </Button>
                  )}

                  {recordingState === 'speaking' && (
                     <div className="flex flex-col items-center text-center">
                        <Volume2 className="h-10 w-10 text-primary animate-pulse" />
                        <p className="text-muted-foreground mt-2">Listening to the question...</p>
                    </div>
                  )}

                   {recordingState === 'processing' && (
                     <div className="flex flex-col items-center text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground mt-2">Processing...</p>
                    </div>
                  )}

                  {recordingState === 'error' && (
                    <Button onClick={handleTryAgain} variant="outline" size="lg">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
