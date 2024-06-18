"use client";
import React, { useState } from "react";
import styles from "./Step5.module.scss";
import { toast } from "sonner";
import Image from "next/image";
import YuoutobeImage from "../../public/assets/you.svg";
import VimeoImage from "../../public/assets/vimeo.svg";
import FacebookImage from "../../public/assets/facebook.svg";
import TikTokImage from "../../public/assets/tiktok.svg";
import Reels from "../../public/assets/reels.svg";
import Shorts from "../../public/assets/shorts.svg";
import { mulish } from "@/app/fonts";
const formatStringToArray = (str) => {
  return str.split(",");
};

const formatStringToArray2 = (str) => {
  // Розділити рядок на масив, використовуючи "and" як роздільник
  const arr = str.split(" and ");

  return arr.flatMap((item) => item.trim());
};
function Step5({
  handleNextStep,
  handlePrevStep,
  handleChangeInput,
  formData,
}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(initialPlatforms);
  const formatString = selectedPlatforms.join(" and ");
  console.log(formData);
  function initialPlatforms() {
    if (
      formData.format === "horizontal 16:9 and vertical 9:16" ||
      formData.format === "vertical 9:16 and horizontal 16:9"
    ) {
      return formatStringToArray2(formData.format);
    } else if (
      formData.format === "horizontal 16:9" ||
      formData.format === "vertical 9:16"
    ) {
      return formatStringToArray(formData.format);
    } else {
      return [];
    }
  }

  const handleChange = (value) => {
    const index = selectedPlatforms.indexOf(value);
    if (index === -1) {
      setSelectedPlatforms([...selectedPlatforms, value]);
    } else {
      const updatedPlatforms = [...selectedPlatforms];
      updatedPlatforms.splice(index, 1);
      setSelectedPlatforms(updatedPlatforms);
    }
  };

  const handleSubmit = () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
    } else {
      handleChangeInput(formatString);
      handleNextStep();
    }
  };

  return (
    <div className={mulish.className}>
      <h2 className={styles.step4_title}>
        What platform/format do you need to edit the video for?
      </h2>
      <div className={styles.step3_radiobtn_container}>
        <div className={styles.step4_container_first}>
          <div className={styles.step4_label_container}>
            <label className={styles.step4_size_text}>
              <input
                type="checkbox"
                value="horizontal 16:9"
                checked={selectedPlatforms.includes("horizontal 16:9")}
                onChange={() => handleChange("horizontal 16:9")}
              />
              16:9
            </label>
            <div className={styles.step4_picture_container}>
              <Image src={YuoutobeImage} alt="Picture of YouTobe" />
              <Image src={FacebookImage} alt="Picture of FaceBook" />
              <Image src={VimeoImage} alt="Picture of Vimeo" />
            </div>
          </div>
        </div>

        <div className={styles.step4_container_first}>
          <div className={styles.step4_label_container}>
            <label className={styles.step4_size_text}>
              <input
                type="checkbox"
                value="vertical 9:16"
                checked={selectedPlatforms.includes("vertical 9:16")}
                onChange={() => handleChange("vertical 9:16")}
              />
              9:16
            </label>
            <div className={styles.step4_picture_container}>
              {" "}
              <Image
                src={Shorts}
                alt="Picture of Youtube shorts"
                width={50}
                height={50}
              />
              <Image src={TikTokImage} alt="Picture of TikTok" />
              <Image
                src={Reels}
                width={50}
                height={50}
                alt="Picture of Reels"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className={`${styles.step2_button} ${
          selectedPlatforms.length === 0 ? styles.disabledButton : ""
        }`}
      >
        Next Step
      </button>
      <div className={styles.step2_button_container}>
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.step2_button_prev}
        >
          <div className={styles.step2_icon_container}>
            <svg className={styles.project_icon_filter} width="15" height="15">
              <use href="/assets/icons.svg#icon-arrow_back"></use>
            </svg>
          </div>
          Return to previous step
        </button>
      </div>
    </div>
  );
}

export default Step5;
