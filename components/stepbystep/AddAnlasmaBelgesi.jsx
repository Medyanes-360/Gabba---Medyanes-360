import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import Link from 'next/link';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { postAPI, getAPI } from '@/services/fetchAPI';
import { useLoadingContext } from '@/app/(StepsLayout)/layout';

const AddAnlasmaBelgesi = ({
  stepByStepData,
  id,
  setStepByStepData,
  orderData,
}) => {
  const { isLoading, setIsLoading } = useLoadingContext();
  const [anlasmaBelgesi, setAnlasmaBelgesi] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [initialValues, setInitialValues] = useState({
    onOdemeMiktari: stepByStepData ? stepByStepData[0]?.onOdemeMiktari : 0,
    anlasmaMetni: '',
    orderCode: id,
    stepByStep: stepByStepData?.length > 0,
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

  useEffect(() => {
    setInitialValues({
      onOdemeMiktari: stepByStepData ? stepByStepData[0]?.onOdemeMiktari : 0,
      anlasmaMetni: '',
      orderCode: id,
      stepByStep: stepByStepData?.length > 0,
    });
  }, [stepByStepData]);

  const getAnlasmaBelgesi = async () => {
    const response = await getAPI(`/stepByStep/anlasmaBelgesi?orderCode=${id}`);
    return setAnlasmaBelgesi([response.data]);
  };

  useEffect(() => {
    getAnlasmaBelgesi();
  }, []);

  return (
    <>
      <div className='w-full flex p-2 mt-2'>
        <div className='flex items-center justify-end w-full text-gray-600 py-2'>
          <AlertDialog
            className='max-w-xl'
            open={openDialog}
            onOpenChange={setOpenDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                className='bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white transition-all duration-200 ease-in-out w-full'
              >
                Anlaşma Belgesi Oluştur
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-xl h-fit max-h-fit'>
              <AlertDialogCancel className='absolute w-10 h-10 -right-4 -top-5 bg-red-600 rounded-full hover:cursor-pointer transition-all duration-500 z-10 group'>
                <span className='text-white text-xl group-hover:text-red-500 group-hover:transition-all group-hover:duration-500'>
                  x
                </span>
              </AlertDialogCancel>
              <div className='max-w-xl h-fit max-h-[650px] px-2'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-center'>
                    Anlaşma Belgesi Oluştur
                  </AlertDialogTitle>
                  {stepByStepData &&
                    stepByStepData?.length > 0 &&
                    stepByStepData[0]?.anlasmaBelgesi == true && (
                      <div className='flex items-center justify-between bg-slate-800 p-2  rounded text-white'>
                        <span className='font-semibold'>
                          Belgeyi Görüntüle:
                        </span>
                        <ul className='flex gap-4 flex-col justify-center items-center'>
                          {anlasmaBelgesi && anlasmaBelgesi?.length > 0 ? (
                            anlasmaBelgesi.map((item) => (
                              <li className='flex gap-3 items-center justify-center'>
                                <Link
                                  href={`/anlasma-belgesi?id=${id}&lang=en&anlasmaKodu=${item?.anlasmaBelgesiKodu}`}
                                >
                                  <Image
                                    className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                                    src='/en_flag.svg'
                                    width={100}
                                    height={100}
                                    alt='Invoice icon'
                                  />
                                </Link>
                                <Link
                                  href={`/anlasma-belgesi?id=${id}&lang=ua&anlasmaKodu=${item?.anlasmaBelgesiKodu}`}
                                >
                                  <Image
                                    className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                                    src='/ua_flag.svg'
                                    width={100}
                                    height={100}
                                    alt='Invoice icon'
                                  />
                                </Link>
                                <Link
                                  href={`/anlasma-belgesi?id=${id}&lang=tr&anlasmaKodu=${item?.anlasmaBelgesiKodu}`}
                                >
                                  <Image
                                    className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                                    src='/tr_flag.svg'
                                    width={100}
                                    height={100}
                                    alt='Invoice icon'
                                  />
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className='p-3 text-red-500 font-semibold text-lg'>
                              Herhangi bir anlaşma belgesi bulunamadı.
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  {stepByStepData[0]?.anlasmaBelgesi != true ? (
                    // Anlaşma metni oluşturma ve stepbystep adımlarını "1.2" adım hariç buradan başlatabiliriz.
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize={true}
                      onSubmit={async (values) => {
                        const date = new Date();
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          '0'
                        ); // Aylar 0-11 arası olduğu için 1 ekliyoruz
                        const year = date.getFullYear();
                        values.formattedDate = `${day}.${month}.${year}`;

                        setIsLoading(true);
                        const response = await postAPI(
                          '/stepByStep/anlasmaBelgesi',
                          {
                            values: values,
                            orderData: orderData,
                            stepByStep: stepByStepData?.length > 0,
                          }
                        );

                        if (response.error || !response) {
                          toast.error(response.message);
                          return setIsLoading(false);
                        } else {
                          toast.success(response.message);
                          const response2 = await getAPI(
                            `/stepByStep?orderCode=${id}`
                          );
                          setStepByStepData(response2.data);
                          setOpenDialog(false);
                          return setIsLoading(false);
                        }
                      }}
                    >
                      {(props) => (
                        <Form onSubmit={props.handleSubmit}>
                          <div className='flex flex-col gap-3'>
                            <Label htmlFor='onOdemeMiktari'>
                              Ön Ödeme Miktarı Giriniz
                            </Label>
                            <Input
                              type='number'
                              placeholder='0'
                              id='onOdemeMiktari'
                              onChange={props.handleChange}
                              value={props.values.onOdemeMiktari}
                            />
                          </div>
                          <Button type='submit' className='mt-4 w-full'>
                            Belgeyi Oluştur
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    // Güncelleme işlemi bu formda oluyor. Üstteki create olduğunu unutma!
                    <Formik
                      initialValues={initialValues}
                      onSubmit={async (values) => {
                        const date = new Date();
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          '0'
                        ); // Aylar 0-11 arası olduğu için 1 ekliyoruz
                        const year = date.getFullYear();
                        values.formattedDate = `${day}.${month}.${year}`;

                        setIsLoading(true);
                        const response = await postAPI(
                          '/stepByStep/anlasmaBelgesi',
                          {
                            values: values,
                            orderData: orderData,
                            stepByStep: stepByStepData?.length > 0,
                          }
                        );

                        if (response.error || !response) {
                          toast.error(response.message);
                          return setIsLoading(false);
                        } else {
                          toast.success(response.message);
                          const response2 = await getAPI(
                            `/stepByStep?orderCode=${id}`
                          );
                          setStepByStepData(response2.data);
                          setOpenDialog(false);
                          return setIsLoading(false);
                        }
                      }}
                    >
                      {(props) => (
                        <Form onSubmit={props.handleSubmit} className='!mb-2'>
                          <div className='flex flex-col gap-3'>
                            <Label htmlFor='onOdemeMiktari'>
                              Ön Ödeme Miktarı Giriniz
                            </Label>
                            <Input
                              type='number'
                              placeholder='0'
                              id='onOdemeMiktari'
                              onChange={props.handleChange}
                              value={props.values.onOdemeMiktari}
                            />
                          </div>
                          <Button type='submit' className='mt-4 w-full'>
                            Belgeyi Güncelle
                          </Button>
                        </Form>
                      )}
                    </Formik>
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

export default AddAnlasmaBelgesi;
