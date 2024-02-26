import React from 'react'
import { personelColumn } from "@/lib/table/table";
import { langs } from "@/lib/table/data";
import CustomTable from '@/components/table/CustomTable';

const Addperson = () => {
  return (
    <div>
      <CustomTable
        api_route="/personal"
        columns={personelColumn}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType="page"
        defaultLang="Us" />
    </div>
  )
}

export default Addperson
