const API_URL = process.env.BACKEND_API_URL!;

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      cache: "no-store",
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return Response.json(
      { detail: "Backend unavailable" },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(`${API_URL}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return Response.json(
      { detail: "Backend unavailable" },
      { status: 502 }
    );
  }
}