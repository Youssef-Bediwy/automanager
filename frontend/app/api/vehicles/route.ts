import { cookies } from "next/headers";
import crypto from "crypto";

function validSession(session?: string) {
  if (!session) return false;

  const expected = crypto
    .createHmac("sha256", process.env.SESSION_SECRET!)
    .update("automanager-admin")
    .digest("hex");

  return session === expected;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("automanager_session")?.value;

  if (!validSession(session)) {
    return Response.json(
      { detail: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await request.text();

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/vehicles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": process.env.BACKEND_ADMIN_KEY!,
      },
      body,
    }
  );

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}