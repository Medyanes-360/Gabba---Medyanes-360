'use client';
import React from 'react';
import PrintTest from '@/components/stepbystep/PrintTest';
import {
  useOrderDataContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { useParams } from 'next/navigation';

const Page = () => {
  const { orderData } = useOrderDataContext();

  const { id } = useParams();

  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();
  return (
    <div>
      {orderData && orderData?.orderCode?.length > 0 && (
        <PrintTest
          data={orderData}
          lang={'tr'}
          stepByStepData={stepByStepData}
          setStepByStepData={setStepByStepData}
          id={id}
        />
      )}
    </div>
  );
};

export default Page;
