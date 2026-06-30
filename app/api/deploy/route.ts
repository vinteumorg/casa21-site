import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEPLOY_SCRIPT = "/home/exedev/casa21-site/scripts/deploy-main.sh";

function timingSafeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function isValidSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
  return timingSafeEqual(signature, expected);
}

function runDeploy() {
  const child = spawn(DEPLOY_SCRIPT, [], {
    detached: true,
    stdio: "ignore",
    env: { ...process.env, DEPLOY_REMOTE: "origin", DEPLOY_BRANCH: "main" },
  });
  child.unref();
}

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "GITHUB_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  if (!isValidSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  if (event === "ping") {
    return NextResponse.json({ ok: true, event: "ping" });
  }

  if (event !== "push") {
    return NextResponse.json({ ok: true, ignored: true, reason: "not a push event" });
  }

  let body: { ref?: string; deleted?: boolean };
  try {
    body = JSON.parse(payload) as { ref?: string; deleted?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (body.ref !== "refs/heads/main" || body.deleted) {
    return NextResponse.json({ ok: true, ignored: true, ref: body.ref });
  }

  runDeploy();
  return NextResponse.json({ ok: true, deploying: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "deploy" });
}
