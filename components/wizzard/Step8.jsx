"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Step8.module.scss";
import { mulish } from "@/app/fonts";

function Step8({
  handleNextStep,
  handlePrevStep,
  formData,
  handleChangeInput,
}) {
  const [value, onChange] = useState(formData.deadline || new Date());
  console.log(formData);
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Функція, яка перевіряє, чи є день вихідним (субота або неділя)
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const today = new Date();
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 3);

  return (
    <div className={mulish}>
      <h2 className={styles.step7_title}>Deadline</h2>
      <div className={styles.step7_calendar_container}>
        <Calendar
          onChange={onChange}
          value={value}
          className={styles.react_calendar}
          minDate={minSelectableDate}
          // Перевіряємо, чи вибрана дата не є вихідним днем
          tileDisabled={({ date, view }) => view === "month" && isWeekend(date)}
        />
        <div>
          <p className={styles.step7_calendar_text}>
            Selected Date: {formatDate(value)}
          </p>
          <button
            type="button"
            onClick={() => {
              handleChangeInput(value);
              handleNextStep();
            }}
            className={styles.step2_button}
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
                <svg
                  className={styles.project_icon_filter}
                  width="15"
                  height="15"
                >
                  <use href="/assets/icons.svg#icon-arrow_back"></use>
                </svg>
              </div>
              Return to previous step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step8;
