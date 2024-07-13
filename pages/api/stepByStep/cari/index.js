import {
  createNewDataMany,
  getDataByMany,
  updateDataByMany,
  createNewData,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
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
      const {
        onOdemeMiktari,
        onOdemeMiktariAciklamasi,
        tahminiTeslimTarihi,
        orderCode,
        step,
        stepName,
        productCount,
        tedarikciAciklama,
        tedarikciId,
        orderData,
      } = req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      // Daha önce bu teklife ait veri eklenmiş mi bir bakıyoruz.
      const isExist = await getDataByMany('StepByStep', {
        orderCode: orderCode,
      });

      if (!isExist || isExist == null || isExist?.length == 0) {
        // Daha önce bu teklif ile ilgili veri eklenmediyse oluşturuyoruz.
        // Ürün verilerini oluştur
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
          },
          orderData
        );

        const response = await createNewDataMany('StepByStep', products);
        // Cari eklenirken hata çıkarsa, kullanıcıyı bildiriyoruz.
        if (response.error || response == null) {
          throw new Error(
            'Ön ödeme miktari eklenirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz!'
          );
        }

        const responseLog = await createNewData('Logs', {
          role: userRole,
          userId: userId,
          step: 1.2,
          stepName: 'Ön Ödeme Miktarı',
          orderCode: orderCode,
        });

        return res.status(200).json({
          message: 'Ön ödeme miktarınız başarıyla kaydedildi!',
          status: 'success',
        });
      }

      if (isExist) {
        // Eğer teklif zaten varsa ve cari değeri tekrar gelirse, bu veriyi güncelliyoruz.
        await updateDataByMany(
          'StepByStep',
          {
            orderCode: isExist[0].orderCode,
          },
          {
            onOdemeMiktari: onOdemeMiktari,
            onOdemeMiktariAciklamasi: onOdemeMiktariAciklamasi,
            tahminiTeslimTarihi: tahminiTeslimTarihi,
            step: isExist[0].step == 1.2 ? 2 : isExist[0].step,
          }
        );

        const responseLog = await createNewData('Logs', {
          role: userRole,
          userId: userId,
          step: 1.2,
          stepName: 'Ön Ödeme Miktarı',
          orderCode: orderCode,
          onOdemeMiktari: onOdemeMiktari,
          onOdemeMiktariAciklamasi: onOdemeMiktariAciklamasi,
        });

        return res.status(200).json({
          message: 'Ön ödeme miktari güncellenmiştir.',
          status: 'success',
        });
      }
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
