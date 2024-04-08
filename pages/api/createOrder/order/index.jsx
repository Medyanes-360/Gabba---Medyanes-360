import prisma from '@/lib/prisma';
import { getAPI, postAPI } from '@/services/fetchAPI';
import {
  createNewData,
  createNewDataMany,
  getAllData,
  getDataByUnique,
  getDataByUniqueMany,
  deleteDataByAny,
  deleteDataByMany,
} from '@/services/serviceOperations';

function generateOrderCode(customerName) {
  const orderDate = new Date();
  // Sipariş tarihini al
  var orderTime =
    orderDate.getHours() +
    '' +
    orderDate.getMinutes() +
    '' +
    orderDate.getSeconds();
  var orderDay = orderDate.getDate();
  var orderMonth = orderDate.getMonth() + 1; // Ay 0 ile başlar, bu nedenle +1 ekliyoruz

  // Müşteri isminin ilk 4 harfini al
  var customerPrefix = customerName.slice(0, 4).toUpperCase();

  // Rastgele 2 harf oluştur
  var randomChars = generateRandomChars(2);

  // Rastgele 2 harf oluşturma fonksiyonu
  function generateRandomChars(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomChars = '';

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomChars += characters.charAt(randomIndex);
    }

    return randomChars;
  }

  // Sipariş kodunu oluştur
  var orderCode =
    orderTime +
    customerPrefix +
    randomChars +
    orderDay +
    orderMonth +
    generateRandomChars(2);

  return orderCode;
}

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { basketData, values, processType, deletedOrderCode } = req.body;

      // Teklifler sayfasından silme işlemi yapılırsa
      if (processType === 'delete') {
        const findOrderCode = await getDataByUniqueMany('OfferOrder', {
          orderCode: deletedOrderCode,
        });

        if (!findOrderCode || findOrderCode.error) {
          throw findOrderCode.error;
        }
        console.log(findOrderCode);

        const result = await Promise.all(
          findOrderCode.map(async (item) => {
            const deletedOrder = deleteDataByAny('OfferOrder', {
              id: item.id,
            });

            const deletedColors = deleteDataByMany('OfferOrderColors', {
              orderCode: item.orderCode,
            });

            const deletedFabrics = deleteDataByMany('OfferOrderFabrics', {
              orderCode: item.orderCode,
            });

            const deletedMeasurements = deleteDataByMany(
              'OfferOrderMeasurements',
              {
                orderCode: item.orderCode,
              }
            );

            const deletedMetals = deleteDataByMany('OfferOrderMetals', {
              orderCode: item.orderCode,
            });

            const deletedExtras = deleteDataByMany('OfferOrderExtra', {
              orderCode: item.orderCode,
            });

            const [
              deletedOrderResult,
              deletedColorsResult,
              deletedFabricsResult,
              deletedMeasurementsResult,
              deletedMetalsResult,
              deletedExtrasResult,
            ] = await Promise.all([
              deletedOrder,
              deletedColors,
              deletedFabrics,
              deletedMeasurements,
              deletedMetals,
              deletedExtras,
            ]);

            return {
              deletedOrderResult,
              deletedColorsResult,
              deletedFabricsResult,
              deletedMeasurementsResult,
              deletedMetalsResult,
              deletedExtrasResult,
            };
          })
        );

        if (!result || result.some((r) => r.error)) {
          throw result.find((r) => r.error).error;
        }

        return res.status(200).json({
          status: 'success',
          data: result,
          message: 'Tekliften ürün başarıyla silindi.',
        });
      }

      const customerId = values.customerId;
      const customerName = values.customerName;
      const personelId = values.personelId;
      const orderNote = values.orderNote;
      const ordersStatus = values.ordersStatus;
      const productOrderStatus = values.productOrderStatus;

      if (personelId == undefined || personelId == null) {
        throw new Error('Hesabınıza giriş yapmanız gerekiyor!');
      }

      // 10 gün eklemek için yeni bir tarih oluştur
      const date = new Date();
      const invalidDate = new Date(date);
      invalidDate.setDate(date.getDate() + 10);

      const orderCode = generateOrderCode(customerName);

      await Promise.all(
        // MAP
        basketData.map(async (item) => {
          const orderData = {
            orderCode: orderCode,
            invalidDate: invalidDate,
            stock: item.Stock,
            orderNote: orderNote,
            ordersStatus: ordersStatus,
            productOrderStatus: productOrderStatus,
            personelId: personelId,
            customerId: customerId,
            productPrice: item.ProductPrice,
            productFeaturePrice: item.ProductFeaturePrice,
            productId: item.Product.id,
          };

          const responseCreateOrder = await createNewData(
            'OfferOrder',
            orderData
          );

          if (!responseCreateOrder || responseCreateOrder?.error) {
            throw responseCreateOrder?.error;
          }

          // Renkleri Order Tablosuna Ekle
          if (item && item.Renkler && item.Renkler.length > 0) {
            const colourData = [];
            await item.Renkler.map((colourItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              colourData.push({
                orderId: responseCreateOrder.id,
                colourId: colourItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdColors = await createNewDataMany(
              'OfferOrderColors',
              colourData
            );
            if (!createdColors || createdColors?.error) {
              throw createdColors?.error;
            }
          }

          // Metalleri Order Tablosuna Ekle
          if (item && item.Metaller && item.Metaller.length > 0) {
            const metalData = [];
            await item.Metaller.map((metalsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              metalData.push({
                orderId: responseCreateOrder.id,
                metalId: metalsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdMetals = await createNewDataMany(
              'OfferOrderMetals',
              metalData
            );
            if (!createdMetals || createdMetals?.error) {
              throw createdMetals?.error;
            }
          }

          // Ölçüleri (measurement) Order Tablosuna Ekle
          if (item && item.Ölçüler && item.Ölçüler.length > 0) {
            const measurementData = [];
            await item.Ölçüler.map((measurementsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              measurementData.push({
                orderId: responseCreateOrder.id,
                measurementId: measurementsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdMeasurements = await createNewDataMany(
              'OfferOrderMeasurements',
              measurementData
            );
            if (!createdMeasurements || createdMeasurements?.error) {
              throw createdMeasurements?.error;
            }
          }

          // Kumaşları (fabric) Order Tablosuna Ekle
          if (item && item.Kumaşlar && item.Kumaşlar.length > 0) {
            const fabricData = [];
            await item.Kumaşlar.map((fabricsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              fabricData.push({
                orderId: responseCreateOrder.id,
                fabricsId: fabricsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdFabrics = await createNewDataMany(
              'OfferOrderFabrics',
              fabricData
            );
            if (!createdFabrics || createdFabrics?.error) {
              throw createdFabrics?.error;
            }
          }

          // Extraları Order Tablosuna Ekle
          if (item && item.Extralar && item.Extralar.length > 0) {
            const extraData = [];
            await item.Extralar.map((extrasItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              extraData.push({
                orderId: responseCreateOrder.id,
                extraId: extrasItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdExtras = await createNewDataMany(
              'OfferOrderExtra',
              extraData
            );
            if (!createdExtras || createdExtras?.error) {
              throw createdExtras?.error;
            }
          }

          // Gelen id ile birlikte sepetteki ürünü sil
          const deletedBasket = await postAPI('/createOffer/basket', {
            processType: 'delete',
            id: item.id,
          });
          if (!deletedBasket || deletedBasket?.error) {
            throw deletedBasket?.error;
          }
        })
        // MAP END
      );

      return res.status(200).json({
        status: 'success',
        message: 'Teklif başarıyla oluşturuldu.',
      });
    }

    if (req.method === 'GET') {
      try {
        const [
          OfferOrdersResult,
          OfferOrderColorsResult,
          OfferOrderFabricsResult,
          OfferOrderMeasurementsResult,
          OfferOrderMetalsResult,
          OfferOrderExtraResult,
        ] = await Promise.all([
          getAllData('OfferOrder'),
          getAllData('OfferOrderColors'),
          getAllData('OfferOrderFabrics'),
          getAllData('OfferOrderMeasurements'),
          getAllData('OfferOrderMetals'),
          getAllData('OfferOrderExtra'),
        ]);

        if (!OfferOrdersResult || OfferOrdersResult?.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
        }

        // Benzersiz orderCode'ları direkt olarak veritabanından al
        const uniqueOrderCodes = OfferOrdersResult.reduce((acc, order) => {
          if (!acc.includes(order.orderCode)) {
            acc.push(order.orderCode);
          }
          return acc;
        }, []);

        const combinetData = [];

        for (const orderCode of uniqueOrderCodes) {
          const [
            matchingColors,
            matchingFabrics,
            matchingMeasurements,
            matchingMetals,
            matchingExtras,
            matchingOrder,
          ] = await Promise.all([
            OfferOrderColorsResult.filter(
              (color) => color.orderCode === orderCode
            ),
            OfferOrderFabricsResult.filter(
              (fabric) => fabric.orderCode === orderCode
            ),
            OfferOrderMeasurementsResult.filter(
              (measurement) => measurement.orderCode === orderCode
            ),
            OfferOrderMetalsResult.filter(
              (metal) => metal.orderCode === orderCode
            ),
            OfferOrderExtraResult.filter(
              (extra) => extra.orderCode === orderCode
            ),
            OfferOrdersResult.filter((order) => order.orderCode === orderCode),
          ]);

          const [
            Colours,
            Fabrics,
            Measurements,
            Metals,
            Extras,
            Products,
            Customer,
            Personel,
          ] = await Promise.all([
            Promise.all(
              matchingColors.map((color) =>
                getDataByUnique('Colors', { id: color.orderId })
              )
            ),
            Promise.all(
              matchingFabrics.map((fabric) =>
                getDataByUnique('Fabrics', { id: fabric.orderId })
              )
            ),
            Promise.all(
              matchingMeasurements.map((measurement) =>
                getDataByUnique('Measurements', { id: measurement.orderId })
              )
            ),
            Promise.all(
              matchingMetals.map((metal) =>
                getDataByUnique('Metals', { id: metal.orderId })
              )
            ),
            Promise.all(
              matchingExtras.map(async (extra) => {
                const extraData = await getAPI(
                  `/createProduct/createProduct?extraId=${extra.extraId}`
                );
                extraData.data.orderId = extra.orderId;
                return extraData.data;
              })
            ),
            Promise.all(
              matchingOrder.map((order) =>
                getDataByUnique('Products', { id: order.productId })
              )
            ),
            Promise.all(
              matchingOrder.map((order) =>
                getDataByUnique('Customer', { id: order.customerId })
              )
            ),
            Promise.all(
              matchingOrder.map((order) =>
                getAPI(`/user?id=${order.personelId}`)
              )
            ),
          ]);

          console.log([
            Colours,
            Fabrics,
            Measurements,
            Metals,
            Extras,
            Products,
            Customer,
            Personel,
          ])

          combinetData.push({
            orderCode: orderCode,
            Orders: matchingOrder,
            Renkler: Colours,
            Kumaşlar: Fabrics,
            Ölçüler: Measurements,
            Metaller: Metals,
            Extralar: Extras,
            Ürünler: Products,
            Müşteri: Customer,
            Personel: Personel,
          });
        }

        return res.status(200).json({
          status: 'success',
          data: combinetData,
          message: 'Siparişler başarıyla getirildi.',
        });
      } catch (error) {
        console.error('Hata:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
