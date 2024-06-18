"use client";
import React, { useState, useEffect } from "react";
import styles from "./Step9.module.scss";
import Image from "next/image";
import DropImage from "../../public/assets/dropbox.svg";
import DriveImage from "../../public/assets/drive.svg";
import { ColorRing } from "react-loader-spinner";
import renderIcon from "@/utils/renderIcon";
import { mulish } from "@/app/fonts";
import { toast } from "sonner";
import axios from "axios";
import renderIconLink from "@/utils/renderIconLink";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Step9({
  handlePrevStep,
  handleSubmitFormData,
  nameForFrameIo,
  handleChangeInput,
  formData,
  handleDeleteLink,
  isDraft,
  isSubmitting,
  setIsSubmitting,
  fainalLoading,
  setUploadedFileNames,
  uploadedFileNames,
  plan,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileProgress, setFileProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [fileIds, setFileIds] = useState({});
  const [listLinks, setListLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [linkMenus, setLinkMenus] = useState({});
  const [buttonUpload, setButtonUpload] = useState(true);
  const [todoDisable, setTodoDisable] = useState(true);
  const [activeProjects, setActiveProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/getallprojectdb");
        const data = response.data;
        const filteredProjects = data.filter(
          (project) => project.status !== "Draft" && project.status !== "Done"
        );
        setActiveProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleReloadClick = () => {
    // Додайте обробник для кнопки Reload
  };
  const handleMenuToggle = (fileName) => {
    setShowMenu((prevMenu) => ({
      ...prevMenu,
      [fileName]: !prevMenu[fileName],
    }));
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
      setUploadedFileNames((prevFileNames) =>
        prevFileNames.filter((name) => name !== fileName)
      );
      setTodoDisable(true);
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      // Обробка помилок, наприклад, показ повідомлення про помилку користувачеві
    }
  };

  //  for input !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

  //  main function!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
          setUploadedFileNames((prevFileNames) => [
            ...prevFileNames,
            file.name,
          ]);

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
      setButtonUpload(false);
      setLoading(false);
      setTodoDisable(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Links//////////////////////////////////////////////////////////////
  const isValidUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/.*$/;
    return urlPattern.test(url);
  };
  const handleChangeLinks = () => {
    if (isValidUrl(newLink)) {
      setListLinks((prevLinks) => [...prevLinks, newLink]);
      handleChangeInput(newLink);
      setNewLink("");
      setTodoDisable(false);
      toast.success("Link added successfully");
    } else {
      toast.warning("Invalid URL");
    }
  };

  const handleMenuOpenLinks = (index) => {
    setLinkMenus((prevMenus) => ({
      ...prevMenus,
      [index]: !prevMenus[index],
    }));
  };
  const handleDeleteClickLinks = (linkIndex, linkName) => {
    // Оновіть список лінків, видаливши лінк за індексом
    const updatedLinks = listLinks.filter((_, index) => index !== linkIndex);
    setListLinks(updatedLinks);
    handleDeleteLink(linkName);

    toast.success("File deleted successfully");
    if (updatedLinks.length === 0) {
      setTodoDisable(true);
    }
  };

  return (
    <div className={mulish.className}>
      <h2 className={styles.step8_title}>Upload files</h2>
      {files && (
        <ul className={styles.upload_form_list}>
          {files.map((file, index) => (
            <li className={styles.upload_form_item} key={index}>
              <div className={styles.upload_form_item_container}>
                {renderIcon(file.type)}
                <p>{file.name}</p>
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
                <div className={styles.links_menue_mob}>
                  {" "}
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
                  )}
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
                          handleDeleteClick(file.name, fileIds[file.name])
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
      {listLinks && (
        <ul
          className={`${styles.upload_form_list} ${styles.upload_form_list_link}`}
        >
          {listLinks.map((link, index) => (
            <li
              key={index}
              className={`${styles.upload_form_item} ${styles.list_links_item}`}
            >
              <div className={styles.links_icon_container}>
                {" "}
                {renderIconLink(link)}
                <p className={styles.links_text}>{link}</p>
              </div>

              <div className={styles.upload_form_item_container}>
                <svg className={styles.navigation_icon} width="30" height="30">
                  <use href="/assets/icons.svg#icon-done-upload"></use>
                </svg>
                <div className={styles.links_menue_mob}>
                  {" "}
                  <button
                    className={styles.upload_form_button_delete}
                    onClick={() => handleMenuOpenLinks(index)}
                  >
                    <svg
                      className={styles.navigation_icon}
                      width="17"
                      height="20"
                    >
                      <use href="/assets/icons.svg#icon-Ellipsis"></use>
                    </svg>
                  </button>
                  {linkMenus[index] && (
                    <div
                      className={`${styles.menu_upload} ${styles.menu_upload_links}`}
                    >
                      <button
                        className={`${styles.menu_upload_button} ${styles.menu_upload_button_delete_link}`}
                        onClick={() => handleDeleteClickLinks(index, link)}
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
            colors={["#7B5BE9", "#CD10FF", "#F496D1", "#3818D9", "#c3b8fc"]}
          />
        </div>
      )}

      <form onSubmit={onSubmit} className={styles.step8_upload_form}>
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
        <div className={styles.step8_upload_container}>
          <label
            className={`${styles.upload_form_label} `}
            htmlFor="upload_form"
          >
            <div className={styles.step2_icon_container}></div>
            Click to add your files
          </label>
        </div>
        <input
          type="file"
          name="file"
          id="upload_form"
          multiple={true}
          onChange={handleFileChange}
          className={styles.step8_input_upload_form}
        />
      </form>

      <div className={styles.step8_atach_container}>
        <p className={styles.step8_links_text}>Or add links to uploaded</p>
        <div className={styles.step8_dropbox_container}>
          <div className={styles.step8_image_container}>
            {" "}
            <Image src={DropImage} alt="Picture of DropBox" />
          </div>
        </div>
        <div className={styles.step8_dropbox_container}>
          <div className={styles.step8_image_container}>
            {" "}
            <Image src={DriveImage} alt="Picture of GoogleDrive" />
          </div>
        </div>
      </div>

      <div className={styles.step8_addlinks_container}>
        <input
          className={styles.step8_input_add_links}
          type="text"
          placeholder="Enter link"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />

        <div className={styles.step8_close_container}>
          <button
            className={styles.step6_button_add_more}
            onClick={handleChangeLinks}
            style={{ display: newLink.trim() !== "" ? "block" : "none" }}
          >
            Save link
          </button>
        </div>
      </div>
      <div className={styles.step8_button_container}>
        <button
          type="button"
          className={`${styles.step2_button} ${
            isSubmitting ? styles.disabled : ""
          }`}
          onClick={async () => {
            if (!isSubmitting) {
              setIsSubmitting(true);
              formData.status = "Draft";
              isDraft = true;
              await handleSubmitFormData(isDraft);

              setIsSubmitting(false);
            }
          }}
          disabled={isSubmitting}
        >
          Save draft
        </button>
        <button
          type="button"
          className={`${styles.step2_button} ${
            isSubmitting || todoDisable ? styles.disabled : ""
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
              if (!isSubmitting) {
                setIsSubmitting(true);
                formData.status = "To do";
                isDraft = false;
                await handleSubmitFormData(isDraft);
                setIsSubmitting(false);
              }
            }
          }}
          disabled={isSubmitting || todoDisable}
        >
          To Do
        </button>
      </div>
      {fainalLoading && (
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

      <div className={styles.step2_button_container}>
        {" "}
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.step2_button_prev}
        >
          <div className={styles.step2_icon_container}>
            {" "}
            <svg className={styles.project_icon_filter} width="15" height="15">
              <use href="/assets/icons.svg#icon-arrow_back"></use>
            </svg>
          </div>{" "}
          Return to previous step
        </button>
      </div>
    </div>
  );
}

export default Step9;
