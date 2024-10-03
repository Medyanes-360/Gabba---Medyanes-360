<<<<<<< HEAD
"use client";
import { useState, useEffect } from "react";
import { getAPI, postAPI } from "@/services/fetchAPI";
import Image from "next/image";
=======
'use client';
import { useState, useEffect } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import Image from 'next/image';
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
import {
  IoClose,
  IoCheckmarkDoneSharp,
  IoAddOutline,
  IoCloseOutline,
<<<<<<< HEAD
} from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingScreen from "@/components/other/loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateCollection from "@/components/createProduct/createProduct/createCollection";
=======
} from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LoadingScreen from '@/components/other/loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateCollection from '@/components/createProduct/createProduct/createCollection';
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef

// (1) Data -> kayıtlı ürün ve tüm ürünlerin kayıtlı özelliklerini getirir.
//

const ListFeatureTable = ({
  categoriesData,
  filterProductCode,
  filterProductName,
  filterProductType,
  filterProductPrice,
  filterProductCategory,
  filterEnabled,
  setIsUpdateEnabled,
  isUpdateEnabled,
  setNewUpdateData,
  newUpdateData,
  collectionModeEnabled,
  setCollectionModeEnabled,
  chooseProducts,
  setChooseProducts,
  collectionAllData,
  setCollectionAllData,
  collectionTypes,
  setCollectionTypes,

  setCollectionUpdateEnabled,
  setCollectionUpdateData,
  setCollectionListEnabled,
  setListProductsEnabled,
  setCollectionUpdateImageData,
  setCollectionUpdateProductData,

  collectionUpdateData,
  collectionUpdateImageData,
  collectionUpdateProductData,
  collectionUpdateEnabled,
}) => {
  // categoriesData değerini bir state içerisine atıyoruz.
  const [catagories, setCatagories] = useState(categoriesData);

  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]); // tüm ürünler ve tüm özellikler
  const [selectedProductFeatures, setSelectedProductFeatures] = useState([]); // seçilen ürünün özellikleri tutar
<<<<<<< HEAD
  const [selectedCategory, setSelectedCategory] = useState(""); // seçilen kategori -> furniture
=======
  const [selectedCategory, setSelectedCategory] = useState(''); // seçilen kategori -> furniture
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
  const [allFeatureData, setAllFeatureData] = useState([]); // ürün kategorisinin tüm özellikleri (hepsi)
  const [productFeatures, setProductFeatures] = useState([]); // seçilen ürünün kendi özellikleri tam olarak

  const [selectedImage, setSelectedImage] = useState(null); // seçilen resim
  const [selectedProduct, setSelectedProduct] = useState(null); // seçilen ürün bilgisi

<<<<<<< HEAD
  const [selectedFeature, setSelectedFeature] = useState(""); // Ölçüler - Renkler - Ürünlar - Metaller - Extra - Image başlıkları
  const [readyForListFeature, setReadyForListFeature] = useState([]); // ürün özelliklerini listelemek için hazır mıyız ?
  const [filteredData, setFilteredData] = useState([]); // filtrelenmiş veriler

  const [selectedProductLanguage, setSelectedProductLanguage] = useState(""); // seçilen ürünün dili
=======
  const [selectedFeature, setSelectedFeature] = useState(''); // Ölçüler - Renkler - Ürünlar - Metaller - Extra - Image başlıkları
  const [readyForListFeature, setReadyForListFeature] = useState([]); // ürün özelliklerini listelemek için hazır mıyız ?
  const [filteredData, setFilteredData] = useState([]); // filtrelenmiş veriler

  const [selectedProductLanguage, setSelectedProductLanguage] = useState(''); // seçilen ürünün dili
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef

  useEffect(() => {
    if (collectionUpdateEnabled && collectionUpdateProductData) {
      setChooseProducts(collectionUpdateProductData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionUpdateEnabled, collectionUpdateProductData]);

  useEffect(() => {
    if (
      selectedProduct &&
      selectedProduct.selectedCategoryKey !== selectedCategory &&
      selectedCategory
    ) {
      setAllFeatureData([]);
    }
  }, [catagories, selectedCategory, selectedProduct]);

  useEffect(() => {
<<<<<<< HEAD
    getData("/createProduct/createProduct");
    getDataCollection();

    setNewUpdateData("");
=======
    getData('/createProduct/createProduct');
    getDataCollection();

    setNewUpdateData('');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // veritabanından verileri çek. (1)
  const getData = async (url) => {
    try {
      setIsloading(true);
<<<<<<< HEAD
      const response = await getAPI(url || "/createProduct/createProduct");
      if (response.status !== "success") {
        throw new Error("Veri çekilemedi 1");
=======
      const response = await getAPI(url || '/createProduct/createProduct');
      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi 1');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      }

      // response.data.createProducts içerisindeki değerleri gez ve "productName" değerlerine göre küçükten büyüğe doğru sırala.
      await response.data.createProducts.sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );

      setData(response.data);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.log(error);
    }
  };

  const getDataCollection = async () => {
    try {
      setIsloading(true);
      const response = await getAPI(
<<<<<<< HEAD
        "/createProduct/createProduct/createCollection"
      );

      if (!response || response.status !== "success" || !response.data) {
        throw new Error("Veri çekilemedi JJKY7TB");
=======
        '/createProduct/createProduct/createCollection'
      );

      if (!response || response.status !== 'success' || !response.data) {
        throw new Error('Veri çekilemedi JJKY7TB');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      }
      // tüm getirilen verileri collectionAllData içerisine atıyoruz.
      setCollectionAllData(response.data);

      // collectionTypes içerisine response.data içindeki tüm collectionTypes verilerini atıyoruz.

      const uniqueCollectionTypes = [];

      response.data.collectionsData.forEach((item) => {
        if (!uniqueCollectionTypes.includes(item.collectionType)) {
          uniqueCollectionTypes.push(item.collectionType);
        }
      });

      // State'i güncelleyin
      setCollectionTypes(uniqueCollectionTypes);

      setIsloading(false);
    } catch (error) {
      setIsloading(false);

      //toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    // Ürün filtreleme işlemleri
    if (
      (!filterProductCode &&
        !filterProductName &&
        !filterProductType &&
        !filterProductCategory) ||
      !data.createProducts
    ) {
      setFilteredData(data);
      return; // Eğer herhangi bir filtre yoksa veya veri yoksa işlemi burada sonlandırın.
    }

    const filteredProducts = data.createProducts.filter((item) => {
      const productCodeMatch =
        !filterProductCode ||
        item.productCode
          .toLowerCase()
          .includes(filterProductCode.toLowerCase());

      const productNameMatch =
        !filterProductName ||
        item.productName
          .toLowerCase()
          .includes(filterProductName.toLowerCase());

      const productTypeMatch =
        !filterProductType ||
        item.productType
          .toLowerCase()
          .includes(filterProductType.toLowerCase());

      const productCategoryMatch =
        !filterProductCategory ||
        item.selectedCategoryValues
          .toLowerCase()
          .includes(filterProductCategory.toLowerCase());

      return (
        productCodeMatch &&
        productNameMatch &&
        productTypeMatch &&
        productCategoryMatch
      );
    });

    setFilteredData({ ...data, createProducts: filteredProducts });
  }, [
    data,
    filterProductCode,
    filterProductName,
    filterProductType,
    filterProductCategory,
  ]);

  // seçilen ürünün özelliklerini data içinden getir ve selectedProductFeatures içine atar. (2)
  // seçilen ürünün kategorisini selectedCategory içine atar. (2)
  const getProductFeatures = async (data, prodcutItem, updateStatus) => {
    try {
      setIsloading(true);
      if (!data || !prodcutItem.id) {
        setIsloading(false);
        return;
      }

      // ########################################################################
      // seçilen ürünün özelliklerini selectedProductFeatures state'ine at. (2.1)

      let selectedProductFeatures = [];

      if (updateStatus) {
        selectedProductFeatures = [
          { selectedCategoryKey: prodcutItem.selectedCategoryKey },
        ];
      }

      await data.productFeatures.map((item, index) => {
        if (item.productId === prodcutItem.id) {
          //id eşleşmesi olan gelen tüm item verilerini selectedProductFeatures state'ine at.
          selectedProductFeatures.push(item);
        }
      });

      setSelectedProductFeatures(selectedProductFeatures);
      // seçilen ürünün özelliklerini selectedProductFeatures state'ine at. (2.1)
      // ########################################################################

      // ########################################################################
      // seçilen ürünün kategorisini selectedCategory state'ine at. (2.2)

      if (!selectedProductFeatures[0] && !updateStatus) {
        setIsloading(false);
<<<<<<< HEAD
        toast.error("ürün özellikleri tanımlanmamış!");
=======
        toast.error('ürün özellikleri tanımlanmamış!');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
        return;
      }
      setSelectedCategory(selectedProductFeatures[0].selectedCategoryKey);
      await fetchData(
        selectedProductFeatures[0].selectedCategoryKey,
        prodcutItem,
        updateStatus
      );
      setIsloading(false);

      // seçilen ürünün kategorisini selectedCategory state'ine at. (2.2)
      // ########################################################################
    } catch (error) {
      console.log(error);
    }
  };

  // seçilen kategoriye göre ürün özelliklerini allFeatureData state'ine at. !!! (tek amacı bu) (3)
  const fetchData = async (productCategory, prodcutItem, updateStatus) => {
    setIsloading(true);
    try {
      if (!productCategory) {
        setIsloading(false);
<<<<<<< HEAD
        throw new Error("M2GF59KGV");
=======
        throw new Error('M2GF59KGV');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      }

      // ########################################################################
      // categories'lerin ürününki ile eşleşen features dewğerlerini ver itabanından getiririz.(3.1)

      if (allFeatureData.length > 0 && allFeatureData) {
        await matchedFeatureOfProduct(
          prodcutItem,
          allFeatureData,
          updateStatus
        );
      } else {
        const results = [];
        const matchedCategories = catagories[productCategory];

        //matchedCategories içerisindeki key değeri label hariç olan tüm değerleri gez. içindeki objenin apiGetRequest değerini al ve verileri çek.
        for (const key in matchedCategories) {
          if (Object.hasOwnProperty.call(matchedCategories, key)) {
            const element = matchedCategories[key];
<<<<<<< HEAD
            if (key !== "label") {
              const response = await getAPI(element.apiGetRequest);
              if (response.status !== "success") {
                throw new Error("Veri çekilemedi 2");
=======
            if (key !== 'label') {
              const response = await getAPI(element.apiGetRequest);
              if (response.status !== 'success') {
                throw new Error('Veri çekilemedi 2');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              }
              results.push(response.data);
            }
          }
        }
        await matchedFeatureOfProduct(prodcutItem, results, updateStatus);

        setAllFeatureData(results);
      }

      setIsloading(false);

      // categories'lerin ürününki ile eşleşen features dewğerlerini ver itabanından getiririz.(3.1)
      // ########################################################################
    } catch (error) {
      setIsloading(false);
      console.log(error);
    }
  };

  // seçilen ürünün özelliklerini en detaylı şekilde state e atar. (4)
  const matchedFeatureOfProduct = async (
    prodcutItem,
    results,
    updateStatus
  ) => {
    const matchedFeature = data.productFeatures.filter(
      (item) => item.productId === prodcutItem.id
    );
    const featureResults = [];

    await matchedFeature.forEach((item) => {
      if (
<<<<<<< HEAD
        item.feature.toLowerCase().includes("extra") ||
        item.feature.toLowerCase().includes("image")
=======
        item.feature.toLowerCase().includes('extra') ||
        item.feature.toLowerCase().includes('image')
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      ) {
        featureResults.push(item);
      }
      results.forEach((item2) => {
        item2.forEach((item3) => {
          if (item.featureId === item3.id) {
            featureResults.push(item3);
          }
        });
      });
    });

    const result = [
      { featureResults: featureResults, matchedFeature: matchedFeature },
    ];

    if (updateStatus) {
      await setNewUpdateData({
        createProducts: prodcutItem,
        productFeatures: matchedFeature,
      });
      await setIsUpdateEnabled(true);
    } else {
      setProductFeatures(result);
    }

    setIsloading(false);
  };

  // seçilen ürünün özelliklerini en detaylı şekilde state e atar. (5)
  const prepareProductList = async (feature) => {
    setSelectedFeature(feature);

    //feature ->  Ölçüler - Renkler - Ürünlar - Metaller - Extra - Image
    const readyForListData = [];
    await productFeatures.forEach((item) => {
      item.matchedFeature.forEach((item2) => {
        // item2.featureId -> özelliğin gerçek id' değeri
        if (feature === item2.feature) {
          // [ productFeatures.matchedFeature.item2.feature ] -> Ölçüler - Renkler - Ürünlar - Metaller - Extra - Image

<<<<<<< HEAD
          if (feature === "Image" || feature === "Extra") {
=======
          if (feature === 'Image' || feature === 'Extra') {
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            // extra ve image değerleri farkl ıbir yerden geliyor o yüzden onları ayrı aldık.
            readyForListData.push(item2);
          } else {
            item.featureResults.forEach((item3) => {
              // item3.id -> özelliğin gerçek id' değeri
              if (item2.featureId === item3.id) {
                readyForListData.push(item3);
              }
            });
          }
        }
      });
    });

    // verileri "isimlerine" ve "değerlerine" göre KÜÇÜKTEN BÜYÜĞE DOĞRU SIRALAR.
    const sortedData = await readyForListData.sort((a, b) => {
      if (a.firstValue && b.firstValue) {
        return (
          parseInt(a.firstValue.match(/\d+/)) -
          parseInt(b.firstValue.match(/\d+/))
        );
      } else if (a.colourType && b.colourType) {
        return a.colourType.localeCompare(b.colourType);
      } else if (a.metalType && b.metalType) {
        return a.metalType.localeCompare(b.metalType);
      } else if (a.fabricType && b.fabricType) {
        return a.fabricType.localeCompare(b.fabricType);
      }

      return 0;
    });

    setReadyForListFeature(sortedData);
  };

  const deleteProdcut = async (id, process) => {
    // id -> productId ya da özelliğin orjinal id değeri.
    // process -> deleteProduct | deleteFeature
    try {
      setIsloading(true);
<<<<<<< HEAD
      const responseData = await postAPI("/createProduct/createProduct", {
        data: id,
        processType: "delete",
        process,
      });
      if (!responseData || responseData.status !== "success") {
        throw new Error("Veri silinemedi");
      }
      await getData("/createProduct/createProduct");
=======
      const responseData = await postAPI('/createProduct/createProduct', {
        data: id,
        processType: 'delete',
        process,
      });
      if (!responseData || responseData.status !== 'success') {
        throw new Error('Veri silinemedi');
      }
      await getData('/createProduct/createProduct');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef

      // silme işleminden sonra açılı özellik liste pnaelini kapatır ve state'leri sıfırlar.
      setProductFeatures([]);
      setReadyForListFeature([]);

<<<<<<< HEAD
      toast.success("Veri başarıyla Silindi");
=======
      toast.success('Veri başarıyla Silindi');
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      setIsloading(false);
    } catch (error) {
      toast.error(error.message);
      setIsloading(false);
    }
  };

  const renderHead = () => {
    const tableHeaders = [
<<<<<<< HEAD
      "sıra",
      "Ürün Kodu",
      "Ürün Adı",
      "Ürün Tipi",
      "Ürün Fiyatı",
      "Seçilen Kategori",
      "Ürün Resmi",
      "Dil Çevirisi",
      "Ürün Özellikleri",
      "İşlem",
    ];

    // koleksiyon modu aktif ise header bölümüne "Seç" ifadesi eklenir.
    collectionModeEnabled && tableHeaders.unshift("Seç");

    return (
      <tr className="bg-blue-600 text-white">
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope="col"
            className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2"
=======
      'sıra',
      'Ürün Kodu',
      'Ürün Adı',
      'Ürün Tipi',
      'Ürün Fiyatı',
      'Seçilen Kategori',
      'Ürün Resmi',
      'Dil Çevirisi',
      'Ürün Özellikleri',
      'İşlem',
    ];

    // koleksiyon modu aktif ise header bölümüne "Seç" ifadesi eklenir.
    collectionModeEnabled && tableHeaders.unshift('Seç');

    return (
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

  const renderData = () => {
    return (
      filteredData &&
      filteredData.createProducts &&
      filteredData.createProducts.map((prodcutItem, index) => (
<<<<<<< HEAD
        <tr key={index} className="border-b hover:bg-blue-50">
=======
        <tr key={index} className='border-b hover:bg-blue-50'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
          {/* // checkbox buraya gelecek */}
          {collectionModeEnabled && (
            <td
              className={`${
                collectionModeEnabled &&
                chooseProducts &&
                chooseProducts.length > 0 &&
                chooseProducts.filter(
                  (item) => item.productId === prodcutItem.id
                ).length > 0
<<<<<<< HEAD
                  ? "bg-white"
                  : "bg-gray-100"
              } text-center py-2 border-r border-b border-black`}
            >
              <input
                type="checkbox"
                className="form-checkbox h-6 w-6 text-blue-600 hover:cursor-pointer"
=======
                  ? 'bg-white'
                  : 'bg-gray-100'
              } text-center py-2 border-r border-b border-black`}
            >
              <input
                type='checkbox'
                className='form-checkbox h-6 w-6 text-blue-600 hover:cursor-pointer'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                // eğer seçilen ürün var ise checkbox'ı işaretler.
                checked={
                  chooseProducts &&
                  chooseProducts.length > 0 &&
                  chooseProducts.some(
                    (item) => item.productId === prodcutItem.id
                  )
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    // eğer seçilmiş ise seçilen ürünleri state içerisine atar.
                    // eğer chooseProducts içerisinde seçilen ürün var ise tekrar atmaz.
                    if (
                      chooseProducts &&
                      chooseProducts.length > 0 &&
                      chooseProducts.filter(
                        (item) => item.productId === prodcutItem.id
                      ).length > 0
                    ) {
                      return;
                    } else {
                      setChooseProducts([
                        ...chooseProducts,
                        {
                          productId: prodcutItem.id,
                          productCode: prodcutItem.productCode,
                          productName: prodcutItem.productName,
                        },
                      ]);
                    }
                  }
                  // eğer seçilmemiş ise seçilen ürünleri state içerisinden çıkarır.
                  else {
                    setChooseProducts(
                      chooseProducts.filter(
                        (item) => item.productId !== prodcutItem.id
                      )
                    );
                  }
                }}
              />
            </td>
          )}

          {/* sıra numarası */}
          {
            // eğer collectionProducts içerisinde seçilen ürün var ise bu td elementinin css rengini mavi yap
          }
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
            } border-r border-b border-black text-center`}
          >
            <div className="flex justify-center items-center h-full mt-2 w-full text-center py-2">
              <div className="bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center">
=======
                ? 'bg-white'
                : 'bg-gray-100'
            } border-r border-b border-black text-center`}
          >
            <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
              <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                {index + 1}
              </div>
            </div>
          </td>

          {/* ürün kodu */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } border-r border-b border-black text-center`}
          >
            <div>{prodcutItem.productCode}</div>
          </td>

          {/* ürün adı */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } border-r border-b border-black text-center`}
          >
            <div>{prodcutItem.productName}</div>
          </td>

          {/* ürün tipi */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } border-r border-b border-black text-center`}
          >
            <div>{prodcutItem.productType}</div>
          </td>

          {/* ürün fiyatı */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } border-r border-b border-black text-center`}
          >
            <div>{prodcutItem.productPrice}</div>
          </td>

          {/* seçilen kategori */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } border-r border-b border-black text-center`}
          >
            <div>{prodcutItem.selectedCategoryValues}</div>
          </td>

          {/* ürün resmi */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
            } text-center py-2 border-r border-b border-black`}
          >
            <div className="w-full flex justify-center item-center flex-wrap">
              {data.productFeatures.map(
                (featureItem, index) =>
                  featureItem.productId === prodcutItem.id &&
                  featureItem.feature.includes("Image" || "image") && (
                    <div key={index} className="lg:p-2 p-0 m-1 lg:m-2">
=======
                ? 'bg-white'
                : 'bg-gray-100'
            } text-center py-2 border-r border-b border-black`}
          >
            <div className='w-full flex justify-center item-center flex-wrap'>
              {data.productFeatures.map(
                (featureItem, index) =>
                  featureItem.productId === prodcutItem.id &&
                  featureItem.feature.includes('Image' || 'image') && (
                    <div key={index} className='lg:p-2 p-0 m-1 lg:m-2'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                      <Image
                        width={100}
                        height={100}
                        src={featureItem.imageValue}
                        alt={`image${index}`}
                        onClick={() => setSelectedImage(featureItem.imageValue)}
<<<<<<< HEAD
                        className="hover:cursor-pointer hover:scale-125 transition-all"
=======
                        className='hover:cursor-pointer hover:scale-125 transition-all'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                      />
                    </div>
                  )
              )}
            </div>
          </td>

          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
            } text-center py-2 border-r border-b border-black`}
          >
            <div className="h-20 flex justify-center items-center">
              <Image
                onClick={() => setSelectedProductLanguage(prodcutItem)}
                className="hover:scale-125 transition-all cursor-pointer"
                src="/translate_book.svg"
                height={30}
                width={40}
                alt="TrFlag"
              />
            </div>
            {/*  ürünlerin çevirilerini gösterir */}
            {selectedProductLanguage && selectedProductLanguage !== "" && (
              <div className="absolute top-0 left-0 w-full z-40 bg-black bg-opacity-90 h-screen flex justify-center item-start lg:items-center">
                <div className="absolute top-0 left-0 w-full h-[2500px] bg-black bg-opacity-90"></div>
                <div className="relative top-0 left-0 w-full flex justify-center item-center">
                  <div className=" bg-white rounded-lg min-h-screen lg:min-h-min">
                    <div className="flex flex-row flex-nowrap justify-center items-center gap-2">
                      <div className="flex flex-col justify-center items-center gap-2 p-2">
                        <div className="w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded">
                          <div className=" rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className=" p-2 w-full bg-black rounded-lg text-white text-center text-xl">
=======
                ? 'bg-white'
                : 'bg-gray-100'
            } text-center py-2 border-r border-b border-black`}
          >
            <div className='h-20 flex justify-center items-center'>
              <Image
                onClick={() => setSelectedProductLanguage(prodcutItem)}
                className='hover:scale-125 transition-all cursor-pointer'
                src='/translate_book.svg'
                height={30}
                width={40}
                alt='TrFlag'
              />
            </div>
            {/*  ürünlerin çevirilerini gösterir */}
            {selectedProductLanguage && selectedProductLanguage !== '' && (
              <div className='absolute top-0 left-0 w-full z-40 bg-black bg-opacity-90 h-screen flex justify-center item-start lg:items-center'>
                <div className='absolute top-0 left-0 w-full h-[2500px] bg-black bg-opacity-90'></div>
                <div className='relative top-0 left-0 w-full flex justify-center item-center'>
                  <div className=' bg-white rounded-lg min-h-screen lg:min-h-min'>
                    <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                      <div className='flex flex-col justify-center items-center gap-2 p-2'>
                        <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded'>
                          <div className=' rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className=' p-2 w-full bg-black rounded-lg text-white text-center text-xl'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                              Dil Çevrisi - Ürün bilgileri
                            </h3>
                          </div>
                        </div>

<<<<<<< HEAD
                        <div className="w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded">
                          <div className="bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Adı Türkçe :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productNameTR}
                            </h4>
                          </div>
                          <div className="bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Tipi Türkçe :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productTypeTR}
                            </h4>
                          </div>
                          <div className="bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Kategorisi Türkçe :
                            </h3>
                            <h4 className="text-center text-black">
=======
                        <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                          <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Adı Türkçe :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productNameTR}
                            </h4>
                          </div>
                          <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Tipi Türkçe :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productTypeTR}
                            </h4>
                          </div>
                          <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Kategorisi Türkçe :
                            </h3>
                            <h4 className='text-center text-black'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                              {selectedProductLanguage.productCategoryTR}
                            </h4>
                          </div>
                        </div>

<<<<<<< HEAD
                        <div className="w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded">
                          <div className="bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Adı İngilizce :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productNameUA}
                            </h4>
                          </div>
                          <div className="bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Tipi İngilizce :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productTypeUA}
                            </h4>
                          </div>
                          <div className="bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Kategorisi İngilizce :
                            </h3>
                            <h4 className="text-center text-black">
=======
                        <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded'>
                          <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Adı İngilizce :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productNameUA}
                            </h4>
                          </div>
                          <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Tipi İngilizce :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productTypeUA}
                            </h4>
                          </div>
                          <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Kategorisi İngilizce :
                            </h3>
                            <h4 className='text-center text-black'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                              {selectedProductLanguage.productCategoryUA}
                            </h4>
                          </div>
                        </div>

<<<<<<< HEAD
                        <div className="w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded">
                          <div className="bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Adı Ukraynaca :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productNameEN}
                            </h4>
                          </div>
                          <div className="bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Tipi Ukraynaca :
                            </h3>
                            <h4 className="text-center text-black">
                              {selectedProductLanguage.productTypeEN}
                            </h4>
                          </div>
                          <div className="bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full">
                            <h3 className="text-center font-bold text-black">
                              Ürün Kategorisi Ukraynaca :
                            </h3>
                            <h4 className="text-center text-black">
=======
                        <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded'>
                          <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Adı Ukraynaca :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productNameEN}
                            </h4>
                          </div>
                          <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Tipi Ukraynaca :
                            </h3>
                            <h4 className='text-center text-black'>
                              {selectedProductLanguage.productTypeEN}
                            </h4>
                          </div>
                          <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                            <h3 className='text-center font-bold text-black'>
                              Ürün Kategorisi Ukraynaca :
                            </h3>
                            <h4 className='text-center text-black'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                              {selectedProductLanguage.productCategoryEN}
                            </h4>
                          </div>
                        </div>

                        <div>
                          <div
<<<<<<< HEAD
                            className="bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white "
                            onClick={() => {
                              setSelectedProductLanguage("");
                            }}
                          >
                            <IoClose color="white" size={40} />
=======
                            className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                            onClick={() => {
                              setSelectedProductLanguage('');
                            }}
                          >
                            <IoClose color='white' size={40} />
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </td>

          {/* ürün özellikleri */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
=======
                ? 'bg-white'
                : 'bg-gray-100'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
            } text-center py-2 border-r border-b border-black`}
          >
            <button
              onClick={() =>
                productFeatures &&
                productFeatures.length > 0 &&
                selectedProduct &&
                selectedProduct.id === prodcutItem.id
                  ? setSelectedProduct(null)
                  : setSelectedProduct(prodcutItem)
              }
<<<<<<< HEAD
              type="button"
=======
              type='button'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              className={`${
                productFeatures &&
                productFeatures.length > 0 &&
                selectedProduct &&
                selectedProduct.id === prodcutItem.id
<<<<<<< HEAD
                  ? "bg-red-600"
                  : "bg-blue-600"
=======
                  ? 'bg-red-600'
                  : 'bg-blue-600'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              } rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow`}
            >
              {productFeatures &&
              productFeatures.length > 0 &&
              selectedProduct &&
              selectedProduct.id === prodcutItem.id ? (
<<<<<<< HEAD
                <div className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap">
                  <FaEyeSlash size={20} />
                  <span className="hidden lg:block">Özellikleri Gizle</span>
=======
                <div className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'>
                  <FaEyeSlash size={20} />
                  <span className='hidden lg:block'>Özellikleri Gizle</span>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                </div>
              ) : (
                <div
                  onClick={() => {
                    // setIsUpdateEnabled(false);

                    // data -> tüm ürünler ve tüm özellikler
                    // prodcutItem -> seçilen ürün
                    // false -> update işlemi değil.
                    getProductFeatures(data, prodcutItem, false);
                  }}
<<<<<<< HEAD
                  className="p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap"
                >
                  <FaEye size={20} />
                  <span className="hidden lg:block">Özellikleri Gör</span>
=======
                  className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap'
                >
                  <FaEye size={20} />
                  <span className='hidden lg:block'>Özellikleri Gör</span>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                </div>
              )}
            </button>
          </td>

          {/* işlem */}
          <td
            className={`${
              collectionModeEnabled &&
              chooseProducts &&
              chooseProducts.length > 0 &&
              chooseProducts.filter((item) => item.productId === prodcutItem.id)
                .length > 0
<<<<<<< HEAD
                ? "bg-white"
                : "bg-gray-100"
            } text-center py-2 border-r border-b border-black px-1`}
          >
            <div className="flex justify-center item-center flex-row gap-2 md:gap-4 lg:gap-6 lg:flex-nowrap">
              <button
                onClick={() => deleteProdcut(prodcutItem.id, "deleteProduct")}
                className="bg-red-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2"
=======
                ? 'bg-white'
                : 'bg-gray-100'
            } text-center py-2 border-r border-b border-black px-1`}
          >
            <div className='flex justify-center item-center flex-row gap-2 md:gap-4 lg:gap-6 lg:flex-nowrap'>
              <button
                onClick={() => deleteProdcut(prodcutItem.id, 'deleteProduct')}
                className='bg-red-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              >
                <FaTrash size={20} />
              </button>
              <button
                onClick={async () => {
                  // data -> tüm ürünler ve tüm özellikler
                  // prodcutItem -> seçilen ürün
                  // true -> update işlemi.
                  await getProductFeatures(data, prodcutItem, true);
                }}
<<<<<<< HEAD
                className="bg-blue-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2"
=======
                className='bg-blue-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              >
                <FaEdit size={20} />
              </button>
            </div>
          </td>
        </tr>
      ))
    );
  };

  const renderFeaturesTable = () => {
    // readyForListFeature içerisindeki verileri burada listeleriz.

    const excludedKeys = [
<<<<<<< HEAD
      "id",
      "oneRangeEnabled",
      "twoRangeEnabled",
      "manuelDefined",
      "translateEnabled",
      "createdAt",
      "updatedAt",
      "colourPickerEnabled",
      "addSwatchEnabled",
      "index",
      "feature",
      "featureId",
      "checked",
      "productId",
      "productName",
      "productType",
      "selectedCategoryKey",
      "selectedCategoryValues",
      "targetValue",
      "value",
    ];
    const keyMappings = {
      firstValue: "Birinci Değer",
      secondValue: "İkinci Değer",
      unit: "Ölçü Tipi",

      colourType: "Renk",
      colourDescription: "Renk Ürün Tipisı",
      colourHex: "Renk Kodu",

      fabricType: "Ürün Türü",
      fabricDescription: "Ürün Ürün Tipisı",
      fabricSwatch: "Ürün Adı",
      image: "Resim",

      metalType: "Metal Türü",
      metalDescription: "Metal Ürün Tipisı",

      imageValue: "Resim",
      extraValue: "Ekstra",
=======
      'id',
      'oneRangeEnabled',
      'twoRangeEnabled',
      'manuelDefined',
      'translateEnabled',
      'createdAt',
      'updatedAt',
      'colourPickerEnabled',
      'addSwatchEnabled',
      'index',
      'feature',
      'featureId',
      'checked',
      'productId',
      'productName',
      'productType',
      'selectedCategoryKey',
      'selectedCategoryValues',
      'targetValue',
      'value',
    ];
    const keyMappings = {
      firstValue: 'Birinci Değer',
      secondValue: 'İkinci Değer',
      unit: 'Ölçü Tipi',

      colourType: 'Renk',
      colourDescription: 'Renk Ürün Tipisı',
      colourHex: 'Renk Kodu',

      fabricType: 'Ürün Türü',
      fabricDescription: 'Ürün Ürün Tipisı',
      fabricSwatch: 'Ürün Adı',
      image: 'Resim',

      metalType: 'Metal Türü',
      metalDescription: 'Metal Ürün Tipisı',

      imageValue: 'Resim',
      extraValue: 'Ekstra',
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      // Diğer anahtarları buraya ekleyebilirsiniz...
    };

    const filteredKeys = readyForListFeature.map((item) =>
      Object.keys(item).filter(
        (key) =>
          !excludedKeys.includes(key) &&
<<<<<<< HEAD
          !key.toLowerCase().includes("turkish") &&
          !key.toLowerCase().includes("ukrainian") &&
          !key.toLowerCase().includes("english")
=======
          !key.toLowerCase().includes('turkish') &&
          !key.toLowerCase().includes('ukrainian') &&
          !key.toLowerCase().includes('english')
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      )
    );

    return (
<<<<<<< HEAD
      <div className="w-full overflow-auto  lg:min-h-[200px] bg-gray-600">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white">
            <tr className="bg-blue-600 w-full">
              <th className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white">
=======
      <div className='w-full overflow-auto  lg:min-h-[200px] bg-gray-600'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
            <tr className='bg-blue-600 w-full'>
              <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                Sıra
              </th>

              {filteredKeys[0].map(
                (key, index) =>
                  (selectedFeature &&
                    selectedFeature.length > 0 &&
<<<<<<< HEAD
                    selectedFeature.toLowerCase().includes("extra") &&
                    !key.toLowerCase().includes("extra")) ||
                  (selectedFeature &&
                    selectedFeature.length > 0 &&
                    selectedFeature.toLowerCase().includes("image") &&
                    !key.toLowerCase().includes("image")) || (
                    <th
                      key={index}
                      scope="col"
                      className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white"
=======
                    selectedFeature.toLowerCase().includes('extra') &&
                    !key.toLowerCase().includes('extra')) ||
                  (selectedFeature &&
                    selectedFeature.length > 0 &&
                    selectedFeature.toLowerCase().includes('image') &&
                    !key.toLowerCase().includes('image')) || (
                    <th
                      key={index}
                      scope='col'
                      className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                    >
                      {keyMappings[key] && keyMappings[key].length > 0
                        ? keyMappings[key]
                        : key}
                    </th>
                  )
              )}

              {/* <th className=" text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white bg-gray-700">İşlemler</th> */}
            </tr>
          </thead>

          <tbody>
            {readyForListFeature &&
              readyForListFeature.map((item, index) => (
<<<<<<< HEAD
                <tr key={index} className="bg-white border-b border-gray-200">
                  <td className="text-center py-2 border-r border-b border-black">
                    <div className="flex justify-center items-center h-full mt-2 w-full text-center py-2">
                      <div className="bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center">
=======
                <tr key={index} className='bg-white border-b border-gray-200'>
                  <td className='text-center py-2 border-r border-b border-black'>
                    <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
                      <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                        {index + 1}
                      </div>
                    </div>
                  </td>

                  {filteredKeys[0].map(
                    (key, index) =>
                      (selectedFeature &&
                        selectedFeature.length > 0 &&
<<<<<<< HEAD
                        selectedFeature.toLowerCase().includes("extra") &&
                        !key.toLowerCase().includes("extra")) ||
                      (selectedFeature &&
                        selectedFeature.length > 0 &&
                        selectedFeature.toLowerCase().includes("image") &&
                        !key.toLowerCase().includes("image")) || (
                        <td
                          key={index}
                          className="text-center py-2 border-r border-b border-black"
                        >
                          <div className="text center flex justify-center item-center">
                            {key.toLowerCase().includes("image")
                              ? item[key] &&
                                item[key].length > 0 && (
                                  <Image
                                    className="hover:scale-150 transition-all rounded shadow"
=======
                        selectedFeature.toLowerCase().includes('extra') &&
                        !key.toLowerCase().includes('extra')) ||
                      (selectedFeature &&
                        selectedFeature.length > 0 &&
                        selectedFeature.toLowerCase().includes('image') &&
                        !key.toLowerCase().includes('image')) || (
                        <td
                          key={index}
                          className='text-center py-2 border-r border-b border-black'
                        >
                          <div className='text center flex justify-center item-center'>
                            {key.toLowerCase().includes('image')
                              ? item[key] &&
                                item[key].length > 0 && (
                                  <Image
                                    className='hover:scale-150 transition-all rounded shadow'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                                    width={100}
                                    height={100}
                                    src={item[key]}
                                    alt={`image${index}`}
                                  />
                                )
                              : item[key]}
                          </div>
                        </td>
                      )
                  )}

                  {
                    //  <td className="text-center py-2 border-r border-b border-black">
                    //    <div className='flex flex-row justify-center items-center gap-2'>
                    //                      {/* item -> özelliğin kendi verisini tutar*/}
                    //      <button onClick={() => deleteProdcut({featureId:item.id, productId:selectedProduct.id}, "deleteFeature")} className='bg-red-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'>
                    //        <FaTrash size={20} />
                    //      </button>
                    //    </div>
                    //  </td>
                  }
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
<<<<<<< HEAD
    <div className="w-full">
=======
    <div className='w-full'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
      {isloading && <LoadingScreen isloading={isloading} />}

      {/* Ürün Özelliklerini Listeleme */}
      {productFeatures && productFeatures.length > 0 && (
<<<<<<< HEAD
        <div className="w-full absolute bg-black bg-opacity-90 z-50 min-h-screen">
          <div className="mt-4 flex flex-col flex-wrap justify-center items-center gap-2 text-xl">
            <div
              className="bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all"
=======
        <div className='w-full absolute bg-black bg-opacity-90 z-50 min-h-screen'>
          <div className='mt-4 flex flex-col flex-wrap justify-center items-center gap-2 text-xl'>
            <div
              className='bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              onClick={() => {
                setProductFeatures([]);
                setSelectedProduct(null);
                setSelectedFeature(null);
                readyForListFeature &&
                  readyForListFeature.length > 0 &&
                  setReadyForListFeature([]);
              }}
            >
<<<<<<< HEAD
              <IoCloseOutline size={50} color="white" />
            </div>
            <div className="p-2 flex flex-row flex-wrap justify-center items-start gap-4 text-xl w-full">
=======
              <IoCloseOutline size={50} color='white' />
            </div>
            <div className='p-2 flex flex-row flex-wrap justify-center items-start gap-4 text-xl w-full'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              {[
                ...new Set(
                  productFeatures[0].matchedFeature.map((item) => item.feature)
                ),
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-2 rounded bg-blue-50 hover:cursor-pointer hover:scale-110 transition-all hover:bg-blue-600 hover:text-white
                   ${
<<<<<<< HEAD
                     selectedFeature === feature ? "bg-blue-600 text-white" : ""
                   }`}
                  onClick={() => prepareProductList(feature)}
                >
                  {feature.toLowerCase().includes("image")
                    ? "Resimler"
                    : feature.toLowerCase().includes("extra")
                    ? "Ekstralar"
=======
                     selectedFeature === feature ? 'bg-blue-600 text-white' : ''
                   }`}
                  onClick={() => prepareProductList(feature)}
                >
                  {feature.toLowerCase().includes('image')
                    ? 'Resimler'
                    : feature.toLowerCase().includes('extra')
                    ? 'Ekstralar'
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
                    : feature}
                </div>
              ))}
              {readyForListFeature && readyForListFeature.length > 0 && (
<<<<<<< HEAD
                <div className="w-full bg-white">{renderFeaturesTable()}</div>
=======
                <div className='w-full bg-white'>{renderFeaturesTable()}</div>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              )}
            </div>
          </div>
        </div>
      )}

      {
        // resim seçildiğinde resmi büyütüyoruz ve ekranda gösteriyoruz (1)
        selectedImage && (
<<<<<<< HEAD
          <div className="absolute w-full h-full z-20 bg-black bg-opacity-80">
            <div className="relative w-full h-full flex flex-col justify-center items-center gap-2">
              <div
                className="bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all"
                onClick={() => setSelectedImage(null)}
              >
                <IoCloseOutline size={50} color="white" />
=======
          <div className='absolute w-full h-full z-20 bg-black bg-opacity-80'>
            <div className='relative w-full h-full flex flex-col justify-center items-center gap-2'>
              <div
                className='bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
                onClick={() => setSelectedImage(null)}
              >
                <IoCloseOutline size={50} color='white' />
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
              </div>

              <Image
                width={750}
                height={750}
                src={selectedImage}
                alt={`image`}
              />
            </div>
          </div>
        )
      }

      {/* ürünleri listelediğimiz tablomuz */}
<<<<<<< HEAD
      <div className="w-full overflow-auto">
=======
      <div className='w-full overflow-auto'>
>>>>>>> a966b0688f2c568b087175c111823997b30fa9ef
        {collectionModeEnabled && (
          <CreateCollection
            collectionProducts={chooseProducts}
            setIsloading={setIsloading}
            collectionAllData={collectionAllData}
            setCollectionAllData={setCollectionAllData}
            collectionTypes={collectionTypes}
            setCollectionTypes={setCollectionTypes}
            setCollectionUpdateEnabled={setCollectionUpdateEnabled}
            setCollectionUpdateData={setCollectionUpdateData}
            setCollectionListEnabled={setCollectionListEnabled}
            setListProductsEnabled={setListProductsEnabled}
            setCollectionUpdateImageData={setCollectionUpdateImageData}
            setCollectionUpdateProductData={setCollectionUpdateProductData}
            collectionUpdateProductData={collectionUpdateProductData}
            collectionUpdateImageData={collectionUpdateImageData}
            collectionUpdateData={collectionUpdateData}
            collectionUpdateEnabled={collectionUpdateEnabled}
          />
        )}
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
          <tbody>{renderData()} </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListFeatureTable;
