"use client";
import Link from "next/link";
import { mulish } from "@/app/fonts";
import { useMemberstackModal, useAuth } from "@memberstack/nextjs/client";
import BurgerMenu from "./Menu";
import styles from "./Navigation.module.scss";
import { useRouter } from "next/navigation";
function Navigation() {
  const { openModal, hideModal } = useMemberstackModal();
  const router = useRouter();
  const { userId, signOut, isLoggedIn } = useAuth();
  const handleSuccess = () => {
    hideModal();
    router.push("/dashboard");
  };
  const handleSignOut = () => {
    signOut();
    router.push("/");
  };
  return (
    <div className={styles.navigation_container}>
      <div>
        <Link
          className={`${styles.navigation_link} ${mulish.className}`}
          href="/"
        >
          indiev
          <div className={styles.logo_indiev}>
            {" "}
            <svg className={styles.logo_icon} width="25" height="25">
              <use href="/assets/icons.svg#icon-logo-indiev"></use>
            </svg>
          </div>
        </Link>
      </div>
      <div className={styles.navigation_button_container}>
        {isLoggedIn ? (
          <div className={styles.sign_out_container}>
            <Link
              href="/dashboard"
              className={` ${styles.link_signin_dashboard}`}
            >
              Dashboard
            </Link>
            <button onClick={handleSignOut} className={styles.sign_out}>
              Sign Out
            </button>
          </div>
        ) : (
          <div
            className={styles.modal_login_link}
            onClick={() =>
              openModal({
                type: "LOGIN",
              }).then(({ data, type }) => {
                if (data?.member?.auth?.hasPassword === true) {
                  handleSuccess();
                } else {
                  console.log(type);
                }
              })
            }
          >
            Log in
          </div>
        )}
        <BurgerMenu />
      </div>
    </div>
  );
}

export default Navigation;
