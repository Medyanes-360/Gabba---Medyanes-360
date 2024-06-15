import {
  updateDataByMany,
  updateDataByAny,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
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

      return res.status(200).json({
        message: 'Ürün/Ürünler gümrüğe başarıyla kaydedildi!',
        status: 'success',
      });
    } else if (req.method === 'PUT') {
      const { id } = req.body;
      const updated = await updateDataByAny(
        'StepByStep',
        {
          orderId: id,
        },
        {
          gumruk: false,
        }
      );
      console.log(updated);
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
