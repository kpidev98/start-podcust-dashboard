"use client";
import { useState } from "react";
import styles from "./Additional.module.scss";
import { mulish } from "@/app/fonts";
import { toast } from "sonner";
import { InfinitySpin } from "react-loader-spinner";
import renderIcon from "@/utils/renderIcon";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
function Upload({ editProject, handleChangeInput, nameForFrameIo }) {
  const [selectedOption, setSelectedOption] = useState("");

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [showMenu, setShowMenu] = useState({});
  const [fileIds, setFileIds] = useState({});

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

        if (!resio.ok) throw new Error(await resio.text());
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

          if (!res.ok) throw new Error(await res.text());

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
              return;
            }

            handleUploadSuccess(file.name);
          }
        } catch (error) {
          console.error("Error during file upload:", error);
          handleUploadError(file.name);
        }
      });

      await Promise.all(uploadPromises);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={mulish.className}>
      <h2 className={styles.step6_title}>Upload your files</h2>
      <div className={styles.options_container}>
        <div className={styles.step6_soundtreck_container}>
          {files.length >= 1 && (
            <ul className={styles.upload_form_list}>
              {files.map((file, index) => (
                <li className={styles.upload_form_item} key={index}>
                  <div className={styles.upload_form_item_container}>
                    {renderIcon(file.type)}
                    <p className={styles.upload_form_item_text}>{file.name}</p>
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
          {loading && (
            <>
              <p>Loading...</p>
              <InfinitySpin
                visible={true}
                width="200"
                color="#7B5BE9"
                ariaLabel="infinity-spin-loading"
              />
            </>
          )}

          <div className={styles.step8_upload_container}>
            <form onSubmit={onSubmit} className={styles.step8_upload_form}>
              {files.length >= 1 && (
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
              <label
                className={`${styles.upload_form_label} `}
                htmlFor="upload_form"
              >
                <p className={styles.upload_form_label_text}>
                  Click here to add your soundtrack
                </p>
                <div className={styles.step2_icon_container}>
                  <svg
                    width="30"
                    height="30"
                    className={styles.soundtrack_icon}
                  >
                    <use href="/assets/icons.svg#icon-noun_project_928"></use>
                  </svg>
                </div>
              </label>

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
      </div>
    </div>
  );
}

export default Upload;
