import { NextResponse, NextRequest } from "next/server";

import Project from "@/models/projectsModel";
import User from "@/models/userModel";
import connectDatabase from "@/utils/connectMongo";
import nodemailer from "nodemailer";

const PASSWORD = process.env.PASSWORD_SMT;
const USER = process.env.SMT_USER;

export async function POST(req, res) {
  const transporter = nodemailer.createTransport({
    host: "smtp-pulse.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });
  try {
    const payload = await req.json();
    console.log("its peyload", payload);

    const memberID = payload.member_id;
    if (payload.actions?.length > 0) {
      const commentActions = payload.actions.filter(
        (action) => action.entity_type === "story-comment"
      );
      console.log("comment payload", commentActions);
      const updateAction = payload.actions.find(
        (action) => action.action === "update" && action.entity_type === "story"
      );

      if (
        commentActions !== undefined &&
        commentActions.length > 0 &&
        memberID !== "65bf6a3d-5d07-4db8-82c1-c1e7c30f8c18"
      ) {
        if (commentActions.length > 0) {
          const updateStoryAction = payload.actions.find(
            (action) =>
              action.entity_type === "story" && action.action === "update"
          );

          const changedAt = payload.changed_at;
          const storyId = updateStoryAction ? updateStoryAction?.id : null;
          const storyName = updateAction ? updateAction?.name : null;
          let text;
          let email;
          let userName;
          for (const action of commentActions) {
            text = action.text;
          }
          try {
            await connectDatabase();
            const existingProject = await Project.findOne({
              storyId: storyId,
            });
            const owner = existingProject.owner;
            const userInformation = await User.findOne({
              _id: owner,
            });
            email = userInformation.email;
            userName = userInformation.name;
            if (text && text.trim().length > 0) {
              // Перевірка наявності тексту коментаря
              const newComment = {
                text,
                author: "Manager",
                date: changedAt,
              };
              if (existingProject) {
                const result = await Project.findOneAndUpdate(
                  { storyId: storyId },
                  { $push: { comments: newComment } },
                  { new: true }
                );
                console.log("Project comment was added");
              }
            } else {
              console.log("Project not found with storyId");
              return NextResponse.json({ success: true });
            }
          } catch (error) {
            console.log(error);
          }
          try {
            const info = await transporter.sendMail({
              from: "inbox@start-podcast.com",
              to: `${email}`,
              subject: `New Comment on Your Project ${storyName} `,
              text: `Dear${userName},
              Your project ${storyName} (${storyId}) has received a new comment from the manager:"${text}". Check it out and keep the momentum going!
              Feel free to reach out if you have any questions or need further information.
              Warm regards,
              The INDIEV Team
              `,
              html: `<p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Dear ${userName},
            </p>
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Your project "${storyName}" (ID: ${storyId}) has received a new comment from the manager: "${text}". Check it out and keep the momentum going!
            </p>
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Feel free to reach out if you have any questions or need further information.
            </p>
            <p style="font-size: 16px; color: #333;">
              Warm regards,<br>
              The Start Podcast Team
            </p>`,
            });
            console.log("Message comment sent: %s", info.messageId);
          } catch (error) {
            console.log(error);
          }
        }
      } else if (updateAction) {
        const newIdState = updateAction.changes?.workflow_state_id?.new;
        const idForFind = updateAction?.id;
        console.log("state part", idForFind);
        let newState;
        switch (newIdState) {
          case 500000041:
            newState = "Draft";
            break;
          case 500000042:
            newState = "To do";
            break;
          case 500000050:
            newState = "Source Check";
            break;
          case 500000051:
            newState = "Waiting for additional sources";
            break;
          case 500000052:
            newState = "Draft in progress";
            break;
          case 500000053:
            newState = "Art Director Riview";
            break;
          case 500000054:
            newState = "Editing";
            break;
          case 500000055:
            newState = "Client Review";
            break;
          case 500000056:
            newState = "Polishing";
            break;
          case 500000057:
            newState = "Client Final Review";
            break;
          case 500000043:
            newState = "Done";
            break;
          default:
            return "Unknown state";
        }
        try {
          await connectDatabase();

          const existingProject = await Project.findOne({
            storyId: idForFind,
          });
          const projectDbName = existingProject.name;
          const ownerstatus = existingProject.owner;
          const userInformationStatus = await User.findOne({
            _id: ownerstatus,
          });
          const custumerName = userInformationStatus.name;
          const custumerEmail = userInformationStatus.email;

          if (existingProject) {
            const result = await Project.updateOne(
              { storyId: idForFind },
              { $set: { status: newState } },
              { new: true }
            );

            console.log("Project status updated", newState);

            let subject = "";
            let textMessage = "";
            let htmlMessage = "";

            switch (newState) {
              case "Draft":
                subject = `New Project Alert! Your Project "${projectDbName}" Is in the Draft Phase!`;
                textMessage = `Dear ${custumerName}, Your project "${projectDbName}" is currently in the draft phase. Feel free to make any adjustments or add details as you see fit. When you're ready, send it over to us for the next steps!\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>Your project "${projectDbName}" is currently in the draft phase. Feel free to make any adjustments or add details as you see fit. When you're ready, send it over to us for the next steps!</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "To do":
                subject = `New Project Alert! "${projectDbName}" Has Moved to To Do`;
                textMessage = `Dear ${custumerName},\nGreat news! "${projectDbName}" is now on our To Do list. Our team will be assigning a project manager to kickstart the work soon.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>Great news! "${projectDbName}" is now on our To Do list. Our team will be assigning a project manager to kickstart the work soon.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Source Check":
                subject = `New Project Alert! Editing Phase for "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" is in the Source Check stage. Our editors are working their magic to enhance your project.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" is in the Source Check stage. Our editors are working their magic to enhance your project.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Waiting for additional sources":
                subject = `New Project Alert! "${projectDbName}" Awaits Your Inputs`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" needs a bit more to go forward. Could you provide the additional sources or information required?\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" needs a bit more to go forward. Could you provide the additional sources or information required?</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Draft in progress":
                subject = `New Project Alert! Crafting Your Project "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\nYour project "${projectDbName}" is being edited. Our team is diligently shaping the initial draft.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>Your project "${projectDbName}" is being edited. Our team is diligently shaping the initial draft.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Art Director Riview":
                subject = `New Project Alert! "${projectDbName}" Under Art Director’s Eye`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" is currently being reviewed by our art director. We're ensuring everything looks perfect!\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" is currently being reviewed by our art director. We're ensuring everything looks perfect!</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Editing":
                subject = `New Project Alert! Editing Phase for "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" is in the editing stage. Our editors are working their magic to enhance your project.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" is in the editing stage. Our editors are working their magic to enhance your project.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Client Review":
                subject = `New Project Alert! Your Feedback Awaited for "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" is ready for your review. Please take a look and let us know your thoughts.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" is ready for your review. Please take a look and let us know your thoughts.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Polishing":
                subject = `New Project Alert! Polishing Your Project "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\nBased on your feedback, "${projectDbName}" is being polished to perfection. We're almost there!\nWarm regards,\nThe INDIEV Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>Based on your feedback, "${projectDbName}" is being polished to perfection. We're almost there!</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Client Final Review":
                subject = `New Project Alert! Final Review Call for "${projectDbName}"`;
                textMessage = `Dear ${custumerName},\n"${projectDbName}" is in its final review phase. Please confirm everything is to your satisfaction.\nWarm regards,\nThe INDIEV Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>"${projectDbName}" is in its final review phase. Please confirm everything is to your satisfaction.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              case "Done":
                subject = `New Project Alert! "${projectDbName}" Is Ready!`;
                textMessage = `Dear ${custumerName},\nExciting news! "${projectDbName}" is complete. It’s ready for the world to see. The final project files are available for download.\nWarm regards,\nThe Start Podcast Team`;
                htmlMessage = `<p>Dear ${custumerName},</p><p>Exciting news! "${projectDbName}" is complete. It’s ready for the world to see. The final project files are available for download.</p><p>Warm regards,<br>The Start Podcast Team</p>`;
                break;
              default:
                // Handle unknown status
                break;
            }

            const info = await transporter.sendMail({
              from: "inbox@start-podcast.com", // sender address
              to: `${custumerEmail}`,
              subject: subject,
              text: textMessage,
              html: htmlMessage,
            });

            console.log("Email sent:", info);
          } else {
            console.log("Project not found with storyId:", idForFind);
            return NextResponse.json({ success: true });
          }
        } catch (error) {
          console.error("Error updating project:", error);
        }
      } else {
        console.log("not fit event");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to fetch epics" },
      { status: 500 }
    );
  }
}
