import { getDataByMany, updateDataByAny } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { dates, step, stepName, orderCode } = req.body;
      const allStepBySteps = await getDataByMany('StepByStep', {
        orderCode: orderCode,
      });

      dates.map((item) => {
        const isoDate = item.selectedDate
          ? new Date(item.selectedDate).toISOString()
          : undefined;
        return {
          selectedDate: isoDate,
          selectedOrdersId: item.selectedOrdersId,
        };
      });

      // Tüm güncelleme işlemlerini bir dizi içinde topla
      const updatePromises = allStepBySteps.map((item) => {
        const matchedDate = dates.find(
          (dateItem) => dateItem?.selectedOrdersId === item.orderId
        );

        if (matchedDate) {
          // Eğer `dates` array'inde tarih varsa, bu değerle güncelle
          const { selectedDate } = matchedDate;
          if (selectedDate != undefined) {
            return updateDataByAny(
              'StepByStep',
              { orderId: item.orderId },
              {
                tedarikciYuklemeTarihi: new Date(selectedDate),
                step: item.step > step ? item.step : step,
                stepName:
                  item.step > 3
                    ? item.stepName
                    : 'Ürün Maliyeti ve Çıkış Tarihi',
              }
            );
          } else {
            // Eğer `dates` array'inde tarih yoksa, tarih alanını sıfırla
            let stepName = '';
            if (item.step == 3) stepName = 'Tedarikçi Yükleme Tarihi';
            if (item.step < 3) stepName = item.stepName;
            if (item.step > 3) stepName = 'Tedarikçi Yükleme Tarihi';
            return updateDataByAny(
              'StepByStep',
              { orderId: item.orderId },
              {
                tedarikciYuklemeTarihi: null,
                urunCikisTarihi: null,
                step: item.step >= 3 ? 3 : item.step,
                stepName: stepName,
              }
            );
          }
        } else {
          // Eğer `dates` array'inde tarih yoksa, tarih alanını sıfırla
          let stepName = '';
          if (item.step == 3) stepName = 'Tedarikçi Yükleme Tarihi';
          if (item.step < 3) stepName = item.stepName;
          if (item.step > 3) stepName = 'Tedarikçi Yükleme Tarihi';
          return updateDataByAny(
            'StepByStep',
            { orderId: item.orderId },
            {
              tedarikciYuklemeTarihi: null,
              urunCikisTarihi: null,
              step: item.step >= 3 ? 3 : item.step,
              stepName: stepName,
            }
          );
        }
      });

      // Tüm güncellemeleri paralel olarak gerçekleştirmek için Promise.all kullan
      await Promise.all(updatePromises);
      return res.status(200).json({
        message: 'İşlem başarıyla gerçekleştirildi!',
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
