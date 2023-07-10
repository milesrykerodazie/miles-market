import getAddressById from '@/app/actions/getAddressById';
import EditAddress from '@/app/components/user-profile/EditAddress';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'User-Dashboard | Update-Address',
};

interface AddressParams {
   id: string;
}

const EditMyAddress = async ({params}: {params: AddressParams}) => {
   //getting the specific address
   const address = await getAddressById(params);

   return (
      //@ts-expect-error
      <EditAddress address={address} />
   );
};

export default EditMyAddress;
