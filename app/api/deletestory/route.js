import axios from "axios";
import { NextResponse } from "next/server";

const ApiKey = process.env.SHORTCUT_API_TOKEN;

export async function DELETE(request) {
  try {
    // Отримання даних з запиту
    const data = await request.json();

    const id = data.storyId;

    // Формування URL для видалення історії
    const StoriesApiUrl = `https://api.app.shortcut.com/api/v3/stories/${id}`;

    // Виконання DELETE запиту за допомогою axios
    const response = await axios.delete(StoriesApiUrl, {
      headers: {
        "Shortcut-Token": `${ApiKey}`,
        "Content-Type": "application/json",
      },
    });

    // Повернення відповіді від API
    return NextResponse.json(response.data);
  } catch (error) {
    // Обробка помилок
    console.error("Error deleting story:", error);

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

    // Повернення відповіді з помилкою
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
