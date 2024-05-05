'use client'

import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {getAPI} from "@/services/fetchAPI";
import {Input} from "@/components/ui/input";

const StepPage = () => {
    const [tedarikci, setTedarikci] = useState('')
    const [data, setData] = useState([])

    const getTedarikciId = () => {
        const filtered = data.filter((dt) => dt.firma === tedarikci)

        if (filtered.length === 0) {
            return null
        }

        return filtered[0].id
    }

    const getData = async () => {
        const dt = await getAPI('/suplier')
        setData(dt.data)
    }

    useEffect(() => {
        getData()
    }, [])

  return (
      <div className={'h-full w-full flex items-center justify-center'}>
          <div className="max-w-sm w-full flex flex-col gap-4">
              <Label>Lütfen bir tedarikçi seçiniz.</Label>
              <Select disabled={data.length === 0} onValueChange={(value) => setTedarikci(value)}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tedarikçiler" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          <SelectLabel>Tedarikçi Listesi</SelectLabel>
                          {data.map((item, i) => {
                              console.log(item)
                              return <SelectItem key={item.id} value={item.firma}>{item.firma}</SelectItem>
                          })}
                      </SelectGroup>
                  </SelectContent>
              </Select>

              <Input type={"text"} className={"w-full"} placeholder={"Tedarikciye Gonderilecek Aciklama"}/>

              <Button onClick={() => {
                  console.log(getTedarikciId())
              }}>Tedarikciye verileri gonder</Button>
          </div>
      </div>
  )
}

export default StepPage