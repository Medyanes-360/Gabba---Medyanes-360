import {
  updateDataByMany,
  updateDataByAny,
  createNewData,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const userRole = token && token?.user?.role;
    const userId = token && token?.user?.id;
    if (req.method === 'POST') {
      const { step, stepName, orderCode, checked } = req.body;

      const selectedOrderIds = Object.keys(checked).filter(
        (orderId) => checked[orderId]
      );

      // Seçilen ürünlerin `gumruk` alanını true yap
      if (selectedOrderIds?.length > 0) {
        await updateDataByMany(
          'StepByStep',
          {
            orderId: { in: selectedOrderIds },
          },
          {
            step: step,
            stepName: stepName,
            gumruk: true,
          }
        );
      }

      // Seçilmeyen ürünlerin `gumruk` alanını false yap
      await updateDataByMany(
        'StepByStep',
        {
          orderCode: orderCode,
          orderId: { notIn: selectedOrderIds },
        },
        {
          gumruk: false, // Seçilmeyenler için gumruk false
        }
      );

      const responseLog = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 6,
        stepName: 'Gümrük',
        orderCode: orderCode,
      });

      return res.status(200).json({
        message: 'Ürün/Ürünler gümrüğe başarıyla kaydedildi!',
        status: 'success',
      });
    } else if (req.method === 'PUT') {
      const { item, orderCode } = req.body;
      const updated = await updateDataByAny(
        'StepByStep',
        {
          orderId: item.id,
        },
        {
          step: 6,
          stepName: 'Gümrük',
          gumruk: false,
        }
      );

      const responseLog = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 6,
        stepName: 'Gümrük',
        orderCode: orderCode,
      });

      return res
        .status(200)
        .json({ status: 'success', message: 'Gümrük veriniz silindi!' });
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
