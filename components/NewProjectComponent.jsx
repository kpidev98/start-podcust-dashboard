"use client";
import AsideBar from "@/components/AsideBar";
import styles from "./NewProjectComponent.module.scss";
import Wizzard from "@/components/wizzard/Wizzard";
import DashboardBurgerMenu from "@/components/DashboardMenu";
import { inter } from "@/app/fonts";
import {
  useMemberstack,
  MemberstackProtected,
} from "@memberstack/nextjs/client";
import { useRouter } from "next/navigation";
const NewProjectComponent = () => {
  const router = useRouter();
  const unathorizedRedirect = () => {
    router.push("https://www.start-podcast.com/acces-denied");
  };
  return (
    <MemberstackProtected
      allow={{
        plans: [
          "pln_startup-h07f0gob",
          "pln_weekly-va6j01w1",
          "pln_boost-cw7h0gp5",
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
              Project
            </h1>
            <div className={styles.dashboard_burger_container}>
              <DashboardBurgerMenu />
            </div>
          </div>
          <div className={styles.wizzard_container}>
            <Wizzard />
          </div>
        </div>
      </div>
    </MemberstackProtected>
  );
};
export default NewProjectComponent;
