import axios from "axios";
import { NextResponse } from "next/server";
const team_id = process.env.FRAME_IO_TEAM_ID;
const jwtToken = process.env.FRAME_IO_TOKEN;
export const dynamic = "force-dynamic";
const FrameApiUrl = `https://api.frame.io/v2/teams/${team_id}/projects`;

export async function GET(request) {
  try {
    const response = await fetch(FrameApiUrl, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch epics");
    }

    const projectData = await response.json();

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("Error fetching epics:", error);
    return NextResponse.json(
      { error: "Failed to fetch epics" },
      { status: 500 }
    );
  }
}
