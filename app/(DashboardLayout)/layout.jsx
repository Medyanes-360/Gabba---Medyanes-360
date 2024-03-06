'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import { useParams } from 'next/navigation'
import UserIcon from '@/assets/icons/UserIcon';

const MainLayout = ({ children }) => {
  const { id } = useParams()

  const buttons = [
    {
      title: 'Panel',
      buttons: [
        {
          id: '1.1',
          icon: UserIcon,
          label: 'Şirket',
          path: '/dashboard/company',
        },
        {
          id: '1.2',
          icon: UserIcon,
          label: 'Mağaza',
          path: '/dashboard/store',
        },
        {
          id: '1.3',
          label: 'Çalışan',
          icon: UserIcon,
          path: '/dashboard/personal',
        },
        {
          id: '1.4',
          label: 'Tedarikçi',
          icon: UserIcon,
          path: '/dashboard/suplier',
        },
        {
          id: '1.5',
          label: 'Gider',
          icon: UserIcon,
          path: '/dashboard/expense',
        },
      ],
    },
    {
      title: 'Diğerleri',
      buttons: [
        {
          id: '1.4',
          label: 'Stok',
          icon: UserIcon,
          childs: [
            {
              id: '1.4.1',
              label: 'Stok',
              icon: UserIcon,
              path: '/dashboard/stock',
            },
            {
              id: '1.4.2',
              label: 'Stok Kontrol',
              icon: UserIcon,
              path: '/dashboard/stock-control',
            },
          ],
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
