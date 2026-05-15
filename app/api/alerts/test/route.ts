import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;

    let message = "";

    switch (type) {
      case "test-detection":
        message =
          "⚠️ Pest Detected Alert: AI detected pest activity in crops.";
        break;

      case "test-community":
        message =
          "📢 Community Alert: Nearby farmers reported pest infections.";
        break;

      case "test-outbreak":
        message =
          "🚨 Outbreak Alert: High pest outbreak risk detected!";
        break;

      default:
        message = "PestGuard Alert";
    }

    const sms = await client.messages.create({
      body: message,
      from: "+13507504356",
      to: "+919916725156",
    });

    console.log("SMS SENT:", sms.sid);

    return NextResponse.json({
      success: true,
      sid: sms.sid,
    });
  } catch (error: any) {
    console.error("TWILIO ERROR:", error);

    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
}