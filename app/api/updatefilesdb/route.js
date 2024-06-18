import Project from "@/models/projectsModel";
import connectDatabase from "@/utils/connectMongo";
import { NextResponse } from "next/server";
export async function PUT(req, res) {
  try {
    const payload = await req.json();
    const storyId = payload.storyId;
    const newFiles = payload.newfiles;
    console.log(newFiles);

    await connectDatabase();
    const result = await Project.findOneAndUpdate(
      { storyId: storyId },
      { $push: { files: { $each: newFiles } } },
      { new: true }
    );
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
