"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAPI, postAPI } from "@/services/fetchAPI";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseOutline } from "react-icons/io5";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";

function ListProducts({
  toast,
  isloading,
  setIsloading,
  search,
  getData,
  products,
  productFeatures,
  setHiddenBasketBar,
  setAllFeatureValues,
  allFeatureValues,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productFeaturePrice, setProductFeaturePrice] = useState(0);
  const [uniqueKeys, setUniqueKeys] = useState(null);

  const [test, setTest] = useState([]);

  const [collections, setCollections] = useState([]);
  const [mergedProducts, setMergedProducts] = useState([]);
  const [collectionFilter, setCollectionFilter] = useState("");

  useEffect(() => {
    getAllFeatureValues();
    getCollections();
    if (!products || products.length === 0) {
      getProducts();
    }
  }, []);

  useEffect(() => {
    if (products && products.length > 0 && collections) {
      const merged = mergeProductsWithCollections(products, collections);
      setMergedProducts(merged);
      console.log("Merged Products:", merged);
    }
  }, [products, collections]);

  useEffect(() => {
    if (
      selectedProduct &&
      selectedProduct.selectedCategoryKey !== selectedCategory &&
      selectedCategory
    ) {
      setAllFeatureData([]);
    }
  }, [selectedCategory, selectedProduct]);

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

  const getProducts = async () => {
    try {
      setIsloading(true);
      const response = await getAPI("/createProduct/createProduct");
      if (
        response.status === "success" &&
        response.data &&
        response.data.createProducts
      ) {
        console.log("Products fetched:", response.data.createProducts);
        getData(response.data); // Assuming getData is a function to update the products in the parent component
      } else {
        toast.error("Ürünler getirilemedi");
      }
      setIsloading(false);
    } catch (error) {
      console.error("Ürünler getirilirken hata oluştu:", error);
      toast.error("Ürünler getirilemedi");
      setIsloading(false);
    }
  };

  async function getAllFeatureValues() {
    const responseMeasurements = getAPI("/createProduct/measurements");
    const responseColors = getAPI("/createProduct/colors");
    const responseFabrics = getAPI("/createProduct/fabrics");
    const responseMetals = getAPI("/createProduct/metals");

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
    data["Ölçüler"] = dataResultMeasurements.data;
    data["Renkler"] = dataResultColors.data;
    data["Kumaşlar"] = dataResultFabrics.data;
    data["Metaller"] = dateResultMetals.data;

    setAllFeatureValues(data);
  }

  function filterFeatures() {
    if (selectedFeatures) {
      const data = {};
      selectedFeatures.map((item) => {
        uniqueKeys.map((key) => {
          if (key !== "Image") {
            if (!data[key]) {
              data[key] = [];
            }
            if (key !== "Extra") {
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
              if (item.featureId === "ekstra") {
                data[key].push(item);
              }
            }
          }
        });
      });

      setTest(data);
    }
  }

  const getCollections = async () => {
    try {
      setIsloading(true);
      const response = await getAPI(
        "/createProduct/createProduct/createCollection"
      );
      if (response.status === "success") {
        setCollections(response.data);
        console.log("Collections:", response.data);
      } else {
        toast.error("Koleksiyonlar getirilemedi");
      }
      setIsloading(false);
    } catch (error) {
      console.error("Koleksiyonlar getirilirken hata oluştu:", error);
      toast.error("Koleksiyonlar getirilemedi");
      setIsloading(false);
    }
  };

  const mergeProductsWithCollections = (products, collections) => {
    console.log("Merging Products:", products);
    console.log("With Collections:", collections);

    if (!collections || !collections.collectionProductsData) {
      console.error("Collections data is missing or invalid");
      return products;
    }

    const collectionProductsMap = new Map();
    collections.collectionProductsData.forEach((cp) => {
      collectionProductsMap.set(cp.productId, cp.collectionId);
    });

    return products.map((product) => {
      const collectionId = collectionProductsMap.get(product.id);
      const collection = collections.collectionsData.find(
        (c) => c.id === collectionId
      );
      return {
        ...product,
        collectionName: collection ? collection.collectionName : "",
        collectionType: collection ? collection.collectionType : "",
      };
    });
  };

  const handleCollectionFilterChange = (e) => {
    setCollectionFilter(e.target.value);
  };

  const addOfferedFeatures = (item, category, props) => {
    if (props.values.selectedOfferFeatures[category]) {
      const id = item.id;
      const categoryArray = props.values.selectedOfferFeatures[category];

      const isDuplicate = categoryArray.some(function (item) {
        return item.id === id;
      });

      if (item.targetValue === "plus" || item.targetValue === "minus") {
        setProductFeaturePrice(
          parseInt(productFeaturePrice) + parseInt(item.value)
        );
      }

      if (!isDuplicate) {
        categoryArray.push({
          id: item.id,
        });
        props.setFieldValue("selectedOfferFeatures", {
          ...props.values.selectedOfferFeatures,
          [category]: categoryArray,
        });
      }
    }
  };

  const deleteOfferedFeatures = (item, category, props) => {
    const id = item.id;
    item.targetValue === "plus" || item.targetValue === "minus"
      ? setProductFeaturePrice(
          parseInt(productFeaturePrice) - parseInt(item.value)
        )
      : null;
    if (props.values.selectedOfferFeatures[category]) {
      const deletedOfferFeatures = props.values.selectedOfferFeatures[
        category
      ].filter((item) => item.id !== id);
      props.setFieldValue("selectedOfferFeatures", {
        ...props.values.selectedOfferFeatures,
        [category]: deletedOfferFeatures,
      });
    }
  };

  const { data } = useSession();

  const renderHead = () => {
    const tableHeaders = [
      "sıra",
      "Ürün Kodu",
      "Ürün Adı",
      "Ürün Tipi",
      "Ürün Fiyatı",
      "Koleksiyon Adı",
      "Koleksiyon Tipi",
      "Ürün Resmi",
      "İşlem",
    ];
    return (
      <tr className="bg-blue-600 text-white">
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope="col"
            className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2"
          >
            {header}
          </th>
        ))}
      </tr>
    );
  };

  const renderData = () => {
    console.log("Rendering data. Merged Products:", mergedProducts); // Debugging
    console.log("Search:", search); // Debugging
    console.log("Collection Filter:", collectionFilter); // Debugging

    return (
      mergedProducts &&
      mergedProducts.length > 0 &&
      mergedProducts
        .filter((prdt) =>
          (prdt.productName || "")
            .toLowerCase()
            .includes((search || "").toLowerCase())
        )
        .filter((prdt) => {
          const collectionNameMatch = (prdt.collectionName || "")
            .toLowerCase()
            .includes((collectionFilter || "").toLowerCase());
          const collectionTypeMatch = (prdt.collectionType || "")
            .toLowerCase()
            .includes((collectionFilter || "").toLowerCase());
          return (
            collectionFilter === "" ||
            collectionNameMatch ||
            collectionTypeMatch
          );
        })
        .map((product, index) => (
          <tr key={product.id} className="border-b">
            <td className="border-r">
              <div className="flex justify-center items-center h-full mt-2 w-full text-center py-2">
                <div className="bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center">
                  {index + 1}
                </div>
              </div>
            </td>
            <td className="text-center py-2 border-r">{product.productCode}</td>
            <td className="text-center py-2 border-r">{product.productName}</td>
            <td className="text-center py-2 border-r">{product.productType}</td>
            <td className="text-center py-2 border-r">
              {product.productPrice}
            </td>
            <td className="text-center py-2 border-r">
              {product.collectionName}
            </td>
            <td className="text-center py-2 border-r">
              {product.collectionType}
            </td>
            <td className="text-center py-2 border-r">
              <div className="w-full flex justify-center item-center flex-wrap">
                {productFeatures.map(
                  (productFeature, index) =>
                    productFeature.productId === product.id &&
                    productFeature.feature.includes("Image" || "image") && (
                      <div key={index} className="lg:p-2 p-0 m-1 lg:m-2">
                        <Image
                          width={100}
                          height={100}
                          src={
                            productFeature.imageValue
                              ? productFeature.imageValue
                              : "/no-image.jpg"
                          }
                          alt={`image${index}`}
                          onClick={() =>
                            setSelectedImage(productFeature.imageValue)
                          }
                          className="hover:cursor-pointer hover:scale-125 transition-all"
                        />
                      </div>
                    )
                )}
              </div>
            </td>
            <td className="text-center py-2 border-r">
              <div className="flex center justify-center items-center gap-4 p-2">
                <button
                  type="button"
                  onClick={async () => {
                    setHiddenBasketBar(true);
                    setSelectedProduct(product);
                    setSelectedFeatures(
                      productFeatures.filter(
                        (productFeature) =>
                          productFeature.productId === product.id
                      )
                    );
                  }}
                  className="shadow-md bg-green-500 hover:bg-green-700 text-white font-bold p-2 rounded-md min-w-[50px] whitespace-nowrap"
                >
                  Teklife Ekle
                </button>
              </div>
            </td>
          </tr>
        ))
    );
  };

  return (
    <>
      {selectedImage && (
        <div className="absolute w-full h-full z-20 bg-black bg-opacity-80">
          <div className="relative w-full h-full flex flex-col justify-center items-center gap-2">
            <div
              className="bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <IoCloseOutline size={50} color="white" />
            </div>

            <Image width={750} height={750} src={selectedImage} alt={`image`} />
          </div>
        </div>
      )}
      {selectedProduct && (
        <Formik
          initialValues={{
            selectedOfferFeatures: {
              Renkler: [],
              Kumaşlar: [],
              Metaller: [],
              Ölçüler: [],
              Extra: [],
            },
            stock: 1,
            orderNote: "",
            selectedOfferProduct: selectedProduct.id,
            selectedOfferProductPrice: selectedProduct.productPrice,
            selectedOfferProductFeaturePrice: productFeaturePrice,
          }}
          onSubmit={async (values, { resetForm }) => {
            setIsloading(true);
            setSelectedProduct(null);
            setSelectedFeatures(null);
            setSelectedCategory(null);
            setHiddenBasketBar(false);
            if (values.stock <= 0) {
              setIsloading(false);
              return toast.error("Lütfen geçerli bir adet giriniz.");
            }

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
            values.selectedOfferProductFeaturePrice = productFeaturePrice;

            const response = await postAPI("/createOffer/basket", {
              data: values,
              userId: data?.user?.id,
            });

            if (response.status !== "success" || response.status == "error") {
              setIsloading(false);
              return toast.error(response.error);
            } else {
              setProductFeaturePrice(0);
              setIsloading(false);
              setHiddenBasketBar(false);
              toast.success("Tüm Veriler Başarıyla Eklendi!");
              setSelectedProduct(null);
              setSelectedFeatures(null);
              setSelectedCategory(null);
              getData("onlyBasket");
            }
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
                      setSelectedProduct(null);
                      setSelectedFeatures(null);
                      setSelectedCategory(null);
                      setHiddenBasketBar(false);
                      setProductFeaturePrice(0);
                      props.resetForm();
                    }}
                  >
                    <IoCloseOutline size={35} color="white" />
                  </div>
                  <div className="grid grid-cols-2 text-xl pl-6">
                    <div className="flex justify-center flex-col items-start px-6 gap-2 bg-gray-200 rounded border-dashed border-2 border-gray-400 py-2">
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün Kodu: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedProduct.productCode}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün İsmi: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedProduct.productName}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Ürün Tipi: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedProduct.productType}
                        </span>
                      </p>
                      <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                        <span className="font-semibold">Liste Fiyatı: </span>
                        <span className="bg-blue-600 p-1 rounded text-white">
                          {selectedProduct.productPrice * props.values.stock}
                        </span>
                      </p>

                      {productFeaturePrice !== 0 && (
                        <p className="p-2 rounded  border-2 border-dashed border-gray-300 bg-white">
                          <span className="font-semibold">
                            Son Güncel Fiyatı:{" "}
                          </span>
                          <span className="bg-green-600 p-1 rounded text-white">
                            {(selectedProduct.productPrice +
                              productFeaturePrice) *
                              props.values.stock}
                          </span>
                        </p>
                      )}
                    </div>
                    <div>
                      {productFeatures.map(
                        (productFeature, index) =>
                          productFeature.productId === selectedProduct.id &&
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
                  <div className="flex gap-4 justify-end m-4 items-center">
                    <textarea
                      name="orderNote"
                      onChange={props.handleChange}
                      className={`border border-gray-300 rounded-md p-2 m-2 w-full h-[43px]`}
                      placeholder="Ürün için özel açıklama ekleyiniz..."
                    />
                    <div className="flex items-center">
                      <label className="font-semibold uppercase text-lg mr-2">
                        Adet:
                      </label>
                      <input
                        name="stock"
                        value={props.values.stock}
                        onChange={props.handleChange}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[100px] m-2]`}
                        type="number"
                        min={1}
                      />
                    </div>
                    <button
                      type="submit"
                      className="shadow-md whitespace-nowrap w-fit bg-green-500 hover:bg-green-700 text-white font-bold p-2  rounded-md"
                    >
                      Teklife Ekle
                    </button>
                  </div>
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
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Seç
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Renk
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Renk Ürün Tipi
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Renk Kodu
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Özelliğin Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Değer
                            </th>
                          </tr>
                        ) : selectedCategory == "Kumaşlar" ? (
                          <tr className="bg-blue-600 text-white">
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Seç
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Ürün Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Ürün Tipi
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Ürün Adı
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Resim
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Özelliğin Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Değer
                            </th>
                          </tr>
                        ) : selectedCategory == "Metaller" ? (
                          <tr className="bg-blue-600 text-white">
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Seç
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Metal Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Metal Ürün Tipi
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Resim
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Özelliğin Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Değer
                            </th>
                          </tr>
                        ) : selectedCategory == "Ölçüler" ? (
                          <tr className="bg-blue-600 text-white">
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Seç
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Birinci Değer
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              İkinci Değer
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Ölçü Tipi
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Özelliğin Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Değer
                            </th>
                          </tr>
                        ) : selectedCategory == "Extra" ? (
                          <tr className="bg-blue-600 text-white">
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Seç
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Extra
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Özelliğin Türü
                            </th>
                            <th className="text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2">
                              Değer
                            </th>
                          </tr>
                        ) : null}
                      </thead>
                      <tbody>
                        {test && selectedCategory == "Renkler"
                          ? test["Renkler"].map((item, index) => (
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
                                      props.values.selectedOfferFeatures.Renkler.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
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
                                      props.values.selectedOfferFeatures.Renkler.filter(
                                        (feature) => feature.id === item.id
                                      ).length > 0
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                    } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
                                  >
                                    <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                                      <span className="block">
                                        {props.values.selectedOfferFeatures.Renkler.filter(
                                          (feature) => feature.id === item.id
                                        ).length > 0
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
                            ))
                          : null}
                        {/* Benzer yapıda diğer kategoriler için de tablolar oluşturulmalı */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Koleksiyona Göre Filtrele"
          value={collectionFilter}
          onChange={handleCollectionFilterChange}
          className="p-2 border rounded"
        />
      </div>
      <div className="w-full overflow-x-scroll bg-white lg:overflow-x-auto">
        <table
          className={`${
            selectedImage && "blur"
          } w-full text-sm text-left text-gray-500 dark:text-gray-400`}
        >
          <thead className="text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white">
            {renderHead()}
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
    </>
  );
}

export default ListProducts;
