import axios from "axios";
import { NextResponse } from "next/server";
const ApiKey = process.env.SHORTCUT_API_TOKEN;

const StoriesApiUrl = `https://api.app.shortcut.com/api/v3/stories`;

export async function POST(request) {
  try {
    // Отримання даних з запиту
    const data = await request.json();

    const { name, email, phone } = data;
    const formatedDescription = ` 1)  Name: ${name}; 2) Email: ${email}; 3)Phone:${phone}  `;
    const requestData = {
      name: name,
      description: formatedDescription, // You can customize this based on your needs
      epic_id: 1336,
      group_id: "65a6d75e-d8f5-4822-94ee-7ca81d104cc4",
      workflow_state_id: 500000033,
      owner_ids: ["65a11375-8993-4370-933e-8fefff39c1cb"],
      requested_by_id: "65bf6a3d-5d07-4db8-82c1-c1e7c30f8c18",
    };
    const response = await axios.post(StoriesApiUrl, requestData, {
      headers: {
        "Shortcut-Token": `${ApiKey}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    // Обробка помилок: повертаємо відповідь із деталями помилки
    console.error("Error creating story try again please:", error);

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
