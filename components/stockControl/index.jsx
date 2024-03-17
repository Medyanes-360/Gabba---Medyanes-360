'use client';
import React, { useState, useEffect } from 'react';
import StockControlCard from './Card';
import Modal from './Modal';
import { getAPI } from '@/services/fetchAPI';
import { useLoadingContext } from '@/app/(DashboardLayout)/layout';

const StockControl = () => {
  const { isLoading, setIsLoading } = useLoadingContext();
  const [stocks, setStocks] = useState([]);
  const [stores, setStores] = useState([]);
  const [productFeatures, setProductFeatures] = useState([]);
  const [popup, setPopup] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState(null);

  const [allFeatureValues, setAllFeatureValues] = useState([]);

  async function getStockData() {
    setIsLoading(true);

    const response1 = getAPI('/createProduct/createProduct');
    const response2 = getAPI('/stock');
    const response3 = getAPI('/store');

    const [responseProductFeatures, responseStocks, responseStore] =
      await Promise.all([response1, response2, response3]);
    setProductFeatures(responseProductFeatures.data.productFeatures);
    setStocks(responseStocks.data);
    setStores(responseStore.data);
    setIsLoading(false);
  }
  useEffect(() => {
    getStockData();
  }, []);

  return (
    <>
      {popup && (
        <Modal
          popup={popup}
          setPopup={setPopup}
          modalData={modalData}
          setModalData={setModalData}
          productFeatures={productFeatures}
          allFeatureValues={allFeatureValues}
          setAllFeatureValues={setAllFeatureValues}
          selectedFeatures={selectedFeatures}
          stores={stores}
        />
      )}

      <StockControlCard
        stocks={stocks}
        setStocks={setStocks}
        popup={popup}
        setPopup={setPopup}
        productFeatures={productFeatures}
        setModalData={setModalData}
        setSelectedFeatures={setSelectedFeatures}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
};

export default StockControl;
