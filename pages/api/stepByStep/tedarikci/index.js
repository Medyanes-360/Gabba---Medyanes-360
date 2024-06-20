import {
  getDataByMany,
  updateDataByAny,
  createNewData,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { tedarikciId, tedarikciAciklama, id, stepName, step } = req.body;
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      const allStepBySteps = await getDataByMany('StepByStep', {
        orderCode: id,
      });

      // Tüm güncelleme işlemlerini bir dizi içinde topla
      const updatePromises = allStepBySteps.map((item) => {
        return updateDataByAny(
          'StepByStep',
          { orderId: item.orderId },
          {
            tedarikciId: tedarikciId,
            tedarikciAciklama: tedarikciAciklama,
            step: item.step > step ? item.step : step,
            stepName:
              item.step > 2 ? item.stepName : 'Tedarikçi Yükleme Tarihi',
          }
        );
      });

      // Tüm güncellemeleri paralel olarak gerçekleştirmek için Promise.all kullan
      await Promise.all(updatePromises);

      if (updatePromises.error || updatePromises == null) {
        throw new Error(
          'Tedarikçi seçilirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz!'
        );
      }

      const responseLog = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 2,
        stepName: 'Tedarikçi Seç',
        orderCode: id,
        tedarikciId: tedarikciId,
        tedarikciAciklama: tedarikciAciklama,
      });

      return res.status(200).json({
        message: 'Tedarikçi seçiminiz başarıyla kaydedildi!',
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
