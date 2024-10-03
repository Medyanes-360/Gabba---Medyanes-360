import React from 'react';
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
import { FaInfoCircle } from 'react-icons/fa';

const ShowEachProductStep = ({ orderData, stepByStepData }) => {
  return (
    <>
      <div className='w-full flex p-2 mt-2'>
        <div className='flex items-center justify-end w-full text-gray-600 py-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                className='w-full bg-slate-800 text-white hover:bg-slate-800/90 hover:text-white transition-all duration-200 ease-in-out'
              >
                Ürünler Hangi Adımda?
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-center'>
                  Aşağıda ürünlerin hangi adımda kaldığını görebilirsiniz!
                </AlertDialogTitle>
                {orderData &&
                  orderData?.Orders?.map((item, index) => {
                    // stepByStepData'daki orderId ve step değerlerini kontrol et
                    const matchingStepData =
                      stepByStepData &&
                      stepByStepData?.length > 0 &&
                      stepByStepData.find(
                        (stepItem) =>
                          stepItem.orderId === item.id && stepItem.step >= 6
                      );
                    if (matchingStepData) {
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
                            <FaInfoCircle
                              className='text-blue-600 ml-2'
                              size='20'
                            />
                            <span>
                              {
                                orderData?.Ürünler[index]
                                  ?.selectedCategoryValues
                              }
                            </span>
                            -
                            <span>
                              {orderData?.Ürünler[index]?.productName}
                            </span>
                            -
                            <span>
                              {(item.productPrice + item.productFeaturePrice) *
                                item.stock}
                            </span>
                          </div>
                          <p className='text-sm'>
                            Bu ürün {''}
                            <span className='p-1 rounded bg-gray-500'>
                              {matchingStepData.stepName}
                            </span>{' '}
                            kısmında kalmıştır.
                          </p>
                        </div>
                      );
                    }

                    const doesntMatchData =
                      stepByStepData &&
                      stepByStepData?.length > 0 &&
                      stepByStepData.find(
                        (stepItem) =>
                          stepItem.orderId === item.id && stepItem.step < 6
                      );

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
                            <FaInfoCircle
                              className='text-blue-600 ml-2'
                              size='20'
                            />
                            <span>
                              {
                                orderData?.Ürünler[index]
                                  ?.selectedCategoryValues
                              }
                            </span>
                            -
                            <span>
                              {orderData?.Ürünler[index]?.productName}
                            </span>
                            -
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
                {stepByStepData && !stepByStepData?.length > 0 && (
                  <p>
                    Ürünlerin adımları ile ilgili veri eklenmesi bekleniyor...
                  </p>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Kapat</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default ShowEachProductStep;
