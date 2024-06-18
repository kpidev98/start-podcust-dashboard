import axios from "axios";
import { NextResponse } from "next/server";

const ApiKey = process.env.SHORTCUT_API_TOKEN;

export async function PUT(request) {
  try {
    // Отримання даних з запиту
    const data = await request.json();
    const id = data.storyId;
    const {
      storyId,
      name,
      description,
      deadline,
      external_links,
      custom_fields,
      workflow_state_id,
    } = data;
    const StoriesApiUrl = `https://api.app.shortcut.com/api/v3/stories/${id}`;
    const response = await axios.put(
      StoriesApiUrl,
      {
        name,
        description,
        deadline,
        external_links,
        custom_fields,
        workflow_state_id,
      },
      {
        headers: {
          "Shortcut-Token": `${ApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    // Обробка помилок: повертаємо відповідь із деталями помилки
    console.error("Error updating story:", error);

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
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}
