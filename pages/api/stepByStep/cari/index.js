import {
  createNewDataMany,
  getDataByMany,
  updateDataByMany,
} from '@/services/serviceOperations';

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
        orderCode,
        step,
        stepName,
        productCount,
        tedarikciAciklama,
        tedarikciId,
        orderData,
      } = req.body;

      // Daha önce bu teklife ait veri eklenmiş mi bir bakıyoruz.
      const isExist = await getDataByMany('StepByStep', {
        orderCode: orderCode,
      });

      if (!isExist || isExist == null) {
        // Daha önce bu teklif ile ilgili veri eklenmediyse oluşturuyoruz.

        // Ürün verilerini oluştur
        const products = generateProductData(
          productCount,
          {
            onOdemeMiktari,
            orderCode,
            step,
            stepName,
            tedarikciAciklama,
            tedarikciId,
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
            id: isExist.id,
          },
          {
            onOdemeMiktari: onOdemeMiktari,
          }
        );

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
