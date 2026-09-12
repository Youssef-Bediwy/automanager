import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("automanager_session")?.value;

  const expected = crypto
    .createHmac("sha256", process.env.SESSION_SECRET!)
    .update("automanager-admin")
    .digest("hex");

  return Response.json({
    authenticated: session === expected,
  });
}