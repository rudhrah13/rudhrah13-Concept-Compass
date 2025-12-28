You’re doing the right thing (polling after `call-end`). The timeout almost always means **Vapi never stored / never attached / or you’re looking up the wrong key**, so `call.artifact.structuredOutputs` stays empty forever.

Here are the top 3 real causes (in order), plus code fixes.

## 1) Your assistant is not actually generating structured outputs

Structured outputs only show up if the assistant has them attached in **Artifact Plan → `structuredOutputIds`** (or equivalent in your assistant config). The quickstart is explicit that the results live at `call.artifact.structuredOutputs[outputId].result`. ([docs.vapi.ai][1])

**Fast check:** go to **Call Logs** → open the same call → do you see a “Structured Outputs” section?

* **If NO** → your assistant isn’t attached to the structured output (or it failed to run).
* **If YES** → your frontend lookup is wrong (outputId mismatch / key shape).

## 2) HIPAA mode is enabled (nothing gets stored)

If `hipaaEnabled: true`, Vapi won’t store call logs/transcripts/structured outputs by default, so polling `GET /call/{id}` won’t return them. ([docs.vapi.ai][2])

For a demo, easiest is: **turn HIPAA off**.

If you *must* keep HIPAA on, you need the structured output’s compliance override (`forceStoreOnHipaaEnabled`) — otherwise you only get it via webhook (and there’s no “structured output completed” webhook; polling after end-of-call report is the recommended pattern). ([Vapi][3])

## 3) You’re using the wrong `outputId` key

In Vapi, `structuredOutputs` is an object keyed by the **Structured Output UUID**. If you accidentally put the assistant id / name / something else into `NEXT_PUBLIC_STRUCTURED_OUTPUT_ID`, you’ll never match.

**Fix:** don’t hardcode the output id at all for demo—just take the first output that appears.

---

# Patch your code to debug + “grab first output”

### `vapi.ts` — return more info + fall back to first output

```ts
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
```

### `page.tsx` — render the debug response

```tsx
const output = await waitForOutput(callId);
setResult(output);
```

And display:

```tsx
{result && (
  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
    {JSON.stringify(result, null, 2)}
  </pre>
)}
```

Now you’ll see *why* it’s not ready:

* `no_structured_outputs_yet` → attachment/HIPAA problem
* `output_present_but_no_result_yet` → it’s processing (increase waits)
* `ready: true` → you’ll get the JSON

---

# One more important detail: there’s no “structured output completed” event for the browser

Even on webhooks, Vapi support says there’s currently **no webhook that fires exactly when the structured output is done**; polling is the intended approach. ([Vapi][3])

---

If you tell me **whether Call Logs shows Structured Outputs for that same call**, I can point to the exact root cause immediately (attachment vs HIPAA vs id mismatch) without guesswork.

[1]: https://docs.vapi.ai/assistants/structured-outputs-quickstart?utm_source=chatgpt.com "Structured outputs quickstart | Vapi"
[2]: https://docs.vapi.ai/security-and-privacy/hipaa?utm_source=chatgpt.com "HIPAA Compliance - Vapi"
[3]: https://vapi.ai/community/m/1432876149381271602?utm_source=chatgpt.com "End-of-call report - add structured object - VAPI"
