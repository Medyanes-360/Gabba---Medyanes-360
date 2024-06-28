'use client';
import { getAPI } from '@/services/fetchAPI';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintTeslimTutanagi from '@/components/stepbystep/PrintTeslimTutanagi';

const Page = () => {
  const id = useSearchParams().get('id');
  const lang = useSearchParams().get('lang');
  const teslimKod = useSearchParams().get('teslimKod');

  const [orderData, setOrderData] = useState(null);
  const [stepByStepData, setStepByStepData] = useState([]);

  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    const response2 = await getAPI(`/stepByStep?orderCode=${id}`);

    const responseStepByStepData = response2.data;
    setStepByStepData(responseStepByStepData);

    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setOrderData(filtered);
  };

  useEffect(() => {
    getAllOrderData();
  }, [id, lang]);

  return (
    <div className='h-screen w-full flex'>
      {stepByStepData?.length > 0 && orderData ? (
        <PrintTeslimTutanagi
          data={orderData}
          lang={lang}
          stepByStepData={stepByStepData}
          id={id}
          teslimKod={teslimKod}
        />
      ) : (
        <p>Yükleniyor....</p>
      )}
    </div>
  );
};

export default Page;
