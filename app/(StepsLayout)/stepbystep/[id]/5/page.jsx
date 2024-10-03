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
import { Input } from '@/components/ui/input';
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
  const [date, setDate] = useState([]);
  const [maliyet, setMaliyet] = useState([]);

  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const [initialValues, setInitialValues] = useState({
    dates: [],
    step: 6,
    stepName: 'Gümrük',
    tedarikciMaliyet: [],
  });

  const initializeDateState = (length) => {
    const initialDates = new Array(length).fill({
      selectedDate: undefined,
      selectedOrdersId: undefined,
    });
    const initialMaliyet = new Array(length).fill({
      tedarikciMaliyeti: 0,
      selectedOrdersId: undefined,
    });
    setMaliyet(initialMaliyet);
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

  useEffect(() => {
    if (stepByStepData?.length > 0) {
      const stepData = stepByStepData.filter((data) => data.orderCode === id);
      if (stepData) {
        const updatedDates = stepData.reduce((acc, item) => {
          acc[item.orderId] = {
            minDate: item.tedarikciYuklemeTarihi
              ? new Date(item.tedarikciYuklemeTarihi)
              : undefined,
            selectedDate: item.urunCikisTarihi
              ? new Date(item.urunCikisTarihi)
              : undefined,
            selectedOrdersId: item.urunCikisTarihi ? item.orderId : undefined,
          };
          return acc;
        }, {});

        const updatedTedarikci = stepData.map((item) => ({
          tedarikciMaliyeti: item.step >= 5 ? item.tedarikciMaliyeti : null,
          selectedOrdersId: item.step >= 5 ? item.orderId : null,
        }));

        setInitialValues({
          ...initialValues,
          dates: updatedDates,
          tedarikciMaliyet: updatedTedarikci,
        });
      }
    }
  }, [stepByStepData]);

  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={async (values) => {
          const hasDate = Array.from(Object.values(values.dates)).some(
            (date) => date.selectedDate !== undefined
          );

          if (!hasDate) {
            toast.warning('Lütfen en az bir tarih seçin!');
            return;
          }

          const formattedDates = Object.values(values.dates).map((item) => {
            const isoDate = item.selectedDate
              ? new Date(item.selectedDate).toISOString()
              : undefined;
            return {
              selectedDate: isoDate,
              selectedOrdersId: item.selectedOrdersId,
            };
          });

          setIsLoading(true);
          values.orderCode = id;
          const response = await postAPI(
            '/stepByStep/urunMaliyetiVeCikisTarihi',
            {
              ...values,
              dates: formattedDates,
            }
          );

          if (response.error || !response) {
            toast.error(response.message);
            return setIsLoading(false);
          } else {
            toast.success(response.message);
            const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
            setStepByStepData(response2.data);
            router.push(`/stepbystep/${id}/6`);
            return setIsLoading(false);
          }
        }}
      >
        {(props) => (
          <Form
            className='max-w-sm w-full flex flex-col gap-2'
            onSubmit={props.handleSubmit}
          >
            <Label>Her Ürün İçin Tarih Ve Maliyet Bilgisi Giriniz.</Label>
            <Label className={'text-muted-foreground text-xs m-0'}>
              Ürünler:
            </Label>

            {data &&
              data?.Orders?.map((item, index) => {
                const matchingStepData = stepByStepData.find(
                  (stepItem) =>
                    stepItem.orderId === item.id && stepItem.step >= 5
                );
                if (matchingStepData) {
                  return (
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
                        <span>
                          {data?.Ürünler[index]?.selectedCategoryValues}
                        </span>
                        -<span>{data?.Ürünler[index]?.productName}</span>-
                        <span>
                          {(item.productPrice + item.productFeaturePrice) *
                            item.stock}
                        </span>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !props.values.dates[item.id] &&
                                'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {props.values.dates[item.id]?.selectedDate ? (
                              format(
                                props.values.dates[item.id].selectedDate,
                                'PPP'
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-full p-0'>
                          <Calendar
                            name={`dates.${item.id}`} // Formik içindeki path'i doğru şekilde belirtin
                            mode='single'
                            selected={props.values.dates[item.id]?.selectedDate}
                            onSelect={(newDate) => {
                              props.setFieldValue(`dates.${item.id}`, {
                                minDate: props.values.dates[item.id]?.minDate,
                                selectedDate: newDate,
                                selectedOrdersId: item.id,
                              });
                            }}
                            disabled={(date) =>
                              date &&
                              date <
                                new Date(
                                  `${props.values.dates[item.id]?.minDate}`
                                )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <div className='flex gap-2 items-center'>
                        <Input
                          name={`tedarikciMaliyet.${item.id}`}
                          value={
                            props.values.tedarikciMaliyet.find(
                              (m) => m.selectedOrdersId === item.id
                            )?.tedarikciMaliyeti || ''
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedMaliyet =
                              props.values.tedarikciMaliyet.map((m) =>
                                m.selectedOrdersId === item.id
                                  ? {
                                      tedarikciMaliyeti: value,
                                      selectedOrdersId: item.id,
                                    }
                                  : m
                              );
                            props.setFieldValue(
                              'tedarikciMaliyet',
                              updatedMaliyet
                            );
                          }}
                          type='number'
                          placeholder='1'
                          min='1'
                        />
                      </div>
                    </div>
                  );
                }

                const doesntMatchData = stepByStepData.find(
                  (stepItem) =>
                    stepItem.orderId === item.id && stepItem.step < 5
                );
                if (doesntMatchData) {
                  return (
                    <div
                      key={item.id}
                      className={
                        'flex flex-col w-full border shadow-sm rounded p-2 gap-2 bg-gray-800 text-white'
                      }
                    >
                      <div
                        className={
                          'flex items-center gap-2 [&_span]:text-sm mx-auto w-fit'
                        }
                      >
                        <span>
                          {data?.Ürünler[index]?.selectedCategoryValues}
                        </span>
                        -<span>{data?.Ürünler[index]?.productName}</span>-
                        <span>
                          {(item.productPrice + item.productFeaturePrice) *
                            item.stock}
                        </span>
                      </div>

                      <p>
                        Bu ürün {''}
                        <span className='bg-gray-500 p-1 text-white rounded'>
                          {doesntMatchData.stepName}
                        </span>{' '}
                        kısmında kalmıştır.
                      </p>
                    </div>
                  );
                }
              })}

            <Button className='w-full' type='submit'>
              Bilgileri Guncelle
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
