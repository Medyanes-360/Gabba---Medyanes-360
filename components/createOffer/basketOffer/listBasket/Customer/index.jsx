import React from 'react';
import { IoIosSave } from 'react-icons/io';

const Customer = ({ FormProps, ErrorMessage }) => {
  return (
    <>
      <button
        type='submit'
        className='hover:scale-105 transition-all flex justify-center items-center p-2 text-white font-semibold bg-purple-500 rounded
              '
      >
        Teklifi Oluştur
        <IoIosSave size={22} className='text-white ml-2' />
      </button>

      <div className='w-full lg:w-1/2 lg:grid-cols-2 p-3 my-4 gap-2'>
        <div className='border p-3 mx-4 rounded shadow order-2 md:order-1 flex gap-2 flex-col'>
          <div className='flex gap-3 justify-center'>
            <button
              type='button'
              onClick={() => alert('Güncellenecek')}
              className='bg-gray-800 rounded text-white p-3'
            >
              Kayıtlı Müşterilerden Seç
            </button>
          </div>
          <h1 className='text-center text-lg font-semibold uppercase'>
            Müşteri Kaydı Ekle
          </h1>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].company_name`}
              name={`Customer[0].company_name`}
              value={FormProps.values.Customer[0].company_name}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Firma İsmi'
            />
            <ErrorMessage
              name='Customer[0].company_name'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].name`}
              name={`Customer[0].name`}
              value={FormProps.values.Customer[0].name}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Müşterinin Adı'
            />
            <ErrorMessage
              name='Customer[0].name'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].surname`}
              name={`Customer[0].surname`}
              value={FormProps.values.Customer[0].surname}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Müşterinin Soyadı'
            />
            <ErrorMessage
              name='Customer[0].surname'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].address`}
              name={`Customer[0].address`}
              value={FormProps.values.Customer[0].address}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Müşterinin Adresi'
            />
            <ErrorMessage
              name='Customer[0].address'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].mailAddress`}
              name={`Customer[0].mailAddress`}
              value={FormProps.values.Customer[0].mailAddress}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Müşterinin Mail Adresi'
            />
            <ErrorMessage
              name='Customer[0].mailAddress'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
          <div className='input-group'>
            <input
              onChange={FormProps.handleChange}
              id={`Customer[0].phoneNumber`}
              name={`Customer[0].phoneNumber`}
              value={FormProps.values.Customer[0].phoneNumber}
              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
              type='text'
              placeholder='Müşterinin Telefon Numarası'
            />
            <ErrorMessage
              name='Customer[0].phoneNumber'
              component='div'
              className='field-error text-red-600 m-1'
            />
          </div>
        </div>
      </div>
      <div className='w-1/2'>
        <textarea
          id='orderNote'
          name='orderNote'
          value={FormProps.values.orderNote}
          onChange={FormProps.handleChange}
          className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full mb-4`}
          placeholder='Sepetteki ürünleriniz için genel bir not bölümü ekleyin...'
        ></textarea>
      </div>
    </>
  );
};

export default Customer;
