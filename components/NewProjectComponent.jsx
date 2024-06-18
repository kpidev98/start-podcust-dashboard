"use client";
import AsideBar from "@/components/AsideBar";
import styles from "./NewProjectComponent.module.scss";
import Wizzard from "@/components/wizzard/Wizzard";
import DashboardBurgerMenu from "@/components/DashboardMenu";
import {
  useMemberstack,
  MemberstackProtected,
} from "@memberstack/nextjs/client";
import { useRouter } from "next/navigation";
const NewProjectComponent = () => {
  const router = useRouter();
  const unathorizedRedirect = () => {
    router.push("https://www.indiev.org/access-denied");
  };
  return (
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
            <h1 className={styles.header_container_text}>Project</h1>
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
