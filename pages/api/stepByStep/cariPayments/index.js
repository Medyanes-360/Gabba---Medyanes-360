import {
  createNewDataMany,
  getDataByMany,
  updateDataByMany,
  createNewData,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { odemeMiktari, odemeMiktariAciklamasi, orderCode } = req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      const response = await createNewData('StepByStepCariPayments', {
        odemeMiktari: odemeMiktari,
        odemeMiktariAciklamasi: odemeMiktariAciklamasi,
        orderCode: orderCode,
      });

      return res.status(200).json({ status: 'success', data: response });
    } else if (req.method === 'GET') {
      const orderCode = req?.query?.orderCode;
      if (orderCode || (orderCode != null && orderCode?.length > 0)) {
        const response = await getDataByMany('StepByStepCariPayments', {
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
      } else {
        throw new Error('Geçersiz teklif isteği yapıldı!');
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
