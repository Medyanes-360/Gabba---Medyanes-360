import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FaRegEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { postAPI } from '@/services/fetchAPI';
import { useLoadingContext } from '@/app/(StepsLayout)/layout';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/table/utils';

const AddCariPayment = ({
  orderData,
  stepByStepData,
  id,
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

  const [isUpdatePaymentData, setIsUpdatePaymentData] = useState({
    index: '',
    isShow: false,
    odemeTarihi: '',
    odemeMiktari: '',
    odemeAciklamasi: '',
  });

  function formatDate(dateString) {
    if (dateString?.length > 0) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için 1 ekliyoruz
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return '';
  }

  async function handleDeletePayment(id) {
    const isConfirmed = confirm('Cari silmek istediğinize emin misiniz?');
    if (isConfirmed) {
      setIsLoading(true);
      const response = await postAPI('/stepByStep/cariPayments', id, 'DELETE');
      if (response.status != 'success') {
        setIsLoading(false);
        return toast.error(
          'Silme işlemi gerçekleştirilemedi! ',
          response.message
        );
      } else {
        getCariPayments();
        setIsLoading(false);
      }
    }
  }

  async function handleUpdatePayments() {
    const totalAmount = orderData.Orders?.reduce((total, order) => {
      return (
        total + (order.productPrice + order.productFeaturePrice) * order.stock
      );
    }, 0);

    const paidAmount = stepByStepData[0]?.onOdemeMiktari ?? 0;
    const ekstraUcretTotal = stepByStepData[0]?.ekstraUcretTotal ?? 0;
    const musteriBorcu =
      totalAmount + ekstraUcretTotal - (paidAmount + cariPaymentTotalAmount);

    if (
      isUpdatePaymentData?.odemeMiktari <= 0 ||
      isUpdatePaymentData.odemeMiktari == '' ||
      isUpdatePaymentData.odemeMiktari == null ||
      isUpdatePaymentData.odemeMiktari == undefined
    ) {
      return toast.error(
        'Cariye işlenecek ödeme miktarı 0 veya negatif değer olamaz!'
      );
    }

    if (
      musteriBorcu - isUpdatePaymentData?.odemeMiktari < 0 ||
      isUpdatePaymentData.odemeMiktari == '' ||
      isUpdatePaymentData.odemeMiktari == null ||
      isUpdatePaymentData.odemeMiktari == undefined
    ) {
      return toast.error('Ön ödeme miktarı borçtan fazla olamaz!');
    }

    if (
      isUpdatePaymentData.odemeAciklamasi?.length <= 0 ||
      isUpdatePaymentData.odemeAciklamasi == '' ||
      isUpdatePaymentData.odemeAciklamasi == null ||
      isUpdatePaymentData.odemeAciklamasi == undefined
    ) {
      return toast.error(
        'Cariye işlenecek ödeme miktarı açıklaması boş olamaz.'
      );
    }

    const isConfirmed = confirm('Cari eklemek istediğinize emin misiniz?');

    if (isConfirmed) {
      setIsLoading(true);
      const response = await postAPI(
        '/stepByStep/cariPayments',
        isUpdatePaymentData,
        'PUT'
      );
      if (response?.status == 'success') {
        getCariPayments();
        setIsUpdatePaymentData({
          ...isUpdatePaymentData,
          isShow: false,
        });
        setIsLoading(false);
        return toast.success('Veri güncellendi!');
      } else {
        toast.error('Ödeme güncellenemedi! ', response?.message);
      }
    }
  }

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
            <AlertDialogContent className='w-full max-w-7xl h-fit max-h-fit'>
              <AlertDialogCancel className='absolute w-10 h-10 -right-4 -top-5 bg-red-600 rounded-full hover:cursor-pointer transition-all duration-500 z-10 group'>
                <span className='text-white text-xl group-hover:text-red-500 group-hover:transition-all group-hover:duration-500'>
                  x
                </span>
              </AlertDialogCancel>
              <div className='max-w-7xl h-fit max-h-[650px] overflow-y-auto px-2'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-center'>
                    Cari Ek Ödeme
                  </AlertDialogTitle>
                  {/* Müşteri Bilgisi */}
                  <div className='bg-slate-600 text-white shadow-lg p-5 rounded-lg mt-5'>
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
                            {stepByStepData ? (
                              <>
                                {(() => {
                                  return (
                                    (stepByStepData[0]?.onOdemeMiktari ?? 0) +
                                    cariPaymentTotalAmount
                                  );
                                })()}
                              </>
                            ) : null}
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
                                      const ekstraUcretTotal =
                                        stepByStepData[0]?.ekstraUcretTotal ??
                                        0;
                                      return (
                                        totalAmount +
                                        ekstraUcretTotal -
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
                  <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                      const totalAmount = orderData.Orders?.reduce(
                        (total, order) => {
                          return (
                            total +
                            (order.productPrice + order.productFeaturePrice) *
                              order.stock
                          );
                        },
                        0
                      );

                      const paidAmount = stepByStepData[0]?.onOdemeMiktari ?? 0;
                      const ekstraUcretTotal =
                        stepByStepData[0]?.ekstraUcretTotal ?? 0;
                      const musteriBorcu =
                        totalAmount +
                        ekstraUcretTotal -
                        (paidAmount + cariPaymentTotalAmount);

                      if (musteriBorcu == 0)
                        return toast.warning(
                          'Müşterinin borcu kalmamıştır. Ek ödeme giremezsiniz!'
                        );

                      if (values.odemeMiktari <= 0) {
                        return toast.error(
                          'Cariye işlenecek ödeme miktarı 0 veya negatif değer olamaz!'
                        );
                      }

                      if (musteriBorcu - values.odemeMiktari < 0) {
                        return toast.error(
                          'Ön ödeme miktarı borçtan fazla olamaz!'
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
                        className='flex flex-col gap-4 mt-12 justify-center items-center shadow p-3'
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
                            disabled={
                              stepByStepData &&
                              stepByStepData[0]?.onOdemeMiktari > 0
                                ? false
                                : true
                            }
                          />
                        </div>
                        <div className='flex gap-2 items-center w-1/2'>
                          <Input
                            name='odemeMiktariAciklamasi'
                            onChange={props.handleChange}
                            type={'text'}
                            placeholder={'Açıklama Ekleyiniz...'}
                            value={props.values.odemeMiktariAciklamasi}
                            disabled={
                              stepByStepData &&
                              stepByStepData[0]?.onOdemeMiktari > 0
                                ? false
                                : true
                            }
                          />
                        </div>
                        <Button
                          type='submit'
                          disabled={
                            stepByStepData &&
                            stepByStepData[0]?.onOdemeMiktari > 0
                              ? false
                              : true
                          }
                        >
                          Cariye işle
                        </Button>
                      </Form>
                    )}
                  </Formik>

                  {/* Ödeme İnputları */}
                  {stepByStepData && stepByStepData[0]?.onOdemeMiktari > 0 && (
                    <div className='bg-slate-600 text-white shadow-lg p-5 rounded-lg mt-5'>
                      <h3 className='text-center mb-4 text-2xl font-semibold'>
                        Daha Önce Yapılan Ödemeler
                      </h3>
                      <table className='w-full text-center table-auto'>
                        <thead>
                          <tr className='bg-slate-700'>
                            <th className='py-2 px-4'>Ödeme Yapılan Tarih</th>
                            <th className='py-2 px-4'>Ödeme Ücreti</th>
                            <th className='py-2 px-4'>Açıklama</th>
                            <th className='py-2 px-4'>İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='border-b border-slate-500'>
                            <td className='py-2 px-4'>
                              {stepByStepData &&
                                formatDate(stepByStepData[0]?.createdAt ?? '')}
                            </td>
                            <td className='py-2 px-4'>
                              {stepByStepData &&
                                (stepByStepData[0]?.onOdemeMiktari ?? 0)}
                            </td>
                            <td className='py-2 px-4'>
                              {stepByStepData &&
                                (stepByStepData[0]?.onOdemeMiktariAciklamasi ??
                                  '')}
                            </td>
                          </tr>
                          {cariPayments &&
                            cariPayments?.length > 0 &&
                            cariPayments.map((item, index) => (
                              <tr
                                key={index}
                                className='border-b border-slate-500'
                              >
                                {isUpdatePaymentData.index == item.id &&
                                isUpdatePaymentData.isShow ? (
                                  <>
                                    <td>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={'outline'}
                                            className={cn(
                                              'w-full justify-start text-left font-normal',
                                              isUpdatePaymentData.odemeTarihi &&
                                                'text-muted-foreground'
                                            )}
                                          >
                                            <CalendarIcon className='mr-2 h-4 w-4 text-black' />
                                            {isUpdatePaymentData.odemeTarihi ? (
                                              <span className='text-black'>
                                                {format(
                                                  isUpdatePaymentData.odemeTarihi,
                                                  'PPP'
                                                )}
                                              </span>
                                            ) : (
                                              <span className='text-black'>
                                                Pick a date
                                              </span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-full p-0'>
                                          <Calendar
                                            className={'text-black'}
                                            name={`dates.${item.id}`}
                                            mode='single'
                                            selected={
                                              new Date(
                                                isUpdatePaymentData.odemeTarihi
                                              )
                                            }
                                            onSelect={(newDate) => {
                                              isUpdatePaymentData.odemeTarihi =
                                                newDate;
                                              setIsUpdatePaymentData({
                                                ...isUpdatePaymentData,
                                                odemeTarihi: newDate,
                                              });
                                            }}
                                            disabled={(date) =>
                                              date && date > new Date()
                                            }
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </td>
                                    <td className='py-2 px-4'>
                                      <Input
                                        onChange={(e) =>
                                          setIsUpdatePaymentData({
                                            ...isUpdatePaymentData,
                                            odemeMiktari: e.target.value,
                                          })
                                        }
                                        className='text-black'
                                        name='odemeMiktari'
                                        value={isUpdatePaymentData.odemeMiktari}
                                        type={'number'}
                                        placeholder={'0'}
                                        min={0}
                                      />
                                    </td>
                                    <td className='py-2 px-4'>
                                      <Input
                                        className='text-black'
                                        name='odemeMiktariAciklamasi'
                                        type={'text'}
                                        onChange={(e) =>
                                          setIsUpdatePaymentData({
                                            ...isUpdatePaymentData,
                                            odemeAciklamasi: e.target.value,
                                          })
                                        }
                                        value={
                                          isUpdatePaymentData.odemeAciklamasi
                                        }
                                        placeholder={'Açıklama Ekleyiniz...'}
                                      />
                                    </td>
                                    <td className='py-2 px-4'>
                                      <div className='flex justify-center items-center gap-3'>
                                        <button
                                          type='button'
                                          onClick={() => handleUpdatePayments()}
                                          className='border border-2 border-green-500 bg-green-500 rounded p-2 group hover:bg-white transition-all duration-500 ease-in-out hover:transition-all hover:duration-500 hover:ease-in-out'
                                        >
                                          <FaCheck
                                            className='text-white group-hover:text-green-500 transition-all duration-500 ease-in-out group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out'
                                            size={20}
                                          />
                                        </button>
                                        <button
                                          type='button'
                                          className='border border-2 border-red-500 bg-red-500 rounded p-2 group hover:bg-white transition-all duration-500 ease-in-out hover:transition-all hover:duration-500 hover:ease-in-out'
                                          onClick={() =>
                                            setIsUpdatePaymentData({
                                              index: item.id,
                                              isShow: false,
                                            })
                                          }
                                        >
                                          <IoClose
                                            className='text-white group-hover:text-red-500 transition-all duration-500 ease-in-out group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out'
                                            size={20}
                                          />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className='py-2 px-4'>
                                      {formatDate(item.createdAt ?? '')}
                                    </td>
                                    <td className='py-2 px-4'>
                                      {item.odemeMiktari}
                                    </td>
                                    <td className='py-2 px-4'>
                                      {item.odemeMiktariAciklamasi}
                                    </td>
                                    <td className='py-2 px-4'>
                                      <div className='flex justify-center items-center gap-3'>
                                        <button
                                          onClick={() =>
                                            setIsUpdatePaymentData({
                                              index: item.id,
                                              isShow: true,
                                              odemeTarihi: item.createdAt,
                                              odemeMiktari: item.odemeMiktari,
                                              odemeAciklamasi:
                                                item.odemeAciklamasi,
                                            })
                                          }
                                          type='button'
                                          className='border border-2 border-green-500 bg-green-500 rounded p-2 group hover:bg-white transition-all duration-500 ease-in-out hover:transition-all hover:duration-500 hover:ease-in-out'
                                        >
                                          <FaRegEdit
                                            className='text-white group-hover:text-green-500 transition-all duration-500 ease-in-out group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out'
                                            size={20}
                                          />
                                        </button>
                                        <button
                                          type='button'
                                          onClick={() =>
                                            handleDeletePayment(item.id)
                                          }
                                          className='border border-2 border-red-500 bg-red-500 rounded p-2 group hover:bg-white transition-all duration-500 ease-in-out hover:transition-all hover:duration-500 hover:ease-in-out'
                                        >
                                          <FaTrash
                                            className='text-white group-hover:text-red-500 transition-all duration-500 ease-in-out group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out'
                                            size={20}
                                          />
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </AlertDialogHeader>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default AddCariPayment;
