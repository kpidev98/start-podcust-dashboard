import { NextRequest, NextResponse } from "next/server";
const jwtToken = process.env.FRAME_IO_TOKEN;

export async function POST(request) {
  const jsonData = await request.json(); // Отримання даних у форматі JSON

  console.log(jsonData);
  // Перевірка, чи отримані дані
  if (!jsonData) {
    return NextResponse.json({ success: false, error: "No files received" });
  }

  try {
    // Створення об'єкта для зберігання посилань на завантаження файлів

    // Перебираємо кожен файл і завантажуємо його

    const assetId = jsonData.rootid;

    // Здійснюємо HTTP-запит до API Frame.io для завантаження файлу
    const response = await fetch(
      `https://api.frame.io/v2/assets/${assetId}/children`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          name: jsonData.name,
          type: "file",
          filetype: jsonData.filetype,
          filesize: jsonData.filesize, // Розмір файлу
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload file ${jsonData.name}`);
    }

    // Отримання посилання на завантаження і додавання його до масиву
    const responseData = await response.json();
    const uploadUrls = responseData.upload_urls;
    const fileId = responseData.id;
    // Відправлення відповіді з посиланнями на завантаження файлів
    console.log(responseData);
    return NextResponse.json({ success: true, uploadUrls, fileId });
  } catch (error) {
    // Обробка помилок
    console.error("Error uploading files:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
