'use client';
import { getAPI, postAPI } from '@/services/fetchAPI';
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

  const todayDate = async () => {
    const today = new Date();

    // Günü, ayı ve yılı al
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 eklenir
    const year = today.getFullYear();

    // İstenen formatta tarihi oluştur
    const formattedDate = `${day}.${month}.${year}`;

    const response = await postAPI('/fatura-belgesi', {
      date: formattedDate,
      faturaNo: id,
    });
  };

  useEffect(() => {
    getAllOrderData();
    todayDate();
  }, [id, lang]);
  return (
    <div className='h-screen w-full flex'>
      {orderData && <PrintFaturaBelgesi id={id} data={orderData} lang={lang} />}
    </div>
  );
};

export default Page;
