'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { Input } from '@/components/ui/input';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import {
  useLoadingContext,
  useStepByStepDataContext,
} from '@/app/(StepsLayout)/layout';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const StepPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [tedarikci, setTedarikci] = useState('');
  const [initialValues, setInitialValues] = useState({
    tedarikciAciklama: '',
    tedarikciId: 0,
    step: 3,
    stepName: 'Tedarikçi Yükleme Tarihi',
  });
  const [data, setData] = useState([]);
  const { isLoading, setIsLoading } = useLoadingContext();
  const { stepByStepData, setStepByStepData } = useStepByStepDataContext();

  const getTedarikciId = () => {
    const filtered = data.filter((dt) => dt.firma === tedarikci);

    if (filtered.length === 0) {
      return null;
    }

    return filtered[0].id;
  };

  const getData = async () => {
    setIsLoading(true);
    const dt = await getAPI('/suplier');
    setData(dt.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const stepData = stepByStepData.find((data) => data.orderCode === id);
    if (stepByStepData?.length > 0) {
      const filtered = data.filter((dt) => dt.id === stepData.tedarikciId);
      if (filtered.length > 0) {
        setTedarikci(filtered[0].firma);
      }
    }
  }, [data]);

  useEffect(() => {
    if (stepByStepData?.length > 0) {
      const stepData = stepByStepData.find((data) => data.orderId === id);
      if (stepData) {
        setInitialValues({
          onOdemeMiktari: stepData.onOdemeMiktari,
          orderId: id,
          step: 3,
          stepName: 'Tedarikçi Yükleme Tarihi',
          tedarikciAciklama: stepData.tedarikciAciklama,
          tedarikciId: stepData.tedarikciId,
        });
        const filtered = data.filter((dt) => dt.id === stepData.tedarikciId);
        if (filtered.length > 0) {
          setTedarikci(filtered[0].firma);
        }
      }
    }
  }, [stepByStepData]);

  return (
    <div className={'h-full w-full flex items-center justify-center'}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values) => {
          if (values.tedarikciAciklama.length === 0)
            return toast.error(
              'Lütfen tedarikçiye göndereceğiniz açıklamayı boş bırakmayınız!'
            );

          const tedarikciId = getTedarikciId();
          values.tedarikciId = tedarikciId;
          if (values.tedarikciId === 0 || values.tedarikciId === null)
            return toast.error(
              'Tedarikçi seçilirken bir hata gerçekleşti. Lütfen tedarikçi seçtiğinizden emin olunuz!'
            );

          values.id = id;

          setIsLoading(true);
          const response = await postAPI('/stepByStep/tedarikci', values);
          if (response.error || !response) {
            toast.error(response.message);
            return setIsLoading(false);
          } else {
            toast.success(response.message);
            const response2 = await getAPI(`/stepByStep?orderCode=${id}`);
            setStepByStepData(response2.data);
            router.push(`/stepbystep/${id}/3`);
            return setIsLoading(false);
          }
        }}
      >
        {(props) => (
          <Form
            className='max-w-sm w-full flex flex-col gap-4'
            onSubmit={props.handleSubmit}
          >
            <Label>Lütfen bir tedarikçi seçiniz.</Label>
            <Select
              disabled={data.length === 0}
              onValueChange={(value) => setTedarikci(value)}
              value={tedarikci}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Tedarikçiler' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tedarikçi Listesi</SelectLabel>
                  {data.map((item, i) => {
                    return (
                      <SelectItem key={item.id} value={item.firma}>
                        {item.firma}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type='text'
              name='tedarikciAciklama'
              onChange={props.handleChange}
              className='w-full'
              placeholder='Tedarikçiye Gönderilecek Açıklama'
              value={props.values.tedarikciAciklama}
            />

            <Button type='submit'>Tedarikçiye verileri gönder</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepPage;
