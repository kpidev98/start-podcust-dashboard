import { Mulish, Roboto, Inter, Open_Sans } from "next/font/google";
export const mulish = Mulish({
  subsets: ["latin"],
});
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});
export const open_sans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
