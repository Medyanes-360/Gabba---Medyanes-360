import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useLoadingContext } from '@/app/(StepsLayout)/layout';

const AddCariPayment = ({
  orderData,
  stepByStepData,
  id,
  setCariPayments,
  cariPayments,
  getCariPayments,
  cariPaymentTotalAmount,
}) => {
  const { isLoading, setIsLoading } = useLoadingContext();
  const [initialValues, setOnitialValues] = useState({
    odemeMiktari: '',
    odemeMiktariAciklamasi: '',
    orderCode: id,
  });
  console.log(cariPayments);
  return (
    <>
      <div className='w-full flex p-2 mt-2'>
        <div className='flex items-center justify-end w-full text-gray-600 py-2'>
          <AlertDialog className='max-w-xl'>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                className='bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white transition-all duration-200 ease-in-out w-full'
              >
                Cari Kontrol ve Ek İşlemler
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='max-w-4xl h-[650px] overflow-y-scroll'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-center'>
                  Cari Ek Ödeme
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {/* Müşteri Bilgisi */}
                  <div className='bg-white shadow p-3'>
                    <p className='text-center mb-3 font-semibold'>
                      -{' '}
                      {orderData &&
                        orderData.Müşteri &&
                        orderData.Müşteri[0]?.name}{' '}
                      {orderData &&
                        orderData?.Müşteri &&
                        orderData.Müşteri[0]?.surname}{' '}
                      -
                    </p>
                    <table className='w-full text-center'>
                      <thead>
                        <tr>
                          <th>Oluşturulma Tarihi</th>
                          <th>Firma İsmi</th>
                          <th>Ürün Adedi</th>
                          <th>Fiyat</th>
                          <th>Ödenen Tutar</th>
                          <th>Kalan Borcu</th>
                          <th>Bekleyen Ürün</th>
                          <th>Teslim Edilen Ürün</th>
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
                            {orderData &&
                              orderData?.Orders &&
                              orderData.Orders.length}
                          </td>
                          <td>
                            {orderData &&
                              orderData?.Orders &&
                              orderData.Orders.reduce((total, order) => {
                                return (
                                  total +
                                  (order.productPrice +
                                    order.productFeaturePrice) *
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
                                      const totalAmount =
                                        orderData.Orders?.reduce(
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
                                        totalAmount -
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
                              stepByStepData?.filter(
                                (item) => item.teslimEdildi === true
                              ).length) ||
                              0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Ödeme İnputları */}
                  <div className='bg-white shadow p-3 mt-3'>
                    <table className='w-full text-center'>
                      <thead>
                        <tr>
                          <th>Ödeme Yapılan Tarih</th>
                          <th>Ödeme Ücreti</th>
                          <th>Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className='border-b border-t'>
                          <td>
                            {stepByStepData &&
                              (stepByStepData[0]?.createdAt ?? '')}
                          </td>
                          <td>
                            {stepByStepData &&
                              (stepByStepData[0]?.onOdemeMiktari ?? 0)}
                          </td>
                          <td>
                            {stepByStepData &&
                              (stepByStepData[0]?.onOdemeMiktariAciklamasi ??
                                '')}
                          </td>
                        </tr>
                        {cariPayments &&
                          cariPayments.map((item) => (
                            <tr className='border-t'>
                              <td>{item.createdAt}</td>
                              <td>{item.odemeMiktari}</td>
                              <td>{item.odemeMiktariAciklamasi}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                      if (values.odemeMiktari <= 0) {
                        return toast.error(
                          'Cariye işlenecek ödeme miktarı 0 veya negatif değer olamaz!'
                        );
                      }

                      if (values.odemeMiktariAciklamasi.length <= 0) {
                        return toast.error(
                          'Cariye işlenecek ödeme miktarı açıklaması boş olamaz.'
                        );
                      }

                      const isConfirmed = confirm(
                        'Cari eklemek istediğinize emin misiniz?'
                      );

                      if (isConfirmed) {
                        setIsLoading(true);
                        const response = await postAPI(
                          '/stepByStep/cariPayments',
                          values
                        );

                        if (response.error || !response) {
                          toast.error(response.message);
                          return setIsLoading(false);
                        } else {
                          setOnitialValues({
                            odemeMiktari: '',
                            odemeMiktariAciklamasi: '',
                            orderCode: id,
                          });
                          toast.success(response.message);
                          getCariPayments();
                          return setIsLoading(false);
                        }
                      }
                    }}
                  >
                    {(props) => (
                      <Form
                        onSubmit={props.handleSubmit}
                        className='flex flex-col gap-4 mt-12 justify-center items-center'
                      >
                        <Label className={'text-xs'}>
                          Açıklama: Müşteriden alınan ödeme miktarını burada
                          giriniz.
                        </Label>
                        <Label>Cariye İşlenecek Ödeme Miktarı</Label>
                        <div className='flex justify-center gap-2 items-center w-1/2'>
                          <Input
                            name='odemeMiktari'
                            onChange={props.handleChange}
                            type={'number'}
                            placeholder={'0'}
                            min={0}
                            value={props.values.odemeMiktari}
                          />
                        </div>
                        <div className='flex gap-2 items-center w-1/2'>
                          <Input
                            name='odemeMiktariAciklamasi'
                            onChange={props.handleChange}
                            type={'text'}
                            placeholder={'Açıklama Ekleyiniz...'}
                            value={props.values.odemeMiktariAciklamasi}
                          />
                        </div>
                        <Button type='submit'>Cariye işle</Button>
                      </Form>
                    )}
                  </Formik>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Kapat</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default AddCariPayment;
