'use client';

import { useParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { PlusCircle } from 'lucide-react';
import { GoTrash } from 'react-icons/go';
import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { Formik, Form, FieldArray, Field } from 'formik';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const StepPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { loading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const [initialValues, setInitialValues] = useState({
    extras: [{ price: '', description: '', orderCode: id }],
    step: 8.1,
    stepName: 'Ürünlerin Bir Kısmı Teslim Edildi',
    orderCode: id,
  });

  const [stepEkstraData, setStepEsktraData] = useState([]);

  async function getEkstralarData() {
    setIsLoading(true);
    const response = await getAPI(`/stepByStep/ekstralar?orderCode=${id}`);
    setStepEsktraData(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (stepByStepData?.length > 0) {
      const stepData = stepByStepData.filter((data) => data.orderCode === id);
      if (stepData) {
        setInitialValues((prevValues) => ({
          ...prevValues,
        }));
      }
    }
  }, [stepByStepData]);

  useEffect(() => {
    getEkstralarData();
  }, []);

  useEffect(() => {
    const extras = stepEkstraData.map((extra) => ({
      price: extra.price,
      description: extra.description,
      orderCode: extra.orderCode,
    }));
    setInitialValues((prevValues) => ({
      ...prevValues,
      extras: extras.length
        ? extras
        : [{ price: '', description: '', orderCode: id }],
    }));
  }, [stepEkstraData]);

  return (
    <div className={'h-full w-full flex items-center justify-center'}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values) => {
          let foundError = false;
          // Check for errors
          values.extras.forEach((extra, index) => {
            if (!foundError && extra.price <= 0) {
              toast.error(`Ekstra ${index + 1} için geçersiz fiyat.`);
              foundError = true;
            }
            if (!foundError && !extra.description.trim()) {
              toast.error(`Ekstra ${index + 1} için boş açıklama.`);
              foundError = true;
            }
          });

          if (!foundError) {
            setIsLoading(true);
            const response = await postAPI('/stepByStep/ekstralar', values);

            if (response.error || !response) {
              toast.error(response.message);
              return setIsLoading(false);
            } else {
              toast.success(response.message);
              const response3 = await getAPI(
                `/stepByStep/ekstralar?orderCode=${id}`
              );
              setStepEsktraData(response3.data);
              const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
              setStepByStepData(response2.data);
              router.push(`/stepbystep/${id}/8.1`);
              return setIsLoading(false);
            }
          }
        }}
      >
        {(props) => (
          <Form className='max-w-lg w-full flex flex-col gap-4'>
            <Label>Cariye İşlenecek Ekstra Ücretleri Giriniz.</Label>

            <FieldArray
              name='extras'
              render={({ push, remove }) => (
                <>
                  {props.values.extras.map((extra, index) => (
                    <div key={index} className='flex items-center w-full gap-2'>
                      <div className='flex items-center'>
                        <Field
                          type='number'
                          name={`extras[${index}].price`}
                          min='1'
                          placeholder='0'
                          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                      </div>
                      <Field
                        type='text'
                        name={`extras[${index}].description`}
                        placeholder='Ek ücret için açıklama giriniz.'
                        className='flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full'
                      />

                      {index > 0 && (
                        <button
                          type='button'
                          className='w-full rounded bg-red-600/90 hover:bg-red-600/70 transition-all duration-200 ease-in-out py-3 flex items-center justify-center text-white text-sm gap-2 font-medium'
                          onClick={() => remove(index)}
                        >
                          <GoTrash size={20} />
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type='button'
                    className='w-full rounded bg-[#dedede]/20 hover:bg-[#dedede]/40 transition-all duration-200 ease-in-out py-3 flex items-center justify-center text-black text-sm gap-2 font-medium'
                    onClick={() =>
                      push({ price: '', description: '', orderCode: id })
                    }
                  >
                    <PlusCircle size={20} />
                    Ekstra Ekle
                  </button>
                </>
              )}
            />
            <Button type='submit'>Cariye İşle</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
