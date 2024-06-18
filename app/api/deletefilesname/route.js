import { NextResponse } from "next/server";
import Project from "@/models/projectsModel";
import connectDatabase from "@/utils/connectMongo";

export async function DELETE(req, res) {
  try {
    const payload = await req.json();
    const storyId = payload.storyId;
    const fileNameToDelete = payload.fileName;

    await connectDatabase();
    const project = await Project.findOne({ storyId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const files = project.files.filter((file) => file !== fileNameToDelete);

    project.files = files;
    await project.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
