import {
  createNewDataMany,
  getDataByMany,
  updateDataByAny,
  createNewData,
  getDataByUniqueMany,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { orderCode, step, stepName, checked } = req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      const entries = Object.keys(checked).map((key) => ({
        id: key,
        value: checked[key].value,
      }));

      for (const item of entries) {
        try {
          // Log ekleme işlemi
          await createNewData('Logs', {
            role: userRole,
            userId: userId,
            step: item.value === true ? step : 8,
            teslimEdildi: item.value,
            orderId: item.id,
            stepName:
              item.value === true
                ? stepName
                : 'Ürünlerin Bir Kısmı Teslim Edildi',
            orderCode: orderCode,
          });

          // Güncelleme işlemi
          await updateDataByAny(
            'StepByStep',
            {
              orderId: item.id,
            },
            {
              step: item.value === true ? step : 8,
              stepName:
                item.value === true
                  ? stepName
                  : 'Ürünlerin Bir Kısmı Teslim Edildi',
              teslimEdildi: item.value,
            }
          );
        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          throw error;
        }
      }

      return res
        .status(200)
        .json({ status: 'success', message: 'Tebrikler, veri oluştu. :)' });
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
