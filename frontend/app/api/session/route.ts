import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("automanager_session")?.value;
  const secret = process.env.SESSION_SECRET;

  let isAdmin = false;

  if (session && secret && /^[a-f0-9]{64}$/.test(session)) {
    const expected = crypto
      .createHmac("sha256", secret)
      .update("automanager-admin")
      .digest();

    isAdmin = crypto.timingSafeEqual(
      Buffer.from(session, "hex"),
      expected
    );
  }

  return Response.json(
    { isAdmin },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("automanager_session");

  return Response.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}