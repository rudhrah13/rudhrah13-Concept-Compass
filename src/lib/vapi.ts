// vapi.ts

import Vapi from "@vapi-ai/web";

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

export async function startTeachingCall(studentName: string, topic: string) {
  const call = await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
    variableValues: {
      studentName,
      topic,
    },
  });
  return call;
}

export async function getStructuredOutput(callId: string) {
  const res = await fetch(`https://api.vapi.ai/call/${callId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY!}`,
    },
  });

  if (!res.ok) throw new Error(`Call fetch failed: ${res.status}`);
  const callData = await res.json();

  const outputs = callData?.artifact?.structuredOutputs;

  // Debug: log once in a while (optional)
  // console.log("structuredOutputs keys:", outputs ? Object.keys(outputs) : []);

  if (!outputs || Object.keys(outputs).length === 0) {
    return { ready: false, reason: "no_structured_outputs_yet", callId };
  }

  const configuredId = process.env.NEXT_PUBLIC_STRUCTURED_OUTPUT_ID;
  const pickedId = (configuredId && outputs[configuredId]) ? configuredId : Object.keys(outputs)[0];

  const picked = outputs[pickedId];
  const result = picked?.result;

  if (result === undefined || result === null) {
    return { ready: false, reason: "output_present_but_no_result_yet", pickedId, picked };
  }

  return { ready: true, pickedId, name: picked?.name, result };
}

export async function waitForOutput(callId: string) {
  // Give Vapi a head start (structured outputs are post-call)
  await new Promise(r => setTimeout(r, 4000));

  for (let i = 0; i < 30; i++) {
    const data = await getStructuredOutput(callId);

    if (data.ready) return data;

    // Helpful debug every few tries
    if (i % 5 === 0) console.log("Waiting structured output:", data);

    await new Promise(r => setTimeout(r, 2000));
  }

  throw new Error("Structured output not ready (timed out). Check Call Logs + HIPAA + assistant attachment.");
}