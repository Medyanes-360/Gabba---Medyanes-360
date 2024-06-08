import { updateDataByAny } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { dates, tedarikciMaliyet, step, stepName } = req.body;

      // Tüm güncelleme işlemlerini bir dizi içinde topla
      const updatePromises = dates.map((item) => {
        const { selectedDate, selectedOrdersId } = item;
        const filtered = tedarikciMaliyet.filter(
          (data) => data.selectedOrdersId === selectedOrdersId
        );

        return updateDataByAny(
          'StepByStep',
          {
            orderId: selectedOrdersId,
          },
          {
            urunCikisTarihi: selectedDate,
            tedarikciMaliyeti: parseFloat(filtered[0].tedarikciMaliyeti),
            step: step,
            stepName: stepName,
          }
        );
      });

      // Tüm güncellemeleri paralel olarak gerçekleştirmek için Promise.all kullan
      await Promise.all(updatePromises);

      return res.status(200).json({
        message: 'Ürün maliyeti ve çıkış tarihi başarıyla kaydedildi!',
        status: 'success',
      });
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
