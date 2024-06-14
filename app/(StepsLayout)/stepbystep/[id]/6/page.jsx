'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const [data, setData] = useState([]);
  const [checked, setChecked] = useState({});

  const getAllOrderData = async () => {
    setIsLoading(true);
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setData(filtered);
    setIsLoading(false);
  };
  useEffect(() => {
    getAllOrderData();
  }, []);

  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <Formik
        initialValues={{
          step: 7,
          stepName: 'Teslim Tutanağı',
        }}
        onSubmit={async (values) => {
          values.orderCode = id;
          const response = await postAPI('/stepByStep/gumruk', values);
          console.log(response);
          if (response.error || !response) {
            toast.error(response.message);
            return setIsLoading(false);
          } else {
            toast.success(response.message);
            const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
            setStepByStepData(response2.data);
            router.push(`/stepbystep/${id}/7.1`);
            return setIsLoading(false);
          }
        }}
      >
        {(props) => (
          <Form
            className='max-w-sm w-full flex flex-col gap-2'
            onSubmit={props.handleSubmit}
          >
            <Label>Stoklara eklenecek ürünleri seçiniz.</Label>
            <Label className={'text-muted-foreground text-xs m-0'}>
              Ürünler:
            </Label>

            {data &&
              data?.Orders?.map((item, index) => {
                // stepByStepData'daki orderId ve step değerlerini kontrol et
                const matchingStepData = stepByStepData.find(
                  (stepItem) =>
                    stepItem.orderId === item.id && stepItem.step >= 6
                );
                if (matchingStepData) {
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col w-full ${
                        checked[index] ?? false ? 'bg-[#dedede]/50' : ''
                      } transition-all duration-200 ease-in-out border shadow-sm rounded p-2 gap-2`}
                    >
                      <div
                        className={
                          'flex items-center gap-2 [&_span]:text-sm w-full w-fit'
                        }
                      >
                        <Checkbox
                          checked={checked[index] ?? false}
                          onCheckedChange={(value) =>
                            setChecked((prev) => ({ ...prev, [index]: value }))
                          }
                          className={'mr-4'}
                        />
                        <span>
                          {data?.Ürünler[index].selectedCategoryValues}
                        </span>
                        -<span>{data?.Ürünler[index].productName}</span>-
                        <span>{data?.Ürünler[index].productPrice}</span>
                      </div>
                    </div>
                  );
                }

                const doesntMatchData = stepByStepData.find(
                  (stepItem) =>
                    stepItem.orderId === item.id && stepItem.step < 6
                );

                if (doesntMatchData) {
                  return (
                    <div
                      key={item.id}
                      className='flex flex-col w-full bg-gray-800 text-white
                       transition-all duration-200 ease-in-out border shadow-sm rounded p-2 gap-2'
                    >
                      <div
                        className={
                          'flex items-center gap-2 [&_span]:text-sm w-full w-fit'
                        }
                      >
                        <Checkbox className={'mr-4'} disabled='true' />
                        <span>
                          {data?.Ürünler[index].selectedCategoryValues}
                        </span>
                        -<span>{data?.Ürünler[index].productName}</span>-
                        <span>{data?.Ürünler[index].productPrice}</span>
                      </div>
                      <p>
                        Bu ürün {''}
                        <span className='bg-gray-500 p-1 text-white rounded'>
                          {stepByStepData[index]?.stepName}
                        </span>{' '}
                        kısmında kalmıştır.
                      </p>
                    </div>
                  );
                }
              })}
            <Button type='submit'>Mağaza Stoklarına Ekle</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
