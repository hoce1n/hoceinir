import { submitContactForm } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitContactForm(body);

    return Response.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return Response.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }
}
