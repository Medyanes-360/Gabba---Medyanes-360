import { deleteDataAll, getDataByMany } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const orderId = req?.query?.orderId;
      if (orderId || (orderId != null && orderId?.length > 0)) {
        const response = await getDataByMany('StepByStep', {
          orderId: orderId,
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
    }
    // if (req.method === 'GET') {
    //   const response = await deleteDataAll('StepByStep');
    //   console.log(response);
    //   return res.status(200).json({ status: 'success', message: 'Silindi!' });
    // }
    else {
      throw new Error('Invalid Method!');
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
