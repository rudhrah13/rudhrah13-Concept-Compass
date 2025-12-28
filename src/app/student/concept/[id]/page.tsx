
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check, ThumbsUp, AlertTriangle, Lightbulb, BookOpen, Pencil, X, BrainCircuit, Puzzle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { startTeachingCall, vapi, waitForOutput } from '@/lib/vapi';
import type { DemoConcept } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { initializeDemoData, getConcepts } from '@/lib/demo-data';


// VAPI Feedback Display Component
function VapiFeedbackDisplay({ feedback }: { feedback: any }) {
  if (!feedback) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs_work': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Check className="h-5 w-5" />;
      case 'good': return <ThumbsUp className="h-5 w-5" />;
      case 'needs_work': return <AlertTriangle className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <Separator />
      <h2 className="text-xl font-semibold text-center text-muted-foreground">Understanding Summary</h2>

      {/* Status Badge */}
      <Card>
        <CardContent className="flex items-center justify-center p-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${getStatusColor(feedback.status)}`}>
            {getStatusIcon(feedback.status)}
            <span className="capitalize">{feedback.status.replace('_', ' ')}</span>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* What you did well */}
        {feedback.goodJob && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-green-800">
                <ThumbsUp className="h-5 w-5" />
                What you did well
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-900">
                {feedback.goodJob.bullets.map((bullet: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* What needs improvement */}
        {feedback.fixThis && (
           <Card className="border-orange-200 bg-orange-50/50">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-base font-semibold text-orange-800">
               <Lightbulb className="h-5 w-5" />
               What needs improvement
             </CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="space-y-2 text-sm text-orange-900">
               {feedback.fixThis.bullets.map((bullet: string, index: number) => (
                 <li key={index} className="flex items-start gap-2">
                   <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                   <span>{bullet}</span>
                 </li>
               ))}
             </ul>
           </CardContent>
         </Card>
        )}
      </div>

      {/* Simple explanation */}
      {feedback.clearExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
              <BookOpen className="h-5 w-5" />
              Simple explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{feedback.clearExplanation}</p>
          </CardContent>
        </Card>
      )}
      
       {/* How to explain better */}
      {feedback.expressionTips && feedback.expressionTips.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
                    <Pencil className="h-5 w-5" />
                    How to explain better
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {feedback.expressionTips.map((tip: any, index: number) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">{tip.category}</p>
                    <p className="text-sm text-muted-foreground">{tip.tip}</p>
                </div>
                ))}
            </CardContent>
        </Card>
      )}


      {/* Try these next */}
      {feedback.followUpQuestions && feedback.followUpQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
              <BrainCircuit className="h-5 w-5" />
              Try these next
            </CardTitle>
             <CardDescription>
                You can try answering these to practise the concept.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {feedback.followUpQuestions.map((question: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Conversation Q&A */}
      {feedback.qaPairs && feedback.qaPairs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
              <Puzzle className="h-5 w-5" />
              Conversation Q&A
            </CardTitle>
            <CardDescription>Questions asked and your answers during the conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.qaPairs.map((qaPair: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">Q</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-primary mb-1">Question</p>
                        <p className="text-sm leading-relaxed">{qaPair.question}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">A</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-primary mb-1">Your Answer</p>
                        <p className="text-sm leading-relaxed italic text-muted-foreground">{qaPair.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [conceptData, setConceptData] = useState<DemoConcept | null>(null);
  const [status, setStatus] = useState<"idle" | "connected" | "ended" | "error">("idle");
  const [loading, setLoading] = useState(true);

  // States from previous implementation that are not fully wired up but kept for structure
  const [sessionState, setSessionState] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'waitingForAI' | 'submitting' | 'error' | 'denied'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [callId, setCallId] = useState<string | null>(null);
  const [isWaitingForResult, setIsWaitingForResult] = useState(false);
  const [result, setResult] = useState<any>(null);

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
    // Get student name from localStorage
    const name = localStorage.getItem('studentName') || 'Student';
    setStudentName(name);
  }, []);

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Call started");
      setStatus("connected");
    });

    vapi.on("call-end", async () => {
      console.log("Call ended");
      setStatus("ended");
      // Small delay to allow VAPI to finish internal cleanup
      setTimeout(async () => {
        if (callId) {
          setIsWaitingForResult(true);
          try {
            const output = await waitForOutput(callId);
            setResult(output);
          } catch (error) {
            console.error("Failed to get structured output:", error);
            setResult({ error: "Failed to get analysis" });
          } finally {
            setIsWaitingForResult(false);
          }
        }
      }, 1000); // Wait 1 second after call ends
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
      // Only stop if call is still active
      if (status === "connected") {
        try {
          vapi.stop();
        } catch (error) {
          console.error("Error stopping VAPI:", error);
        }
      }
      vapi.removeAllListeners();
    };
  }, [callId, status]);


  const startCall = async () => {
    try {
      const studentName = localStorage.getItem('studentName') || 'Student';
      const topic = conceptData?.conceptName || 'the concept';
      
      console.log('🎤 Starting Vapi call for student:', {
        studentName,
        topic,
        timestamp: new Date().toISOString()
      });
      
      const call = await startTeachingCall(studentName, topic);
      if (call?.id) {
        setCallId(call.id);
      }
    } catch (err) {
      console.error('Error starting call:', err);
      setStatus("error");
    }
  };

  const endCall = async () => {
    try {
      await vapi.stop();
    } catch (err) {
      console.error('Error ending call:', err);
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
        <p className="text-lg font-semibold text-primary">{conceptData.chapter}</p>
        <h1 className="text-3xl font-bold">Explain the idea in your own words: {conceptData.conceptName}</h1>
        <p className="text-muted-foreground mt-2">This is not an exam.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Vapi Voice Assistant</CardTitle>
          <CardDescription>
            <div className="space-y-1">
              <p>Interact with the AI assistant to understand the concept.</p>
              <div className="text-sm text-muted-foreground">
                <p><strong>Student:</strong> {studentName}</p>
                <p><strong>Topic:</strong> {conceptData.conceptName}</p>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Status: <strong>{status}</strong></p>
          <div className="flex gap-4">
            <Button onClick={startCall} disabled={status === "connected"}>Start Call</Button>
            <Button onClick={endCall} disabled={status !== "connected"} variant="outline">End Call</Button>
          </div>
          {isWaitingForResult && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing conversation...</span>
            </div>
          )}
          {result && (
            <div className="mt-4">
              {result.error ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="h-5 w-5" />
                      <span className="font-medium">Error</span>
                    </div>
                    <p className="text-red-700 mt-2">{result.error}</p>
                  </CardContent>
                </Card>
              ) : (
                <VapiFeedbackDisplay feedback={result.result} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    
    