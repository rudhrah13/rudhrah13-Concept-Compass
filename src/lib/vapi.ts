import Vapi from "@vapi-ai/web";

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

export async function startTeachingCall(studentName: string, topic: string) {
  await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
    variableValues: {
      studentName,
      topic,
    },
  });
}