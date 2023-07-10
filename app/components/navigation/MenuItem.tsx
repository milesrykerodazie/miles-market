import React, {FC} from 'react';

interface MenuItemProps {
   onClick: () => void;
   label: string;
   isOpen?: boolean;
   setIsOpen: (isOpen: boolean) => void;
}

const MenuItem: FC<MenuItemProps> = ({onClick, label, setIsOpen}) => {
   //handle click
   const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      onClick();
      setIsOpen(false);
   };
   return (
      <div
         onClick={handleClick}
         className='px-4 py-3 hover:text-primarywhite hover:bg-primary dark:hover:text-primarywhite text-primary transition duration-300 ease-out font-semibold'
      >
         {label}
      </div>
   );
};

export default MenuItem;
