"use client";
import React, { useState } from "react";
import styles from "./DashboardMenu.module.scss";
import Link from "next/link";

import { inter, mulish } from "@/app/fonts";

const DashboardBurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${styles.burgerMenu} ${inter.className}`}>
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        type="button"
        aria-label="Burger Menu"
      >
        <svg className={styles.navigation_icon_burger} width="25" height="17">
          <use href="/assets/icons.svg#icon-menu"></use>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menuItems}>
          <button className={styles.closeButton} onClick={closeMenu}>
            <svg className={styles.button_close} width="25" height="25">
              <use href="/assets/icons.svg#icon-Close"></use>
            </svg>
          </button>
          <Link
            className={`${styles.navigation_link} ${mulish.className}`}
            href="/"
          >
            <div className={styles.logo_icon_container}></div>
            startpodcast
          </Link>
          <div className={styles.menu_container}>
            <div className={styles.dashboard_menu_link_containers}>
              <svg className={styles.navigation_icon} width="20" height="20">
                <use href="/assets/icons.svg#icon-home3"></use>
              </svg>
              <Link className={styles.menu_links} href="/">
                Dashboard
              </Link>
            </div>
            <div className={styles.dashboard_menu_link_containers}>
              <svg className={styles.navigation_icon} width="20" height="20">
                <use href="/assets/icons.svg#icon-folder-open"></use>
              </svg>
              <Link href="/projects" className={styles.menu_links}>
                Projects
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBurgerMenu;
