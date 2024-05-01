"use client";

import SendDocument from "@/components/stepbystep/SendDocument"
import { useParams } from "next/navigation";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

const StepPage = () => {
  const { id } = useParams();

  return <div className={'h-full w-full flex items-center justify-center'}>
    <div className="max-w-sm w-full flex flex-col gap-4">
      <Label>Cariye İşlenecek Ön Ödeme Miktarı</Label>
      <div className="flex gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
          <path
              d="M7 12.1429V20H11.8889C15.8162 20 19 16.8162 19 12.8889V12M7 12.1429V8.14286M7 12.1429L5 13M7 12.1429L12 10M7 8.14286V4M7 8.14286L5 9M7 8.14286L12 6"
              stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <Input type={'number'} placeholder={'0 TL'}/>
      </div>
      <Button>Cariye işle</Button>
    </div>
  </div>;
};

export default StepPage;
