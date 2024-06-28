import {
  getDataByManyV2,
  getDataByMany,
  updateDataByAny,
  createNewData,
  getDataByUniqueMany,
  deleteDataAll,
} from '@/services/serviceOperations';
import { getToken } from 'next-auth/jwt';

const handler = async (req, res) => {
  function generateTeslimKod(orderCode, teslimNo) {
    let teslimTutanagiKodu = 'TESLIM-';
    const date = new Date();
    teslimTutanagiKodu += date.getUTCFullYear();
    teslimTutanagiKodu += '-' + orderCode;
    teslimTutanagiKodu += '-' + teslimNo;

    return teslimTutanagiKodu;
  }

  try {
    if (req.method === 'POST') {
      const { matchedData, indirimOrani, kdvliFirma, kdvOrani, date } =
        req.body;

      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      const teslimTutanaklari = await getDataByUniqueMany('TeslimTutanagi', {
        orderCode: matchedData[0].orderCode,
      });

      const highestTeslimTutanagiNo = await getDataByManyV2('TeslimTutanagi', {
        orderBy: {
          teslimTutanagiNo: 'desc',
        },
        take: 1,
        select: {
          teslimTutanagiNo: true,
        },
      });

      if (teslimTutanaklari?.length > 0) {
        // Veritabanında bir değer var demektir.
        console.log('teslimTutanagiNooooo: ', highestTeslimTutanagiNo);
        const teslimTutanagiNo = highestTeslimTutanagiNo[0].teslimTutanagiNo;
        const teslimTutanagiKodu = generateTeslimKod(
          matchedData[0].orderCode,
          teslimTutanagiNo + 1
        );

        const createPromise = matchedData.map((item) => {
          createNewData('TeslimTutanagi', {
            teslimTutanagiKodu: teslimTutanagiKodu,
            orderCode: item.orderCode,
            orderId: item.orderId,
            indirimOrani: parseInt(indirimOrani),
            kdvliFirma: kdvliFirma,
            kdvOrani: parseInt(kdvOrani),
            teslimTutanagiNo: parseInt(teslimTutanagiNo),
            date: String(date),
          });
        });
        await Promise.all(createPromise);

        const updatedPromises = matchedData.map((item) =>
          updateDataByAny(
            'StepByStep',
            {
              orderCode: item.orderCode,
              orderId: item.orderId,
            },
            {
              step: 7.2,
              teslimTutanagi: true,
              teslimTutanagiKodu: teslimTutanagiKodu,
              teslimTutanagiNo: teslimTutanagiNo + 1,
            }
          )
        );
        await Promise.all(updatedPromises);

        return res.status(200).json({ status: 'success', message: 'YES!' });
      } else {
        // Veritabanında şu an hiçbir değer yok.
        const teslimTutanagiNo = 1;
        const teslimTutanagiKodu = generateTeslimKod(
          matchedData[0].orderCode,
          1
        );

        const createPromise = matchedData.map((item) => {
          createNewData('TeslimTutanagi', {
            teslimTutanagiKodu: teslimTutanagiKodu,
            orderCode: item.orderCode,
            orderId: item.orderId,
            indirimOrani: parseInt(indirimOrani),
            kdvliFirma: kdvliFirma,
            kdvOrani: parseInt(kdvOrani),
            teslimTutanagiNo: teslimTutanagiNo,
            date: String(date),
          });
        });
        await Promise.all(createPromise);

        const updatedPromises = matchedData.map((item) =>
          updateDataByAny(
            'StepByStep',
            {
              orderCode: item.orderCode,
              orderId: item.orderId,
            },
            {
              step: 7.2,
              teslimTutanagi: true,
              teslimTutanagiKodu: teslimTutanagiKodu,
              teslimTutanagiNo: teslimTutanagiNo,
            }
          )
        );
        await Promise.all(updatedPromises);

        return res.status(200).json({ status: 'success', message: 'YES!' });
      }
    } else if (req.method === 'GET') {
      const orderCode = req?.query?.orderCode;
      const teslimTutanagiKodu = req?.query?.teslimTutanagiKodu;

      if (
        teslimTutanagiKodu ||
        (teslimTutanagiKodu != null && teslimTutanagiKodu?.length > 0)
      ) {
        const response = await getDataByMany('TeslimTutanagi', {
          teslimTutanagiKodu: teslimTutanagiKodu,
        });
        if (response?.length <= 0) {
          return res.status(200).json({
            status: 'success',
            data: {},
            message: 'Bu teklife ait teslim tutanağı bulunamadı!',
          });
        }

        return res.status(200).json({ status: 'success', data: response });
      } else if (orderCode || (orderCode != null && orderCode?.length > 0)) {
        const response = await getDataByMany('TeslimTutanagi', {
          orderCode: orderCode,
        });
        if (response?.length <= 0) {
          return res.status(200).json({
            status: 'success',
            data: {},
            message: 'Bu teklife ait teslim tutanağı bulunamadı!',
          });
        }

        return res.status(200).json({ status: 'success', data: response });
      } else {
        throw new Error('Geçersiz teklif isteği yapıldı!');
      }
    }
    // else if (req.method === 'GET') {
    //   const response = await deleteDataAll('TeslimTutanagi');
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
