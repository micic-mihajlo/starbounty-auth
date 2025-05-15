import { NextResponse } from "next/server";
import { passkeyServerInstance } from "@/lib/passkey_service";

export async function POST(req: Request) {
  if (!passkeyServerInstance) {
    console.error("/api/send Error: PasskeyServer is not initialized on the server.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const { xdr } = await req.json();
    if (!xdr || typeof xdr !== 'string') {
      return NextResponse.json({ error: "Invalid XDR provided." }, { status: 400 });
    }

    console.log("/api/send: Attempting to send XDR via PasskeyServer...");
    const submissionResult = await passkeyServerInstance.send(xdr);
    console.log("/api/send: PasskeyServer.send SUCCEEDED.", submissionResult);
    return NextResponse.json(submissionResult);
  } catch (error: any) {
    console.error("/api/send Error: Error during transaction submission:", error);
    // Try to pass along Launchtube's error structure if available
    if (error && typeof error === 'object' && 'status' in error && 'error' in error) {
        return NextResponse.json({ error: error.error, details: error }, { status: error.status as number || 500 });
    }
    return NextResponse.json({ error: error.message || "Failed to send transaction" }, { status: 500 });
  }
} 