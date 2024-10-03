import { updateDataByMany, createNewData } from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { orderCode, step, stepName } = req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      const responseUpdate = updateDataByMany(
        'StepByStep',
        {
          orderCode: orderCode,
        },
        {
          step: step,
          stepName: stepName,
        }
      );

      const responseLog = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 10,
        stepName: 'İşlem Sonu Cari Kontrol',
        orderCode: orderCode,
      });

      return res.status(200).json({
        status: 'success',
        message:
          'Tebrikler, bütün işlemleri başarıyla tamamladınız. Sipariş durumunu güncellemeyi unutmayın!',
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
