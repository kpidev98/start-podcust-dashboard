import { NextRequest, NextResponse } from "next/server";
const jwtToken = process.env.FRAME_IO_TOKEN;

export async function DELETE(request) {
  const { fileId } = await request.json(); // Отримання ID файлу для видалення
  console.log(fileId);
  if (!fileId) {
    return NextResponse.json({ success: false, error: "No file ID received" });
  }

  try {
    // Здійснюємо HTTP-запит до API Frame.io для видалення файлу
    const response = await fetch(`https://api.frame.io/v2/assets/${fileId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file with ID ${fileId}`);
    }

    // Відправлення відповіді з підтвердженням видалення
    return NextResponse.json({
      success: true,
      message: `File with ID ${fileId} deleted successfully`,
    });
  } catch (error) {
    // Обробка помилок
    console.error("Error deleting file:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
