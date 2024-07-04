'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { getAPI, postAPI } from '@/services/fetchAPI';
import InvoiceJustButton from '../createOffer/orderOffer/PrintOrder/ButtonPrint';
import { useLoadingContext } from '@/app/(StepsLayout)/layout';
import { cn } from '@/lib/table/utils';

const SendDocument = ({ id, lang }) => {
  const [orderData, setOrderData] = useState();
  const { isLoading, setIsLoading } = useLoadingContext();
  const [email, setEmail] = useState('');
  const getAllOrderData = async () => {
    setIsLoading(true);
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
    setOrderData(filtered);
    setIsLoading(false);
  };
  useEffect(() => {
    getAllOrderData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await postAPI('/mail', { email: email, url: `${process.env.NEXT_PUBLIC_URL}/document?id=${id}&lang=tr` })
      await postAPI('/mail', {
        email: email,
        orderCode: id,
        url: `https://gabba-medyanes-360.vercel.app/document?id=${id}&lang=${lang}`,
      });
    } catch (error) {
      console.error('Error sending mail:', error);
    }
  };

  const mailformat =
    '[a-z0-9!#$%&’*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <form
        className='flex h-fit flex-col w-full max-w-md'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2 mb-4'>
          <Label>Email:</Label>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='flex w-full gap-2'>
          {orderData && (
            <InvoiceJustButton
              data={orderData}
              lang={lang}
              title={'Fişi Gör'}
            />
          )}
          <Button
            className={cn(
              'flex flex-1 cursor-not-allowed',
              email.length > 6 && 'cursor-default'
            )}
            type='submit'
            disabled={email?.match(mailformat) ? false : true}
          >
            Fişi Gönder
          </Button>
        </div>
      </form>
    </div>
  );
};
export default SendDocument;
