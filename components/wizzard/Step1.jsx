import { useState } from "react";

import styles from "./Step1.module.scss";
import { mulish } from "@/app/fonts";
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

function Step1({ formData, handleChangeInput, handleNextStep }) {
  const [selectedOption, setSelectedOption] = useState(
    formData.typeOfVideo || options[0]
  );

  console.log(selectedOption);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={mulish.className}>
      <h2 className={styles.step1_title}>
        What type of video do you <br className={styles.step1_divadier} /> want
        us to edit?
      </h2>

      <div className={styles.custom_select}>
        {" "}
        <select
          value={selectedOption}
          onChange={handleOptionChange}
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

      <button
        type="button"
        onClick={() => {
          handleChangeInput(selectedOption);
          handleNextStep();
        }}
        className={styles.step1_button}
      >
        Next Step
      </button>
    </div>
  );
}

export default Step1;
