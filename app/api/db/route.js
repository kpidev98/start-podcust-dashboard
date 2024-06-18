import connectDatabase from "@/utils/connectMongo";
import { NextResponse } from "next/server";
export async function GET(NextResponse) {
  try {
    console.log("conecting data base");
    await connectDatabase();
    console.log("success");
    const success = "success";
    return NextResponse.json(success);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect data base" },
      { status: 500 }
    );
  }
}
