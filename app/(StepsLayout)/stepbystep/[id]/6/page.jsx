'use client'

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getAPI} from "@/services/fetchAPI";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

const StepPage = () => {
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
      <div className={'flex h-full w-full items-center justify-center'}>
          <div className="max-w-sm w-full flex flex-col gap-2">
              <Label>Stoklara eklenecek ürünleri seçiniz.</Label>
              <Label className={'text-muted-foreground text-xs m-0'}>Ürünler:</Label>

              {data && data?.Ürünler?.map((item, index) => <div
                  key={item.id}
                  className={`flex flex-col w-full ${(checked[index] ?? false) ? 'bg-[#dedede]/50' : ''} transition-all duration-200 ease-in-out border shadow-sm rounded p-2 gap-2`}>
                  <div className={'flex items-center gap-2 [&_span]:text-sm w-full w-fit'}>
                      <Checkbox
                          checked={checked[index] ?? false}
                          onCheckedChange={(value)=> setChecked((prev) => ({...prev, [index]: value})) }
                          className={'mr-4'}/>
                      <span>{item.selectedCategoryValues}</span>
                      -
                      <span>{item.productName}</span>
                      -
                      <span>{item.productPrice} TL</span>
                  </div>
              </div>)}
              <Button onClick={() => {
                  console.log(checked)
              }}>
                  Mağaza Stoklarına Ekle
              </Button>
          </div>
      </div>
  )
}

export default StepPage