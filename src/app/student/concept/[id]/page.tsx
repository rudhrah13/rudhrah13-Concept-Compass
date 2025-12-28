'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mic, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Concept } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { evaluateConcept } from '@/ai/flows/evaluate-concept';

// Mock data, in a real app this would come from an API
const mockConcept: Concept = {
  id: 'sci1',
  title: 'Photosynthesis',
  questions: [
    'Explain photosynthesis in your own words.',
    'What happens if sunlight is not available?',
  ],
};

type RecordingState = 'idle' | 'recording' | 'stopped' | 'denied' | 'error';

export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [conceptData, setConceptData] = useState<Concept | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [transcript, setTranscript] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Fetch concept data
  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setConceptData(mockConcept);
      setLoading(false);
    }, 500);
  }, [id]);

  // Check for SpeechRecognition API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecordingState('denied');
        setError('Your browser does not support voice recognition. Please try a different browser like Chrome or Firefox.');
      }
    }
  }, []);


  const startRecording = () => {
    setTranscript('');
    setRecordingState('recording');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setRecordingState('denied');
      } else if (event.error === 'no-speech') {
        setRecordingState('error');
      } else {
        setRecordingState('error');
        setError(`Error: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
        if (recognitionRef.current) { // Ensure it wasn't manually stopped
            setRecordingState(t => t === 'recording' ? 'stopped' : t);
        }
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setRecordingState('stopped');
    }
  };

  const handleConfirmAnswer = async () => {
    const newAnswers = [...answers, transcript];
    setAnswers(newAnswers);
    setTranscript('');
    setRecordingState('idle');

    if (currentQuestionIndex < (conceptData?.questions?.length ?? 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        await evaluateConcept({
          studentId: 'S123', // Replace with actual student ID
          conceptId: id,
          questions: conceptData?.questions || [],
          answers: newAnswers
        });
        router.push(`/student/feedback/${id}`);
      } catch (e) {
        setError('There was an error submitting your answers. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  const handleRecordAgain = () => {
    setTranscript('');
    setRecordingState('idle');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading concept...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild variant="link"><Link href="/student/dashboard">Back to Concepts</Link></Button>
      </div>
    );
  }
  
  if (!conceptData) {
    return <div className="container mx-auto py-10 text-center"><p>Concept not found.</p></div>;
  }
  
  const currentQuestion = conceptData.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/student/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts</Link>
      </Button>

      <header className="mb-8 text-center">
        <p className="text-lg font-semibold text-primary">{conceptData.title}</p>
        <h1 className="text-3xl font-bold">Answer by speaking. This is not a test.</h1>
      </header>

      {isSubmitting ? (
         <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Understanding your explanation...</p>
            <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-normal">{currentQuestion}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[250px]">
            {recordingState === 'denied' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Microphone Access Denied</AlertTitle>
                <AlertDescription>
                  Please allow microphone access in your browser settings to continue.
                </AlertDescription>
              </Alert>
            )}

            {recordingState === 'error' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Speech Not Detected</AlertTitle>
                <AlertDescription>
                  We couldn’t hear you clearly. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {transcript && recordingState === 'stopped' && (
              <div className="w-full p-4 border rounded-md bg-muted/50 text-center space-y-2">
                <Label className="font-semibold">What we heard:</Label>
                <p className="text-muted-foreground italic">&quot;{transcript}&quot;</p>
                <p className="text-xs text-muted-foreground/80 pt-2">You don’t need perfect English. Speak naturally.</p>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4 pt-4">
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

              {recordingState === 'stopped' && transcript && (
                <>
                  <Button onClick={handleRecordAgain} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Record Again
                  </Button>
                  <Button onClick={handleConfirmAnswer} size="lg">
                    Confirm & Continue
                  </Button>
                </>
              )}
               {(recordingState === 'error' || (recordingState === 'stopped' && !transcript)) && (
                 <Button onClick={handleRecordAgain} variant="outline" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
               )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}