'use client';
import React, { useState } from 'react';

const FilterInput = ({ musteriler, setFilteredMusteriler }) => {
  const [filterText, setFilterText] = useState('');

  const handleFilter = (filterText) => {
    const filteredData = musteriler.filter((musteri) =>
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
