import axios from "axios";
import { NextResponse } from "next/server";

const ApiKey = process.env.SHORTCUT_API_TOKEN;
const EpicsApiUrl = `https://api.app.shortcut.com/api/v3/epics`;

export async function POST(request) {
  try {
    // Отримуємо дані для створення Epic з запиту
    const { name, description, ...otherData } = await request.json();

    // Виконуємо запит POST для створення Epic
    const response = await axios.post(
      EpicsApiUrl,
      {
        name,
        description,
        ...otherData,
      },
      {
        headers: {
          "Shortcut-Token": ApiKey,
          "Content-Type": "application/json",
        },
      }
    );

    // Повертаємо відповідь у форматі JSON
    console.log(response.data.id);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating epic:", error);

    // Обробляємо помилку
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    // Повертаємо відповідь про помилку у форматі JSON зі статусом 500
    return NextResponse.json(
      { error: "Failed to create epic" },
      { status: 500 }
    );
  }
}
