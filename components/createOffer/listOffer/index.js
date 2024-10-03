<<<<<<< HEAD
"use client";
import React, { useState } from "react";
import LoadingScreen from "@/components/other/loading";
=======
'use client';
import React, { useState } from 'react';
import LoadingScreen from '@/components/other/loading';
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
const ListOffer = () => {
  const [isloading, setIsloading] = useState(false);
  const [productFeatures, setProductFeatures] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const renderHead = () => {
    const tableHeaders = [
<<<<<<< HEAD
      "sıra",
      "Ürün Kodu",
      "Ürün Adı",
      "Ürün Tipi",
      "Ürün Fiyatı",
      "Ürün Resmi",
      "Ürün Özellikleri",
      "İşlem",
=======
      'sıra',
      'Ürün Kodu',
      'Ürün Adı',
      'Ürün Tipi',
      'Ürün Fiyatı',
      'Ürün Resmi',
      'Ürün Özellikleri',
      'İşlem',
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
    ];

    // koleksiyon modu aktif ise header bölümüne "Seç" ifadesi eklenir.
    //collectionModeEnabled && tableHeaders.unshift('Seç');

    return (
<<<<<<< HEAD
      <tr className="bg-blue-600 text-white">
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope="col"
            className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2"
=======
      <tr className='bg-blue-600 text-white'>
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope='col'
            className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
          >
            {header}
          </th>
        ))}
      </tr>
    );
  };
  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      <table
<<<<<<< HEAD
        className={`${selectedImage && "blur"} ${
          productFeatures && productFeatures.length > 0 && "blur"
        } w-full text-sm text-left text-gray-500 dark:text-gray-400`}
      >
        <thead className="text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white">
          {renderHead()}{" "}
=======
        className={`${selectedImage && 'blur'} ${
          productFeatures && productFeatures.length > 0 && 'blur'
        } w-full text-sm text-left text-gray-500 dark:text-gray-400`}
      >
        <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
          {renderHead()}{' '}
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
        </thead>
      </table>
    </>
  );
};

export default ListOffer;
