"use client";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Calendar.module.scss";
import { mulish } from "@/app/fonts";
function CalendarModal({ editedProject, handleChangeInput }) {
  const [value, onChange] = useState(new Date());

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const handleChange = (value) => {
    onChange(value);
    handleChangeInput(value); // Передача значення дати в функцію handleChangeInputCalendar
  };
  const today = new Date();
  const minSelectableDate = new Date(today);
  minSelectableDate.setDate(today.getDate() + 3);
  return (
    <div className={`${styles.step7_calendar_container} ${mulish.className}`}>
      {" "}
      <Calendar
        onChange={handleChange}
        value={value}
        className={styles.react_calendar}
        minDate={minSelectableDate}
        tileDisabled={({ date, view }) => view === "month" && isWeekend(date)}
      />
    </div>
  );
}

export default CalendarModal;
