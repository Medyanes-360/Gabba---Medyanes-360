import {
  createNewData,
  deleteDataAll,
  deleteDataByMany,
  getAllData,
  updateDataByMany,
} from '@/services/serviceOperations';

const handleDelete = async (req) => {
  let data = {};

  if (req.body.type === 'one') {
    data = await deleteDataByMany('Company', {
      id: {
        equals: req.body.id,
      },
    });
  }

  if (req.body.type === 'selected') {
    data = await deleteDataByMany('Company', {
      id: {
        in: req.body.ids,
      },
    });
  }

  if (req.body.type === 'all') {
    data = await deleteDataAll('Company');
  }

  if (!data || data.error) {
    throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
  }
  return {
    status: 'success',
    data: data,
    message: data.message,
  };
};

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const financialManagementSpecial = await getAllData('Company');
      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    } else if (req.method === 'DELETE') {
      const result = await handleDelete(req);
      return res.status(200).json(result);
    } else if (req.method === 'PUT') {
      req.body.newData.kdvOrani = parseFloat(req.body.newData.kdvOrani);
      const financialManagementSpecial = await updateDataByMany(
        'Company',
        {
          id: req.body.id,
        },
        req.body.newData
      );
      console.log(financialManagementSpecial);

      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    } else if (req.method === 'DELETE') {
      const result = await handleDelete(req);
      return res.status(200).json(result);
    } else if (req.method === 'POST') {
      req.body.newData.kdvOrani = parseFloat(req.body.newData.kdvOrani);
      req.body.newData.status = false;
      const financialManagementSpecial = await createNewData('Company', {
        ...req.body.newData,
      });
      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
