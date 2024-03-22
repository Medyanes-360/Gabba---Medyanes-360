import React from 'react'
import { personelColumn } from "@/lib/table/table";
import { langs } from "@/lib/table/data";
import CustomTable from '@/components/table/CustomTable';

const Addperson = () => {
  // next-auth kurulunca güncellenecek
  const role = "company_manager"
  return (
    <div>
      <CustomTable
        api_route="/personal"
        columns={personelColumn(role)}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType="page"
        defaultLang="Us" />
    </div>
  )
}

export default Addperson
