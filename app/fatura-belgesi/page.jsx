'use client';
import { getAPI } from '@/services/fetchAPI';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintFaturaBelgesi from '@/components/stepbystep/PrintFaturaBelgesi';

const Page = () => {
  const id = useSearchParams().get('id');
  const lang = useSearchParams().get('lang');

  const [orderData, setOrderData] = useState(null);

  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setOrderData(filtered);
  };

  useEffect(() => {
    getAllOrderData();
  }, [id, lang]);
  return (
    <div className='h-screen w-full flex'>
      {orderData && <PrintFaturaBelgesi data={orderData} lang={lang} />}
    </div>
  );
};

export default Page;
