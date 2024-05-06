'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {useParams} from "next/navigation";
import {getAPI} from "@/services/fetchAPI";

const Page = () => {
    const { id } = useParams();
    const [data, setData] = useState([])
    const [checked, setChecked] = useState({});

    const getAllOrderData = async () => {
        const response = await getAPI("/createOrder/order");
        const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
        setData(filtered);
    };
    useEffect(() => {
        getAllOrderData();
    }, []);

    return (
        <div className={'h-full w-full flex gap-4 items-center justify-center'}>
            <div class="flex flex-col w-full max-w-sm gap-4">
                {data && data?.Ürünler?.map((item, index) => <div
                    key={item.id}
                    className={`flex flex-col w-full ${(checked[index] ?? false) ? 'bg-[#dedede]/50' : ''} transition-all duration-200 ease-in-out border shadow-sm rounded p-2 px-4 gap-2`}>
                    <div className={'flex items-center gap-2 [&_span]:text-sm w-full w-fit'}>
                        <Checkbox
                            checked={checked[index] ?? false}
                            onCheckedChange={(value)=> setChecked((prev) => ({...prev, [index]: value})) }
                            className={'mr-4'}/>

                        <div className="flex flex-col gap-1 w-full">
                            <Label className={'w-full'}>Bu ürün teslim edildi mi ?</Label>

                            <div className={'flex items-center w-full gap-2'}>
                                <span>{item.selectedCategoryValues}</span>
                                -
                                <span>{item.productName}</span>
                                -
                                <span>{item.productPrice}</span>
                            </div>
                        </div>

                    </div>
                </div>)}

                <Button onClick={() => {
                    console.log("Ürünlerin hepsi geldi, cari kontrol ediliyor... otomatik mail atılacak.")
                    console.log(checked)
                }} disabled={!checked} className={'w-full transition-all duration-300'}>
                    Cariyi Kontrol Et
                </Button>
            </div>
        </div>
    )
}

export default Page