"use client";
import { getAPI, postAPI } from "@/services/fetchAPI";
import React, { useState, useEffect } from "react";
import ListBasket from "./listBasket";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";

const BasketOffer = ({
  toast,
  isloading,
  setIsloading,
  productFeatures,
  getData,
  basketData,
  setBasketData,
  setShowOrderOffer,
  setShowBasketOffer,
  setIsCustomerAndPersonel,
  isCustomerAndPersonel,
  setHiddenBasketBar,
  allFeatureValues,
  setAllFeatureValues,
  customers,
}) => {
  const [isSelectedBasket, setIsSelectedBasket] = useState(false);
  const [selectedBasketData, setSelectedBasketData] = useState([]);
  const [selectedBasketFeatures, setSelectedBasketFeatures] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uniqueKeys, setUniqueKeys] = useState(null);
  const [filteredAllFeatureValues, setFilteredAllFeatureValues] = useState([]);
  const [productFeaturePrice, setProductFeaturePrice] = useState(0);

  useEffect(() => {
    if (basketData && basketData.length > 0) {
      setProductFeaturePrice(basketData[0].ProductFeaturePrice);
    }
    getUniqueKey();
  }, [selectedBasketFeatures]);

  function getUniqueKey() {
    const uniqueKeysValues = [
      ...new Set(
        productFeatures.map((item, index) => {
          return item.feature;
        })
      ),
    ];
    const keyToRemove = "Image";
    const indexToRemove = uniqueKeysValues.indexOf(keyToRemove);
    if (indexToRemove !== -1) {
      uniqueKeysValues.splice(indexToRemove, 1);
    }

    setUniqueKeys(uniqueKeysValues);
    filterFeatures(uniqueKeysValues[0]);
  }

  function filterFeatures() {
    if (selectedBasketFeatures) {
      const data = {};
      selectedBasketFeatures.map((item) => {
        uniqueKeys.map((key) => {
          if (key !== "Image") {
            if (!data[key]) {
              data[key] = [];
            }
            if (key !== "Extra") {
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
              if (item.featureId === "ekstra") {
                data[key].push(item);
              }
            }
          }
        });
      });

      setFilteredAllFeatureValues(data);
    }
  }

  const selectedProductTableHeader = (tableHeads) => {
    return tableHeads.map((header, index) => (
      <th
        key={index}
        scope="col"
        className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2"
      >
        {header}
      </th>
    ));
  };

  // Formik verilerine seçilen ek özelliği ekler.
  // Örnek: Renkler kategorisine "A" ürünü ve bu ürünün ek değerini ekle.
  function addOfferedFeatures(selectedItem, category, prop) {
    // Eski verilere doğrudan erişerek güncelleme işlemi yap
    prop.setFieldValue(`selectedOfferFeatures.${category}`, {
      ...prop.values.selectedOfferFeatures[category],
      [selectedItem.id]: selectedItem,
    });

    // Feature değeri yoksa fonksiyondan çık.
    if (!selectedItem.value) {
      return;
    }
    // Feature değerini güncelliyoruz.
    prop.setFieldValue(
      "selectedOfferProductFeaturePrice",
      parseInt(
        prop.values.selectedOfferProductFeaturePrice +
          parseInt(selectedItem.value)
      )
    );
  }

  // Formik verilerine seçilen ek özelliği kaldırır.
  function deleteOfferedFeatures(selectedItem, category, prop) {
    // Önceki kategori verilerinin bir kopyasını al
    const updatedCategoryData = {
      ...prop.values.selectedOfferFeatures[category],
    };

    // Belirli bir öğeyi kategoriden sil
    delete updatedCategoryData[selectedItem.id];

    // Güncellenmiş kategori verilerini setFieldValue ile atama
    prop.setFieldValue(
      `selectedOfferFeatures.${category}`,
      updatedCategoryData
    );

    if (!selectedItem.value) {
      return;
    }

    // Feature değerini güncelliyoruz.
    prop.setFieldValue(
      "selectedOfferProductFeaturePrice",
      parseInt(
        prop.values.selectedOfferProductFeaturePrice -
          parseInt(selectedItem.value)
      )
    );
  }

  return (
    <>
      {selectedBasketData && selectedBasketData.length > 0 && (
        <Formik
          initialValues={{
            selectedOfferFeatures: {
              Renkler: selectedBasketData[0].Renkler.reduce((acc, renk) => {
                // Renkler verisini dönüştürerek, her bir rengin id'sini anahtar olarak kullanıp rengi objeye yerleştirelim
                acc[renk.id] = renk;
                return acc;
              }, {}),
              Kumaşlar: selectedBasketData[0].Kumaşlar.reduce(
                (acc, kumaslar) => {
                  // Renkler verisini dönüştürerek, her bir rengin id'sini anahtar olarak kullanıp rengi objeye yerleştirelim
                  acc[kumaslar.id] = kumaslar;
                  return acc;
                },
                {}
              ),
              Metaller: selectedBasketData[0].Metaller.reduce(
                (acc, metaller) => {
                  // Renkler verisini dönüştürerek, her bir rengin id'sini anahtar olarak kullanıp rengi objeye yerleştirelim
                  acc[metaller.id] = metaller;
                  return acc;
                },
                {}
              ),
              Ölçüler: selectedBasketData[0].Ölçüler.reduce((acc, olculer) => {
                // Renkler verisini dönüştürerek, her bir rengin id'sini anahtar olarak kullanıp rengi objeye yerleştirelim
                acc[olculer.id] = olculer;
                return acc;
              }, {}),
              Extralar: selectedBasketData[0].Extralar.reduce((acc, extra) => {
                // Renkler verisini dönüştürerek, her bir rengin id'sini anahtar olarak kullanıp rengi objeye yerleştirelim
                acc[extra.id] = extra;
                return acc;
              }, {}),
            },
            stock: selectedBasketData[0].Stock,
            basketId: selectedBasketData[0].id,
            orderNote: selectedBasketData[0].OrderNote,
            selectedOfferProduct: selectedBasketData[0].Product.id,
            selectedOfferProductPrice: selectedBasketData[0].ProductPrice,
            selectedOfferProductFeaturePrice:
              selectedBasketData[0].ProductFeaturePrice,
          }}
          onSubmit={async (values, { resetForm }) => {
            setIsloading(true);

            // Stok adedini 0'dan büyük olmasını kontrol ediyoruz.
            if (values.stock <= 0) {
              setIsloading(false);
              return toast.error("Lütfen geçerli bir adet giriniz.");
            }

            // Ürünlerin ek özelliklerinden bir tane seçme zorunluluğu vardır. Bunu kontrol ediyoruz.
            if (
              values.selectedOfferFeatures.Renkler.length === 0 &&
              values.selectedOfferFeatures.Kumaşlar.length === 0 &&
              values.selectedOfferFeatures.Metaller.length === 0 &&
              values.selectedOfferFeatures.Ölçüler.length === 0 &&
              values.selectedOfferFeatures.Extra.length === 0
            ) {
              setIsloading(false);
              return toast.error("Lütfen en az bir özellik seçiniz.");
            }

            // API'ye istek atıyoruz
            const response = await postAPI("/createOffer/basket/", {
              data: values,
              processType: "updateBasket",
            });

            if (response.status == "error") {
              setIsloading(false);
              return toast.error(response.message);
            }

            toast.success(response.message);
            getData("onlyBasket");
            setIsloading(false);
            setHiddenBasketBar(false);
            setIsSelectedBasket(false);
            setSelectedBasketData([]);
          }}
        >
          {(props) => (
            <Form
              onSubmit={props.handleSubmit}
              className="w-full absolute bg-black bg-opacity-90 z-50 min-h-screen"
            >
              <div className="relative w-full h-full flex flex-col justify-center items-center gap-2">
                <div className="relative bg-white w-[1000px] rounded p-4">
                  <div
                    className="absolute -right-4 -top-5 bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all"
                    onClick={() => {
                      setHiddenBasketBar(false);
                      setIsSelectedBasket(false);
                      setSelectedBasketData([]);
                    }}
                  >
                    <IoCloseOutline size={50} color="white" />
                  </div>
                  {/* Ürün Fotoğrafı ve Ürün Bilgileri buradadır. */}
                  <div className="grid grid-cols-2 text-xl pl-6">
                    <div className="flex justify-center flex-col items-start px-6 gap-2 bg-gray-200 rounded border-dashed border-2 border-gray-400 py-2">
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün Kodu: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedBasketData[0].Product.productCode}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün İsmi: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedBasketData[0].Product.productName}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün Tipi: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedBasketData[0].Product.productType}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Liste Fiyatı: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedBasketData[0].ProductPrice}
                        </span>
                      </p>
                      {productFeaturePrice !== 0 && (
                        <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                          <span className="font-semibold">
                            Son Güncel Fiyatı:{" "}
                          </span>
                          <span className="bg-green-600 p-1 rounded text-white">
                            {(props.values.selectedOfferProductPrice +
                              props.values.selectedOfferProductFeaturePrice) *
                              props.values.stock}
                          </span>
                        </p>
                      )}
                    </div>
                    <div>
                      {productFeatures.map(
                        (productFeature, index) =>
                          productFeature.productId ===
                            selectedBasketData[0].Product.id &&
                          productFeature.feature.includes(
                            "Image" || "image"
                          ) && (
                            <div
                              key={index}
                              className=" flex justify-center place-items-center rounded px-4 h-full"
                            >
                              <Image
                                width={600}
                                height={300}
                                src={
                                  productFeature.imageValue
                                    ? productFeature.imageValue
                                    : "/no-image.jpg"
                                }
                                alt={`image${index}`}
                                className="max-h-[250px] w-auto hover:cursor-pointer hover:scale-125 transition-all rounded"
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  {/* Ürün Özel Açıklama, Ürün adedi ve Ürünü ekleme butonu buradadır.  */}
                  <div className="flex gap-4 justify-end m-4 items-center">
                    <textarea
                      name="orderNote"
                      className={`border border-gray-300 rounded-md p-2 m-2 w-full h-[43px]`}
                      placeholder="Ürün için özel açıklama ekleyiniz..."
                      onChange={props.handleChange}
                      value={props.values.orderNote}
                    />
                    <div className="flex items-center">
                      <label className="font-semibold uppercase text-lg mr-2">
                        Adet:
                      </label>
                      <input
                        name="stock"
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[100px] m-2]`}
                        type="number"
                        min={1}
                        value={props.values.stock}
                        onChange={props.handleChange}
                      />
                    </div>
                    <button
                      onClick={() => {
                        getUniqueKey();
                      }}
                      type="submit"
                      className="shadow-md whitespace-nowrap w-fit bg-green-500 hover:bg-green-700 text-white font-bold p-2  rounded-md"
                    >
                      Güncelle
                    </button>
                  </div>
                  {/* Ürün için eklenen özellikler buradadır. */}
                  <div>
                    <h2 className="font-semibold text-2xl mb-6 text-center bg-blue-200 p-2 rounded">
                      Ürün Özellikleri
                    </h2>
                    <div className="flex flex-row gap-2 mt-2">
                      {uniqueKeys.map((key, index) => (
                        <div key={index}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(key);
                              filterFeatures();
                            }}
                            className={`${
                              key == selectedCategory
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            } hover:scale-105 transition-all rounded-md p-2 w-full m-2]`}
                          >
                            {key}
                          </button>
                        </div>
                      ))}
                    </div>
                    <table className="mb-20 mt-10 gap-2 w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white">
                        {selectedCategory == "Renkler" ? (
                          <tr className="bg-blue-600 text-white">
                            {selectedProductTableHeader([
                              "Seç",
                              "Renk",
                              "Renk Ürün Tipi",
                              "Renk Kodu",
                              "Özelliğin Türü",
                              "Değer",
                            ])}
                          </tr>
                        ) : selectedCategory == "Kumaşlar" ? (
                          <tr className="bg-blue-600 text-white">
                            {selectedProductTableHeader([
                              "Seç",
                              "Ürün Türü",
                              "Ürün Tipi",
                              "Ürün Adı",
                              "Resim",
                              "Özelliğin Türü",
                              "Değer",
                            ])}
                          </tr>
                        ) : selectedCategory == "Metaller" ? (
                          <tr className="bg-blue-600 text-white">
                            {selectedProductTableHeader([
                              "Seç",
                              "Metal Türü",
                              "Metal Ürün Tipi",
                              "Resim",
                              "Özelliğin Türü",
                              "Değer",
                            ])}
                          </tr>
                        ) : selectedCategory == "Ölçüler" ? (
                          <tr className="bg-blue-600 text-white">
                            {selectedProductTableHeader([
                              "Seç",
                              "Birinci Değer",
                              "İkinci Değer",
                              "Ölçü Tipi",
                              "Özelliğin Türü",
                              "Değer",
                            ])}
                          </tr>
                        ) : selectedCategory == "Extra" ? (
                          <tr className="bg-blue-600 text-white">
                            {selectedProductTableHeader([
                              "Seç",
                              "Extra",
                              "Özelliğin Türü",
                              "Değer",
                            ])}
                          </tr>
                        ) : null}
                      </thead>
                      <tbody>
                        {filteredAllFeatureValues &&
                        selectedCategory == "Renkler"
                          ? filteredAllFeatureValues["Renkler"].map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    selectedCategory == "Renkler"
                                      ? "table-row border-b"
                                      : "hidden"
                                  } `}
                                >
                                  <td className="text-center py-2 border-r">
                                    <button
                                      onClick={() =>
                                        props.values.selectedOfferFeatures
                                          .Renkler[item.id]
                                          ? deleteOfferedFeatures(
                                              item,
                                              "Renkler",
                                              props
                                            )
                                          : addOfferedFeatures(
                                              item,
                                              "Renkler",
                                              props
                                            )
                                      }
                                      type="button"
                                      className={`${
                                        props.values.selectedOfferFeatures
                                          .Renkler[item.id]
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                    >
                                      <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                        <span className="block">
                                          {props.values.selectedOfferFeatures
                                            .Renkler[item.id]
                                            ? "Özelliği Kaldır"
                                            : "Özelliği Ekle"}
                                        </span>
                                      </div>
                                    </button>
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.colourType}
                                  </td>

                                  <td className="text-center py-2 border-r">
                                    {item.colourDescription}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.colourHex}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.targetValue === "plus"
                                      ? "+ Ücret"
                                      : item.targetValue === "minus"
                                      ? "- Ücret"
                                      : item.targetValue === "standard"
                                      ? "Standart"
                                      : ""}
                                  </td>
                                  <td
                                    className={`text-center py-2 border-r text-white ${
                                      item.targetValue === "plus"
                                        ? "bg-green-500"
                                        : item.targetValue === "minus"
                                        ? "bg-red-500"
                                        : ""
                                    }`}
                                  >
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                        {filteredAllFeatureValues &&
                        selectedCategory == "Kumaşlar"
                          ? filteredAllFeatureValues["Kumaşlar"].map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    selectedCategory == "Kumaşlar"
                                      ? "table-row border-b"
                                      : "hidden"
                                  }`}
                                >
                                  <td className="text-center py-2 border-r">
                                    <button
                                      onClick={() =>
                                        props.values.selectedOfferFeatures
                                          .Kumaşlar[item.id]
                                          ? deleteOfferedFeatures(
                                              item,
                                              "Kumaşlar",
                                              props
                                            )
                                          : addOfferedFeatures(
                                              item,
                                              "Kumaşlar",
                                              props
                                            )
                                      }
                                      type="button"
                                      className={`${
                                        props.values.selectedOfferFeatures
                                          .Kumaşlar[item.id]
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                    >
                                      <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                        <span className="block">
                                          {props.values.selectedOfferFeatures
                                            .Kumaşlar[item.id]
                                            ? "Özelliği Kaldır"
                                            : "Özelliği Ekle"}
                                        </span>
                                      </div>
                                    </button>
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.fabricType}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.fabricDescription}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.fabricSwatch}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.image && (
                                      <div className="text-center flex justify-center item-center">
                                        <Image
                                          src={item.image}
                                          className="hover:scale-150 transition-all rounded shadow"
                                          alt={item.fabricType}
                                          width={100}
                                          height={100}
                                        />
                                      </div>
                                    )}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.targetValue === "plus"
                                      ? "+ Ücret"
                                      : item.targetValue === "minus"
                                      ? "- Ücret"
                                      : item.targetValue === "standard"
                                      ? "Standart"
                                      : ""}
                                  </td>
                                  <td
                                    className={`text-center py-2 border-r text-white ${
                                      item.targetValue === "plus"
                                        ? "bg-green-500"
                                        : item.targetValue === "minus"
                                        ? "bg-red-500"
                                        : ""
                                    }`}
                                  >
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                        {filteredAllFeatureValues &&
                        selectedCategory == "Metaller"
                          ? filteredAllFeatureValues["Metaller"].map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    selectedCategory == "Metaller"
                                      ? "table-row border-b"
                                      : "hidden"
                                  }`}
                                >
                                  <td className="text-center py-2 border-r">
                                    <button
                                      onClick={() =>
                                        props.values.selectedOfferFeatures
                                          .Metaller[item.id]
                                          ? deleteOfferedFeatures(
                                              item,
                                              "Metaller",
                                              props
                                            )
                                          : addOfferedFeatures(
                                              item,
                                              "Metaller",
                                              props
                                            )
                                      }
                                      type="button"
                                      className={`${
                                        props.values.selectedOfferFeatures
                                          .Metaller[item.id]
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                    >
                                      <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                        <span className="block">
                                          {props.values.selectedOfferFeatures
                                            .Metaller[item.id]
                                            ? "Özelliği Kaldır"
                                            : "Özelliği Ekle"}
                                        </span>
                                      </div>
                                    </button>
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.metalType}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.metalDescription}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.image && (
                                      <div className="text-center flex justify-center item-center">
                                        <Image
                                          src={item.image}
                                          className="hover:scale-150 transition-all rounded shadow"
                                          alt={item.metalType}
                                          width={100}
                                          height={100}
                                        />
                                      </div>
                                    )}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.targetValue === "plus"
                                      ? "+ Ücret"
                                      : item.targetValue === "minus"
                                      ? "- Ücret"
                                      : item.targetValue === "standard"
                                      ? "Standart"
                                      : ""}
                                  </td>
                                  <td
                                    className={`text-center py-2 border-r text-white ${
                                      item.targetValue === "plus"
                                        ? "bg-green-500"
                                        : item.targetValue === "minus"
                                        ? "bg-red-500"
                                        : ""
                                    }`}
                                  >
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                        {filteredAllFeatureValues &&
                        selectedCategory == "Ölçüler"
                          ? filteredAllFeatureValues["Ölçüler"].map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    selectedCategory == "Ölçüler"
                                      ? "table-row border-b"
                                      : "hidden"
                                  }`}
                                >
                                  <td className="text-center py-2 border-r">
                                    <button
                                      onClick={() =>
                                        props.values.selectedOfferFeatures
                                          .Ölçüler[item.id]
                                          ? deleteOfferedFeatures(
                                              item,
                                              "Ölçüler",
                                              props
                                            )
                                          : addOfferedFeatures(
                                              item,
                                              "Ölçüler",
                                              props
                                            )
                                      }
                                      type="button"
                                      className={`${
                                        props.values.selectedOfferFeatures
                                          .Ölçüler[item.id]
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                    >
                                      <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                        <span className="block">
                                          {props.values.selectedOfferFeatures
                                            .Ölçüler[item.id]
                                            ? "Özelliği Kaldır"
                                            : "Özelliği Ekle"}
                                        </span>
                                      </div>
                                    </button>
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.firstValue}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.secondValue}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.unit}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.targetValue === "plus"
                                      ? "+ Ücret"
                                      : item.targetValue === "minus"
                                      ? "- Ücret"
                                      : item.targetValue === "standard"
                                      ? "Standart"
                                      : ""}
                                  </td>
                                  <td
                                    className={`text-center py-2 border-r text-white ${
                                      item.targetValue === "plus"
                                        ? "bg-green-500"
                                        : item.targetValue === "minus"
                                        ? "bg-red-500"
                                        : ""
                                    }`}
                                  >
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                        {filteredAllFeatureValues && selectedCategory == "Extra"
                          ? filteredAllFeatureValues["Extra"].map(
                              (item, index) => (
                                <tr
                                  key={index}
                                  className={`${
                                    selectedCategory == "Extra"
                                      ? "table-row border-b"
                                      : "hidden"
                                  }`}
                                >
                                  <td className="text-center py-2 border-r">
                                    <button
                                      onClick={() =>
                                        props.values.selectedOfferFeatures
                                          .Extralar[item.id]
                                          ? deleteOfferedFeatures(
                                              item,
                                              "Extralar",
                                              props
                                            )
                                          : addOfferedFeatures(
                                              item,
                                              "Extralar",
                                              props
                                            )
                                      }
                                      type="button"
                                      className={`${
                                        props.values.selectedOfferFeatures
                                          .Extralar[item.id]
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                    >
                                      <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                        <span className="block">
                                          {props.values.selectedOfferFeatures
                                            .Extralar[item.id]
                                            ? "Özelliği Kaldır"
                                            : "Özelliği Ekle"}
                                        </span>
                                      </div>
                                    </button>
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.extraValue}
                                  </td>
                                  <td className="text-center py-2 border-r">
                                    {item.targetValue === "plus"
                                      ? "+ Ücret"
                                      : item.targetValue === "minus"
                                      ? "- Ücret"
                                      : item.targetValue === "standard"
                                      ? "Standart"
                                      : ""}
                                  </td>
                                  <td
                                    className={`text-center py-2 border-r text-white ${
                                      item.targetValue === "plus"
                                        ? "bg-green-500"
                                        : item.targetValue === "minus"
                                        ? "bg-red-500"
                                        : ""
                                    }`}
                                  >
                                    {item.value}
                                  </td>
                                </tr>
                              )
                            )
                          : null}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p>1</p>
              </div>
            </Form>
          )}
        </Formik>
      )}

      <ListBasket
        toast={toast}
        basketData={basketData}
        setBasketData={setBasketData}
        getData={getData}
        productFeatures={productFeatures}
        isloading={isloading}
        setIsloading={setIsloading}
        setShowOrderOffer={setShowOrderOffer}
        setShowBasketOffer={setShowBasketOffer}
        setIsCustomerAndPersonel={setIsCustomerAndPersonel}
        isCustomerAndPersonel={isCustomerAndPersonel}
        setSelectedBasketData={setSelectedBasketData}
        setIsSelectedBasket={setIsSelectedBasket}
        setHiddenBasketBar={setHiddenBasketBar}
        setSelectedBasketFeatures={setSelectedBasketFeatures}
        customers={customers}
      />
    </>
  );
};

export default BasketOffer;
