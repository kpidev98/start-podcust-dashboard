import { Webhook } from "svix";
import { headers } from "next/headers";

import connectDatabase from "@/utils/connectMongo";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import nodemailer from "nodemailer";
const PASSWORD = process.env.PASSWORD_SMT;
const USER = process.env.SMT_USER;

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.MEMBER_WEBHOOK_SECRET;
  const transporter = nodemailer.createTransport({
    host: "smtp-pulse.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET to .env or .env.local");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  console.log(payload);
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.event;

  console.log(evt.payload);
  try {
    await connectDatabase();

    switch (eventType) {
      case "member.created": {
        const { id, auth, customFields } = evt.payload;

        const mongoUser = await User.create({
          id: id,
          name: customFields["first-name"],
          soname: customFields["last-name"],
          email: auth.email,
          phone: customFields?.phone,
        });
        console.log("member created");
        const info = await transporter.sendMail({
          from: "inbox@indiev.org", // sender address
          to: `${auth.email}`,
          subject: `Welcome to INDIEV! Your Account Is Ready`,
          text: `Dear ${customFields["first-name"]},
          Thrilled to have you on board! Your INDIEV account is set up and ready to go. You're now closer than ever to unlocking all we have to offer. Feel free to dive in and create your first task today. We can't wait to see the amazing projects you'll bring to life.
          Warm regards,
          The INDIEV Team
          `,
          html: `<p>Dear ${customFields["first-name"]},</p>
          <p>Thrilled to have you on board! Your INDIEV account is set up and ready to go. You're now closer than ever to unlocking all we have to offer. Feel free to dive in and create your first task today. We can't wait to see the amazing projects you'll bring to life.</p>
          <p>Warm regards <br>The INDIEV Team</p>
        `,
        });
        console.log("Message sent: %s", info.messageId);
        return NextResponse.json({ message: "OK", user: mongoUser });
      }
      case "member.updated": {
        const { id, auth, customFields } = evt.payload;

        const mongoUser = await User.findOneAndUpdate(
          { id: id }, // умова пошуку
          {
            name: customFields["first-name"],
            soname: customFields["last-name"],
            email: auth.email,
            phone: customFields?.phone,
          },
          { new: true } // опція для повернення оновленого документа
        );
        console.log("User updated------------");
        return NextResponse.json({ message: "OK", user: mongoUser });
      }
      case "member.deleted": {
        const { id } = evt.payload;

        const mongoUser = await User.findOneAndDelete({ id: id });
        console.log("user deleted");
        return NextResponse.json({ message: "OK", user: mongoUser });
      }
      default:
        return new Response("Unknown event type", { status: 400 });
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return new Response("Error occured during database operation", {
      status: 500,
    });
  }

  return new Response("", { status: 200 });
}
