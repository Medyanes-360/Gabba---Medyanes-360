'use client';
import { getAPI } from '@/services/fetchAPI';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintAnlasmaBelgesi from '@/components/stepbystep/PrintAnlasmaBelgesi';

const Page = () => {
  const id = useSearchParams().get('id');
  const lang = useSearchParams().get('lang');
  const anlasmaKodu = useSearchParams().get('anlasmaKodu');

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
        <PrintAnlasmaBelgesi
          id={id}
          data={orderData}
          lang={lang}
          anlasmaKodu={anlasmaKodu}
        />
      ) : (
        <p>Yükleniyor....</p>
      )}
    </div>
  );
};

export default Page;
