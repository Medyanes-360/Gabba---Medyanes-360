'use client';
import React from 'react';
import PrintTest from '@/components/stepbystep/PrintTest';
import {
  useOrderDataContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';

const Page = () => {
  const { orderData } = useOrderDataContext();
  const { stepByStepData } = useStepByStepDataContext();
  console.log('orderData: ', orderData);
  return (
    <div>
      {orderData && orderData?.orderCode?.length > 0 && (
        <PrintTest
          data={orderData}
          lang={'tr'}
          stepByStepData={stepByStepData}
        />
      )}
    </div>
  );
};

export default Page;
