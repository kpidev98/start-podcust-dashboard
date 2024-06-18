"use client";
import { useEffect, useState } from "react";
import styles from "./EditModal.module.scss";
import { useMemberstack } from "@memberstack/nextjs/client";
import Step7 from "./modal-edit/ModalEditSound";
import CalendarModal from "./modal-edit/Calendar";
import { ColorRing } from "react-loader-spinner";
import axios from "axios";
import Step9 from "./modal-edit/Upload";
import { toast } from "sonner";
import { mulish } from "../app/fonts";
import StatusTracker from "../components/modal-edit/StatusTracker";

let isDraft;
const options = [
  "Video Tutorials",
  "Ask Me Anything (AMA) Videos",
  "Whiteboard Videos",
  "Listicle Videos",
  "Product Reviews",
  "Educational Videos",
  "Challenge Videos",
  "Unboxing Videos",
  "Explainer Videos",
  "BTS Videos",
  "Product Demo Videos",
  "Video Testimonials",
  "Reaction Videos",
  "Webinar Teasers",
  "Community-Based Videos",
  "Business Results Videos",
  "Meet the Team Videos",
  "Employee Spotlight Videos",
  "Company Values Videos",
  "Q&A Videos",
  "Company Culture Videos",
  "Video Blogs (Vlogs)",
  "Product Launch Videos",
  "Video Podcasts",
];
const timeIntervals = [
  "1 min",
  "5 min",
  "10 min",
  "15 min",
  "20 min",
  "30 min",
  "40 min",
  "50 min",
  "60 min",
  "90 min",
  "100 min",
];
const ModalEdit = ({ isOpenEdit, onCloseEdit, project }) => {
  const [editedProject, setEditedProject] = useState({
    ...project,
    links: project.links || [], // якщо links не визначений, встановити порожній масив
  });

  const [selectedOption, setSelectedOption] = useState(editedProject.type);
  const [selectedInterval, setSelectedInterval] = useState(timeIntervals[0]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [uploadedFilesDocument, setUploadedFilesDocument] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [user, setUser] = useState(null);
  const [disableButton, setDisableButton] = useState(false);

  const memberstack = useMemberstack();
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data: member } = await memberstack.getCurrentMember();
        setUser(member);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchMember();
  }, []);
  useEffect(() => {
    const fetchProjects = async (userId) => {
      try {
        const response = await axios.get(
          `/api/getallprojectdb?userId=${userId}`
        );
        const data = response.data;
        const filteredProjects = data.filter(
          (project) => project.status !== "Draft" && project.status !== "Done"
        );
        setActiveProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user]);

  useEffect(() => {
    setSelectedOption(editedProject.type);
  }, [editedProject.type]);

  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      onCloseEdit();
    }
  };
  useEffect(() => {
    if (isOpenEdit) {
      // Заборона прокрутки body при відкритому модальному вікні
      document.body.style.overflow = "hidden";
    } else {
      // Зняття обмеження прокрутки body при закритті модального вікна
      document.body.style.overflow = "auto";
    }
  }, [isOpenEdit]);
  useEffect(() => {
    // Додавання обробників подій для кліку на весь документ і кнопку
    document.addEventListener("keydown", handleEscKey);

    // Прибирання обробників подій при видаленні компонента
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onCloseEdit]);

  const epicData = {
    name: `${user?.customFields["first-name"]} ${user?.customFields["last-name"]}-id:${user?.id}`,
    group_ids: ["65ca3851-9e90-4234-b79f-4cb2cb414cc9"],
    external_id: user?.id,
  };
  const plan = user?.planConnections[0].planId;
  const nameForFrameIo = epicData.name;

  const date = new Date(editedProject.deadline);
  const formattedDate = date.toLocaleDateString();
  if (!isOpenEdit) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };
  const handleChangeSelect = (e) => {
    const value = e.target.value;
    setEditedProject((prevProject) => ({
      ...prevProject,
      type: value,
    }));
  };
  const handleChangeTime = (e) => {
    const value = timeIntervals[e.target.value - 1]; // Отримуємо вибраний інтервал часу
    setEditedProject((prevProject) => ({
      ...prevProject,
      time: value, // Оновлюємо значення часу в об'єкті editedProject
    }));
  };
  const handleChangeFormat = (format) => {
    setEditedProject((prevProject) => ({
      ...prevProject,
      format: format,
    }));
  };
  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setEditedProject((prevProject) => ({
        ...prevProject,
        links: [...prevProject.links, newLink.trim()],
      }));
      setNewLink(""); // Очищення поля вводу після додавання лінку
    }
  };
  const handleChangeInput7 = (value) => {
    setEditedProject((prevProject) => ({
      ...prevProject,
      soundtrack: value,
    }));
  };
  const handleChangeInputCalendar = (value) => {
    setEditedProject((prevProject) => ({
      ...prevProject,
      deadline: value,
    }));
  };
  const handleChangeInput9 = (value) => {
    setEditedProject((prevState) => ({
      ...prevState,
      links: [...prevState.links, value],
    }));
  };
  const handleDeleteLink = (linkName) => {
    // Копіюємо старі посилання зі стану editedProject
    const oldLinks = [...editedProject.links];

    // Фільтруємо список посилань, видаляючи той, який потрібно видалити
    const updatedLinks = oldLinks.filter((link) => link !== linkName);

    // Оновлюємо стан editedProject, встановлюючи новий список посилань
    setEditedProject((prevProject) => ({
      ...prevProject,
      links: updatedLinks, // Оновлюємо список посилань в стані editedProject
    }));
  };
  const handleSubmitFormData = async (isDraft) => {
    setLoading(true);
    setDisableButton(true);
    try {
      let value_idTiming;

      switch (editedProject.time) {
        case "1 min":
          value_idTiming = "65ca3c1f-aa86-415c-ad20-d8b5295a551d";
          break;
        case "5 min":
          value_idTiming = "65ca3c1f-0c5e-43fc-8f96-7dfa7306de62";
          break;
        case "10 min":
          value_idTiming = "65ca3c1f-664a-481a-a54b-211fc65ed827";
          break;
        case "15 min":
          value_idTiming = "65ca3c1f-cd95-408e-9798-f17b3d6da301";
          break;
        case "20 min":
          value_idTiming = "65ca3c1f-efd4-4ee2-b489-f53c13bfb32f";
          break;
        case "30 min":
          value_idTiming = "65ca3c1f-30e3-42d9-8af9-0776443e0a2e";
          break;
        case "40 min":
          value_idTiming = "65ca3c1f-5c66-474d-a827-42fad5d99cf2";
          break;
        case "50 min":
          value_idTiming = "65ca3c1f-022b-4ff8-8125-6917c90d2c08";
          break;
        case "60 min":
          value_idTiming = "65ca3c1f-064a-486b-931b-b425ea488629";
          break;
        case "70 min":
          value_idTiming = "65ca3c1f-8166-4ee0-9a13-0b70828a6f56";
          break;
        case "80 min":
          value_idTiming = "65ca3c1f-1e1a-413b-b545-8c6447cba9f4";
          break;
        case "90 min":
          value_idTiming = "65ca3c1f-616c-4e37-a064-53533b010618";
          break;
        case "100 min":
          value_idTiming = "65ca3c1f-55e3-4b97-b40c-97b4689c915c";
          break;
        // Додайте інші варіанти за потреби
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idTiming = "default_id";
          break;
      }
      let value_idTypeVideo;

      switch (editedProject.type) {
        case "Video Tutorials":
          value_idTypeVideo = "65ca3abe-720d-428a-a16e-b2570d85347f";
          break;
        case "Ask Me Anything (AMA) Videos":
          value_idTypeVideo = "65ca3abe-e393-4d5b-abbd-9dff5e067887";
          break;
        case "Whiteboard Videos":
          value_idTypeVideo = "65ca3abe-da84-4738-b333-0622b0031675";
          break;
        case "Listicle Videos":
          value_idTypeVideo = "65ca3abe-7dd7-4a4e-bf4c-049af3a7785e";
          break;
        case "Product Reviews":
          value_idTypeVideo = "65ca3abe-c17e-4e4e-9f53-a1134845bfac";
          break;
        case "Educational Videos":
          value_idTypeVideo = "65ca3abe-1c21-4557-a1a8-bbad6a282b6f";
          break;
        case "Challenge Videos":
          value_idTypeVideo = "65ca3abe-9a93-4cec-9f98-4851790d2ec7";
          break;
        case "Unboxing Videos":
          value_idTypeVideo = "65ca3b75-4e2d-458d-bf05-7cb57cee4139";
          break;
        case "Explainer Videos":
          value_idTypeVideo = "65ca3b75-c5e6-4af1-a580-aa4993c9f777";
          break;
        case "BTS Videos":
          value_idTypeVideo = "65ca3b75-c044-4b7c-aafc-5da1a0b04205";
          break;
        case "Product Demo Videos":
          value_idTypeVideo = "65ca3b75-53c5-442a-b540-22bd35d744e3";
          break;
        case "Reaction Videos":
          value_idTypeVideo = "65ca3b75-2e12-471d-9e9b-1bfbbe7554fa";
          break;
        case "Webinar Teasers":
          value_idTypeVideo = "65ca3b75-d84c-4579-b449-7de7eed940d2";
          break;
        case "Community-Based Videos":
          value_idTypeVideo = "65ca3b75-984b-4959-944f-885f1be1ebbf";
          break;
        case "Business Results Videos":
          value_idTypeVideo = "65ca3b75-fc6c-41b3-94c1-9b984d1c8ec0";
          break;
        case "Meet the Team Videos":
          value_idTypeVideo = "65ca3b75-f1ed-4263-a101-bd44594fa380";
          break;
        case "Employee Spotlight Videos":
          value_idTypeVideo = "65ca3b75-53cb-429d-8d31-0dc0f267d1be";
          break;
        case "Company Values Videos":
          value_idTypeVideo = "65ca3b75-eb69-4740-b5a0-d64fbf2df8d7";
          break;
        case "Q&A Videos":
          value_idTypeVideo = "65ca3b75-7a66-43a7-84b5-7366ce27619d";
          break;
        case "Company Culture Videos":
          value_idTypeVideo = "65ca3b75-e3ff-4f29-921f-2ce3d8636cc0";
          break;
        case "Video Blogs (Vlogs)":
          value_idTypeVideo = "65ca3b75-4083-49b5-8e62-ff691615da5e";
          break;
        case "Product Launch Videos":
          value_idTypeVideo = "65ca3b75-36d9-492a-a4ad-2e8a2cec5e4a";
          break;
        case "Video Podcasts":
          value_idTypeVideo = "65ca3b75-1c34-49a5-8e6f-ee3187098c58";
          break;
        case "Video Testimonials":
          value_idTypeVideo = "65ca3b75-8295-46c4-a421-adce327b9b1f";
          break;
        // Додайте інші варіанти за потреби
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idTypeVideo = "default_id";
          break;
      }
      let value_idSoundtrack;
      switch (editedProject.soundtrack) {
        case "Yes":
          value_idSoundtrack = "65ca3cc6-4911-4888-9486-e67732c426bd";
          break;
        case "No":
          value_idSoundtrack = "65ca3cc6-8d96-4c2d-abd1-2273dda9b961";
          break;
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          value_idSoundtrack = "default_id";
          break;
      }
      let valueFormatId;
      switch (editedProject.format) {
        case "horizontal 16:9":
          valueFormatId = "65ca3c8a-2057-4a96-9ce5-6b3cfa9790a1";
          break;
        case "vertical 9:16":
          valueFormatId = "65ca3c8a-47f5-41b3-beff-f1267065c378";
          break;
        case "horizontal 16:9 and vertical 9:16":
        case "vertical 9:16 and horizontal 16:9":
          valueFormatId = "66164864-d6b3-47c7-a124-a3307356916e";
          break;
        default:
          // Значення за замовчуванням, якщо не відповідає жодному з варіантів
          valueFormatId = "default_id";
          break;
      }

      const requestData = {
        storyId: editedProject.storyId,
        name: editedProject.name,
        description: editedProject.description,
        deadline: editedProject.deadline,
        external_links: editedProject.links,
        workflow_state_id: isDraft ? 500000041 : 500000042,
        custom_fields: [
          {
            field_id: "65ca3c1f-9a4b-40e3-8a96-2f1bdb5579c2",
            value: editedProject.time,
            value_id: value_idTiming,
          },
          {
            field_id: "65ca3abe-f5b0-43a0-a14d-b5704f658d4d",
            value: editedProject.type,
            value_id: value_idTypeVideo,
          },
          {
            field_id: "65ca3cc6-d321-42b9-9ddf-354bf5817fea",
            value: editedProject.soundtrack,
            value_id: value_idSoundtrack,
          },
          {
            field_id: "65ca3c8a-3838-4cc7-8f47-4e20c848f6bb",
            value: editedProject.format,
            value_id: valueFormatId,
          },
        ],
      };

      const responsedb = await axios.put("/api/updatestory", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responsedb.status === 200) {
        console.log("success");
      } else {
        console.log("error");
        setLoading(false);
      }
      const updatedProject = {
        ...editedProject,
        uploadedtrack: [...editedProject.uploadedtrack, ...uploadedFileNames],
        files: [...editedProject.files, ...uploadedFilesDocument],
      };
      const db = await axios.put("/api/updateprojectdb", updatedProject, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (db.status === 200) {
        toast.success("Thank you  project was updated");
        setLoading(false);
        setDisableButton(false);
        window.location.reload();
      } else {
        toast.error("Faild to update project, try again please");
        setLoading(false);
      }
    } catch (error) {
      console.error("error update story:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${mulish.className}`}>
        <button className={styles.closeButton} onClick={onCloseEdit}>
          &times;
        </button>
        <div className={styles.modalContent}>
          <div className={styles.modal_firs_container}>
            <p className={styles.project_id}>#{editedProject.storyId}</p>
            <div className={`${styles.flex_container}`}>
              {" "}
              <p className={styles.modal_title}>Project Title</p>
              <input
                className={styles.title_input}
                type="text"
                name="name"
                value={editedProject.name}
                onChange={handleChange}
              />
            </div>
            <div className={`${styles.flex_container} `}>
              <p className={styles.modal_type}> Type of video</p>

              <select
                value={selectedOption}
                onChange={handleChangeSelect}
                className={styles.step1_select}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className={styles.custom_select_arrow}></span>
            </div>

            <div className={styles.flex_container}>
              <p className={styles.modal_description}>Description</p>
              <textarea
                className={`${styles.description_input} ${mulish.className}`}
                type="text"
                name="description"
                value={editedProject.description}
                onChange={handleChange}
              />
            </div>
            <div className={styles.time_format_container}>
              <div className={styles.conteiner_time}>
                {" "}
                <p className={styles.modal_time}>
                  {" "}
                  Time:
                  <span className={styles.modal_span}>
                    {editedProject.time}
                  </span>
                </p>
                <input
                  className={styles.step3_range}
                  type="range"
                  id="timeInterval"
                  min={1}
                  max={timeIntervals.length}
                  value={timeIntervals.indexOf(selectedInterval) + 1}
                  onChange={(event) => {
                    setSelectedInterval(timeIntervals[event.target.value - 1]);
                    handleChangeTime(event);
                  }}
                />
              </div>
              <div className={styles.flex_container}>
                <p className={styles.modal_format}>
                  Format:
                  <span className={styles.modal_span}>
                    {editedProject.format}
                  </span>
                </p>
                <label className={styles.step4_size_text}>
                  <input
                    type="radio"
                    name="platform"
                    value="horizontal 16:9"
                    checked={editedProject.format === "horizontal 16:9"}
                    onChange={() => handleChangeFormat("horizontal 16:9")}
                  />
                  16:9
                </label>
                <label className={styles.step4_size_text}>
                  <input
                    type="radio"
                    name="platform"
                    value="vertical 9:16"
                    checked={editedProject.format === "vertical 9:16"}
                    onChange={() => handleChangeFormat("vertical 9:16")}
                  />
                  9:16
                </label>
                <label className={styles.step4_size_text}>
                  <input
                    type="radio"
                    name="platform"
                    value="vertical 9:16 and horizontal 16:9"
                    checked={
                      editedProject.format ===
                        "vertical 9:16 and horizontal 16:9" ||
                      editedProject.format ===
                        "horizontal 16:9 and vertical 9:16"
                    }
                    onChange={() =>
                      handleChangeFormat("vertical 9:16 and horizontal 16:9")
                    }
                  />
                  9:16 and 16:9
                </label>
              </div>
            </div>
            <div className={styles.flex_container}>
              <p className={styles.modal_links}>
                Provide links to reference videos:
                <span
                  className={`${styles.modal_span} ${styles.modal_span_links}`}
                >
                  {editedProject.links?.length > 0 ? (
                    editedProject.links.map((link, index) => (
                      <span
                        key={index}
                        className={styles.modal_span_links_short}
                      >
                        <a
                          className={styles.modal_span_links_a}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link}
                        </a>
                        {index !== editedProject.links.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>You didn&apos;t add links</span>
                  )}
                </span>
              </p>
              {/* Поля введення для нового лінку */}
              <input
                className={styles.link_input}
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              />
              {/* Кнопка для додавання нового лінку */}
              <button
                onClick={handleAddLink}
                className={styles.add_link_button}
                style={{ display: newLink.trim() !== "" ? "block" : "none" }}
              >
                Add Link
              </button>
            </div>
          </div>
          <div>
            <StatusTracker currentStatus={project.status} />
          </div>
        </div>

        <div className={styles.soundtrack_container}>
          <p className={styles.modal_soundtrack}>
            Soundtrack:
            <span className={styles.modal_span}>
              {editedProject.soundtrack}
            </span>
          </p>
          <ul className={styles.links_list}>
            {editedProject.uploadedtrack &&
            editedProject.uploadedtrack.length > 0 ? (
              editedProject.uploadedtrack.map((name, index) => (
                <li className={` ${styles.soundtrack_item}`} key={index}>
                  <div>
                    <svg className={styles.sound_icon} width="25" height="17">
                      <use href="/assets/icons.svg#icon-sound"></use>
                    </svg>
                  </div>
                  {name}
                </li>
              ))
            ) : (
              <li className={styles.soundtrack_item}>
                You didn&lsquo;t upload soundtrack
              </li>
            )}
          </ul>
        </div>
        <Step7
          editedProject={editedProject}
          handleChangeInput={handleChangeInput7}
          nameForFrameIo={nameForFrameIo}
          uploadedFileNames={uploadedFileNames}
          setUploadedFileNames={setUploadedFileNames}
        />
        <div
          className={`${styles.flex_container} ${styles.calendar_container}`}
        >
          <p className={styles.modal_soundtrack}>
            Deadline:
            <span className={styles.modal_span}>{formattedDate}</span>
          </p>
        </div>
        <CalendarModal
          editedProject={editedProject}
          handleChangeInput={handleChangeInputCalendar}
        />
        <div
          className={`${styles.flex_container} ${styles.flex_container_upload}`}
        >
          <p className={styles.uploaded_list_title}>Uploaded files</p>
          <ul className={styles.links_list}>
            {editedProject.files && editedProject.files.length > 0 ? (
              editedProject.files.map((name, index) => (
                <li className={` ${styles.soundtrack_item}`} key={index}>
                  <div>
                    <svg className={styles.sound_icon} width="25" height="17">
                      <use href="/assets/icons.svg#icon-file"></use>
                    </svg>
                  </div>
                  {name}
                </li>
              ))
            ) : (
              <li className={styles.soundtrack_item}>
                You didn&lsquo;t upload files
              </li>
            )}
          </ul>
          <p className={styles.modal_upload}>Upload your file</p>{" "}
          <Step9
            nameForFrameIo={nameForFrameIo}
            handleChangeInput={handleChangeInput9}
            handleDeleteLink={handleDeleteLink}
            uploadedFilesDocument={uploadedFilesDocument}
            setUploadedFilesDocument={setUploadedFilesDocument}
          />
        </div>
        {loading && (
          <div className={styles.step8_loader_container}>
            <p>Loading...</p>
            <ColorRing
              visible={true}
              width="200"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#7B5BE9", "#CD10FF", "#F496D1", "#3818D9", "#c3b8fc"]}
            />
          </div>
        )}
        <div className={styles.step8_button_container}>
          <button
            className={`${styles.step2_button} ${
              disableButton ? styles.disabled : ""
            }`}
            onClick={async () => {
              isDraft = true;
              await handleSubmitFormData(isDraft);
            }}
          >
            Draft
          </button>
          <button
            className={`${styles.step2_button} ${
              disableButton ? styles.disabled : ""
            }`}
            onClick={async () => {
              if (
                (plan === "pln_ultimate-plan-de15n090q" ||
                  plan === "pln_ultimate-plan-year-d819f0w1u") &&
                activeProjects.length >= 2
              ) {
                toast.warning(
                  "To increase the number of active projects in your work, please contact our sales team"
                );
              } else if (
                (plan !== "pln_ultimate-plan-de15n090q" ||
                  plan !== "pln_ultimate-plan-year-d819f0w1u") &&
                activeProjects.length >= 1
              ) {
                toast.warning(
                  "In order for you to have 2 active projects, you need to upgrade your plan to the Ultimate Plan"
                );
              } else {
                isDraft = false;
                await handleSubmitFormData(isDraft);
              }
            }}
          >
            To do
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
