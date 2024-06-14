import { getDataByUniqueMany } from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  //getServerSession:  Kullanıcının oturum açıp açmadığını kontrol eder. Eğer açılmışsa session değişkenine atar.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.method === 'GET') {
    try {
      const orderCode = req?.query?.orderCode;
      if (orderCode || (orderCode != null && orderCode?.length > 0)) {
        const response = await getDataByUniqueMany('Logs', {
          orderCode: orderCode,
        });

        if (response?.length <= 0) {
          return res.status(200).json({
            status: 'success',
            data: {},
            message: 'Bu teklife ait log bulunamadı!',
          });
        }

        return res.status(200).json({ status: 'success', data: response });
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  } else {
    return res.status(405).json({
      status: 'error',
      message: 'hatalı bir istek gerçekleştirdiniz.',
    });
  }
};

export default handler;
