import { NextResponse } from "next/server";
import Project from "@/models/projectsModel";
import connectDatabase from "@/utils/connectMongo";
export async function PUT(req, res) {
  try {
    const payload = await req.json();
    const storyId = payload._id;
    await connectDatabase();
    const result = await Project.findByIdAndUpdate(storyId, payload, {
      new: true,
    });
    console.log(result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
