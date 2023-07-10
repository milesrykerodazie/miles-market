import React, {FC} from 'react';
import {useCallback, useEffect, useState} from 'react';
import {IoMdClose} from 'react-icons/io';
import AuthButton from '../buttons/AuthButton';

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

const Modal: FC<ModalProps> = ({
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
      <>
         <div className='flex items-center justify-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black/50 trans'>
            <div className='relative w-full h-[calc(100%-130px)] md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto ld:h-auto md:h-auto md:pt-0'>
               <div
                  className={`translate duration-300   h-full ${
                     showModal ? 'translate-y-0' : 'translate-y-full'
                  } ${showModal ? 'opacity-100' : 'opacity-0'}
    `}
               >
                  <div className='translate h-full lg:h-auto md:h-auto md:rounded-lg relative flex flex-col w-full bg-primarywhite outline-none'>
                     <div className='flex items-center p-3 md:p-6 rounded-t justify-center relative border-b'>
                        <button
                           className='p-1 border absolute left-9 rounded-full bg-primary text-white'
                           onClick={handleClose}
                        >
                           <IoMdClose className='text-white' />
                        </button>
                        <div className='text-sm md:text-lg font-semibold text-primary '>
                           {title}
                        </div>
                     </div>
                     {/*body*/}
                     <div className='relative p-6 flex-auto'>{body}</div>
                     {/*footer*/}
                     <div className='flex flex-col gap-2 p-6'>
                        <div className='flex flex-row items-center gap-4 w-full'>
                           {secondaryAction && secondaryActionLabel && (
                              <AuthButton
                                 label={secondaryActionLabel}
                                 onClick={handleSecondaryAction}
                              />
                           )}
                           <AuthButton
                              label={actionLabel ? actionLabel : 'Take Action'}
                              onClick={handleSubmit}
                           />
                        </div>
                        {footer}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Modal;
