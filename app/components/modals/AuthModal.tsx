"use client";

import React, { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import AuthButton from "../buttons/AuthButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const AuthModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  //DYNAMIC MODAL
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  //PROTECT SUBMIT
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <button onClick={handleClose} className="absolute top-2 right-4">
        <IoMdClose className="text-white" />
      </button>

      <div
        className={`translate duration-300 project_modal_wrapper  ${
          showModal ? "translate-y-0" : "translate-y-full"
        } ${showModal ? "opacity-100" : "opacity-0"}`}
      >
        <div className="text-sm md:text-lg font-semibold text-primary ">
          {title}
        </div>
        {/*body*/}
        <div className="relative py-4 flex-auto">{body}</div>
        {/*footer*/}
        <div className="flex flex-col gap-2 py-4">
          <div className="flex flex-row items-center gap-4 w-full">
            {secondaryAction && secondaryActionLabel && (
              <AuthButton
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
              />
            )}
            <AuthButton
              label={actionLabel ? actionLabel : "Take Action"}
              onClick={handleSubmit}
              disabled={disabled}
            />
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
