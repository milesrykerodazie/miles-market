"use client";

import React, { FC } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconType;
  disabled?: boolean;
}

const AuthButton: FC<ButtonProps> = ({
  label,
  onClick,
  icon: Icon,
  disabled,
}) => {
  return (
    <button
      className="relative disabled:opacity-70 disabled:cursor-not-allowed font-semibold rounded-lg hover:opacity-80 w-full bg-primary trans text-primarywhite py-3"
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={20} className=" absolute left-4 top-3 text-black" />}{" "}
      {label}
    </button>
  );
};

export default AuthButton;
