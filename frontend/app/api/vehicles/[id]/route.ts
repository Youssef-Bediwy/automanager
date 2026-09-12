import { cookies } from "next/headers";
import crypto from "crypto";

const API_URL = process.env.BACKEND_API_URL!;

function validSession(session?: string) {
  if (!session || !process.env.SESSION_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update("automanager-admin")
    .digest("hex");

  return session === expected;
}

async function authorized() {
  const cookieStore = await cookies();
  return validSession(cookieStore.get("automanager_session")?.value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      cache: "no-store",
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({ detail: "Backend unavailable" }, { status: 502 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorized())) {
    return Response.json({ detail: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": process.env.BACKEND_ADMIN_KEY!,
      },
      body: await request.text(),
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({ detail: "Backend unavailable" }, { status: 502 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorized())) {
    return Response.json({ detail: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        "X-Admin-Key": process.env.BACKEND_ADMIN_KEY!,
      },
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({ detail: "Backend unavailable" }, { status: 502 });
  }
}