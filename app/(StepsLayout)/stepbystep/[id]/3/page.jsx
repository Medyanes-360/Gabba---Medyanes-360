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

const StepPage = () => {
    const { id } = useParams();
    const [data, setData] = useState([])
    const [date, setDate] = useState()

    const getAllOrderData = async () => {
        const response = await getAPI("/createOrder/order");
        const filtered = response.data?.filter((fl) => fl.orderCode === id)[0];
        setData(filtered);
    };
    useEffect(() => {
        getAllOrderData();
    }, []);

  return (
    <div className={'flex h-full w-full items-center justify-center'}>
        <div className="max-w-sm w-full flex flex-col gap-2">
            <Label className={"text-xs"}>
                Açıklama : Bu bölümde siparişlerin tedarikçi tarafından yüklendiği tarih bilgisi girilir, buna göre tedarikçi tarafından ürünlerin birim bazında ne zaman yüklendiği belirlenir.
            </Label>
            <Label>Her Ürün İçin Tarih Giriniz.</Label>
            <Label className={'text-muted-foreground text-xs m-0'}>Ürünler:</Label>

            {data && data?.Ürünler?.map((item, index) => <div key={item.id} className={'flex flex-col w-full border shadow-sm rounded p-2 gap-2'}>
                <div className={'flex items-center gap-2 [&_span]:text-sm mx-auto w-fit'}>
                    <span>{item.selectedCategoryValues}</span>
                    -
                    <span>{item.productName}</span>
                    -
                    <span>{item.productPrice} </span>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date[index] && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date[index] ? format(date[index], "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Calendar
                            mode="single"
                            selected={date[index]}
                            onSelect={(newDate) => setDate((prev) => ({...prev, [index]: newDate}))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>)}

            <Button className={"w-full"}>Tarihleri Guncelle</Button>
        </div>
    </div>
  )
}

export default StepPage