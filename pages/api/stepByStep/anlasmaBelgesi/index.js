import {
  updateDataByMany,
  createNewData,
  getDataByUnique,
  deleteDataAll,
  updateDataByAny,
  createNewDataMany,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  function generateAnlasmaKodu(orderCode) {
    let anlasmaKodu = 'ANLASMA-';
    const date = new Date();
    anlasmaKodu += date.getUTCFullYear();
    anlasmaKodu += '-' + orderCode;

    return anlasmaKodu;
  }

  // Ürün verilerini dinamik olarak oluşturma fonksiyonu
  function generateProductData(count, commonData, orderData) {
    const productDataArray = [];

    for (let i = 0; i < count; i++) {
      commonData.orderId = orderData[i].id;
      productDataArray.push({ ...commonData });
    }

    return productDataArray;
  }

  try {
    if (req.method === 'POST') {
      const { values, stepByStep } = req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      // StepByStep değeri eğer true ise, "1.2" adımda ön ödeme mıktarı eklenmiş demektir.
      // Bu yüzden stepByStep üzerinde sadece güncelleme işlemi olacaktır.
      if (stepByStep) {
        const anlasmaBelgesiKodu = generateAnlasmaKodu(values.orderCode);

        const updateStepByStep = await updateDataByMany(
          'StepByStep',
          {
            orderCode: values.orderCode,
          },
          {
            anlasmaBelgesi: true,
            onOdemeMiktari: values.onOdemeMiktari,
          }
        );

        const isCreatedAnlasmaBelgesi = await getDataByUnique(
          'AnlasmaBelgesi',
          {
            orderCode: values.orderCode,
          }
        );

        // Eğer daha önce varsa, güncelleme yap.
        if (isCreatedAnlasmaBelgesi) {
          const updateAnlasmaBelgesi = await updateDataByAny(
            'AnlasmaBelgesi',
            {
              orderCode: values.orderCode,
            },
            {
              onOdemeMiktari: values.onOdemeMiktari,
            }
          );

          return res.status(200).json({
            status: 'success',
            message: 'Anlaşma belgeniz başarıyla güncellendi!',
          });
        }
        // eğer daha önce veri eklenmediyse, oluştur.
        else {
          const createAnlasmaBelgesi = await createNewData('AnlasmaBelgesi', {
            orderCode: values.orderCode,
            anlasmaBelgesiKodu: anlasmaBelgesiKodu,
            date: values.formattedDate,
            onOdemeMiktari: values.onOdemeMiktari,
          });
          return res.status(200).json({
            status: 'success',
            message: 'Anlaşma belgeniz başarıyla oluşturuldu!',
          });
        }
      } else {
        const { values, orderData } = req.body;
        const anlasmaBelgesiKodu = generateAnlasmaKodu(values.orderCode);

        const productCount = orderData?.Orders?.length ?? 1;
        const onOdemeMiktariAciklamasi = '';
        const step = 1.2;
        const stepName = 'Ön Ödeme Miktarı';
        const tedarikciAciklama = '';
        const tedarikciId = '';
        const tahminiTeslimTarihi = null;
        const onOdemeMiktari = values.onOdemeMiktari;
        const orderCode = values.orderCode;
        const anlasmaBelgesi = true;

        const stepOrderData = orderData.Orders;

        const products = generateProductData(
          productCount,
          {
            onOdemeMiktari,
            onOdemeMiktariAciklamasi,
            orderCode,
            step,
            stepName,
            tedarikciAciklama,
            tedarikciId,
            tahminiTeslimTarihi,
            anlasmaBelgesi,
          },
          stepOrderData
        );

        const response = await createNewDataMany('StepByStep', products);

        const isCreatedAnlasmaBelgesi = await getDataByUnique(
          'AnlasmaBelgesi',
          {
            orderCode: values.orderCode,
          }
        );

        // Eğer daha önce varsa, güncelleme yap.
        if (isCreatedAnlasmaBelgesi) {
          const updateAnlasmaBelgesi = await updateDataByAny(
            'AnlasmaBelgesi',
            {
              orderCode: values.orderCode,
            },
            {
              onOdemeMiktari: values.onOdemeMiktari,
            }
          );

          return res.status(200).json({
            status: 'success',
            message: 'Anlaşma belgeniz başarıyla güncellendi!',
          });
        }
        // eğer daha önce veri eklenmediyse, oluştur.
        else {
          const createAnlasmaBelgesi = await createNewData('AnlasmaBelgesi', {
            orderCode: values.orderCode,
            anlasmaBelgesiKodu: anlasmaBelgesiKodu,
            date: values.formattedDate,
            onOdemeMiktari: values.onOdemeMiktari,
          });
          return res.status(200).json({
            status: 'success',
            message: 'Anlaşma belgeniz başarıyla oluşturuldu!',
          });
        }
      }
    }

    if (req.method === 'GET') {
      const orderCode = req?.query?.orderCode;
      if (orderCode || (orderCode != null && orderCode?.length > 0)) {
        const response = await getDataByUnique('AnlasmaBelgesi', {
          orderCode: orderCode,
        });

        if (response?.length <= 0) {
          return res.status(200).json({
            status: 'success',
            data: {},
            message: 'Bu teklife ait veri bulunamadı!',
          });
        }

        return res.status(200).json({ status: 'success', data: response });
      }

      const response = await getDataByUnique('');

      //! SİLME KODU
      // const deleted = await deleteDataAll('AnlasmaBelgesi');
      // const updated = await updateDataByMany(
      //   'StepByStep',
      //   {
      //     orderCode: '212615ENESLJ57HG',
      //   },
      //   {
      //     anlasmaBelgesi: false,
      //   }
      // );
      // return res.status(200).json({
      //   status: 'success',
      //   message: deleted,
      // });
    } else {
      throw new Error('Invalid Method!');
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
