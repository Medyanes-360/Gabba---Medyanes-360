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

      const updatePromises = entries.map((item) => {
        return updateDataByAny(
          'StepByStep',
          {
            orderId: item.id,
          },
          {
            step: step,
            stepName: stepName,
            teslimEdildi: item.value,
          }
        );
      });

      await Promise.all(updatePromises);

      console.log(updatePromises);

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
