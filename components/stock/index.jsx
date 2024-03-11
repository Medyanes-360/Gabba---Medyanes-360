'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import LoadingScreen from '@/components/other/loading';
import ListProducts from './listProducts';
import { getAPI } from '@/services/fetchAPI';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';
import { BiFilterAlt } from 'react-icons/bi';
import { FaFileInvoice } from 'react-icons/fa';

const Stock = () => {
  const [stores, setStores] = useState([]);
  const [showOrderOffer, setShowOrderOffer] = useState(false);
  const [hiddenBasketBar, setHiddenBasketBar] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productFeatures, setProductFeatures] = useState([]);
  const [showBasketOffer, setShowBasketOffer] = useState(false);
  const [allFeatureValues, setAllFeatureValues] = useState([]);

  // Sepetteki ürünleri tuttuğumuz state.
  const [basketData, setBasketData] = useState([]);
  // Sepetteki ürünlerin stok değerlerini tuttuğumuz state.
  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/createProduct');
      if (!response) {
        throw new Error('Veri çekilemedi 2');
      }

      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }

      // response.data.createProducts içerisindeki değerleri gez ve "productName" değerlerine göre küçükten büyüğe doğru sırala.
      await response.data.createProducts.sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      await Promise.all(
        await response.data.createProducts.map(async (item) => {
          const { result } = await FinancialManagementCalculate(
            item.productPrice
          );
          item.productPrice = result[result.length - 1];
        })
      );
      setProducts(response.data.createProducts);
      setProductFeatures(response.data.productFeatures);
      setIsloading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  async function getAllBasketData() {
    const response = getAPI('/createOffer/basket');
    const [dataResult] = await Promise.all([response]);
    setIsloading(false);
    setBasketData(dataResult.data);
  }

  async function getStoreData() {
    const response = getAPI('/store');
    const [dataResult] = await Promise.all([response]);
    setStores(dataResult.data);
  }

  useEffect(() => {
    getData();
    getAllBasketData();
    getStoreData();
  }, []);

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <div
        className={`${
          hiddenBasketBar ? 'hidden' : 'flex'
        } flex-col md:flex-row p-2 lg:p-2 lg:px-10 w-full justify-between mb-4 items-center shadow-lg bg-background gap-2 pr-4`}
      >
        {/* Filtreleme ve Teklifler Butonu */}
        <div className='flex justify-center item-center flex-col md:flex-row gap-2 px-4 my-2'>
          <button className='bg-green-500 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'>
            <BiFilterAlt size={25} />
            Filtrele
          </button>
          <button
            onClick={() => {
              setShowOrderOffer(true);
              setShowBasketOffer(false);
            }}
            className='bg-purple-600 p-4 text-white rounded lg:text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'
          >
            <FaFileInvoice size={25} />
            Stoklar
          </button>
        </div>
      </div>

      <ListProducts
        getData={getData}
        getAllBasketData={getAllBasketData}
        toast={toast}
        isloading={isloading}
        setIsloading={setIsloading}
        products={products}
        productFeatures={productFeatures}
        setHiddenBasketBar={setHiddenBasketBar}
        setAllFeatureValues={setAllFeatureValues}
        allFeatureValues={allFeatureValues}
        stores={stores}
      />
    </>
  );
};

export default Stock;
