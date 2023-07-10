'use client';

import React, {FC} from 'react';

interface HeadingProps {
   title: string;
}

const Heading: FC<HeadingProps> = ({title}) => {
   return (
      <div>
         <h2>{title}</h2>
      </div>
   );
};

export default Heading;
