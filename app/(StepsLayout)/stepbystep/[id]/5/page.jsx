'use client'

import {useEffect, useState} from "react";
import {getAPI} from "@/services/fetchAPI";
import {useParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/table/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "@/components/ui/input";

const StepPage = () => {
    const { id } = useParams();
    const [data, setData] = useState([])
    const [date, setDate] = useState()
    const [maliyet, setMaliyet] = useState(0)

    const getAllOrderData = async () => {
        const response = await getAPI("/createOrder/order");
        const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
        console.log(filtered)
        setData(filtered);
    };
    useEffect(() => {
        getAllOrderData();
    }, []);

    return (
        <div className={'flex h-full w-full items-center justify-center'}>
            <div class="max-w-sm w-full flex flex-col gap-2">
                <Label>Her Ürün İçin Tarih Ve Maliyet Bilgisi Giriniz.</Label>
                <Label className={'text-muted-foreground text-xs m-0'}>Ürünler:</Label>

                {data && data?.Ürünler?.map((item) => <div
                    className={'flex flex-col w-fit border shadow-sm rounded p-2 gap-2'}>
                    <div className={'flex items-center gap-2 [&_span]:text-sm mx-auto w-fit'}>
                        <span>{item.selectedCategoryValues}</span>
                        -
                        <span>{item.productName}</span>
                        -
                        <span>{item.productPrice} TL</span>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <div class="flex gap-2 items-center">
                        <Input type={'number'} placeholder={'0 TL'}/>
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default StepPage