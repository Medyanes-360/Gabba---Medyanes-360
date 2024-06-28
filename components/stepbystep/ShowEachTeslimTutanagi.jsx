import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getAPI } from '@/services/fetchAPI';

import Link from 'next/link';
import Image from 'next/image';

const ShowEachTeslimTutanagi = ({ id }) => {
  const [teslimTutanagi, setTeslimTutanagi] = useState([]);

  const getTeslimTutanagi = async () => {
    const response = await getAPI(`/stepByStep/teslimTutanagi?orderCode=${id}`);
    const uniqueCodes = new Set();
    const filteredData = response.data.filter((item) => {
      const isDuplicate = uniqueCodes.has(item.teslimTutanagiKodu);
      uniqueCodes.add(item.teslimTutanagiKodu);
      return !isDuplicate;
    });
    setTeslimTutanagi(filteredData);
  };

  useEffect(() => {
    getTeslimTutanagi();
  }, []);
  console.log(teslimTutanagi);
  return (
    <div className='w-full flex p-2 mt-2'>
      <div className='flex items-center justify-end w-full text-gray-600 py-2'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='outline'
              className='w-full bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white transition-all duration-200 ease-in-out'
            >
              Teslim Tutanaklarını Göster
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='max-w-4xl'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-center mb-10'>
                Aşağıda bu teklife ait teslim tutanaklarını görebilirsiniz!
              </AlertDialogTitle>
              <ul className='flex gap-4 flex-col justify-center items-center'>
                {teslimTutanagi &&
                  teslimTutanagi?.length > 0 &&
                  teslimTutanagi.map((item) => (
                    <li className='flex gap-3 items-center justify-center'>
                      <span className='text-xl'>{item.teslimTutanagiKodu}</span>{' '}
                      <Link
                        href={`/teslim-tutanagi?id=${id}&lang=en&teslimKod=${item.teslimTutanagiKodu}`}
                      >
                        <Image
                          className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                          src='/en_flag.svg'
                          width={100}
                          height={100}
                          alt='Invoice icon'
                        />
                      </Link>
                      <Link
                        href={`/teslim-tutanagi?id=${id}&lang=ua&teslimKod=${item.teslimTutanagiKodu}`}
                      >
                        <Image
                          className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                          src='/ua_flag.svg'
                          width={100}
                          height={100}
                          alt='Invoice icon'
                        />
                      </Link>
                      <Link
                        href={`/teslim-tutanagi?id=${id}&lang=tr&teslimKod=${item.teslimTutanagiKodu}`}
                      >
                        <Image
                          className='w-8 h-8 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                          src='/tr_flag.svg'
                          width={100}
                          height={100}
                          alt='Invoice icon'
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kapat</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ShowEachTeslimTutanagi;
