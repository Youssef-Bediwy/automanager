const API_URL = process.env.BACKEND_API_URL!;

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
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

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.text();

    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: "PUT",
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

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: "DELETE",
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