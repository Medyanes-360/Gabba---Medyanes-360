"use client";

import SendDocument from "@/components/stepbystep/SendDocument"
import { useParams } from "next/navigation";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {PlusCircle} from "lucide-react";

const StepPage = () => {
  const { id } = useParams();
  const [extras, setExtras] = useState([
    {
      price: '',
      description: '',
    }
  ]);

  const handleAddExtras = () => {
    setExtras((prev) => [...prev, {
      price: '',
      description: '',
    }])
  }

  return <div className={'h-full w-full flex items-center justify-center'}>
    <div className="max-w-lg w-full flex flex-col gap-4">
      <Label>Cariye İşlenecek Ekstra Ücretleri Giriniz.</Label>

      {extras.map((extra, i) => (
          <div className="flex items-center w-full gap-2">
            <div className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                <path
                    d="M7 12.1429V20H11.8889C15.8162 20 19 16.8162 19 12.8889V12M7 12.1429V8.14286M7 12.1429L5 13M7 12.1429L12 10M7 8.14286V4M7 8.14286L5 9M7 8.14286L12 6"
                    stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <Input
                  type={'number'}
                  value={extra.price}
                  onChange={(e) => setExtras(prev => {
                    const updatedExtras = [...prev];
                    updatedExtras[i] = { ...updatedExtras[i], price: e.target.value };
                    return updatedExtras;
                  })}
                  placeholder={'0 TL'}
              />

            </div>

            <Input
                type={'text'}
                value={extra.description}
                onChange={(e) => setExtras(prev => {
                  const updatedExtras = [...prev];
                  updatedExtras[i] = { ...updatedExtras[i], description: e.target.value };
                  return updatedExtras;
                })}
                placeholder={'Ek ücret için açıklama giriniz.'}
            />
          </div>
      ))}

      <button
          className={'w-full rounded bg-[#dedede]/20 hover:bg-[#dedede]/40 transition-all duration-200 ease-in-out py-3 flex items-center justify-center text-black text-sm gap-2 font-medium'}
          onClick={handleAddExtras}>
        <PlusCircle size={20}/>
        Ekstra Ekle
      </button>

      <Button onClick={() => {
        console.log(extras)
      }}>
        Cariye İşle
      </Button>
    </div>
  </div>;
};

export default StepPage;
