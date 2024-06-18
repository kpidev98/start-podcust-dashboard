import axios from "axios";
import { NextResponse } from "next/server";
const ApiKey = process.env.SHORTCUT_API_TOKEN;
export const dynamic = "force-dynamic";
const EpicsApiUrl = `https://api.app.shortcut.com/api/v3/epics`;

export async function GET(request) {
  try {
    const response = await fetch(EpicsApiUrl, {
      headers: {
        "Shortcut-Token": ApiKey,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch epics");
    }

    const epicsObject = await response.json();

    return NextResponse.json(epicsObject);
  } catch (error) {
    console.error("Error fetching epics:", error);
    return NextResponse.json(
      { error: "Failed to fetch epics" },
      { status: 500 }
    );
  }
}
