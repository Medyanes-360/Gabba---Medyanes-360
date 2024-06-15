'use client';
import Sidebar from '@/components/stepByStepDashboard/Sidebar';
import { useParams } from 'next/navigation';
import { getAPI } from '@/services/fetchAPI';
import { useState, useEffect, createContext, useContext } from 'react';
import LoadingScreen from '@/components/other/dashboardLoading';

const LoadingContext = createContext();
const StepByStepDataContext = createContext();

const StepsLayout = ({ children }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const buttons = [
    {
      title: 'Siparişinizi Tamamlayın',
      buttons: [
        {
          id: '1',
          label: 'Fişi Gör Veya Gönder',
          path: `/stepbystep/${id}/1`,
          roles: ['company_manager', 'manager', 'personal'],
          childs: [
            {
              id: '1.1',
              label: 'Fişi Gör Veya Gönder',
              path: `/stepbystep/${id}/1.1`,
            },
            {
              id: '1.2',
              label: 'Ön Ödeme Miktarı',
              path: `/stepbystep/${id}/1.2`,
            },
          ],
        },
        {
          id: '2',
          label: 'Tedarikçi Seç',
          path: `/stepbystep/${id}/2`,
          roles: ['company_manager'],
        },
        {
          id: '3',
          label: 'Tedarikçi Yükleme Tarihi',
          path: `/stepbystep/${id}/3`,
          roles: ['company_manager'],
        },
        {
          id: '5',
          label: 'Ürün maliyeti ve Çıkış tarihi',
          path: `/stepbystep/${id}/5`,
          roles: ['company_manager'],
        },
        {
          id: '6',
          label: 'Gümrük',
          path: `/stepbystep/${id}/6`,
          roles: ['company_manager', 'logistic'],
        },
        {
          id: '7',
          label: 'Cari Kontrolü',
          path: `/stepbystep/${id}/7`,
          childs: [
            {
              id: '7.1',
              label: 'Teslim Tutanağı',
              path: `/stepbystep/${id}/7.1`,
              roles: ['company_manager', 'logistic'],
            },
            {
              id: '7.2',
              label: 'Ek ücret',
              path: `/stepbystep/${id}/7.2`,
              roles: ['company_manager', 'logistic'],
            },
          ],
        },
        {
          id: '8',
          label: 'Ürünlerin Bir Kısmı Teslim Edildi',
          path: `/stepbystep/${id}/8`,
          childs: [
            {
              id: '8.1',
              label: 'Cari Kontrol',
              path: `/stepbystep/${id}/8.1`,
              roles: ['company_manager', 'logistic', 'manager', 'personal'],
            },
          ],
        },
        {
          id: '9',
          label: 'İşlem Sonu Cari Kontrol',
          path: `/stepbystep/${id}/9`,
          roles: ['company_manager', 'logistic', 'manager', 'personal'],
        },
      ],
    },
    {
      title: 'Siparişinizin Durumunu Değiştirin',
      buttons: [
        {
          id: '99',
          label: 'Sipariş Durumu',
          path: `/stepbystep/${id}/siparis-durumu`,
          roles: ['company_manager', 'logistic', 'manager', 'personal'],
        },
      ],
    },
  ];

  //Tekliflerin datasını bu state tutar.
  const [orderData, setOrderData] = useState([]);

  // Context'de kullanacağımız stepbystep datasını aktarıyoruz.
  const [stepByStepData, setStepByStepData] = useState([]);

  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

  const getAllOrderData = async () => {
    setIsLoading(true);

    try {
      const response1 = await getAPI('/createOrder/order');
      const response2 = await getAPI(`/stepByStep?orderCode=${id}`);

      const responseOrderData = response1.data;
      const responseStepByStepData = response2.data;

      const order = responseOrderData.find((ord) => id === ord.orderCode);

      if (order) {
        setOrderData(order);
        setStepByStepData(responseStepByStepData);

        const totalOrderAmounts = order.Orders.reduce((total, order) => {
          return (
            total +
            (order.productPrice + order.productFeaturePrice) * order.stock
          );
        }, 0);

        setTotalOrderAmount(totalOrderAmounts);
      } else {
        // handle case where order is not found
        console.error('Order not found');
      }
    } catch (error) {
      console.error('Failed to fetch order data:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getAllOrderData();
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <StepByStepDataContext.Provider
        value={{ stepByStepData, setStepByStepData, orderData }}
      >
        <div className='flex h-screen w-full overflow-hidden bg-background pb-4'>
          <LoadingScreen isloading={isLoading} />

          <Sidebar buttons={buttons} stepByStepData={stepByStepData} />

          <div className='flex flex-1 w-full flex-col h-full px-4 overflow-hidden gap-2'>
            {/* <Navbar /> */}

            <div className='flex flex-col flex-1 h-screen overflow-auto bg-background rounded-lg'>
              <div className='w-full flex p-2 border-b border-r border-l shadow-md'>
                <ul className='flex items-center justify-around w-full text-gray-600 py-2'>
                  <li className=''>
                    Oluşturma Tarihi:{' '}
                    {orderData &&
                      orderData?.Orders &&
                      orderData?.Orders?.map(
                        (orders, index) =>
                          index == 0 &&
                          orders.createdAt
                            .split('T')[0]
                            .split('-')
                            .reverse()
                            .join('.')
                      )}
                  </li>
                  <li className='underline'>
                    Müşteri İsmi:{' '}
                    {orderData &&
                      orderData.Müşteri &&
                      orderData.Müşteri[0]?.name}{' '}
                    {orderData &&
                      orderData?.Müşteri &&
                      orderData.Müşteri[0]?.surname}
                  </li>
                  <li className='underline'>
                    Firma İsmi:{' '}
                    {orderData &&
                      orderData?.Müşteri &&
                      orderData.Müşteri[0]?.company_name}
                  </li>
                  <li className='underline'>
                    Ürün Adedi:{' '}
                    {orderData && orderData?.Orders && orderData.Orders.length}
                  </li>
                  <li className='underline'>
                    Fiyat:{' '}
                    {orderData &&
                      orderData?.Orders &&
                      orderData.Orders.reduce((total, order) => {
                        return (
                          total +
                          (order.productPrice + order.productFeaturePrice) *
                            order.stock
                        );
                      }, 0)}
                  </li>
                  <li>
                    Durum:{' '}
                    <span className='text-xs px-3 py-1.5 rounded-full bg-blue-900 text-blue-100 font-semibold'>
                      {orderData &&
                        orderData?.Orders &&
                        orderData.Orders[0].ordersStatus}
                    </span>
                  </li>
                </ul>
              </div>
              {/* Müşterinin Bilgileri */}
              <div className='w-full flex p-2 border-b border-r border-l shadow-md mt-2'>
                <ul className='flex items-center justify-around w-full text-gray-600 py-2'>
                  <li className=''>
                    Müşterinin Ödediği Tutar:{' '}
                    {stepByStepData && (stepByStepData[0]?.onOdemeMiktari ?? 0)}
                  </li>
                  <li>
                    Müşterinin Kalan Borcu:{' '}
                    {orderData ? (
                      <>
                        {stepByStepData ? (
                          <>
                            {(() => {
                              const totalAmount = orderData.Orders?.reduce(
                                (total, order) => {
                                  return (
                                    total +
                                    (order.productPrice +
                                      order.productFeaturePrice) *
                                      order.stock
                                  );
                                },
                                0
                              );
                              const paidAmount =
                                stepByStepData[0]?.onOdemeMiktari ?? 0;
                              return totalAmount - paidAmount;
                            })()}
                          </>
                        ) : (
                          'Step by step data bulunamadı.'
                        )}
                      </>
                    ) : (
                      'Order data bulunamadı.'
                    )}
                  </li>
                  <li>
                    Bekleyen Ürün Sayısı:{' '}
                    {orderData && orderData?.Orders && orderData.Orders.length}
                  </li>
                  <li>Teslim Edilen Ürün Sayısı: 0</li>
                </ul>
              </div>
              <div className='py-6 h-full w-full pl-6 md:pl-0'>{children}</div>
            </div>
          </div>
        </div>
      </StepByStepDataContext.Provider>
    </LoadingContext.Provider>
  );
};

export default StepsLayout;

// Alt bileşenlerde LoadingContext'i kullanmak için bir custom hook oluşturuluyor
export const useLoadingContext = () => {
  return useContext(LoadingContext);
};

export const useStepByStepDataContext = () => {
  return useContext(StepByStepDataContext);
};
