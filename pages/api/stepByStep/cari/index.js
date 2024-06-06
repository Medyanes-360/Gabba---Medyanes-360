import {
  createNewDataMany,
  getDataByUnique,
  updateDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  // Ürün verilerini dinamik olarak oluşturma fonksiyonu
  function generateProductData(count, commonData) {
    const productDataArray = [];

    for (let i = 0; i < count; i++) {
      productDataArray.push({ ...commonData });
    }

    return productDataArray;
  }

  try {
    if (req.method === 'POST') {
      const {
        onOdemeMiktari,
        orderId,
        step,
        stepName,
        productCount,
        tedarikciAciklama,
        tedarikciId,
      } = req.body;

      // Daha önce bu teklife ait veri eklenmiş mi bir bakıyoruz.
      const isExist = await getDataByUnique('StepByStep', {
        orderId: orderId,
      });

      if (!isExist || isExist == null) {
        // Daha önce bu teklif ile ilgili veri eklenmediyse oluşturuyoruz.

        // Ürün verilerini oluştur
        const products = generateProductData(productCount, {
          onOdemeMiktari,
          orderId,
          step,
          stepName,
          tedarikciAciklama,
          tedarikciId,
        });

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
        const updateCari = await updateDataByMany(
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
