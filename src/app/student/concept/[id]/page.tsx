// page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mic, Pause, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { startTeachingCall, vapi } from '@/lib/vapi';
import type { Concept, StudentAttempt } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { evaluateConcept } from '@/ai/flows/evaluate-concept';
import { startConversation } from '@/ai/flows/start-conversation-flow';
import { continueConversation } from '@/ai/flows/continue-conversation-flow';

const mockConcept: Concept = {
  id: 'sci1',
  name: 'Photosynthesis',
  status: 'In Progress',
  questions: [
    'Explain photosynthesis in your own words.',
    'What happens if sunlight is not available?',
  ],
};


// #####################################

// #Add it in your env.local
// NEXT_PUBLIC_VAPI_PUBLIC_KEY=681788e3-c222-489d-8cbb-e8fe9756ef29
// NEXT_PUBLIC_VAPI_ASSISTANT_ID=9ccfdd2e-b58e-40c5-b518-c5965fec5944
  
// ######################################


export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  
  const [conceptData, setConceptData] = useState<Concept | null>(null);
  const [status, setStatus] = useState<"idle" | "connected" | "ended" | "error">("idle");

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

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Call started");
      setStatus("connected");
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setStatus("ended");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setStatus("error");
    });

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would save the answers here
    router.push(`/student/feedback/${id}`);
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
      setSessionState('error');
    }
  };

  const startCall = async () => {
    try {
      const studentName = localStorage.getItem('studentName') || 'Student';
      const topic = conceptData?.name || 'the concept';
      
      await startTeachingCall(studentName, topic);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const endCall = async () => {
    try {
      await vapi.stop();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /> Loading concept...</div>;
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
    setFullTranscript('');
    setQuestions([]);
    setAnswers([]);
  };
  
  const renderControls = () => {
    switch(sessionState) {
        case 'idle':
            return (
                <Button onClick={startSession} size="lg" className="rounded-full w-32 h-32 flex flex-col items-center">
                    <Mic className="h-12 w-12 mb-1" />
                    Start Speaking
                </Button>
            );
        case 'recording':
        case 'paused':
            return (
                <div className="flex items-center justify-center space-x-4">
                    <Button onClick={togglePause} variant="outline" size="lg" className="rounded-full w-28 h-28 flex flex-col items-center">
                        {sessionState === 'recording' ? <Pause className="h-10 w-10 mb-1" /> : <Mic className="h-10 w-10 mb-1" />}
                        {sessionState === 'recording' ? 'Pause' : 'Resume'}
                    </Button>
                    <Button onClick={() => endConversation()} variant="destructive" size="lg" className="rounded-full w-28 h-28 flex flex-col items-center">
                        <Square className="h-10 w-10 mb-1" />
                        End
                    </Button>
                </div>
            );
        case 'processing':
        case 'waitingForAI':
             return (
                 <div className="flex flex-col items-center text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground mt-2">{sessionState === 'processing' ? 'Starting...' : 'Listening...'}</p>
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

      <header className="mb-8">
        <p className="text-lg font-semibold text-primary">{conceptData.name}</p>
        <h1 className="text-3xl font-bold">Explain the idea in your own words.</h1>
        <p className="text-muted-foreground mt-2">This is not an exam.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Vapi Voice Assistant</CardTitle>
          <CardDescription>Interact with the AI assistant to understand the concept.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Status: <strong>{status}</strong></p>
          <div className="flex gap-4">
            <Button onClick={startCall} disabled={status === "connected"}>Start Call</Button>
            <Button onClick={endCall} disabled={status !== "connected"} variant="outline">End Call</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
