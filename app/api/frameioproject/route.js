import { NextRequest, NextResponse } from "next/server";
const jwtToken = process.env.FRAME_IO_TOKEN;
const team_id = process.env.FRAME_IO_TEAM_ID;
export async function POST(request) {
  const jsonData = await request.json();

  if (!jsonData) {
    return NextResponse.json({ success: false });
  }

  const response = await fetch(
    `https://api.frame.io/v2/teams/${team_id}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: jsonData.name,
      }),
    }
  );

  const responseData = await response.json();
  const rootId = responseData.root_asset_id;
  console.log(responseData.root_asset_id);
  return NextResponse.json({ success: true, rootId });
}
