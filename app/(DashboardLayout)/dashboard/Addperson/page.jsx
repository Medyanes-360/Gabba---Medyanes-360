import React from 'react'
import {personelColumn} from "@/lib/table/table";
import {personnel, langs} from "@/lib/table/data";
import CustomTable from '@/components/table/CustomTable';

const Addperson = () => {
  return (
    <div>
         <CustomTable   columns={personelColumn}
                    langs={langs}
                    initial_dt={personnel}
                    perPage={10}
                    pagination={true}
                    paginationType="page"
                    defaultLang="Us"/>

    </div>
  )
}

export default Addperson
