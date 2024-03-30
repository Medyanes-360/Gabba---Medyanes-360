import { getAllData } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const customerData = await getAllData('Customer');
      if (!customerData || customerData.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: customerData,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
