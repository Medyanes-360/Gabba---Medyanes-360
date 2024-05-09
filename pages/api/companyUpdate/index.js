import {
  updateDataByAny,
  updateDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  const data = req.body;
  try {
    if (req.method === 'PUT') {
      const financialManagementSpecial = await updateDataByAny(
        'Company',
        {
          id: data.id,
        },
        { status: true }
      );

      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }

      // Tüm şirketlerin durumunu "false" olarak güncelle
      const updateAllCompanies = await updateDataByMany(
        'Company',
        { id: { not: data.id } }, // Aktif şirketin dışındaki tüm şirketleri seç
        { status: false }
      );

      if (!updateAllCompanies || updateAllCompanies.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY5';
      }

      // Tüm mağazaların firma bilgisini güncelle
      const updateAllStores = await updateDataByMany(
        'Store',
        {},
        {
          companyId: data.id,
        }
      );

      if (!updateAllStores || updateAllStores.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY6';
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
