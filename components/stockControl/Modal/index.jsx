'use client';
import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import Image from 'next/image';
import { getAPI } from '@/services/fetchAPI';

const Modal = ({
  popup,
  setPopup,
  modalData,
  setModalData,
  productFeatures,
  allFeatureValues,
  setAllFeatureValues,
  selectedFeatures,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [test, setTest] = useState([]);

  const uniqueKeys = ['Renkler', 'Kumaşlar', 'Metaller', 'Ölçüler', 'Extra'];
  console.log(modalData);

  async function getAllFeatureValues() {
    const responseMeasurements = getAPI('/createProduct/measurements');
    const responseColors = getAPI('/createProduct/colors');
    const responseFabrics = getAPI('/createProduct/fabrics');
    const responseMetals = getAPI('/createProduct/metals');

    const [
      dataResultMeasurements,
      dataResultColors,
      dataResultFabrics,
      dateResultMetals,
    ] = await Promise.all([
      responseMeasurements,
      responseColors,
      responseFabrics,
      responseMetals,
    ]);
    const data = [];
    data['Ölçüler'] = dataResultMeasurements.data;
    data['Renkler'] = dataResultColors.data;
    data['Kumaşlar'] = dataResultFabrics.data;
    data['Metaller'] = dateResultMetals.data;

    setAllFeatureValues(data);
  }

  function filterFeatures() {
    if (selectedFeatures) {
      const data = {};
      selectedFeatures.map((item) => {
        uniqueKeys.map((key) => {
          if (key !== 'Image') {
            if (!data[key]) {
              data[key] = [];
            }
            if (key !== 'Extra') {
              // Kontrol etmek istediğiniz koşullar buraya gelir
              if (
                allFeatureValues.hasOwnProperty(key) &&
                Array.isArray(allFeatureValues[key])
              ) {
                allFeatureValues[key].forEach((feature) => {
                  if (feature.id === item.featureId) {
                    feature.targetValue = item.targetValue;
                    feature.value = item.value;
                    data[key].push(feature);
                  }
                });
              }
            } else {
              // 'Extra' durumu için özel işlemler
              if (item.featureId === 'ekstra') {
                data[key].push(item);
              }
            }
          }
        });
      });

      setTest(data);
    }
  }

  useEffect(() => {
    getAllFeatureValues();
  }, []);

  const selectedProductTableHeader = (tableHeads) => {
    return tableHeads.map((header, index) => (
      <th
        key={index}
        scope='col'
        className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'
      >
        {header}
      </th>
    ));
  };

  return (
    <div className={popup ? 'block bg-gray-800 p-2' : 'hidden'}>
      <Formik
        initialValues={{
          selectedOfferFeatures: {
            Renkler: [],
            Kumaşlar: [],
            Metaller: [],
            Ölçüler: [],
            Extra: [],
          },
          stock: modalData.Stock,
          orderNote: '',
          selectedOfferProduct: modalData.id,
          selectedOfferProductPrice: modalData.ProductPrice,
          selectedOfferProductFeaturePrice: modalData.ProductFeaturePrice,
        }}
        onSubmit={async (values, { resetForm }) => {
          console.log(values);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <div className='relative w-full h-full flex flex-col justify-center items-center gap-2'>
              <div className='relative bg-white w-[1000px] rounded p-4'>
                <div
                  className='absolute -right-4 -top-5 bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
                  onClick={() => {
                    setPopup(false);
                    props.resetForm();
                  }}
                >
                  <IoCloseOutline size={35} color='white' />
                </div>
                {/* Ürün Fotoğrafı ve Ürün Bilgileri buradadır. */}
                <div className='grid grid-cols-2 text-xl pl-6'>
                  <div className='flex justify-center flex-col items-start px-6 gap-2 bg-gray-200 rounded border-dashed border-2 border-gray-400 py-2'>
                    <p className='p-2 rounded  border-2 border-dashed border-gray-300 bg-white'>
                      <span className='font-semibold'>Ürün Kodu: </span>
                      <span className='bg-blue-600 p-1 rounded text-white'>
                        {modalData.Product.productCode}
                      </span>
                    </p>
                    <p className='p-2 rounded  border-2 border-dashed border-gray-300 bg-white'>
                      <span className='font-semibold'>Ürün İsmi: </span>
                      <span className='bg-blue-600 p-1 rounded text-white'>
                        {modalData.Product.productName}
                      </span>
                    </p>
                    <p className='p-2 rounded  border-2 border-dashed border-gray-300 bg-white'>
                      <span className='font-semibold'>Ürün Tipi: </span>
                      <span className='bg-blue-600 p-1 rounded text-white'>
                        {modalData.Product.productType}
                      </span>
                    </p>
                    <p className='p-2 rounded  border-2 border-dashed border-gray-300 bg-white'>
                      <span className='font-semibold'>Liste Fiyatı: </span>
                      <span className='bg-blue-600 p-1 rounded text-white'>
                        {modalData.ProductPrice * props.values.stock}
                      </span>
                    </p>

                    {modalData.ProductFeaturePrice !== 0 && (
                      <p className='p-2 rounded  border-2 border-dashed border-gray-300 bg-white'>
                        <span className='font-semibold'>
                          Son Güncel Fiyatı:{' '}
                        </span>
                        <span className='bg-green-600 p-1 rounded text-white'>
                          {(modalData.ProductPrice +
                            modalData.ProductFeaturePrice) *
                            props.values.stock}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    {productFeatures.map(
                      (productFeature, index) =>
                        productFeature.productId === modalData.Product.id &&
                        productFeature.feature.includes('Image' || 'image') && (
                          <div
                            key={index}
                            className=' flex justify-center place-items-center rounded px-4 h-full'
                          >
                            <Image
                              width={600}
                              height={300}
                              src={
                                productFeature.imageValue
                                  ? productFeature.imageValue
                                  : '/no-image.jpg'
                              }
                              alt={`image${index}`}
                              className='max-h-[250px] w-auto hover:cursor-pointer hover:scale-125 transition-all rounded'
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
                {/* Ürün Özel Açıklama, Ürün adedi ve Ürünü ekleme butonu buradadır.  */}
                <div className='flex gap-4 justify-end m-4 items-center'>
                  <textarea
                    name='orderNote'
                    onChange={props.handleChange}
                    className={`border border-gray-300 rounded-md p-2 m-2 w-full h-[43px]`}
                    placeholder='Ürün için özel açıklama ekleyiniz...'
                  />
                  <div className='flex items-center'>
                    <label className='font-semibold uppercase text-lg mr-2'>
                      Adet:
                    </label>
                    <input
                      name='stock'
                      value={props.values.stock}
                      onChange={props.handleChange}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[100px] m-2]`}
                      type='number'
                      min={1}
                    />
                  </div>
                  <button
                    type='submit'
                    className='shadow-md whitespace-nowrap w-fit bg-green-500 hover:bg-green-700 text-white font-bold p-2  rounded-md'
                  >
                    Stok Güncelle
                  </button>
                </div>
                {/* Ürün için eklenen özellikler buradadır. */}
                <div>
                  <h2 className='font-semibold text-2xl mb-6 text-center bg-blue-200 p-2 rounded'>
                    Ürün Özellikleri
                  </h2>
                  <div className='flex flex-row gap-2 mt-2'>
                    {uniqueKeys.map((key, index) => (
                      <div key={index}>
                        <button
                          type='button'
                          onClick={() => {
                            setSelectedCategory(key);
                            filterFeatures();
                          }}
                          className={`${
                            key == selectedCategory
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200'
                          } hover:scale-105 transition-all rounded-md p-2 w-full m-2]`}
                        >
                          {key}
                        </button>
                      </div>
                    ))}
                  </div>
                  <table className='mb-20 mt-10 gap-2 w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                    <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
                      {selectedCategory == 'Renkler' ? (
                        <tr className='bg-blue-600 text-white'>
                          {selectedProductTableHeader([
                            'Seç',
                            'Renk',
                            'Renk Ürün Tipi',
                            'Renk Kodu',
                            'Özelliğin Türü',
                            'Değer',
                          ])}
                        </tr>
                      ) : selectedCategory == 'Kumaşlar' ? (
                        <tr className='bg-blue-600 text-white'>
                          {selectedProductTableHeader([
                            'Seç',
                            'Ürün Türü',
                            'Ürün Tipi',
                            'Ürün Adı',
                            'Resim',
                            'Özelliğin Türü',
                            'Değer',
                          ])}
                        </tr>
                      ) : selectedCategory == 'Metaller' ? (
                        <tr className='bg-blue-600 text-white'>
                          {selectedProductTableHeader([
                            'Seç',
                            'Metal Türü',
                            'Metal Ürün Tipi',
                            'Resim',
                            'Özelliğin Türü',
                            'Değer',
                          ])}
                        </tr>
                      ) : selectedCategory == 'Ölçüler' ? (
                        <tr className='bg-blue-600 text-white'>
                          {selectedProductTableHeader([
                            'Seç',
                            'Birinci Değer',
                            'İkinci Değer',
                            'Ölçü Tipi',
                            'Özelliğin Türü',
                            'Değer',
                          ])}
                        </tr>
                      ) : selectedCategory == 'Extra' ? (
                        <tr className='bg-blue-600 text-white'>
                          {selectedProductTableHeader([
                            'Seç',
                            'Extra',
                            'Özelliğin Türü',
                            'Değer',
                          ])}
                        </tr>
                      ) : null}
                    </thead>
                    <tbody>
                      {test && selectedCategory == 'Renkler'
                        ? test['Renkler'].map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                selectedCategory == 'Renkler'
                                  ? 'table-row border-b'
                                  : 'hidden'
                              } `}
                            >
                              <td className='text-center py-2 border-r'>
                                <button
                                  onClick={() =>
                                    modalData.Renkler.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? deleteOfferedFeatures(
                                          item,
                                          'Renkler',
                                          props
                                        )
                                      : addOfferedFeatures(
                                          item,
                                          'Renkler',
                                          props
                                        )
                                  }
                                  type='button'
                                  className={`${
                                    modalData.Renkler.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                >
                                  <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                                    <span className='block'>
                                      {modalData.Renkler.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? 'Özelliği Kaldır'
                                        : 'Özelliği Ekle'}
                                    </span>
                                  </div>
                                </button>
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.colourType}
                              </td>

                              <td className='text-center py-2 border-r'>
                                {item.colourDescription}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.colourHex}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.targetValue === 'plus'
                                  ? '+ Ücret'
                                  : item.targetValue === 'minus'
                                  ? '- Ücret'
                                  : item.targetValue === 'standard'
                                  ? 'Standart'
                                  : ''}
                              </td>
                              <td
                                className={`text-center py-2 border-r text-white ${
                                  item.targetValue === 'plus'
                                    ? 'bg-green-500'
                                    : item.targetValue === 'minus'
                                    ? 'bg-red-500'
                                    : ''
                                }`}
                              >
                                {item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                      {test && selectedCategory == 'Kumaşlar'
                        ? test['Kumaşlar'].map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                selectedCategory == 'Kumaşlar'
                                  ? 'table-row border-b'
                                  : 'hidden'
                              }`}
                            >
                              <td className='text-center py-2 border-r'>
                                <button
                                  onClick={() =>
                                    modalData.Kumaşlar.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? deleteOfferedFeatures(
                                          item,
                                          'Kumaşlar',
                                          props
                                        )
                                      : addOfferedFeatures(
                                          item,
                                          'Kumaşlar',
                                          props
                                        )
                                  }
                                  type='button'
                                  className={`${
                                    modalData.Kumaşlar.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                >
                                  <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                                    <span className='hidden lg:block'>
                                      {modalData.Kumaşlar.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? 'Özelliği Kaldır'
                                        : 'Özelliği Ekle'}
                                    </span>
                                  </div>
                                </button>
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.fabricType}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.fabricDescription}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.fabricSwatch}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.image && (
                                  <div className='text-center flex justify-center item-center'>
                                    <Image
                                      src={item.image}
                                      className='hover:scale-150 transition-all rounded shadow'
                                      alt={item.fabricType}
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                )}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.targetValue === 'plus'
                                  ? '+ Ücret'
                                  : item.targetValue === 'minus'
                                  ? '- Ücret'
                                  : item.targetValue === 'standard'
                                  ? 'Standart'
                                  : ''}
                              </td>
                              <td
                                className={`text-center py-2 border-r text-white ${
                                  item.targetValue === 'plus'
                                    ? 'bg-green-500'
                                    : item.targetValue === 'minus'
                                    ? 'bg-red-500'
                                    : ''
                                }`}
                              >
                                {item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                      {test && selectedCategory == 'Metaller'
                        ? test['Metaller'].map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                selectedCategory == 'Metaller'
                                  ? 'table-row border-b'
                                  : 'hidden'
                              }`}
                            >
                              <td className='text-center py-2 border-r'>
                                <button
                                  onClick={() =>
                                    modalData.Metaller.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? deleteOfferedFeatures(
                                          item,
                                          'Metaller',
                                          props
                                        )
                                      : addOfferedFeatures(
                                          item,
                                          'Metaller',
                                          props
                                        )
                                  }
                                  type='button'
                                  className={`${
                                    modalData.Metaller.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                >
                                  <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                                    <span className='hidden lg:block'>
                                      {modalData.Metaller.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? 'Özelliği Kaldır'
                                        : 'Özelliği Ekle'}
                                    </span>
                                  </div>
                                </button>
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.metalType}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.metalDescription}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.image && (
                                  <div className='text-center flex justify-center item-center'>
                                    <Image
                                      src={item.image}
                                      className='hover:scale-150 transition-all rounded shadow'
                                      alt={item.metalType}
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                )}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.targetValue === 'plus'
                                  ? '+ Ücret'
                                  : item.targetValue === 'minus'
                                  ? '- Ücret'
                                  : item.targetValue === 'standard'
                                  ? 'Standart'
                                  : ''}
                              </td>
                              <td
                                className={`text-center py-2 border-r text-white ${
                                  item.targetValue === 'plus'
                                    ? 'bg-green-500'
                                    : item.targetValue === 'minus'
                                    ? 'bg-red-500'
                                    : ''
                                }`}
                              >
                                {item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                      {test && selectedCategory == 'Ölçüler'
                        ? test['Ölçüler'].map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                selectedCategory == 'Ölçüler'
                                  ? 'table-row border-b'
                                  : 'hidden'
                              }`}
                            >
                              <td className='text-center py-2 border-r'>
                                <button
                                  onClick={() =>
                                    modalData.Ölçüler.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? deleteOfferedFeatures(
                                          item,
                                          'Ölçüler',
                                          props
                                        )
                                      : addOfferedFeatures(
                                          item,
                                          'Ölçüler',
                                          props
                                        )
                                  }
                                  type='button'
                                  className={`${
                                    modalData.Ölçüler.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                >
                                  <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                                    <span className='hidden lg:block'>
                                      {modalData.Ölçüler.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? 'Özelliği Kaldır'
                                        : 'Özelliği Ekle'}
                                    </span>
                                  </div>
                                </button>
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.firstValue}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.secondValue}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.unit}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.targetValue === 'plus'
                                  ? '+ Ücret'
                                  : item.targetValue === 'minus'
                                  ? '- Ücret'
                                  : item.targetValue === 'standard'
                                  ? 'Standart'
                                  : ''}
                              </td>
                              <td
                                className={`text-center py-2 border-r text-white ${
                                  item.targetValue === 'plus'
                                    ? 'bg-green-500'
                                    : item.targetValue === 'minus'
                                    ? 'bg-red-500'
                                    : ''
                                }`}
                              >
                                {item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                      {test && selectedCategory == 'Extra'
                        ? test['Extra'].map((item, index) => (
                            <tr
                              key={index}
                              className={`${
                                selectedCategory == 'Extra'
                                  ? 'table-row border-b'
                                  : 'hidden'
                              }`}
                            >
                              <td className='text-center py-2 border-r'>
                                <button
                                  onClick={() =>
                                    modalData.Extralar.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? deleteOfferedFeatures(
                                          item,
                                          'Extra',
                                          props
                                        )
                                      : addOfferedFeatures(item, 'Extra', props)
                                  }
                                  type='button'
                                  className={`${
                                    modalData.Extralar.filter(
                                      (feature) => feature.id === item.id
                                    ).length > 0
                                      ? 'bg-red-500'
                                      : 'bg-blue-500'
                                  } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                >
                                  <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                                    <span className='hidden lg:block'>
                                      {modalData.Extralar.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? 'Özelliği Kaldır'
                                        : 'Özelliği Ekle'}
                                    </span>
                                  </div>
                                </button>
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.extraValue}
                              </td>
                              <td className='text-center py-2 border-r'>
                                {item.targetValue === 'plus'
                                  ? '+ Ücret'
                                  : item.targetValue === 'minus'
                                  ? '- Ücret'
                                  : item.targetValue === 'standard'
                                  ? 'Standart'
                                  : ''}
                              </td>
                              <td
                                className={`text-center py-2 border-r text-white ${
                                  item.targetValue === 'plus'
                                    ? 'bg-green-500'
                                    : item.targetValue === 'minus'
                                    ? 'bg-red-500'
                                    : ''
                                }`}
                              >
                                {item.value}
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      ;
    </div>
  );
};

export default Modal;
