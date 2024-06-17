'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams } from 'next/navigation';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { Formik, Form } from 'formik';
import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FaExclamationCircle } from 'react-icons/fa';

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const [data, setData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    orderCode: id,
    step: 9,
    stepName: 'İşlem Sonu Cari Kontrol',
    checked: {},
  });

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

  console.log('stepByStepData: ', stepByStepData);

  return (
    <div className={'h-full w-full flex gap-4 items-center justify-center'}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const response = await postAPI(
            '/stepByStep/urunlerinBirKismiTeslimEdildi',
            values
          );

          if (response.error || !response) {
            toast.error(response.message);
            return setIsLoading(false);
          } else {
            toast.success(response.message);
            const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
            setStepByStepData(response2.data);
            router.push(`/stepbystep/${id}/9`);
            return setIsLoading(false);
          }
        }}
      >
        {(props) => (
          <Form className='flex flex-col w-full max-w-sm gap-4'>
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
                        props.values.checked[item.id]?.value ?? false
                          ? 'bg-[#dedede]/50'
                          : ''
                      } transition-all duration-200 ease-in-out border shadow-sm rounded p-2 px-4 gap-2`}
                    >
                      <div
                        className={
                          'flex items-center gap-2 [&_span]:text-sm w-full'
                        }
                      >
                        <Checkbox
                          checked={
                            props.values.checked[item.id]?.value ?? false
                          }
                          onCheckedChange={(value) => {
                            props.setFieldValue(`checked.${item.id}`, {
                              value,
                            });
                          }}
                          className={'mr-4'}
                        />

                        <div className='flex flex-col gap-1 w-full'>
                          <Label className={'w-full'}>
                            Bu ürün teslim edildi mi ?
                          </Label>

                          <div className={'flex items-center w-full gap-2'}>
                            <span>
                              {data.Ürünler[index].selectedCategoryValues}
                            </span>
                            -<span>{data.Ürünler[index].productName}</span>-
                            <span>{data.Ürünler[index].productPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                const doesntMatchData = stepByStepData.find(
                  (stepItem) =>
                    stepItem.orderId === item.id && stepItem.step < 6
                );
                {
                  /* Eğer kullanıcı ürünü diğer adımda kaldıysa burası çalışır*/
                }

                if (doesntMatchData) {
                  return (
                    <div
                      key={item.id}
                      className='flex flex-col w-full  
                       transition-all duration-200 ease-in-out border shadow-sm rounded p-2 gap-2 cursor-not-allowed bg-gray-800 text-white'
                    >
                      <div
                        className={
                          'flex items-center gap-2 [&_span]:text-sm w-full'
                        }
                      >
                        <FaExclamationCircle
                          className='text-orange-600 ml-2'
                          size='20'
                        />
                        <span>
                          {data?.Ürünler[index]?.selectedCategoryValues}
                        </span>
                        -<span>{data?.Ürünler[index]?.productName}</span>-
                        <span>
                          {(item.productPrice + item.productFeaturePrice) *
                            item.stock}
                        </span>
                      </div>
                      <p className='text-sm'>
                        Bu ürün {''}
                        <span className='p-1 rounded bg-gray-500'>
                          {doesntMatchData.stepName}
                        </span>{' '}
                        kısmında kalmıştır.
                      </p>
                    </div>
                  );
                }
              })}

            <Button
              type='submit'
              className={'w-full transition-all duration-300'}
            >
              Cariyi Kontrol Et
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
