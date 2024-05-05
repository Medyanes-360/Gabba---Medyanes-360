"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useParams } from "next/navigation";
import UserIcon from "@/assets/icons/UserIcon";
import LoadingScreen from "@/components/other/dashboardLoading";
import { signIn, signOut, useSession } from "next-auth/react";

const LoadingContext = createContext();

const MainLayout = ({ children }) => {
  // Context oluşturuluyor
  const [isLoading, setIsLoading] = useState(false);

  const buttons = [
    {
      title: "Panel",
      roles: ['company_manager', 'manager'],
      buttons: [
        {
          id: "1.1",
          icon: UserIcon,
          label: "Şirket",
          path: "/dashboard/company",
          roles: ['company_manager']
        },
        {
          id: "1.2",
          icon: UserIcon,
          label: "Mağaza",
          path: "/dashboard/store",
          roles: ['company_manager', 'manager']
        },
        {
          id: "1.3",
          label: "Çalışan",
          icon: UserIcon,
          path: "/dashboard/personal",
          roles: ['company_manager', 'manager']
        },
        {
          id: "1.4",
          label: "Tedarikçi",
          icon: UserIcon,
          path: "/dashboard/suplier",
          roles: ['company_manager', 'manager', 'personal']
        },
        {
          id: "1.5",
          label: "Gider",
          icon: UserIcon,
          path: "/dashboard/expense",
          roles: ['company_manager', 'manager', 'personal']
        },
      ],
    },
    {
      title: "Diğerleri",
      roles: ['company_manager', 'manager', 'personal'],
      buttons: [
        {
          id: "1.4",
          label: "Stok",
          icon: UserIcon,
          childs: [
            {
              id: "1.4.1",
              label: "Stok",
              icon: UserIcon,
              path: "/dashboard/stock",
              roles: ['company_manager', 'manager', 'personal']
            },
            {
              id: "1.4.2",
              label: "Stok Kontrol",
              icon: UserIcon,
              path: "/dashboard/stock-control",
              roles: ['company_manager', 'manager', 'personal']
            },
          ],
        },
      ],
    },
  ];

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div className="flex h-screen w-full overflow-hidden bg-background pb-4 relative">
        <LoadingScreen isloading={isLoading} />
        <Sidebar buttons={buttons} />
        <div className="flex flex-1 w-full flex-col h-full px-4 overflow-hidden gap-2">
          <div className="flex flex-col flex-1 h-full overflow-auto bg-background rounded-lg">
            <div className="w-full flex py-2 px-4">
              <ul className='divide-x flex items-center gap-4 divide-gray-700 text-gray-300'>
                <li className=''>
                  Oluşturma Tarihi:{' '}
                  {item.Orders.map(
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
                  Müşteri İsmi: {item.Müşteri[0]?.name}{' '}
                  {item.Müşteri[0]?.surname}
                </li>
                <li className=''>
                  Firma İsmi: {item.Müşteri[0]?.company_name}
                </li>
                <li className=''>Ürün Adedi: {item.Orders.length}</li>
                <li className=''>
                  Fiyat:{' '}
                  {item.Orders.reduce((total, order) => {
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
                        {item.Orders[0].ordersStatus}
                      </span>
                </li>
              </ul>
            </div>

            <div className="py-6 w-full pl-6 md:pl-0">{children}</div>
          </div>
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

// Alt bileşenlerde LoadingContext'i kullanmak için bir custom hook oluşturuluyor
export const useLoadingContext = () => {
  return useContext(LoadingContext);
};

export default MainLayout;
