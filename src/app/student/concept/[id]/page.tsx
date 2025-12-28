'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Mic, Pause, Square, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { startTeachingCall, vapi } from '@/lib/vapi';
import type { Concept, StudentAttempt, DemoConcept } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { evaluateConcept } from '@/ai/flows/evaluate-concept';
import { startConversation } from '@/ai/flows/start-conversation-flow';
import { continueConversation } from '@/ai/flows/continue-conversation-flow';
import { getConcepts, initializeDemoData } from '@/lib/demo-data';


export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  
  const [conceptData, setConceptData] = useState<DemoConcept | null>(null);
  const [status, setStatus] = useState<"idle" | "connected" | "ended" | "error">("idle");
  const [loading, setLoading] = useState(true);

  // States from previous implementation that are not fully wired up but kept for structure
  const [sessionState, setSessionState] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'waitingForAI' | 'submitting' | 'error' | 'denied'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [fullTranscript, setFullTranscript] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeDemoData();
    const concept = getConcepts().find(c => c.conceptId === id) || null;
    setConceptData(concept);
    setLoading(false);

    // Voice recognition setup and cleanup from previous implementation
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSessionState('denied');
        setError('Your browser does not support voice recognition. Please use Chrome or Firefox.');
      }
    }
    return () => {
      // stopRecording(true);
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


  const startCall = async () => {
    try {
      const studentName = localStorage.getItem('studentName') || 'Student';
      const topic = conceptData?.conceptName || 'the concept';
      
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
  
  if (!conceptData) {
    return <div className="flex items-center justify-center h-screen">Concept not found.</div>;
  }
  
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <audio ref={audioRef} className="hidden" />
      <Button asChild variant="outline" className="mb-4">
        <Link href="/student/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Concepts</Link>
      </Button>

      <header className="mb-8">
        <p className="text-lg font-semibold text-primary">{conceptData.conceptName}</p>
        <h1 className="text-3xl font-bold">Explain the idea in your own words.</h1>
        <p className="text-muted-foreground mt-2">This is not an exam.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Voice Assistant</CardTitle>
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
