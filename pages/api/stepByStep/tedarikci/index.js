import {
  createNewDataMany,
  getDataByUnique,
  updateDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { tedarikciId, tedarikciAciklama, id, stepName, step } = req.body;
      const response = await updateDataByMany(
        'StepByStep',
        {
          orderId: id,
        },
        {
          tedarikciId: tedarikciId,
          tedarikciAciklama: tedarikciAciklama,
          stepName: stepName,
          step: step,
        }
      );

      console.log(response);

      if (response.error || response == null) {
        throw new Error(
          'Tedarikçi seçilirken bir hata oluştu, lütfen yetkili bir kişi ile iletişime geçiniz!'
        );
      }

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
