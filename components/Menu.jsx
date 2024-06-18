"use client";
import React, { useState } from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";

import { mulish } from "@/app/fonts";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${styles.burgerMenu} ${mulish.className}`}>
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        type="button"
        aria-label="Burger Menu"
      >
        <svg className={styles.navigation_icon} width="25" height="17">
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
          <Link href="/" className={styles.menu_logo}>
            indiev
            <div className={styles.logo_indiev}>
              {" "}
              <svg className={styles.logo_icon} width="25" height="25">
                <use href="/assets/icons.svg#icon-logo-indiev"></use>
              </svg>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className={`${styles.link_signin_dashboard} `}
          >
            Dashboard
          </Link>

          <Link
            href="/sign-in"
            className={`${styles.menu_links} ${styles.menu_links_sign}`}
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
