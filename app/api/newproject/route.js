import axios from "axios";
import { NextResponse } from "next/server";
const ApiKey = process.env.SHORTCUT_API_TOKEN;

const StoriesApiUrl = `https://api.app.shortcut.com/api/v3/stories`;

export async function POST(request) {
  try {
    // Отримання даних з запиту
    const data = await request.json();

    const response = await axios.post(StoriesApiUrl, data, {
      headers: {
        "Shortcut-Token": `${ApiKey}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    // Обробка помилок: повертаємо відповідь із деталями помилки
    console.error("Error creating story:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      // Запит був відправлений, але не отримано відповіді
      console.error("Request data:", error.request);
    } else {
      // Відбулась помилка під час налаштування запиту
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
