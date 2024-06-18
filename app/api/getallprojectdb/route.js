import User from "@/models/userModel";
import Project from "@/models/projectsModel";
import { NextResponse } from "next/server";
import connectDatabase from "@/utils/connectMongo";

export const dynamic = "force-dynamic";
export async function GET(request, response) {
  try {
    await connectDatabase();
    console.log("success conected");
    const url = new URL(request.url);
    const searchParam = new URLSearchParams(url.searchParams);
    const userId = searchParam.get("userId");
    console.log("its ID", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }
    const id = userId;
    const user = await User.findOne({ id });

    const { _id: owner } = user;

    const result = await Project.find(
      { owner },
      "-createdAt -updatedAt"
    ).populate("owner", "name email");
    return NextResponse.json(result);
  } catch (error) {
    // Обробка помилок
    console.error("Error get projects:", error);
    return NextResponse.json(
      { error: "Failed to get all project" },
      { status: 500 }
    );
  }
}
