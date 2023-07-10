'use client';

import Image from 'next/image';

interface AvatarProps {
   src?: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({src}) => {
   return (
      <img
         className='rounded-full w-8 h-8 object-cover'
         alt='Avatar'
         src={src ? src : '/images/no-user.jpg'}
         referrerPolicy='no-referrer'
      />
   );
};

export default Avatar;
