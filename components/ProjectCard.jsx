"use client";

import { useState, useEffect } from "react";
import styles from "./ProjectCard.module.scss";
import ModalDetails from "./ModalDetails";
import { Tooltip } from "react-tooltip";
import ModalEdit from "./EditModal";
import ModalDeleteConfirmation from "./ModalDeleteConfirmation";

import axios from "axios";
import { toast } from "sonner";
import { mulish } from "@/app/fonts";
function ProjectCard({ project }) {
  const [color, setColor] = useState("#000");
  const [backColor, setBackColor] = useState("#000");
  const [borderColor, setBorderColor] = useState("#000");

  const [isModalOpenDetails, setIsModalOpenDetails] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenUpload, setIsModalOpenUpload] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const changeColor = (value) => {
    let newColor, newBackColor, newBorderColor;

    switch (value) {
      case "Draft":
        newColor = "#BA1717";
        newBackColor = "#F9F2F2";
        newBorderColor = "#E2A1A1";
        break;
      case "To do":
        newColor = "#03781D";
        newBackColor = "#F0F9F2";
        newBorderColor = "#6DC580";
        break;
      case "Source Check":
      case "Waiting for additional sources":
        newColor = "#E9C400";
        newBackColor = "#FCFAF1";
        newBorderColor = "#F3DE71";
        break;
      case "Draft in progress":
        newColor = "#007BFF";
        newBackColor = "#E6F3FF";
        newBorderColor = "#BFD7FF";
        break;
      case "Art Director Riview":
        newColor = "#FFC107";
        newBackColor = "#FFF8E1";
        newBorderColor = "#FFE29B";
        break;
      case "Editing":
        newColor = "#DC3545";
        newBackColor = "#F8D7DA";
        newBorderColor = "#F3A6AF";
        break;
      case "Client Review":
        newColor = "#28A745";
        newBackColor = "#E6F4EA";
        newBorderColor = "#B4E5BE";
        break;
      case "Polishing":
        newColor = "#FF0000";
        newBackColor = "#FFE6E6";
        newBorderColor = "#FFCCCC";
        break;
      case "Client Final Review":
        newColor = "#FFA500";
        newBackColor = "#FFF0E6";
        newBorderColor = "#FFDAB9";
        break;
      case "Done":
        newColor = "#28A745";
        newBackColor = "#E6F4EA";
        newBorderColor = "#B4E5BE";
        break;
      default:
        newColor = "#000";
        newBackColor = "#FFF";
        newBorderColor = "#FFF";
        break;
    }

    return {
      color: newColor,
      backColor: newBackColor,
      borderColor: newBorderColor,
    };
  };

  useEffect(() => {
    const { color, backColor, borderColor } = changeColor(project.status);
    setColor(color);
    setBackColor(backColor);
    setBorderColor(borderColor);
  }, [project.status]);
  const date = new Date(project.deadline); // Створюємо об'єкт Date з рядка
  const formattedDate = date.toLocaleDateString();

  const handleDeletestory = async () => {
    try {
      const response = await axios.delete("/api/deletestory", {
        headers: {
          "Content-Type": "application/json",
        },
        data: project,
      });
      if (response.status === 200) {
        console.log("success");
      } else {
        console.log("error");
      }
      const responsedb = await axios.delete("/api/deleteprojectdb", {
        headers: {
          "Content-Type": "application/json",
        },
        data: project,
      });
      if (responsedb.status === 200) {
        console.log("success");

        toast.success("Project  deleted");
        window.location.reload();
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      toast.error("something go wrong, try again");
    }
  };
  return (
    <>
      <li
        className={`${styles.card_li} ${mulish.className} `}
        onClick={() => setIsModalOpenDetails(true)}
      >
        <div className={styles.top_container}>
          <div className={styles.title_container}>
            <p className={styles.card_title}> {project.name} </p>
            <p className={styles.card_deadline}>
              {" "}
              <span>deadline:</span> {formattedDate}
            </p>
          </div>

          <p className={styles.card_id}>#id:{project.storyId}</p>
          <p className={styles.card_description}>{project.description}</p>
        </div>

        <div className={styles.card_details_container}>
          <p
            className={styles.card_status}
            style={{
              color: color,
              backgroundColor: backColor,
              borderColor: borderColor,
            }}
          >
            {project.status}
          </p>
          {project.status === "Draft" && (
            <div className={styles.delete_project_container}>
              <button
                className={styles.delete_project_button}
                onClick={(e) => {
                  e.stopPropagation(); // Зупиняє подальше поширення події
                  setIsModalOpenEdit(true); // Викликає функцію для видалення проекту
                }}
              >
                {" "}
                <svg
                  className={styles.edit_icon}
                  width="25"
                  height="17"
                  data-tooltip-id="my-tooltip-edit"
                  data-tooltip-content="Edit project"
                >
                  <use href="/assets/icons.svg#icon-pencil"></use>
                </svg>
              </button>
              <Tooltip
                id="my-tooltip-edit"
                style={{ backgroundColor: "#222", color: "#fff" }}
              />
              <button
                className={styles.delete_project_button}
                onClick={(e) => {
                  e.stopPropagation(); // Зупиняє подальше поширення події
                  setIsModalOpenDelete(true); // Відкриває модальне вікно підтвердження видалення
                }}
              >
                <svg
                  className={styles.edit_icon}
                  width="25"
                  height="17"
                  data-tooltip-id="my-tooltip-delete"
                  data-tooltip-content="Delete project"
                >
                  <use href="/assets/icons.svg#icon-bin"></use>
                </svg>
                <Tooltip
                  id="my-tooltip-delete"
                  style={{ backgroundColor: "#222", color: "#fff" }}
                />
              </button>
            </div>
          )}
        </div>
      </li>
      <ModalDetails
        isOpenDetails={isModalOpenDetails}
        onCloseDetails={() => setIsModalOpenDetails(false)}
        project={project}
      />
      <ModalEdit
        isOpenEdit={isModalOpenEdit}
        onCloseEdit={() => setIsModalOpenEdit(false)}
        project={project}
      />
      <ModalDeleteConfirmation
        isOpen={isModalOpenDelete}
        onClose={() => setIsModalOpenDelete(false)}
        onDelete={handleDeletestory}
      />
    </>
  );
}

export default ProjectCard;
