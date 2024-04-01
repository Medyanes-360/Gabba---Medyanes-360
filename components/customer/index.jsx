'use client';
import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import FilterInput from './FilterInput';

const MusteriTablosu = ({
  currentPage,
  pageSize,
  filteredMusteriler,
  selectedMusteri,
  setSelectedMusteri,
  FormProps,
}) => {
  const handleMusteriSecimi = (customer, FormProps) => {
    // Formik formundan gelen props değerlerini kullanarak müşteri bilgilerini güncelleyin
    FormProps.setFieldValue('customerId', customer.id);
    FormProps.setFieldValue('customerName', customer.name);

    setSelectedMusteri(customer);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentMusteriler = filteredMusteriler.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className='overflow-x-auto w-[600px] lg:w-full'>
      <table className='w-full mt-4 border-collapse'>
        <thead>
          <tr>
            <th className='border p-3 bg-gray-100'>Seçim</th>
            <th className='border p-3 bg-gray-100'>Firma İsmi</th>
            <th className='border p-3 bg-gray-100'>Müşterinin Adı</th>
            <th className='border p-3 bg-gray-100'>Müşterinin Soyadı</th>
            <th className='border p-3 bg-gray-100'>Müşterinin Adresi</th>
            <th className='border p-3 bg-gray-100'>Müşterinin Mail Adresi</th>
            <th className='border p-3 bg-gray-100'>
              Müşterinin Telefon Numarası
            </th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {selectedMusteri && (
            <tr>
              <td className='border p-3 bg-green-600 text-white'></td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.company_name}
              </td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.name}
              </td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.surname}
              </td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.address}
              </td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.mailAddress}
              </td>
              <td className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.phoneNumber}
              </td>
            </tr>
          )}
          {currentMusteriler.map((musteri, index) => (
            <tr key={index}>
              <td className='border p-3'>
                <input
                  className='w-5 h-5 cursor-pointer'
                  name='secim'
                  type='checkbox'
                  checked={
                    selectedMusteri ? selectedMusteri.id === musteri.id : false
                  }
                  onChange={() => handleMusteriSecimi(musteri, FormProps)}
                />
              </td>
              <td className='border p-3'>{musteri.company_name}</td>
              <td className='border p-3'>{musteri.name}</td>
              <td className='border p-3'>{musteri.surname}</td>
              <td className='border p-3'>{musteri.address}</td>
              <td className='border p-3'>{musteri.mailAddress}</td>
              <td className='border p-3'>{musteri.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Customer = ({ setAddCustomerPopup, customers, FormProps }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [filteredMusteriler, setFilteredMusteriler] = useState(customers); // Filtrelenmiş müşteri verilerini saklamak için state
  const pageSize = 5;

  useEffect(() => {
    setFilteredMusteriler(customers);
  }, [customers]);

  return (
    customers &&
    customers.length > 0 && (
      <div className='m-5'>
        <div className='flex flex-col gap-2 md:flex-row md:gap-0 md:justify-between'>
          <FilterInput
            customers={customers}
            setFilteredMusteriler={setFilteredMusteriler}
            setCurrentPage={setCurrentPage}
          />
          <button
            type='button'
            className='bg-purple-500 text-white rounded font-semibold p-3 hover:scale-105 transition-all duration-300'
            onClick={() => setAddCustomerPopup(true)}
          >
            Müşteri Kaydı Ekle
          </button>
        </div>
        <MusteriTablosu
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          filteredMusteriler={filteredMusteriler}
          customers={customers}
          setFilteredMusteriler={setFilteredMusteriler}
          selectedMusteri={selectedMusteri}
          setSelectedMusteri={setSelectedMusteri}
          FormProps={FormProps}
        />
        {/* Sayfalama kontrolleri */}
        <Pagination
          customers={customers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
        />
        <div className='flex justify-between mt-4 gap-6'>
          <textarea
            name='orderNote'
            onChange={FormProps.handleChange}
            className='w-3/4 h-[50px] border p-3 rounded hover:scale-105 transition-all duration-300'
            placeholder='Ürün için genel açıklama notu ekleyin...'
          />
          {selectedMusteri && (
            <button
              onSubmit={FormProps.handleSubmit}
              type='submit'
              className='w-1/4 bg-green-500 rounded text-white font-semibold p-3'
            >
              Sipariş Oluştur
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default Customer;
