'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useRouter } from 'next/navigation';
import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { useParams } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/table/utils';
import { tr } from 'date-fns/locale';

const AddCari = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isLoading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData, orderData } =
    useStepByStepDataContext();
  const [initialValues, setInitialValues] = useState({
    onOdemeMiktari: '',
    onOdemeMiktariAciklamasi: '',
    orderCode: id,
    step: 2,
    stepName: 'Tedarikçi Seç',
    tedarikciAciklama: '',
    tedarikciId: '',
    tahminiTeslimTarihi: '',
  });

  useEffect(() => {
    if (stepByStepData?.length > 0) {
      const data = stepByStepData.find((data) => data.orderCode === id);
      if (data) {
        setInitialValues({
          onOdemeMiktari: data.onOdemeMiktari,
          onOdemeMiktariAciklamasi: data.onOdemeMiktariAciklamasi,
          tahminiTeslimTarihi: data.tahminiTeslimTarihi,
          orderCode: id,
          step: 2,
          stepName: 'Tedarikçi Seç',
          tedarikciAciklama: '',
          tedarikciId: '',
        });
      }
    }
  }, [stepByStepData]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={async (values) => {
        values.productCount = orderData.Ürünler.length;
        values.orderData = orderData.Orders;
        if (values.onOdemeMiktari <= 0) {
          return toast.error(
            'Cariye işlenecek ön ödeme miktarı 0 veya negatif değer olamaz!'
          );
        }

        if (values.tahminiTeslimTarihi == undefined) {
          return toast.error('Tahmini teslim tarihi boş bırakılamaz.');
        }

        if (values.onOdemeMiktariAciklamasi.length <= 0) {
          return toast.error(
            'Cariye işlenecek ön ödeme miktarı açıklaması boş olamaz.'
          );
        }

        setIsLoading(true);

        const response = await postAPI('/stepByStep/cari', values);
        if (response.error || !response) {
          toast.error(response.message);
          return setIsLoading(false);
        } else {
          toast.success(response.message);
          const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
          setStepByStepData(response2.data);
          router.push(`/stepbystep/${id}/2`);
          return setIsLoading(false);
        }
      }}
    >
      {(props) => (
        <Form
          onSubmit={props.handleSubmit}
          className='max-w-sm w-full flex flex-col gap-4'
        >
          <Label className={'text-xs'}>
            Açıklama: Müşteriden alınan ön ödeme miktarını burada giriniz.
          </Label>
          <Label>Cariye İşlenecek Ön Ödeme Miktarı</Label>
          <div className='flex gap-2 items-center'>
            <Input
              name='onOdemeMiktari'
              onChange={props.handleChange}
              type={'number'}
              placeholder={'0'}
              min={0}
              value={props.values.onOdemeMiktari}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',

                  'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {props.values.tahminiTeslimTarihi ? (
                  format(props.values.tahminiTeslimTarihi, 'PPP', {
                    locale: tr,
                  })
                ) : (
                  <span>Tahmini Teslim Tarihini Seçiniz</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Calendar
                name='tahminiTeslimTarihi'
                selected={props.values.tahminiTeslimTarihi}
                onSelect={(newValue) =>
                  props.setFieldValue('tahminiTeslimTarihi', newValue)
                }
                mode='single'
                locale={tr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className='flex gap-2 items-center'>
            <Input
              name='onOdemeMiktariAciklamasi'
              onChange={props.handleChange}
              type={'text'}
              placeholder={'Açıklama Ekleyiniz...'}
              value={props.values.onOdemeMiktariAciklamasi}
            />
          </div>
          <Button type='submit'>Cariye işle</Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddCari;
