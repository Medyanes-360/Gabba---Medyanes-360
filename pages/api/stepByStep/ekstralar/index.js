import {
  createNewDataMany,
  deleteDataByMany,
  getAllData,
  getDataByMany,
  updateDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { orderCode, extras, step, stepName } = req.body;

      // Toplam fiyatı hesapla
      const totalPrice = extras.reduce(
        (sum, extra) => sum + parseFloat(extra.price),
        0
      );

      // Daha önce bu teklife ait veri eklenmiş mi bir bakıyoruz.
      const isExist = await getDataByMany('StepByStep', {
        orderCode: orderCode,
      });

      // Eğer daha önce veritabanında varsa bu verileri siliyoruz ve tekrar ekliyoruz!
      if (isExist) {
        const deleteAll = await deleteDataByMany('StepByStepEkstralar', {
          orderCode: orderCode,
        });

        const response = await createNewDataMany('StepByStepEkstralar', extras);

        if (response.error || response == null) {
          throw new Error(
            'Ekstra verileri eklenirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz!'
          );
        }

        const updated = await updateDataByMany(
          'StepByStep',
          {
            orderCode: orderCode,
          },
          {
            step: step,
            stepName: stepName,
            ekstraUcretTotal: totalPrice,
          }
        );

        if (updated.error || updated == null) {
          throw new Error(
            'Ekstra verileri eklenirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz! [KX1A]'
          );
        }

        return res
          .status(200)
          .json({ message: 'Tebrikler!', status: 'success' });
      } else {
        const response = await createNewDataMany('StepByStepEkstralar', extras);

        if (response.error || response == null) {
          throw new Error(
            'Ekstra verileri eklenirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz!'
          );
        }

        const updated = await updateDataByMany(
          'StepByStep',
          {
            orderCode: orderCode,
          },
          {
            step: step,
            stepName: stepName,
            ekstraUcretTotal: totalPrice,
          }
        );

        if (updated.error || updated == null) {
          throw new Error(
            'Ekstra verileri eklenirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz! [KX1A]'
          );
        }

        return res
          .status(200)
          .json({ message: 'Tebrikler!', status: 'success' });
      }
    } else if (req.method === 'GET') {
      const orderCode = req?.query?.orderCode;
      const response = await getDataByMany('StepByStepEkstralar', {
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
    } else if (req.method === 'DELETE') {
      const id = req.body;
      const response = await deleteDataByMany('StepByStepEkstralar', {
        orderCode: id,
      });

      return res
        .status(200)
        .json({ status: 'success', message: 'Silme işleminiz başarılı!' });
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
