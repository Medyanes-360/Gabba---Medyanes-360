'use client';

import { useEffect, useState } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/table/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const StepPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [date, setDate] = useState();
  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const initializeDateState = (length) => {
    const initialDates = new Array(length).fill(undefined);
    setDate(initialDates);
  };

  const getAllOrderData = async () => {
    setIsLoading(true);
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setData(filtered);
    initializeDateState(filtered?.Ürünler?.length || 0);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllOrderData();
  }, []);

  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <Formik
        initialValues={{
          dates: [],
          step: 5,
          stepName: 'Ürün Maliyeti ve Çıkış Tarihi',
        }}
        onSubmit={async (values) => {
          const response = await postAPI(
            '/stepByStep/tedarikciYuklemeTarihi',
            values
          );
          if (response.error || !response) {
            toast.error(response.message);
            return setIsLoading(false);
          } else {
            toast.success(response.message);
            const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
            setStepByStepData(response2.data);
            router.push(`/stepbystep/${id}/5`);
            return setIsLoading(false);
          }
        }}
      >
        {(props) => (
          <Form
            className='max-w-sm w-full flex flex-col gap-2'
            onSubmit={props.handleSubmit}
          >
            <Label className={'text-xs'}>
              Açıklama : Bu bölümde siparişlerin tedarikçi tarafından yüklendiği
              tarih bilgisi girilir, buna göre tedarikçi tarafından ürünlerin
              birim bazında ne zaman yüklendiği belirlenir.
            </Label>
            <Label>Her Ürün İçin Tarih Giriniz.</Label>
            <Label className={'text-muted-foreground text-xs m-0'}>
              Ürünler:
            </Label>

            {data &&
              data?.Orders?.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    'flex flex-col w-full border shadow-sm rounded p-2 gap-2'
                  }
                >
                  <div
                    className={
                      'flex items-center gap-2 [&_span]:text-sm mx-auto w-fit'
                    }
                  >
                    <span>{data?.Ürünler[index]?.selectedCategoryValues}</span>-
                    <span>{data?.Ürünler[index]?.productName}</span>-
                    <span>{data?.Ürünler[index]?.productPrice} </span>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date[index] && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {date[index] ? (
                          format(date[index], 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Calendar
                        name={`dates.${item.id}`}
                        mode='single'
                        selected={date[index]}
                        onSelect={(newDate) => {
                          setDate((prev) => ({ ...prev, [index]: newDate }));
                          const dateStr = newDate ? newDate.toISOString() : '';
                          props.setFieldValue(`dates.${index}`, {
                            selectedDate: dateStr,
                            selectedOrdersId: item.id,
                          });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}

            <Button className={'w-full'} type='submit'>
              Tarihleri Guncelle
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
