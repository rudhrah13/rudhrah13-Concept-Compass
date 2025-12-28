// page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { startTeachingCall, vapi } from '@/lib/vapi';
import type { Concept, StudentAttempt } from '@/types';
import { useProtectedRoute } from '@/hooks/use-protected-route';

// Mock data, in a real app this would come from an API
const mockConcept: Concept = {
  id: 'sci1',
  name: 'Photosynthesis',
  status: 'In Progress',
  questions: [
    'Explain photosynthesis in your own words.',
    'What happens if sunlight is not available?',
  ],
};

export default function ConceptPage() {
  const params = useParams();
  const id = params.id as string;
  useProtectedRoute('student');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conceptData, setConceptData] = useState<Concept | null>(null);
  const [status, setStatus] = useState<"idle" | "connected" | "ended" | "error">("idle");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // To test error state: setError("Failed to load concept.");
      setConceptData(mockConcept);
      setLoading(false);
    }, 500);
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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Simulate refetch
    setTimeout(() => {
      setConceptData(mockConcept);
      setLoading(false);
    }, 500);
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

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleRetry}>Try Again</Button>
      </div>
    );
  }

  if (!conceptData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Concept not found.</p>
        <Button asChild variant="link"><Link href="/student/dashboard">Back to Concepts</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
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
