'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

const StepPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();
  const [initialValues, setInitialValues] = useState({
    step: 7,
    stepName: 'Teslim Tutanağı',
    checked: {}, // checkbox başlangıç değerleri
  });
  const [allGumrukTrue, setAllGumrukTrue] = useState(false);

  const [data, setData] = useState([]);

  const getAllOrderData = async () => {
    setIsLoading(true);
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setData(filtered);
    setIsLoading(false);
  };

  const deleteGumruk = async (item) => {
    setIsLoading(true);
    const response = await postAPI(
      '/stepByStep/gumruk',
      {
        item,
        orderCode: id,
      },
      'PUT'
    );
    const response2 = await getAPI(`/stepByStep?orderCode=${item.orderCode}`);
    setStepByStepData(response2.data);
    setIsLoading(false);
    toast.success('Gümrük veriniz silindi!');
  };

  useEffect(() => {
    getAllOrderData();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (stepByStepData?.length > 0) {
      const stepData = stepByStepData.filter((data) => data.orderCode === id);
      if (stepData.length > 0) {
        const checkeds = stepData.reduce((acc, item) => {
          acc[item.orderId] = item.gumruk || false;
          return acc;
        }, {});
        setInitialValues({
          step: 7.1,
          stepName: 'Teslim Tutanağı',
          checked: checkeds,
        });
      }
      // gumruk kontrolü
      const allTrue = stepByStepData.every((item) => item.gumruk === true);
      setAllGumrukTrue(allTrue);
    }

    setIsLoading(false);
  }, [stepByStepData, id]);

  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={async (values) => {
          values.orderCode = id;
          const response = await postAPI('/stepByStep/gumruk', values);
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
            className='max-w-lg w-full flex flex-col gap-2'
            onSubmit={props.handleSubmit}
          >
            <Label>Stoklara eklenecek ürünleri seçiniz.</Label>
            <Label className={'text-muted-foreground text-xs m-0'}>
              Ürünler:
            </Label>
            {allGumrukTrue && (
              <h2 className=' bg-green-500 text-white p-2 mb-2 rounded text-center uppercase'>
                SİPARİŞTEKİ tüm ürünler stoklara eklendi!
              </h2>
            )}
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
                      className='flex gap-3 justify-center items-center'
                      key={item.id}
                    >
                      <div
                        className={classNames(
                          'flex flex-col w-full transition-all duration-200 ease-in-out border shadow-sm rounded p-2 gap-2',
                          props.values.checked[item.id] ?? false
                            ? 'bg-[#dedede]/50'
                            : '',
                          matchingStepData?.gumruk && 'bg-green-500 text-white'
                        )}
                      >
                        <div
                          className={
                            'flex items-center gap-2 [&_span]:text-sm w-full'
                          }
                        >
                          {matchingStepData?.gumruk ? (
                            <FaCheckCircle
                              className='text-white ml-2'
                              size='20'
                            />
                          ) : (
                            <Checkbox
                              name={`checked.${item.id}`} // Formik path
                              checked={props.values?.checked[item.id] ?? false}
                              onCheckedChange={(value) =>
                                props.setFieldValue(`checked.${item.id}`, value)
                              }
                              className='mr-4'
                            />
                          )}
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
                          {matchingStepData?.gumruk &&
                            'Ürün gümrükten geçti ve stoklara eklendi.'}
                        </p>
                      </div>
                      <div>
                        <Button
                          type='button'
                          onClick={() => deleteGumruk(item)}
                          className={classNames(
                            'bg-red-500 hover:bg-red-500/80',
                            !matchingStepData?.gumruk && 'disabled'
                          )}
                          disabled={!matchingStepData?.gumruk}
                        >
                          Gümrükten veriyi sil
                        </Button>
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
            <Button type='submit'>Mağaza Stoklarına Ekle</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
