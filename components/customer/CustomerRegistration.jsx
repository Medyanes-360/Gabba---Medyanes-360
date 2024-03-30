'use client';
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const CustomerRegistration = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        type='button'
        className='bg-purple-500 text-white rounded font-semibold p-3 hover:scale-105 transition-all duration-300'
        onClick={openPopup}
      >
        Müşteri Kaydı Ekle
      </button>
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/90 flex justify-center items-center z-50'>
          <div className='bg-white relative px-10 py-4 rounded-lg'>
            <button
              type='button'
              onClick={closePopup}
              color='#FFF'
              className='absolute -top-4 -right-4 bg-red-500 border border-red-500 p-2 rounded-lg text-white hover:rotate-6 transition-all duration-300'
            >
              <AiOutlineClose className='cursor-pointer' />
            </button>
            <h2 className='font-semibold text-2xl mb-4'>
              Yeni Müşteri Ekleme Formu
            </h2>
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Firma İsmi'
              />
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Ad'
              />
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Soyad'
              />
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Adres'
              />
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Mail Adresi'
              />
              <input
                type='text'
                className='p-2 rounded border'
                placeholder='Telefon Numarası'
              />
              <button
                type='submit'
                className='p-2 bg-slate-700 text-white font-semibold rounded mt-2'
              >
                Yeni Müşteri Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration;
