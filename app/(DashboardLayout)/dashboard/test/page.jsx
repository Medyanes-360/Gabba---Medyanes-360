"use client"
import CustomTable from '@/components/table/CustomTable'
import {langs} from '@/lib/table/data'
import {TestColumn} from '@/lib/table/table'
import React from 'react'

const Test = () => {
    return (
        <div>
            <CustomTable
                api_route="/test"
                columns={TestColumn}
                langs={langs}
                perPage={10}
                pagination={true}
                paginationType="page"
                defaultLang="Us"/>

        </div>
    )
}

export default Test
