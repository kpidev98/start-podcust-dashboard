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
    router.push("https://www.indiev.org/access-denied");
  };

  const handleProfileButtonClick = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  return (
    <>
      <MemberstackProtected
        allow={{
          plans: [
            "pln_basic-plan-1515l09dz",
            "pln_basic-plan-year-r819b0w7b",
            "pln_one-time-video-tj18d0xcj",
            "pln_pro-plan-nx1960wm1",
            "pln_pro-plan-year-gl19d0whp",
            "pln_ultimate-plan-de15n090q",
            "pln_ultimate-plan-year-d819f0w1u",
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
    </>
  );
};

export default DashboardComponent;
