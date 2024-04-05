'use client';
import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import FilterInput from './FilterInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
    <div className='overflow-x-auto w-[600px] lg:w-full rounded border border-border mt-8'>
      <Table className='border-collapse w-full'>
        <TableHeader>
          <TableHead className="border border-border">Seçim</TableHead>
          <TableHead className="border border-border">Firma İsmi</TableHead>
          <TableHead className="border border-border">Müşterinin Adı</TableHead>
          <TableHead className="border border-border">Müşterinin Soyadı</TableHead>
          <TableHead className="border border-border">Müşterinin Adresi</TableHead>
          <TableHead className="border border-border">Müşterinin Mail Adresi</TableHead>
          <TableHead className="border border-border">
            Müşterinin Telefon Numarası
          </TableHead>
        </TableHeader>
        <TableBody className='text-center'>
          {selectedMusteri && (
            <TableRow>
              <TableCell className='border p-3 bg-green-600 text-white'></TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.company_name}
              </TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.name}
              </TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.surname}
              </TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.address}
              </TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.mailAddress}
              </TableCell>
              <TableCell className='border p-3 bg-green-600 text-white font-semibold'>
                {selectedMusteri.phoneNumber}
              </TableCell>
            </TableRow>
          )}
          {currentMusteriler.map((musteri, index) => (
            <TableRow key={index}>
              <TableCell className='border border-border'>
                <Checkbox
                  className="w-5 h-5"
                  checked={selectedMusteri ? selectedMusteri.id === musteri.id : false}
                  onCheckedChange={() => handleMusteriSecimi(musteri, FormProps)}
                />
              </TableCell>
              <TableCell className='border border-border'>{musteri.company_name}</TableCell>
              <TableCell className='border border-border'>{musteri.name}</TableCell>
              <TableCell className='border border-border'>{musteri.surname}</TableCell>
              <TableCell className='border border-border'>{musteri.address}</TableCell>
              <TableCell className='border border-border'>{musteri.mailAddress}</TableCell>
              <TableCell className='border border-border'>{musteri.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
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
          <Button
            type='button'
            className='text-white rounded font-semibold transition-all duration-300'
            onClick={() => setAddCustomerPopup(true)}
          >
            Müşteri Kaydı Ekle
          </Button>
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
          <Textarea
            name='orderNote'
            onChange={FormProps.handleChange}
            className='w-full h-[100px] resize-none border rounded'
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
