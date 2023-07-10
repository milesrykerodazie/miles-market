'use client';
import React, {FC} from 'react';

interface InputProps {
   id: string;
   label: string;
   type?: string;
   required: boolean;
   disabled: boolean;
   value: string;
   placeholder?: string;
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
   id,
   label,
   type,
   required,
   disabled,
   value,
   placeholder,
   onChange,
}) => {
   return (
      <div className='w-full relative'>
         <input
            type={type}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            id={id}
            className='peer w-full px-4 py-2 pt-6 font-light bg-primarywhite border rounded-md outline-none transition-all trans text-primary disabled:opacity-70 disabled:cursor-not-allowed border-primary text-sm md:text-base'
         />
         <label className='absolute text-sm md:text-base duration-300 transform pb-2 -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-primary'>
            {label}
         </label>
      </div>
   );
};

export default Input;
