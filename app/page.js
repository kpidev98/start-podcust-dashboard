import DashboardComponent from "@/components/DashboardPageCom";
export const metadata = {
  title: "Dashboard",
  description: "Create your projects with Start Podcust",
  robots: {
    index: false,
    follow: false,
  },
};
export default function Home() {
  return (
    <div>
      <DashboardComponent />
    </div>
  );
}
