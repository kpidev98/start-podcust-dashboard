import connectDatabase from "@/utils/connectMongo";
import Project from "@/models/projectsModel";
import User from "@/models/userModel";

import { NextResponse } from "next/server";
export async function POST(request, res) {
  try {
    await connectDatabase();

    console.log("success conected");
    const body = await request.json(); // Розпарсити JSON з тіла запиту
    console.log(body);
    const {
      id,
      name,
      type,
      description,
      time,
      format,
      links,
      soundtrack,
      deadline,
      status,
      storyId,
      files,
      uploadedtrack,
    } = body;
    const user = await User.findOne({ id });

    const { _id: owner } = user;

    if (!user) {
      throw new Error("User not found");
    }
    const result = await Project.create({
      name,
      type,
      description,
      time,
      format,
      links,
      soundtrack,
      deadline,
      status,
      storyId,
      owner,
      uploadedtrack,
      files,
    });
    return NextResponse.json(result);
  } catch (error) {
    // Обробка помилок
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
