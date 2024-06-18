import Project from "@/models/projectsModel";
import { NextResponse } from "next/server";
import connectDatabase from "@/utils/connectMongo";

export const dynamic = "force-dynamic";

export async function GET(request, response) {
  const url = new URL(request.url);
  const searchParam = new URLSearchParams(url.searchParams);
  const projectId = searchParam.get("projectId");

  try {
    if (!projectId) {
      throw new Error("projectId is missing in the request query");
    }
    await connectDatabase();
    console.log("Successfully connected");

    const result = await Project.findById(projectId)
      .populate("owner", "name email")
      .select("-createdAt -updatedAt");
    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    // Обробка помилок
    console.error("Error getting project:", error);
    return NextResponse.json(
      { error: "Failed to get the project" },
      { status: 500 }
    );
  }
}
