'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getAPI, postAPI } from '@/services/fetchAPI';
import {
  useOrderDataContext,
  useStepByStepDataContext,
  useLoadingContext,
} from '@/app/(StepsLayout)/layout';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [checked, setChecked] = useState(true);

  const { isLoading, setIsLoading } = useLoadingContext();
  const { orderData, cariPaymentTotalAmount } = useOrderDataContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const finishStepByStep = async () => {
    if (!checked)
      return toast.error('Tüm ürünler teslim edildi seçildiğinden emin olun!');
    const isConfirmed = confirm(
      'Tüm ürünler teslim edildiğinden emin misiniz?'
    );
    if (isConfirmed) {
      setIsLoading(true);
      const response = await postAPI('/stepByStep/final', {
        orderCode: id,
        step: 10,
        stepName: 'Sipariş Durumu',
      });

      if (response.error || !response) {
        toast.error(response.message);
        return setIsLoading(false);
      } else {
        toast.success(response.message);
        const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
        setStepByStepData(response2.data);
        router.push(`/stepbystep/${id}/siparis-durumu`);
        return setIsLoading(false);
      }
    }
  };

  return (
    <div className={'h-full w-full flex gap-4 items-center justify-center'}>
      <div class='flex flex-col w-full max-w-4xl gap-4 border rounded p-4'>
        {/* Müşteri Bilgisi */}
        <div className='bg-slate-600 text-white shadow-lg p-5 rounded-lg mt-5'>
          <p className='text-center mb-3 font-semibold'>
            - {orderData && orderData.Müşteri && orderData.Müşteri[0]?.name}{' '}
            {orderData && orderData?.Müşteri && orderData.Müşteri[0]?.surname} -
          </p>
          <table className='w-full text-center'>
            <thead>
              <tr>
                <th className='py-2 px-4'>Oluşturulma Tarihi</th>
                <th className='py-2 px-4'>Firma İsmi</th>
                <th className='py-2 px-4'>Ürün Adedi</th>
                <th className='py-2 px-4'>Fiyat</th>
                <th className='py-2 px-4'>Ödenen Tutar</th>
                <th className='py-2 px-4'>Kalan Borcu</th>
                <th className='py-2 px-4'>Bekleyen Ürün</th>
                <th className='py-2 px-4'>Teslim Edilen Ürün</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {orderData &&
                    orderData?.Orders &&
                    orderData?.Orders?.map(
                      (orders, index) =>
                        index == 0 &&
                        orders.createdAt
                          .split('T')[0]
                          .split('-')
                          .reverse()
                          .join('.')
                    )}
                </td>
                <td>
                  {orderData &&
                    orderData?.Müşteri &&
                    orderData.Müşteri[0]?.company_name}
                </td>
                <td>
                  {orderData && orderData?.Orders && orderData.Orders.length}
                </td>
                <td>
                  {orderData &&
                    orderData?.Orders &&
                    orderData.Orders.reduce((total, order) => {
                      return (
                        total +
                        (order.productPrice + order.productFeaturePrice) *
                          order.stock
                      );
                    }, 0)}
                </td>
                <td>
                  {stepByStepData &&
                    (stepByStepData[0]?.onOdemeMiktari ?? 0) +
                      cariPaymentTotalAmount}
                </td>
                <td>
                  {orderData ? (
                    <>
                      {stepByStepData ? (
                        <>
                          {(() => {
                            const totalAmount = orderData.Orders?.reduce(
                              (total, order) => {
                                return (
                                  total +
                                  (order.productPrice +
                                    order.productFeaturePrice) *
                                    order.stock
                                );
                              },
                              0
                            );
                            const paidAmount =
                              stepByStepData[0]?.onOdemeMiktari ?? 0;
                            return (
                              totalAmount +
                              stepByStepData[0]?.ekstraUcretTotal -
                              (paidAmount + cariPaymentTotalAmount)
                            );
                          })()}
                        </>
                      ) : (
                        'Step by step data bulunamadı.'
                      )}
                    </>
                  ) : (
                    'Order data bulunamadı.'
                  )}
                </td>
                <td>
                  {(stepByStepData &&
                    stepByStepData?.length > 0 &&
                    stepByStepData?.filter(
                      (item) => item.teslimEdildi === false
                    ).length) ||
                    0}
                </td>
                <td>
                  {(stepByStepData &&
                    stepByStepData?.length > 0 &&
                    stepByStepData?.filter((item) => item.teslimEdildi === true)
                      .length) ||
                    0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className={
            'w-full flex flex-col items-center justify-between p-2 rounded gap-3'
          }
        >
          <div className='flex gap-2 items-center'>
            <Label>Tüm Ürünler Teslim Edildi mi ?</Label>
            <Checkbox
              checked={checked}
              onCheckedChange={(val) => setChecked(val)}
            />
          </div>
          <Button
            onClick={() => finishStepByStep()}
            className={!checked && 'cursor-not-allowed'}
            disabled={!checked}
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
