"use client";
import { SignInModal, useMemberstackModal } from "@memberstack/nextjs/client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function SignIn() {
  const { hideModal } = useMemberstackModal();
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    hideModal();
  };

  const handleClose = () => {
    router.push("https://www.indiev.org/access-denied");
  };

  return (
    <>
      <SignInModal
        onSuccess={({ data }) => {
          if (data?.member?.auth?.hasPassword === true) {
            handleSuccess();
          } else {
            console.log(type);
          }
        }}
        onClose={handleClose}
      />
    </>
  );
}

export default SignIn;
