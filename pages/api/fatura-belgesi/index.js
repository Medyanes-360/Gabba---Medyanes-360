import { createNewData, getDataByUnique } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const faturaNo = req?.query?.faturaNo;
      const faturaBelgesi = await getDataByUnique('FaturaBelgesi', {
        faturaNo: faturaNo,
      });
      if (!faturaBelgesi || faturaBelgesi.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: faturaBelgesi,
        message: faturaBelgesi.message,
      });
    } else if (req.method === 'POST') {
      const { date, faturaNo } = req.body;

      const existingFatura = await getDataByUnique('FaturaBelgesi', {
        faturaNo: faturaNo,
      });

      if (!existingFatura) {
        const createdFaturaBelgesi = await createNewData('FaturaBelgesi', {
          date: date,
          faturaNo: faturaNo,
        });

        if (!createdFaturaBelgesi || createdFaturaBelgesi.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
        }

        return res.status(200).json({
          status: 'success',
          data: createdFaturaBelgesi,
          message: createdFaturaBelgesi.message,
        });
      }
      return res
        .status(200)
        .json({ status: 'success', message: 'Fatura bilgisi zaten kayıtlı!' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
