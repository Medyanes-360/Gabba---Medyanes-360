import { getAPI } from '@/services/fetchAPI';
import {
  createNewData,
  createNewDataMany,
  getAllData,
  updateDataByAny,
  updateDataByMany,
  deleteDataByAny,
  deleteDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { data, processType, id, stock, userId } = req.body;

      if (processType === 'updateBasket') {
        const basketData = {
          stock: data.stock,
          //storeId: data.storeId,
          orderNote: data.orderNote,
          productPrice: data.selectedOfferProductPrice,
          productFeaturePrice: data.selectedOfferProductFeaturePrice,
        };

        const updatedData = await updateDataByMany(
          'OfferBasket',
          { id: data.basketId },
          basketData
        );

        // Daha önce eklenmiş verileri siliyoruz.

        const deleteColor = deleteDataByMany('OfferBasketColors', {
          basketId: {
            equals: data.basketId,
          },
        });

        const deleteExtra = deleteDataByMany('OfferBasketExtra', {
          basketId: {
            equals: data.basketId,
          },
        });

        const deleteFabrics = deleteDataByMany('OfferBasketFabrics', {
          basketId: {
            equals: data.basketId,
          },
        });

        const deleteMeasurements = deleteDataByMany('OfferBasketMeasurements', {
          basketId: {
            equals: data.basketId,
          },
        });

        const deleteMetals = deleteDataByMany('OfferBasketMetals', {
          basketId: {
            equals: data.basketId,
          },
        });

        const [
          resultDeleteColor,
          resultDeleteExtra,
          resultDeleteFabrics,
          resultDeleteMeasurements,
          resultDeleteMetals,
        ] = await Promise.all([
          deleteColor,
          deleteExtra,
          deleteFabrics,
          deleteMeasurements,
          deleteMetals,
        ]);

        // Seçilen ek özellikleri veri tabanına ekliyoruz.
        // Renkler, Kumaşlar, Metaller...
        if (
          data.selectedOfferFeatures &&
          data.selectedOfferFeatures.Renkler &&
          Object.keys(data.selectedOfferFeatures.Renkler).length > 0
        ) {
          const renklerArray = Object.values(
            data.selectedOfferFeatures.Renkler
          );

          const renklerToSend = renklerArray.map((item) => {
            return {
              colourId: item.id,
              productId: data.selectedOfferProduct,
              basketId: data.basketId,
            };
          });

          const responseCreateOfferBasketColor = await createNewDataMany(
            'OfferBasketColors',
            renklerToSend
          );

          if (
            !responseCreateOfferBasketColor ||
            responseCreateOfferBasketColor.error
          ) {
            throw responseCreateOfferBasketColor.error;
          }
        }

        if (
          data.selectedOfferFeatures &&
          data.selectedOfferFeatures.Kumaşlar &&
          Object.keys(data.selectedOfferFeatures.Kumaşlar).length > 0
        ) {
          const fabricsArray = Object.values(
            data.selectedOfferFeatures.Kumaşlar
          );

          const fabricsToSend = fabricsArray.map((item) => {
            return {
              fabricsId: item.id,
              productId: data.selectedOfferProduct,
              basketId: data.basketId,
            };
          });

          const responseCreateOfferBasketFabric = await createNewDataMany(
            'OfferBasketFabrics',
            fabricsToSend
          );

          if (
            !responseCreateOfferBasketFabric ||
            responseCreateOfferBasketFabric.error
          ) {
            throw responseCreateOfferBasketFabric.error;
          }
        }

        if (
          data.selectedOfferFeatures &&
          data.selectedOfferFeatures.Ölçüler &&
          Object.keys(data.selectedOfferFeatures.Ölçüler).length > 0
        ) {
          const measurementArray = Object.values(
            data.selectedOfferFeatures.Ölçüler
          );

          const measurementToSend = measurementArray.map((item) => {
            return {
              measurementId: item.id,
              productId: data.selectedOfferProduct,
              basketId: data.basketId,
            };
          });

          const responseCreateOfferBasketMeasurement = await createNewDataMany(
            'OfferBasketMeasurements',
            measurementToSend
          );

          if (
            !responseCreateOfferBasketMeasurement ||
            responseCreateOfferBasketMeasurement.error
          ) {
            throw responseCreateOfferBasketMeasurement.error;
          }
        }

        if (
          data.selectedOfferFeatures &&
          data.selectedOfferFeatures.Metaller &&
          Object.keys(data.selectedOfferFeatures.Metaller).length > 0
        ) {
          const metalArray = Object.values(data.selectedOfferFeatures.Metaller);

          const metalToSend = metalArray.map((item) => {
            return {
              metalId: item.id,
              productId: data.selectedOfferProduct,
              basketId: data.basketId,
            };
          });

          const responseCreateOfferBasketMetal = await createNewDataMany(
            'OfferBasketMetals',
            metalToSend
          );

          if (
            !responseCreateOfferBasketMetal ||
            responseCreateOfferBasketMetal.error
          ) {
            throw responseCreateOfferBasketMetal.error;
          }
        }

        if (
          data.selectedOfferFeatures &&
          data.selectedOfferFeatures.Extralar &&
          Object.keys(data.selectedOfferFeatures.Extralar).length > 0
        ) {
          const extraArray = Object.values(data.selectedOfferFeatures.Extralar);

          const extraToSend = extraArray.map((item) => {
            return {
              extraId: item.id,
              productId: data.selectedOfferProduct,
              basketId: data.basketId,
            };
          });

          const responseCreateOfferBasketExtra = await createNewDataMany(
            'OfferBasketExtra',
            extraToSend
          );

          if (
            !responseCreateOfferBasketExtra ||
            responseCreateOfferBasketExtra.error
          ) {
            throw responseCreateOfferBasketExtra.error;
          }
        }

        return res.status(200).json({
          status: 'success',
          message: 'Ürünler başarıyla güncellendi!',
        });
      }

      if (processType === 'delete') {
        const deletedData = await deleteDataByAny('OfferBasket', { id: id });
        if (!deletedData || deletedData.error) {
          throw deletedData.error;
        }
        return res.status(200).json({
          status: 'success',
          message: 'Ürün sepetten başarılı bir şekilde kaldırıldı.',
        });
      }

      if (processType === 'update') {
        if (id && stock) {
          const updatedData = await updateDataByAny(
            'OfferBasket',
            { id: id },
            {
              stock: stock,
            }
          );
          return res.status(200).json({
            status: 'success',
            data: updatedData,
          });
        }
      }

      const basketData = {
        stock: data.stock,
        orderNote: data.orderNote,
        productId: data.selectedOfferProduct,
        productPrice: parseFloat(data.selectedOfferProductPrice),
        productFeaturePrice: parseFloat(data.selectedOfferProductFeaturePrice),
        user: { connect: { id: userId } },
      };

      const responseCreateBasket = await createNewData(
        'OfferBasket',
        basketData
      );

      if (!responseCreateBasket || responseCreateBasket.error) {
        throw responseCreateBasket.error;
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Renkler &&
        data.selectedOfferFeatures.Renkler.length > 0
      ) {
        await data.selectedOfferFeatures.Renkler.map((item) => {
          item.colourId = item.id;
          item.productId = data.selectedOfferProduct;
          item.basketId = responseCreateBasket.id;
          delete item.id;
        });

        const responseCreateBasketColor = await createNewDataMany(
          'OfferBasketColors',
          data.selectedOfferFeatures.Renkler
        );

        if (!responseCreateBasketColor || responseCreateBasketColor.error) {
          throw responseCreateBasketColor.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Kumaşlar &&
        data.selectedOfferFeatures.Kumaşlar.length > 0
      ) {
        data.selectedOfferFeatures.Kumaşlar.map((item) => {
          item.fabricsId = item.id;
          item.productId = data.selectedOfferProduct;
          item.basketId = responseCreateBasket.id;
          delete item.id;
        });
        const responseCreateBasketFabric = await createNewDataMany(
          'OfferBasketFabrics',
          data.selectedOfferFeatures.Kumaşlar
        );

        if (!responseCreateBasketFabric || responseCreateBasketFabric.error) {
          throw responseCreateBasketFabric.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Ölçüler &&
        data.selectedOfferFeatures.Ölçüler.length > 0
      ) {
        data.selectedOfferFeatures.Ölçüler.map((item) => {
          item.measurementId = item.id;
          item.productId = data.selectedOfferProduct;
          item.basketId = responseCreateBasket.id;
          delete item.id;
        });

        const responseCreateBasketMeasurement = await createNewDataMany(
          'OfferBasketMeasurements',
          data.selectedOfferFeatures.Ölçüler
        );

        if (
          !responseCreateBasketMeasurement ||
          responseCreateBasketMeasurement.error
        ) {
          throw responseCreateBasketMeasurement.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Metaller &&
        data.selectedOfferFeatures.Metaller.length > 0
      ) {
        data.selectedOfferFeatures.Metaller.map((item) => {
          item.metalId = item.id;
          item.productId = data.selectedOfferProduct;
          item.basketId = responseCreateBasket.id;
          delete item.id;
        });

        const responseCreateBasketMetal = await createNewDataMany(
          'OfferBasketMetals',
          data.selectedOfferFeatures.Metaller
        );

        if (!responseCreateBasketMetal || responseCreateBasketMetal.error) {
          throw responseCreateBasketMetal.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Extra &&
        data.selectedOfferFeatures.Extra.length > 0
      ) {
        data.selectedOfferFeatures.Extra.map((item) => {
          item.extraId = item.id;
          item.productId = data.selectedOfferProduct;
          item.basketId = responseCreateBasket.id;
          delete item.id;
        });

        const responseCreateBasketExtra = await createNewDataMany(
          'OfferBasketExtra',
          data.selectedOfferFeatures.Extra
        );

        if (!responseCreateBasketExtra || responseCreateBasketExtra.error) {
          throw responseCreateBasketExtra.error;
        }
      }

      return res.status(200).json({
        status: 'success',
      });
    }

    if (req.method === 'GET') {
      const OfferBaskets = await getAllData('OfferBasket');
      const OfferBasketColors = await getAllData('OfferBasketColors');
      const OfferBasketFabrics = await getAllData('OfferBasketFabrics');
      const OfferBasketMeasurements = await getAllData(
        'OfferBasketMeasurements'
      );
      const OfferBasketMetals = await getAllData('OfferBasketMetals');
      const OfferBasketExtra = await getAllData('OfferBasketExtra');

      if (!OfferBaskets || OfferBaskets.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }

      if (!OfferBasketColors || OfferBasketColors.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY5';
      }

      if (!OfferBasketFabrics || OfferBasketFabrics.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY6';
      }

      if (!OfferBasketMeasurements || OfferBasketMeasurements.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY7';
      }

      if (!OfferBasketMetals || OfferBasketMetals.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY8';
      }

      if (!OfferBasketExtra || OfferBasketExtra.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY9';
      }

      // Toplam verileri saklamak için bir dizi oluştur
      const combinedData = [];

      // OfferBaskets içindeki her bir öğeyi kontrol et

      await Promise.all(
        OfferBaskets.filter((dtres) => dtres.userId === req.query.userId).map(
          async (offerBasket) => {
            const offerBasketId = offerBasket.id;

            // OfferBasketColors içinde OfferBaskets ID'sine göre eşleşen renkleri seçme
            const matchingColors = await OfferBasketColors.filter(
              (color) => color.basketId === offerBasketId
            );

            // OfferBasketExtra içinde OfferBaskets ID'sine göre eşleşen ekstraları seçme
            const matchingExtras = await OfferBasketExtra.filter(
              (extra) => extra.basketId === offerBasketId
            );

            // OfferBasketFabrics içinde OfferBaskets ID'sine göre eşleşen kumaşları seçme
            const matchingFabrics = await OfferBasketFabrics.filter(
              (fabric) => fabric.basketId === offerBasketId
            );

            const matchingMeasurements = await OfferBasketMeasurements.filter(
              (measurement) => measurement.basketId === offerBasketId
            );

            // OfferBasketMetals içinde OfferBaskets ID'sine göre eşleşen metalleri seçme
            const matchingMetals = await OfferBasketMetals.filter(
              (metal) => metal.basketId === offerBasketId
            );

            // Her bir renk için API çağrısını yaparak Renkler dizisine eklemek
            const dataColour = await Promise.all(
              matchingColors.map(async (color) => {
                const colourData = await getAPI(
                  `/createProduct/colors?colourId=${color.colourId}`
                );
                return colourData.data;
              })
            );

            // Her bir ölçü için API çağrısını yaparak Ölçüler dizisine eklemek
            const dataMeasurement = await Promise.all(
              matchingMeasurements.map(async (measurement) => {
                const measurementData = await getAPI(
                  `/createProduct/measurements?measurementId=${measurement.measurementId}`
                );
                return measurementData.data;
              })
            );

            // Her bir metaller için API çağrısını yaparak Metaller dizisine eklemek
            const dataMetal = await Promise.all(
              matchingMetals.map(async (metal) => {
                const metalData = await getAPI(
                  `/createProduct/metals?metalId=${metal.metalId}`
                );
                return metalData.data;
              })
            );

            // Her bir kumaş için API çağrısını yaparak Kumaşlar dizisine eklemek
            const dataFabric = await Promise.all(
              matchingFabrics.map(async (fabric) => {
                const fabricData = await getAPI(
                  `/createProduct/fabrics?fabricsId=${fabric.fabricsId}`
                );
                return fabricData.data;
              })
            );

            // Ürün ID'sine göre API çağrısını yaparak ürünü seçme
            const productData = await getAPI(
              `/createProduct/createProduct?productId=${offerBasket.productId}`
            );

            // Extra ID'sine göre API çağrısını yaparak ekstrayı seçme
            const extraData = await Promise.all(
              matchingExtras.map(async (extra) => {
                const extraData = await getAPI(
                  `/createProduct/createProduct?extraId=${extra.extraId}`
                );
                return extraData.data;
              })
            );

            const combinedItem = {
              id: offerBasket.id,
              Product: productData.data,
              Stock: offerBasket.stock,
              OrderNote: offerBasket.orderNote,
              ProductPrice: offerBasket.productPrice,
              ProductFeaturePrice: offerBasket.productFeaturePrice,
              Renkler: dataColour,
              Extralar: extraData,
              Ölçüler: dataMeasurement,
              Kumaşlar: dataFabric,
              Metaller: dataMetal,
            };

            // Toplu veriler dizisine ekle
            combinedData.push(combinedItem);
          }
        )
      );

      return res.status(200).json({
        status: 'success',
        data: combinedData,
        message: OfferBaskets.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
