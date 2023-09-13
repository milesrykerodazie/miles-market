import { Metadata } from "next";
import getCurrentUser from "../actions/getCurrentUser";
import SideBar from "../components/SideBar";
import MobileSideBar from "../components/sidebar/MobileSidebar";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin-Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "ADMIN") redirect("/");
  return (
    <>
      <section className="py-2 bg-primary dark:bg-white trans rounded-lg">
        <div className=" mx-auto px-4 flex items-center justify-between">
          <h1 className="text-bold lg:text-2xl text-white dark:text-primary trans">
            Admin Dashboard
          </h1>
          <MobileSideBar password={currentUser?.password} />
        </div>
      </section>{" "}
      <section className="pt-3 lg:pt-10 ">
        <div className="w-full lg:max-w-[90%] mx-auto lg:px-4">
          <div className="flex flex-col lg:flex-row">
            <SideBar password={currentUser?.password} />
            <main className="w-full lg:w-[90%] lg:px-4">
              <article className="bg-white md:drop-shadow-md rounded-md mb-5 p-1 lg:p-5 ">
                {children}
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
