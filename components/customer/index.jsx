'use client';
import React, { useState, useEffect } from 'react';
import CustomerRegistration from './CustomerRegistration';
import Pagination from './Pagination';
import FilterInput from './FilterInput';
import { getAPI } from '@/services/fetchAPI';

const MusteriTablosu = ({
  currentPage,
  pageSize,
  filteredMusteriler,
  musteriler,
  selectedMusteri,
  setSelectedMusteri,
}) => {
  const handleMusteriSecimi = (index) => {
    setSelectedMusteri(filteredMusteriler[index]);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentMusteriler = filteredMusteriler.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      {/* Filtreleme componentini kullan */}
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
          {currentMusteriler.map((musteri, index) => (
            <tr key={index}>
              <td className='border p-3'>
                <input
                  type='radio'
                  name='secim'
                  checked={selectedMusteri === musteriler[startIndex + index]}
                  onChange={() => handleMusteriSecimi(startIndex + index)}
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
    </>
  );
};

const Customer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [musteriler, setMusteriler] = useState([]);
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [filteredMusteriler, setFilteredMusteriler] = useState([]); // Filtrelenmiş müşteri verilerini saklamak için state

  const pageSize = 5;

  async function getAllCustomer() {
    const response = await getAPI('/customer');
    setMusteriler(response.data);
    setFilteredMusteriler(response.data);
  }

  useEffect(() => {
    getAllCustomer();
  }, []);

  return (
    musteriler &&
    musteriler.length > 0 && (
      <div className='m-5'>
        <div className='flex justify-between'>
          <FilterInput
            musteriler={musteriler}
            setFilteredMusteriler={setFilteredMusteriler}
          />
          <CustomerRegistration />
        </div>
        <MusteriTablosu
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          filteredMusteriler={filteredMusteriler}
          musteriler={musteriler}
          setFilteredMusteriler={setFilteredMusteriler}
          selectedMusteri={selectedMusteri}
          setSelectedMusteri={setSelectedMusteri}
        />
        {/* Sayfalama kontrolleri */}
        <Pagination
          musteriler={musteriler}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          selectedMusteri={selectedMusteri}
        />
      </div>
    )
  );
};

export default Customer;
