"use client";

import AsideBar from "@/components/AsideBar";
import styles from "./DashboardPageCom.module.scss";
import { inter } from "../app/fonts";
import { useRouter } from "next/navigation";
import DashboardBurgerMenu from "@/components/DashboardMenu";
import { MemberstackProtected } from "@memberstack/nextjs/client";
import { useState, useRef, useEffect } from "react";
import ProfileModalComponent from "./ModalProfile";

const DashboardComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const unathorizedRedirect = () => {
    router.push("https://www.start-podcast.com/acces-denied");
  };

  const handleProfileButtonClick = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  return (
    <MemberstackProtected
      allow={{
        plans: [
          "pln_startup-h07f0gob",
          "pln_weekly-va6j01w1",
          "pln_boost-o7zl0cuh",
        ],
      }}
      onUnauthorized={unathorizedRedirect}
    >
      <div className={styles.flex_container}>
        <div className={styles.asidebar_container}>
          <AsideBar />
        </div>
        <div className={styles.full_width}>
          <div className={styles.header_container}>
            <h1
              className={`${styles.header_container_text} ${inter.className}`}
            >
              Dashboard
            </h1>

            <div className={styles.dashboard_burger_container}>
              <button
                ref={buttonRef}
                onClick={handleProfileButtonClick}
                className={styles.profile_button}
              ></button>
              <DashboardBurgerMenu />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div ref={modalRef}>
          <ProfileModalComponent />
        </div>
      )}
    </MemberstackProtected>
  );
};

export default DashboardComponent;
