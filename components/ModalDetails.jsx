"use client";
import { useEffect, useState } from "react";
import styles from "./ModalDetails.module.scss";
import { toast } from "sonner";
import { ColorRing } from "react-loader-spinner";
import renderIcon from "@/utils/renderIcon";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import StatusTracker from "./modal-edit/StatusTracker";
import { useMemberstack } from "@memberstack/nextjs/client";
const ModalDetails = ({ isOpenDetails, onCloseDetails, project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [fileIds, setFileIds] = useState({});
  const [buttonUpload, setButtonUpload] = useState(true);
  const [user, setUser] = useState(null);
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
  const renderComment = (commentText) => {
    // Регулярний вираз для пошуку URL-адрес у тексті
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Розбиваємо текст коментаря на окремі фрагменти (текст і URL-адреси)
    const parts = commentText.split(urlRegex);

    return (
      <div>
        {parts.map((part, index) =>
          // Перевіряємо, чи частина є URL-адресою або текстом
          urlRegex.test(part) ? (
            <a
              key={index}
              href={part}
              className={styles.comment_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
    );
  };

  const nameForFrameIo = `${user?.customFields["first-name"]} ${user?.customFields["last-name"]}-id:${user?.id}`;
  const author = `${user?.customFields["first-name"]} ${user?.customFields["last-name"]}`;
  const currentDateTime = new Date();
  const formattedDateTime = `${currentDateTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}, ${currentDateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onCloseDetails]);

  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      onCloseDetails();
    }
  };
  useEffect(() => {
    if (isOpenDetails) {
      fetchComments();
      document.body.style.overflow = "hidden";
    } else {
      // Зняття обмеження прокрутки body при закритті модального вікна
      document.body.style.overflow = "auto";
    }
  }, [isOpenDetails]);

  const date = new Date(project.deadline); // Створюємо об'єкт Date з рядка
  const formattedDate = date.toLocaleDateString();
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  const maxDescriptionLength = 100;
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post("/api/comments", {
        projectId: project.storyId,
        comment: comment,
      });

      if (response.status === 200) {
        setComment("");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
    try {
      const responsedb = await axios.put("/api/commentdb", {
        storyId: project.storyId,
        text: comment,
        timestamp: formattedDateTime,
        author: author,
      });
      if (responsedb.status === 200) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `/api/getprojectbyid?projectId=${project._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.comments);
        setCommentsList(response.data.comments);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // ////////////////////////////////////////////////////////////////////
  // file uploader
  const handleMenuToggle = (fileName) => {
    setShowMenu((prevMenu) => ({
      ...prevMenu,
      [fileName]: !prevMenu[fileName],
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles([...selectedFiles]);
    const initialProgress = {};
    files.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setFileProgress(initialProgress);
    setButtonUpload(true);
  };
  const updateFileProgress = (fileName, progress) => {
    setFileProgress((prevProgress) => ({
      ...prevProgress,
      [fileName]: progress,
    }));
  };
  const handleUploadError = (fileName) => {
    setUploadStatus((prevStatus) => ({
      ...prevStatus,
      [fileName]: "error",
    }));
  };

  const handleUploadSuccess = (fileName) => {
    setUploadStatus((prevStatus) => ({
      ...prevStatus,
      [fileName]: "success",
    }));
  };
  const handleReloadClick = () => {
    // Додайте обробник для кнопки Reload
  };
  const handleDeleteClick = async (fileName, fileId) => {
    try {
      const response = await fetch(`/api/deleteframeiofile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: fileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const updatedFiles = files.filter((file) => file.name !== fileName);
      setFiles(updatedFiles);
      try {
        const storyId = project.storyId;
        const response = await axios.delete("/api/deletefilesname", {
          data: { storyId, fileName }, // Відправте storyId та fileName у вигляді даних запиту
        });
        console.log(response.data); // Опрацьовуйте відповідь
      } catch (error) {
        console.error("Error deleting project file:", error);
        throw error;
      }

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      // Обробка помилок, наприклад, показ повідомлення про помилку користувачеві
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) return;
    setLoading(true);

    const frameIoData = {
      name: nameForFrameIo,
    };

    try {
      const resproject = await fetch("/api/getprojectframeio", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resproject.ok) {
        setLoading(false);
        throw new Error("Failed to fetch epics");
      }

      const projectData = await resproject.json();
      let existRootId;
      let newRootId;

      const existProject = projectData.find(
        (object) => object.name === frameIoData.name
      );

      if (existProject) {
        existRootId = existProject ? existProject.root_asset_id : null;
      } else {
        const resio = await fetch("/api/frameioproject", {
          method: "POST",
          body: JSON.stringify(frameIoData),
        });

        if (!resio.ok) {
          setLoading(false);
          throw new Error(await resio.text());
        }
        const { rootId } = await resio.json();

        newRootId = rootId;
      }

      const finalRootId = existProject ? existRootId : newRootId;
      const uploadPromises = files.map(async (file) => {
        const fileInfo = {
          name: file.name,
          filetype: file.type,
          filesize: file.size,
          rootid: finalRootId,
        };

        try {
          const res = await fetch("/api/frameio", {
            method: "POST",
            body: JSON.stringify(fileInfo),
          });

          if (!res.ok) {
            setLoading(false);
            throw new Error(await res.text());
          }

          const { uploadUrls, fileId } = await res.json();
          setFileIds((prevFileIds) => ({
            ...prevFileIds,
            [file.name]: fileId,
          }));

          console.log(fileId);
          const headers = {
            "Content-Type": file.type,
            "x-amz-acl": "private",
          };

          const chunkSize = Math.ceil(file.size / uploadUrls.length);

          for (let index = 0; index < uploadUrls.length; index++) {
            const uploadUrl = uploadUrls[index];
            const start = index * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            const response = await axios.put(uploadUrl, chunk, {
              headers: headers,
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  ((start + progressEvent.loaded) / file.size) * 100
                );
                updateFileProgress(file.name, progress);
              },
            });

            if (response.status !== 200) {
              console.error("Upload error:", response.data);
              handleUploadError(file.name);
              setLoading(false);
              return;
            }

            handleUploadSuccess(file.name);
          }
        } catch (error) {
          console.error("Error during file upload:", error);
          handleUploadError(file.name);
          setLoading(false);
        }
      });

      await Promise.all(uploadPromises);

      const newFiles = {
        storyId: project.storyId,
        newfiles: files.map((file) => file.name),
      };
      console.log(newFiles);
      try {
        const response = await axios.put("/api/updatefilesdb", newFiles);
        console.log(response.data); // Результат запиту, який повертає сервер
      } catch (error) {
        console.error("Error updating project:", error);
        setLoading(false);
        throw error;
      }
      setButtonUpload(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  if (!isOpenDetails) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onCloseDetails}>
          &times;
        </button>
        <div className={styles.modalContent}>
          <div className={styles.content_container}>
            <p className={styles.modal_title}>{project.name}</p>
            <p className={styles.modal_id}>#id:{project.storyId}</p>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>
                {" "}
                What type of video do you need to edit?
              </p>
              <p className={styles.current_value}>{project.type}</p>
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>The title of your video </p>
              <p className={styles.current_value}>{project.name}</p>
            </div>

            <div className={styles.value_container}>
              <p className={styles.modal_type}>
                What is the approximate timing of the finished video?
              </p>
              <p className={styles.current_value}>{project.time}</p>
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>
                What platform/format do you need to edit the video for?
              </p>
              <p className={styles.current_value}>{project.format}</p>
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>
                Provide links to reference videos
              </p>
              {project.links && project.links.length > 0 ? (
                <ul className={styles.links_list}>
                  {project.links.map((link, index) => (
                    <li className={`${styles.current_value}`} key={index}>
                      <a className={styles.links_a} href={link}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.current_value}>
                  You haven&lsquo;t added any links
                </p>
              )}
            </div>

            <div className={styles.value_container}>
              <p className={styles.modal_type}>
                Do you have a soundtrack ready?
              </p>
              <p className={styles.current_value}>{project.soundtrack}</p>
              <div>
                <ul className={styles.links_list}>
                  {project.uploadedtrack && project.uploadedtrack.length > 0 ? (
                    project.uploadedtrack.map((name, index) => (
                      <li className={` ${styles.soundtrack_item}`} key={index}>
                        <div>
                          <svg
                            className={styles.sound_icon}
                            width="25"
                            height="17"
                          >
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
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>Description</p>
              <p
                className={`${styles.current_value} ${styles.description_text}`}
              >
                {isExpanded
                  ? project.description // Відображає повний опис, якщо розгорнуто
                  : project.description.slice(0, maxDescriptionLength) +
                    (project.description.length > maxDescriptionLength
                      ? "..."
                      : "")}{" "}
                {project.description.length > maxDescriptionLength && (
                  <button
                    onClick={toggleExpansion}
                    className={styles.expand_button}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </p>
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>Deadline</p>
              <p className={styles.current_value}>{formattedDate}</p>
            </div>
            <div className={styles.value_container}>
              <p className={styles.modal_type}>Attached files</p>
              <ul className={styles.links_list}>
                {project.files.length > 0 ? (
                  project.files.map((name, index) => (
                    <li className={` ${styles.soundtrack_item}`} key={index}>
                      <div>
                        <svg
                          className={styles.sound_icon}
                          width="25"
                          height="17"
                        >
                          <use href="/assets/icons.svg#icon-file"></use>
                        </svg>
                      </div>
                      {name}
                    </li>
                  ))
                ) : (
                  <li className={styles.soundtrack_item}>
                    You haven&lsquo;t uploaded any files
                  </li>
                )}
              </ul>
            </div>

            <div className={styles.comments_container}>
              <p className={styles.comments_title}>Comments</p>
              <ul className={styles.comments_list}>
                {commentsList.map((comment, index) => {
                  // Форматування дати
                  const parts = comment.text.split(" ");
                  const commentDate = new Date(comment.date);
                  const formattedDate = commentDate.toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );
                  const formattedTime = commentDate.toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );

                  return (
                    <li key={index} className={styles.comment_item}>
                      <div
                        className={`${styles.comments_user_icon} ${
                          comment.author === "Manager" ? styles.managerIcon : ""
                        }`}
                      >
                        {comment.author.split(" ").map((namePart, index) => {
                          return index < 2
                            ? namePart.charAt(0).toUpperCase()
                            : null;
                        })}
                      </div>
                      <div>
                        <div className={styles.timestamp_container}>
                          {" "}
                          <p className={styles.comment_author}>
                            {comment.author}
                          </p>{" "}
                          <p className={styles.comment_date}>
                            {formattedDate}, {formattedTime}
                          </p>
                        </div>

                        {renderComment(comment.text)}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.step6_soundtreck_container}>
                {files.length >= 1 && (
                  <ul className={styles.upload_form_list}>
                    {files.map((file, index) => (
                      <li className={styles.upload_form_item} key={index}>
                        <div className={styles.upload_form_item_container}>
                          {renderIcon(file.type)}
                          <p className={styles.upload_form_item_text}>
                            {file.name}
                          </p>
                        </div>
                        <div className={styles.upload_form_item_container}>
                          {uploadStatus[file.name] === "success" &&
                            fileProgress[file.name] === 100 && (
                              <svg
                                className={styles.navigation_icon}
                                width="30"
                                height="30"
                              >
                                <use href="/assets/icons.svg#icon-done-upload"></use>
                              </svg>
                            )}
                          {uploadStatus[file.name] === "error" && (
                            <div className={styles.erorr_uploading}>Erorr</div>
                          )}
                          {!(
                            uploadStatus[file.name] === "success" &&
                            fileProgress[file.name] === 100
                          ) &&
                            uploadStatus[file.name] !== "error" && (
                              <div className={styles.loader}>
                                <CircularProgressbar
                                  value={fileProgress[file.name] || 0}
                                  text={`${fileProgress[file.name] || 0}%`}
                                  styles={buildStyles({
                                    pathColor: "#3818d9",
                                    textColor: "#000",
                                    trailColor: "#eaedf6",
                                  })}
                                />
                              </div>
                            )}
                          <div className={styles.upload_menu_elips_container}>
                            {(uploadStatus[file.name] === "error" ||
                              fileProgress[file.name] === 100) && (
                              <button
                                className={styles.upload_form_button_delete}
                                onClick={() => handleMenuToggle(file.name)}
                              >
                                <svg
                                  className={styles.navigation_icon}
                                  width="17"
                                  height="20"
                                >
                                  <use href="/assets/icons.svg#icon-Ellipsis"></use>
                                </svg>
                              </button>
                            )}{" "}
                            {showMenu[file.name] && (
                              <div className={styles.menu_upload}>
                                <button
                                  className={`${styles.menu_upload_button} ${styles.menu_upload_button_reload}`}
                                  onClick={handleReloadClick}
                                >
                                  Reload
                                </button>
                                <button
                                  className={`${styles.menu_upload_button} ${styles.menu_upload_button_delete}`}
                                  onClick={() =>
                                    handleDeleteClick(
                                      file.name,
                                      fileIds[file.name]
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {loading && (
                  <div className={styles.step8_loader_container}>
                    <p>Loading...</p>
                    <ColorRing
                      visible={true}
                      width="200"
                      ariaLabel="color-ring-loading"
                      wrapperStyle={{}}
                      wrapperClass="color-ring-wrapper"
                      colors={[
                        "#7B5BE9",
                        "#CD10FF",
                        "#F496D1",
                        "#3818D9",
                        "#c3b8fc",
                      ]}
                    />
                  </div>
                )}

                <div className={styles.step8_upload_container}>
                  <form
                    onSubmit={onSubmit}
                    className={styles.step8_upload_form}
                  >
                    {files.length >= 1 && buttonUpload && (
                      <div className={styles.step8_icon_upload_container}>
                        <button
                          title="Upload your files"
                          className={styles.step8_input_upload_form_button}
                          type="submit"
                          disabled={!files}
                        >
                          <div className={styles.step2_icon_container}>
                            <svg
                              className={styles.step8_icon_upload}
                              width="20"
                              height="20"
                            >
                              <use href="/assets/icons.svg#icon-upload3"></use>
                            </svg>
                          </div>
                          upload files
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      name="file"
                      multiple={true}
                      id="upload_form"
                      onChange={handleFileChange}
                      className={styles.step8_input_upload_form}
                    />
                  </form>
                </div>
              </div>

              <div className={styles.relative_container}>
                <textarea
                  className={styles.comment_textarea}
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="write your comment..."
                />
                <label htmlFor="upload_form" className={styles.atach_button}>
                  {" "}
                  <svg className={styles.atach_icon} width="25" height="17">
                    <use href="/assets/icons.svg#icon-atach"></use>
                  </svg>
                </label>
              </div>

              <button
                onClick={handleCommentSubmit}
                className={styles.comments_button}
              >
                Save
              </button>
            </div>
          </div>
          <div className={styles.status_container}>
            <StatusTracker currentStatus={project.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
