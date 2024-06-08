import { updateDataByAny } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { step, stepName, orderCode } = req.body;

      const response = await updateDataByAny(
        'StepByStep',
        {
          orderCode: orderCode,
        },
        {
          step: step,
          stepName: stepName,
        }
      );

      return res.status(200).json({
        message: 'Ürün/Ürünler gümrüğe başarıyla kaydedildi!',
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
