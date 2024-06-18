import styles from "./ModalProfile.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileModalMember from "./ProfileModal";
import {
  useMemberstack,
  MemberstackProtected,
  useAuth,
} from "@memberstack/nextjs/client";
const ProfileModalComponent = () => {
  const [user, setUser] = useState(null);
  const [isProfileModalMemberOpen, setIsProfileModalMemberOpen] =
    useState(false);
  const { signOut } = useAuth();

  const memberstack = useMemberstack();
  const router = useRouter();
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data: member } = await memberstack.getCurrentMember();
        setUser(member);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchMember();
  }, []);

  const userName = `${user?.customFields["first-name"]} ${user?.customFields["last-name"]}`;
  const userEmail = user?.auth.email;
  const handleSignOut = () => {
    signOut();
    router.push("https://www.indiev.org/sign-in");
  };

  const handleManageAccount = () => {
    setIsProfileModalMemberOpen(true);
  };

  return (
    <div className={styles.modal}>
      <p className={styles.modal_user_name}>{userName}</p>
      <p className={styles.modal_user_email}>{userEmail}</p>
      <div className={styles.modal_botton_container}>
        <button className={styles.modal_button_signout} onClick={handleSignOut}>
          Sign Out
        </button>
        <button
          className={styles.modal_button_signout}
          onClick={handleManageAccount}
        >
          Manage Account
        </button>
      </div>
      {isProfileModalMemberOpen && <ProfileModalMember />}
    </div>
  );
};
export default ProfileModalComponent;
