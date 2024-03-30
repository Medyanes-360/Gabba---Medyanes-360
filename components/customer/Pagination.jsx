import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const Pagination = ({
  currentPage,
  musteriler,
  pageSize,
  setCurrentPage,
  selectedMusteri,
}) => {
  // Dropdown'dan sayfa seçildiğinde çağrılacak fonksiyon
  const handleDropdownChange = (e) => {
    setCurrentPage(parseInt(e.target.value));
  };
  // Toplam sayfa sayısını hesapla
  const totalPageCount = Math.ceil(musteriler.length / pageSize);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, i) => i + 1);
  // Sayfa seçenekleri oluştur
  const pageOptions = pageNumbers.map((page) => (
    <option key={page} value={page}>
      {page}
    </option>
  ));
  return (
    <div className='mt-5 flex justify-between'>
      <div className='flex justify-start items-center gap-4'>
        <div className='relative inline-block rounded bg-gray-100'>
          <select
            className='appearance-none border-none bg-transparent rounded w-16 h-16 text-left p-2'
            onChange={handleDropdownChange}
            value={currentPage}
          >
            {pageOptions}
          </select>
          <div className='absolute top-1/2 right-0 mr-3 pointer-events-none -translate-y-1/2'>
            <IoIosArrowDown className='text-2xl' />
          </div>
        </div>
        <span>
          Sayfa: {currentPage} / {totalPageCount}
        </span>
      </div>
      {selectedMusteri && (
        <button
          type='button'
          className='bg-green-500 rounded text-white font-semibold p-3'
        >
          Sipariş Oluştur
        </button>
      )}
    </div>
  );
};

export default Pagination;
