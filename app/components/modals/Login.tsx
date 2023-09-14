"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import Input from "../inputs/Input";
import AuthButton from "../buttons/AuthButton";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import AuthModal from "./AuthModal";

const Login = () => {
  //the router to navigate
  const router = useRouter();

  //the modals
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  //the loading state
  const [isLoading, setIsLoading] = useState(false);

  //login credentials data initital states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // navigating between the login and register modal
  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  //handle login method

  const handleLogin = () => {
    setIsLoading(true);

    signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })
      .then((response) => {
        if (response?.error === null) {
          toast.success("You are logged in.");
          router.refresh();
          loginModal.onClose();
        }
        if (response?.error !== null) {
          toast.error(response?.error!);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setEmail("");
        setPassword("");
      });
  };

  //login body
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email"
        value={email}
        type="text"
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={isLoading}
      />

      <Input
        id="password"
        label="Password"
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        required
        disabled={isLoading}
      />
      <div className="text-[13px] text-primary flex items-center flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0">
        <span>test-email: test@gmail.com</span>
        <span>test-password: 1234567</span>
      </div>
    </div>
  );

  //login footer
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <AuthButton
        label="Login With Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <div className="text-primary text-center mt-4 font-light">
        <p>
          Are you a new user?
          <span
            onClick={onToggle}
            className="text-primary cursor-pointer hover:underline font-semibold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <AuthModal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Market Login"
      actionLabel="Login"
      onClose={loginModal.onClose}
      onSubmit={handleLogin}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default Login;
