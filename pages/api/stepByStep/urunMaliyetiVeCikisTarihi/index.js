import {
  updateDataByAny,
  getDataByMany,
  createNewData,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { dates, step, stepName, tedarikciMaliyet, orderCode } = req.body;
      const allStepBySteps = await getDataByMany('StepByStep', {
        orderCode: orderCode,
      });

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;
      // Tüm güncelleme işlemlerini bir dizi içinde topla

      const updatePromises = allStepBySteps.map((item, index) => {
        const matchedDate = dates.find(
          (dateItem) => dateItem?.selectedOrdersId === item.orderId
        );

        if (matchedDate) {
          // Eğer `dates` array'inde tarih varsa, bu değerle güncelle
          const { selectedDate } = matchedDate;
          if (selectedDate != undefined) {
            const response = updateDataByAny(
              'StepByStep',
              { orderId: item.orderId },
              {
                urunCikisTarihi: new Date(selectedDate),
                step: item.step > step ? item.step : step,
                stepName: item.step > 5 ? item.stepName : 'Gümrük',
                tedarikciMaliyeti: parseFloat(
                  tedarikciMaliyet[index].selectedOrdersId ==
                    matchedDate.selectedOrdersId
                    ? tedarikciMaliyet[index].tedarikciMaliyeti
                    : 0
                ),
              }
            );
            return response;
          } else {
            // Eğer `dates` array'inde tarih yoksa, tarih alanını sıfırla
            let stepName = '';
            if (item.step == 5) stepName = 'Ürün Maliyeti ve Çıkış Tarihi';
            if (item.step < 5) stepName = item.stepName;
            if (item.step > 5) stepName = 'Ürün Maliyeti ve Çıkış Tarihi';
            return updateDataByAny(
              'StepByStep',
              { orderId: item.orderId },
              {
                urunCikisTarihi: null,
                gumruk: false,
                teslimEdildi: false,
                step: item.step >= 5 ? 5 : item.step,
                tedarikciMaliyeti: parseFloat(0),
                stepName: stepName,
              }
            );
          }
        } else {
          // Eğer `dates` array'inde tarih yoksa, tarih alanını sıfırla
          let stepName = '';
          if (item.step == 5) stepName = 'Ürün Maliyeti ve Çıkış Tarihi';
          if (item.step < 5) stepName = item.stepName;
          if (item.step > 5) stepName = 'Ürün Maliyeti ve Çıkış Tarihi';
          return updateDataByAny(
            'StepByStep',
            { orderId: item.orderId },
            {
              urunCikisTarihi: null,
              gumruk: false,
              teslimEdildi: false,
              step: item.step >= 5 ? 5 : item.step,
              stepName: stepName,
              tedarikciMaliyeti: parseFloat(0),
            }
          );
        }
      });

      // Tüm güncellemeleri paralel olarak gerçekleştirmek için Promise.all kullan
      await Promise.all(updatePromises);

      const responseLog = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 5,
        stepName: 'Ürün Maliyeti ve Çıkış Tarihi',
        orderCode: orderCode,
      });

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
