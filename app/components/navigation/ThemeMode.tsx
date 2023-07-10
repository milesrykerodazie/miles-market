'use client';

import React, {useEffect, useState} from 'react';
import {BsFillSunFill, BsMoonFill} from 'react-icons/bs';

const ThemeMode = () => {
   const [theme, setTheme] = useState('light');

   // if local storage is empty save theme as light
   useEffect(() => {
      if (localStorage.getItem('theme-mode') === null) {
         localStorage.setItem('theme-mode', 'light');
      }
   }, []);

   useEffect(() => {
      // select html elem
      const html: HTMLHtmlElement | null = document.querySelector('html');
      if (localStorage.getItem('theme-mode') === 'dark') {
         html?.classList.add('dark');
         setTheme('dark');
      } else {
         html?.classList.remove('dark');
         setTheme('light');
      }
   }, [theme]);

   // handle switch theme
   const handleThemeSwitch = () => {
      if (localStorage.getItem('theme-mode') === 'light') {
         setTheme('dark');
         localStorage.setItem('theme-mode', 'dark');
      } else {
         setTheme('light');
         localStorage.setItem('theme-mode', 'light');
      }
   };
   return (
      <button
         onClick={handleThemeSwitch}
         className='transition duration-500 ease-out'
      >
         {theme === 'light' ? (
            <BsMoonFill className='w-4 h-4 text-primary' />
         ) : (
            <BsFillSunFill className='w-4 h-4 text-primarywhite' />
         )}
      </button>
   );
};

export default ThemeMode;
