"use client";

import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { FC } from "react";
import { MdClose, MdOutlineAdminPanelSettings } from "react-icons/md";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { FaRegistered } from "react-icons/fa";

interface MobileTypes {
  navMobile: boolean;
  setNavMobile: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser?: SafeUser | null;
}

const MobileNav: FC<MobileTypes> = ({
  navMobile,
  setNavMobile,
  currentUser,
}) => {
  //using the modal hooks
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  return (
    <div
      className={`${
        navMobile &&
        "lg:hidden fixed left-0 top-0 w-full h-screen bg-primary/80 z-90 ease-in-out duration-700 transition"
      }`}
      onClick={() => setNavMobile(false)}
    >
      <div
        className={
          navMobile
            ? "fixed top-0 left-0 h-screen bg-main bg-primary shadow-xl shadow-white w-[80%] md:w-[70%] ease-in duration-500 z-90 pt-3 px-3"
            : "fixed -left-[100%] top-0 ease-in duration-300 bg-primary/95 shadow-xl shadow-white w-[80%] md:w-[50%] h-screen z-90 pt-3 px-3"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <div
            onClick={() => setNavMobile((current: any) => !current)}
            className="flex items-center justify-center rounded-full w-7 h-7 bg-white"
          >
            <MdClose className="w-5 h-5 text-primary" />
          </div>
        </div>
        {currentUser && (
          <div className="pb-3 space-y-2 border-b border-white trans">
            <div className="flex items-center space-x-3">
              <img
                src={
                  currentUser?.image
                    ? currentUser?.image
                    : "/images/no-user.jpg"
                }
                alt=""
                className="w-14 h-14 object-cover rounded-full"
              />
              <p className="text-white trans font-[500]">{currentUser?.name}</p>
            </div>
            <p className="text-white tracking-wide">{currentUser?.email}</p>
          </div>
        )}

        <div className="my-2">
          {currentUser && currentUser?.role === "ADMIN" ? (
            <Link
              href="/admin-dashboard"
              className="px-3 py-2 text-center text-white flex items-center space-x-2 trans"
              onClick={() => setNavMobile(false)}
            >
              <MdOutlineAdminPanelSettings />
              <span className=" ml-1">Dashboard</span>
            </Link>
          ) : currentUser?.role === "USER" ? (
            <Link
              href="/user-dashboard"
              className="px-3 py-2 text-center text-white flex items-center space-x-2 trans"
              onClick={() => setNavMobile(false)}
            >
              <MdOutlineAdminPanelSettings />
              <span className=" ml-1">Dashboard</span>
            </Link>
          ) : null}
        </div>
        <div className="cursor-pointer flex flex-col space-y-4">
          {currentUser ? (
            <div
              onClick={() => {
                setNavMobile(false);
                signOut();
              }}
              className="px-3 py-2 text-center text-white flex items-center space-x-2 trans"
            >
              <AiOutlineLogout />
              <span>Logout</span>
            </div>
          ) : (
            <>
              <div
                onClick={loginModal.onOpen}
                className="px-3 py-2 text-center text-white flex items-center space-x-2 trans"
              >
                <AiOutlineLogin />
                <span>Login</span>
              </div>

              <div
                onClick={registerModal.onOpen}
                className="px-3 py-2 text-center text-white flex items-center space-x-2 trans"
              >
                <FaRegistered />
                <span>Register</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
