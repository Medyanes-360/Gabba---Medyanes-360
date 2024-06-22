'use client';
import React from 'react';
import PrintTest from '@/components/stepbystep/PrintTest';
import { useOrderDataContext } from '@/app/(StepsLayout)/layout';

const Page = () => {
  const { orderData } = useOrderDataContext();
  console.log('orderData: ', orderData);
  return (
    <div>
      {orderData && orderData?.orderCode?.length > 0 && (
        <PrintTest data={orderData} lang={'tr'} />
      )}
    </div>
  );
};

export default Page;
