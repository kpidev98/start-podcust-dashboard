import styles from "./AsideBar.module.scss";
import Link from "next/link";
import { mulish, inter } from "@/app/fonts";

function AsideBar() {
  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.sidebar_logo_container}>
          {" "}
          <Link
            className={`${styles.navigation_link} ${mulish.className}`}
            href="/"
          >
            indiev
          </Link>
        </div>
        <div className={styles.sidebar_link_flex}>
          <div className={inter.className}>
            <ul className={styles.sidebar_list}>
              <li className={styles.sidebar_items}>
                <svg className={styles.navigation_icon} width="20" height="20">
                  <use href="/assets/icons.svg#icon-home3"></use>
                </svg>
                <Link href="/" className={styles.sidebar_link}>
                  Dashboard
                </Link>
              </li>

              <li className={styles.sidebar_items}>
                <svg
                  className={styles.navigation_icon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M10 3H3V10H10V3Z"
                    stroke="#707070"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 3H14V10H21V3Z"
                    stroke="#707070"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 14H14V21H21V14Z"
                    stroke="#707070"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 14H3V21H10V14Z"
                    stroke="#707070"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <Link href="/projects" className={styles.sidebar_link}>
                  Projects
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AsideBar;
