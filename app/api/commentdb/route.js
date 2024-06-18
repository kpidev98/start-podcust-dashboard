import connectDatabase from "@/utils/connectMongo";
import Project from "@/models/projectsModel";

import { NextResponse } from "next/server";
export async function PUT(request, res) {
  try {
    await connectDatabase();

    const body = await request.json(); // Розпарсити JSON з тіла запиту
    console.log(body);
    const { text, author, storyId, timestamp } = body;
    const newComment = {
      text,
      author,
      date: timestamp,
      // Інші поля коментаря, які ви хочете додати
    };

    const result = await Project.findOneAndUpdate(
      { storyId: storyId },
      { $push: { comments: newComment } },
      { new: true }
    );

    return NextResponse.json(result);
  } catch (error) {
    // Обробка помилок
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
