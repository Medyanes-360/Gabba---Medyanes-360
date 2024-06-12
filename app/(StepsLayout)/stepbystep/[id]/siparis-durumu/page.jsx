'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useLoadingContext } from '@/app/(StepsLayout)/layout';

const StepPage = () => {
  const { id } = useParams();
  const [activeButton, setActiveButton] = useState(null);
  const { isLoading, setIsLoading } = useLoadingContext();

  const handleButtonClick = async (buttonIndex, buttonText) => {
    setActiveButton(buttonIndex);
    const response = await postAPI(
      '/createOrder/order',
      {
        orderCode: id,
        ordersStatus: buttonText,
      },
      'PUT'
    );
    toast.success(`${buttonText} seçildi!`);
  };

  async function fetchData() {
    setIsLoading(true);
    const response = await getAPI('/createOrder/order');
    const order = response.data.find((order) => order.orderCode === id);
    if (order) {
      const ordersStatus = order.Orders[0].ordersStatus;
      const index = buttonData.findIndex(
        (button) => button.text === ordersStatus
      );
      if (index !== -1) {
        setActiveButton(index);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const buttonData = [
    { text: 'Onay Bekliyor', bgColor: '#3b82f6', hoverColor: '#2563eb' },
    { text: 'Beklemede', bgColor: '#f97316', hoverColor: '#ea580c' },
    { text: 'İptal Edildi', bgColor: '#dc2626', hoverColor: '#b91c1c' },
    { text: 'Sipariş Tamamlandı', bgColor: '#10b981', hoverColor: '#059669' },
  ];

  const buttonStyle = (bgColor, hoverColor, isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    backgroundColor: bgColor,
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: isActive ? '0 0 0 3px rgba(99, 102, 241, 0.5)' : '',
  });

  const spanStyle = {
    marginRight: '8px',
  };

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <form className='max-w-lg w-full flex flex-col gap-4'>
        {buttonData.map((button, index) => (
          <div
            key={index}
            onClick={() => handleButtonClick(index, button.text)}
            style={buttonStyle(
              button.bgColor,
              button.hoverColor,
              activeButton === index
            )}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = button.hoverColor)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = button.bgColor)
            }
          >
            <span style={spanStyle}>{button.text}</span>
            {activeButton === index && (
              <FaCheckCircle className='text-white ml-2' />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default StepPage;
