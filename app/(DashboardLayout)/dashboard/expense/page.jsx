import React from 'react';

import CustomTable from '@/components/table/CustomTable';
import { langs } from '@/lib/table/data';
import { expenseColumns } from '@/lib/table/table';

const Addcompany = () => {
  return (
    <>
      <CustomTable
        api_route='/expense'
        columns={expenseColumns}
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
