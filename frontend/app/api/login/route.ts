import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return Response.json(
      { detail: "Identifiants incorrects" },
      { status: 401 }
    );
  }

  const secret = process.env.SESSION_SECRET!;

  const signature = crypto
    .createHmac("sha256", secret)
    .update("automanager-admin")
    .digest("hex");

  const cookieStore = await cookies();

  cookieStore.set("automanager_session", signature, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ success: true });
}