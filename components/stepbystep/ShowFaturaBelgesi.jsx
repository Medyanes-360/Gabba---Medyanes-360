import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const ShowFaturaBelgesi = ({ id }) => {
  return (
    <>
      <div className='w-full flex p-2 mt-2'>
        <div className='flex items-center justify-end w-full text-gray-600 py-2'>
          <div className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 px-4 py-2 bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white transition-all duration-200 ease-in-out w-full>'>
            <span className='mr-4'>Faturayı Göster:</span>
            <div className='flex flex-col items-center pt-4'>
              <div className='flex my-4 gap-2'>
                <Link href={`/fatura-belgesi?id=${id}&lang=en`}>
                  <Image
                    className='w-6 h-6 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                    src='/en_flag.svg'
                    width={100}
                    height={100}
                    alt='Invoice icon'
                  />
                </Link>
                <Link href={`/fatura-belgesi?id=${id}&lang=ua`}>
                  <Image
                    className='w-6 h-6 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                    src='/ua_flag.svg'
                    width={100}
                    height={100}
                    alt='Invoice icon'
                  />
                </Link>
                <Link href={`/fatura-belgesi?id=${id}&lang=tr`}>
                  <Image
                    className='w-6 h-6 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                    src='/tr_flag.svg'
                    width={100}
                    height={100}
                    alt='Invoice icon'
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowFaturaBelgesi;
