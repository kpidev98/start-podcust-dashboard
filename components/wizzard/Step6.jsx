"use client";
import { useState } from "react";
import styles from "./Step6.module.scss";
import { toast } from "sonner";
import { mulish } from "@/app/fonts";

function Step6({
  handleNextStep,
  handlePrevStep,
  formData,
  handleChangeInput,
}) {
  const [linksText, setLinksText] = useState(formData.links || [""]); // Початкове значення - масив з одним порожнім рядком

  const handleLink = () => {
    const lastInputValue = linksText[linksText.length - 1];
    if (lastInputValue.trim() !== "") {
      setLinksText([...linksText, ""]); // Додаємо новий порожній рядок до масиву
    } else {
      toast.warning("please add link");
    }
  };

  const handleChangeLink = (index, value) => {
    const newLinks = [...linksText];
    newLinks[index] = value;
    setLinksText(newLinks);
  };
  const isValidUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/.*$/;
    return urlPattern.test(url);
  };

  const nonEmptyLinks = linksText.filter((link) => link.trim() !== "");
  return (
    <div className={mulish.className}>
      <h2 className={styles.step5_title}>
        Provide links to <br className={styles.step6_devider} /> reference
        videos
      </h2>

      <div className={styles.step5_textarea_container}>
        <div>
          {linksText.map((link, index) => (
            <div className={styles.step5_input_links_contaniner} key={index}>
              <input
                className={styles.step5_input_links}
                type="text"
                placeholder="Enter link ..."
                value={link}
                onChange={(e) => handleChangeLink(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleLink} className={styles.step6_button_add_more}>
            <div>
              {" "}
              <svg className={styles.step6_icon} width="10" height="10">
                <use href="/assets/icons.svg#icon-plus"></use>
              </svg>
            </div>{" "}
            add more links
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (nonEmptyLinks.every((link) => isValidUrl(link))) {
            handleChangeInput(nonEmptyLinks);
            handleNextStep();
          } else {
            toast.warning("Please enter valid link");
          }
        }}
        className={`${styles.step2_button} `}
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

export default Step6;
