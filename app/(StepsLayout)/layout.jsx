'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import { useParams } from 'next/navigation';
import {getAPI} from "@/services/fetchAPI";
import {useState, useEffect} from 'react'

const MainLayout = ({ children }) => {
  const { id } = useParams()

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
            }
          ]
        },
        {
          id: '2',
          label: 'Tedarikçi Seç',
          path: `/stepbystep/${id}/2`,
          roles: ['company_manager']
        },
        {
          id: '3',
          label: 'Ürünler İçin Tarih Gir',
          path: `/stepbystep/${id}/3`,
          roles: ['company_manager']
        },
        {
          id: '5',
          label: 'Ürün maliyeti ve Çıkış tarihi',
          path: `/stepbystep/${id}/5`,
          roles: ['company_manager']
        },
        {
          id: '6',
          label: 'Gümrük',
          path: `/stepbystep/${id}/6`,
          roles: ['company_manager', 'logistic']
        },
        {
          id: '7',
          label: 'Cari Kontrolü',
          path: `/stepbystep/${id}/7`,
          childs: [
            {
              id: '7.1',
              label: 'Otomatik Teslim Tutanağı',
              path: `/stepbystep/${id}/7.1`,
              roles: ['company_manager', 'logistic']
            },
            {
              id: '7.2',
              label: 'Ek ücret',
              path: `/stepbystep/${id}/7.2`,
              roles: ['company_manager', 'logistic']
            }
          ]
        },
        {
          id: '8',
          label: 'Ürünlerin Bir Kısmı Teslim Edildi',
          path: `/stepbystep/${id}/8`,
          childs: [
            {
              id: '8.1',
              label: '8.1 Adım',
              path: `/stepbystep/${id}/8.1`,
              roles: ['company_manager', 'logistic']
            }
          ]
        },
        {
          id: '9',
          label: '9. Adım',
          path: `/stepbystep/${id}/9`,
          roles: ['company_manager', 'logistic']
        },
      ],
    },
  ];

  const [orderData, setOrderData] = useState([]);

  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    setOrderData(response.data.filter((ord) => id === ord.orderCode)[0]);
  };

  useEffect(() => {
    getAllOrderData()
  }, []);

  return (
    <div className='flex h-screen w-full overflow-hidden bg-background pb-4'>
      <Sidebar buttons={buttons} />

      <div className='flex flex-1 w-full flex-col h-full px-4 overflow-hidden gap-2'>
        {/* <Navbar /> */}

        <div className='flex flex-col flex-1 h-screen overflow-auto bg-background rounded-lg'>
          <div className="w-full flex py-2 px-4">
            <ul className='divide-x flex items-center gap-4 divide-gray-700 text-gray-300'>
              <li className=''>
                Oluşturma Tarihi:{' '}
                {orderData && orderData?.Orders && orderData?.Orders?.map(
                    (orders, index) =>
                        index == 0 &&
                        orders.createdAt
                            .split('T')[0]
                            .split('-')
                            .reverse()
                            .join('.')
                )}
              </li>
              <li className=''>
                Müşteri İsmi: {orderData && orderData.Müşteri && orderData.Müşteri[0]?.name}{' '}
                {orderData && orderData?.Müşteri && orderData.Müşteri[0]?.surname}
              </li>
              <li className=''>
                Firma İsmi: {orderData && orderData?.Müşteri && orderData.Müşteri[0]?.company_name}
              </li>
              <li className=''>Ürün Adedi: {orderData && orderData?.Orders && orderData.Orders.length}</li>
              <li className=''>
                Fiyat:{' '}
                {orderData && orderData?.Orders && orderData.Orders.reduce((total, order) => {
                  return (
                      total +
                      (order.productPrice + order.productFeaturePrice) *
                      order.stock
                  );
                }, 0)}
              </li>
              <li>
                Durum:{' '}
                <span className='text-xs font-medium rounded-full bg-blue-900 text-blue-300'>
                        {orderData && orderData?.Orders && orderData.Orders[0].ordersStatus}
                      </span>
              </li>
            </ul>
          </div>

          <div className='py-6 h-full w-full pl-6 md:pl-0'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
