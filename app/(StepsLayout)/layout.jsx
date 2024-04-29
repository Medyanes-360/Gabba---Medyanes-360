'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import { useParams } from 'next/navigation';

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
          path: `/stepbystep/${id}/2`
        },
        {
          id: '3',
          label: 'Ürünler İçin Tarih Gir',
          path: `/stepbystep/${id}/3`
        },
        {
          id: '5',
          label: 'Ürüm maliyeti ve Çıkış tarihi',
          path: `/stepbystep/${id}/5`,
        },
        {
          id: '6',
          label: 'Gümrük',
          path: `/stepbystep/${id}/6`,
        },
        {
          id: '7',
          label: '7. Adım',
          path: `/stepbystep/${id}/7`,
          childs: [
            {
              id: '7.1',
              label: '7.1 Adım',
              path: `/stepbystep/${id}/7.1`,
            },
            {
              id: '7.2',
              label: '7.2 Adım',
              path: `/stepbystep/${id}/7.2`,
            }
          ]
        },
        {
          id: '8',
          label: '8. Adım',
          path: `/stepbystep/${id}/8`,
          childs: [
            {
              id: '8.1',
              label: '8.1 Adım',
              path: `/stepbystep/${id}/8.1`,
            }
          ]
        },
        {
          id: '9',
          label: '9. Adım',
          path: `/stepbystep/${id}/9`,
        },
      ],
    },
  ];


  return (
    <div className='flex h-screen w-full overflow-hidden bg-background pb-4'>
      <Sidebar buttons={buttons} />

      <div className='flex flex-1 w-full flex-col h-full px-4 overflow-hidden gap-2'>
        {/* <Navbar /> */}

        <div className='flex flex-1 h-full overflow-auto bg-background rounded-lg'>
          <div className='py-6 w-full pl-6 md:pl-0'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
