'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ListProducts from './listProducts';
import { getAPI } from '@/services/fetchAPI';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';
import { useLoadingContext } from '@/app/(DashboardLayout)/layout';

const Stock = () => {
  const [stores, setStores] = useState([]);
  const [hiddenBasketBar, setHiddenBasketBar] = useState(false);
  const [products, setProducts] = useState([]);
  const [productFeatures, setProductFeatures] = useState([]);
  const [allFeatureValues, setAllFeatureValues] = useState([]);

  // Sepetteki ürünleri tuttuğumuz state.
  const [basketData, setBasketData] = useState([]);
  // Sepetteki ürünlerin stok değerlerini tuttuğumuz state.

  const { isLoading, setIsLoading } = useLoadingContext();

  const getData = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  async function getAllBasketData() {
    const response = getAPI('/createOffer/basket');
    const [dataResult] = await Promise.all([response]);
    setIsLoading(false);
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
      <ListProducts
        getData={getData}
        getAllBasketData={getAllBasketData}
        toast={toast}
        isloading={isLoading}
        setIsloading={setIsLoading}
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
