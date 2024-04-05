'use client';
import React, { useState } from 'react';

const FilterInput = ({ customers, setFilteredMusteriler, setCurrentPage }) => {
  const [filterText, setFilterText] = useState('');

  const handleFilter = (filterText) => {
    setCurrentPage(1);
    const filteredData = customers.filter((musteri) =>
      Object.values(musteri).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(filterText.toLowerCase())
      )
    );
    setFilteredMusteriler(filteredData);
  };

  return (
    <input
      className='w-[250px] border p-3 rounded hover:scale-105 transition-all duration-300'
      type='text'
      placeholder='Tabloyu filtrele...'
      value={filterText}
      onChange={(e) => {
        setFilterText(e.target.value);
        handleFilter(e.target.value);
      }}
    />
  );
};

export default FilterInput;
