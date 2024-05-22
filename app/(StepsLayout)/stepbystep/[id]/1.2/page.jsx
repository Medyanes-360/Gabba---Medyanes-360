'use client';

import SendDocument from '@/components/stepbystep/SendDocument';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const StepPage = () => {
  const { id } = useParams();

  return (
    <div className={'h-full w-full flex items-center justify-center'}>
      <div className='max-w-sm w-full flex flex-col gap-4'>
        <Label className={'text-xs'}>
          Açıklama: Müşteriden alınan ön ödeme miktarını burada giriniz.
        </Label>
        <Label>Cariye İşlenecek Ön Ödeme Miktarı</Label>
        <div className='flex gap-2 items-center'>
          <Input type={'number'} placeholder={'0'} />
        </div>
        <Button>Cariye işle</Button>
      </div>
    </div>
  );
};

export default StepPage;
