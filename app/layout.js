import "./globals.scss";
import { MemberstackProvider } from "@memberstack/nextjs/client";

import { Toaster, toast } from "sonner";
export const metadata = {
  title: {
    default: "Start Podcust - Video Editing Service by Subscription",
  },
  description: "The best platform for your video editing needs",
};
const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <MemberstackProvider
          config={{
            publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY,
            useCookies: true,
            setCookieOnRoot: true,
          }}
        >
          {children}
          <Toaster position="top-right" richColors />
        </MemberstackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
