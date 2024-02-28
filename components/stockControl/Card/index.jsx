'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { GoTrash } from 'react-icons/go';
import { LiaEdit } from 'react-icons/lia';
import { postAPI } from '@/services/fetchAPI';
import { BiCalendarCheck } from 'react-icons/bi';

const StockControlCard = ({
  stocks,
  popup,
  setPopup,
  productFeatures,
  setModalData,
  setSelectedFeatures,
}) => {
  console.log(stocks);

  return (
    <div className={popup ? 'hidden' : 'block'}>
      <p>Stoktaki Ürün Adedi: {stocks.length}</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 p-4'>
        {stocks.map((stock) => (
          <div
            className='shadow bg-white rounded flex flex-col gap-3'
            key={stock.id}
          >
            {/* Stock ürün resmi */}
            {productFeatures.map(
              (productFeature, index) =>
                productFeature.productId === stock.Product.id &&
                productFeature.feature.includes('Image' || 'image') && (
                  <Image
                    key={index}
                    width={600}
                    height={300}
                    src={
                      productFeature.imageValue
                        ? productFeature.imageValue
                        : '/no-image.jpg'
                    }
                    alt={`image${index}`}
                    className='max-h-[150px] w-full h-full rounded object-contain	bg-gray-100 hover:scale-110 transition-all'
                  />
                )
            )}
            {/* Stock ürün adı, ürünü kaldır, ürünü düzenle */}

            <div className='flex items-center mx-2 gap-3 justify-between'>
              <p className='text-center font-semibold uppercase break-all '>
                {stock.Product.productName}
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setPopup(true);
                    setModalData(stock);
                    setSelectedFeatures(
                      productFeatures.filter(
                        (productFeature) =>
                          productFeature.productId === stock.Product.id
                      )
                    );
                  }}
                  title='Düzenle'
                  type='button'
                  className='font-semibold text-white border border-green-500 rounded-full p-1 bg-green-500
          hover:bg-green-800 transition duration-300 ease-in-out hover:border-green-800'
                >
                  <LiaEdit size={20} />
                </button>
                <button
                  title='Sil'
                  type='button'
                  className='font-semibold text-white border border-red-500 rounded-full p-1 bg-red-500
          hover:bg-red-800 transition duration-300 ease-in-out hover:border-red-800'
                >
                  <GoTrash size={18} />
                </button>
              </div>
            </div>
            {/* Stock ürün fiyatı, stok adedi */}
            <div className='flex gap-2 items-center justify-between px-2'>
              <div className='flex gap-2  items-center'>
                <button
                  type='button'
                  className='w-8 h-8 bg-blue-500 rounded-full text-white'
                >
                  +
                </button>

                <p>{stock.Stock}</p>
                <button
                  type='button'
                  className='w-8 h-8 bg-blue-500 rounded-full text-white'
                >
                  -
                </button>
              </div>
              <p className='mr-4 font-semibold text-red-600'>
                Fiyat:{' '}
                {(stock.ProductPrice + stock.ProductFeaturePrice) * stock.Stock}
              </p>
            </div>
            {/* Mağaza İsmi, Eklenme Tarihi */}
            <div className='flex flex-col'>
              <p className='mr-4 font-semibold px-2'>Mağaza İsmi: </p>
              <div className='flex items-center gap-1 justify-center bg-gray-100 w-full p-1'>
                <BiCalendarCheck size={20} className='text-muted-foreground' />
                <p className='font-semibold text-muted-foreground'>
                  {formatDate(stock.CreatedDate)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockControlCard;

function formatDate(dateString) {
  var dateObject = new Date(dateString);
  var day = dateObject.getDate();
  var month = dateObject.getMonth() + 1; // JavaScript'te aylar 0'dan başlar, bu yüzden 1 ekliyoruz
  var year = dateObject.getFullYear();

  // Tarih bilgisini istenen formata çevir
  var formattedDate =
    (day < 10 ? '0' : '') +
    day +
    '.' +
    (month < 10 ? '0' : '') +
    month +
    '.' +
    year;

  return formattedDate;
}
