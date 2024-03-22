'use client'
import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { langs } from '@/lib/table/data';
import { expenseColumns } from '@/lib/table/table';

const Addcompany = () => {
  // next-auth kurulunca güncellenecek
  const role = "company_manager"
  return (
    <>
      <CustomTable
        api_route='/expense'
        columns={expenseColumns(role)}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType='page'
        defaultLang='Us'
      />
    </>
  );
};

export default Addcompany;
