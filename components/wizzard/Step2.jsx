"use client";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./Step2.module.scss";
import { mulish } from "@/app/fonts";
function Step2({
  handleNextStep,
  handlePrevStep,
  formData,
  handleChangeInput,
}) {
  console.log(formData);
  const [text, setText] = useState(formData.title || "");
  const handleChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div className={mulish.className}>
      <h2 className={styles.step2_title}>The title of your video</h2>
      <div className={styles.step2_input_container}>
        <input
          className={styles.step2_input}
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type text ..."
        />
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
        className={`${styles.step2_button} ${
          text.trim() === "" ? styles.disabledButton : ""
        }`}
      >
        Next Step
      </button>
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

export default Step2;
