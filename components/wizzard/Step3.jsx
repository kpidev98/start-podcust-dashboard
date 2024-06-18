"use client";
import { useState } from "react";
import styles from "./Step3.module.scss";
import { toast } from "sonner";
import { mulish } from "@/app/fonts";
function Step3({
  handleNextStep,
  handlePrevStep,
  formData,
  handleChangeInput,
}) {
  const [text, setText] = useState(formData.description || "");
  const handleInputChange = (event) => {
    setText(event.target.value);
  };
  return (
    <div className={mulish.className}>
      <h2 className={styles.step3_title}>Video description</h2>

      <div className={styles.step3_textarea_container}>
        <textarea
          className={styles.step3_textarea}
          value={text}
          onChange={handleInputChange}
          placeholder="Write  description about video..."
        ></textarea>
      </div>
      <button
        type="button"
        onClick={() => {
          if (text.trim() === "") {
            toast.error(
              "The input field cannot be empty, please enter a value"
            );
          } else {
            handleChangeInput(text);
            handleNextStep();
          }
        }}
        className={`${styles.step3_button} ${
          text.trim() === "" ? styles.disabledButton : ""
        }`}
      >
        Next Step
      </button>
      <div className={styles.step3_button_container}>
        {" "}
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.step3_button_prev}
        >
          <div className={styles.step3_icon_container}>
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

export default Step3;
