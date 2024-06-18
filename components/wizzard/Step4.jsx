import styles from "./Step4.module.scss";
import React, { useState } from "react";
import { mulish } from "@/app/fonts";
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
function Step4({
  handleNextStep,
  handlePrevStep,
  formData,
  handleChangeInput,
}) {
  const [selectedInterval, setSelectedInterval] = useState(
    formData.timing || timeIntervals[0]
  );

  console.log(formData);
  const handleChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  return (
    <div className={mulish.className}>
      <h2 className={styles.step3_title}>
        What is the approximate <br className={styles.step4_devidr} /> timing of
        the <br className={styles.step4_devidr} /> finished video?{" "}
      </h2>
      <div className={styles.sliderContainer}>
        <label htmlFor="timeInterval" className={styles.step3_slider_label}>
          Select Time Interval:
        </label>
        <input
          className={styles.step3_range}
          type="range"
          id="timeInterval"
          min={1}
          max={timeIntervals.length}
          value={timeIntervals.indexOf(selectedInterval) + 1}
          onChange={(event) =>
            setSelectedInterval(timeIntervals[event.target.value - 1])
          }
        />
      </div>
      <p className={styles.step3_interval_text}>
        Selected Time Interval: {selectedInterval}
      </p>
      <button
        type="button"
        onClick={() => {
          handleChangeInput(selectedInterval);
          handleNextStep();
        }}
        className={styles.step2_button}
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

export default Step4;
