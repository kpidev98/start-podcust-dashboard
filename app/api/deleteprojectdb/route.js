import { NextResponse } from "next/server";
import Project from "@/models/projectsModel";
import connectDatabase from "@/utils/connectMongo";
export async function DELETE(req, res) {
  try {
    const payload = await req.json();
    console.log(payload);
    const storyId = payload._id;
    console.log(storyId);
    await connectDatabase();
    const result = await Project.findByIdAndDelete(storyId);
    console.log(result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
