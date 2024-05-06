'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

const Page = () => {
    const [checked, setChecked] = useState(true);

    return (
        <div className={'h-full w-full flex gap-4 items-center justify-center'}>
            <div class="flex flex-col w-full max-w-sm gap-4 border rounded p-4">
                <div className={'w-full flex items-center justify-between p-2 rounded'}>
                    <Label>Tüm Ürünler Teslim Edildi mi ?</Label>
                    <Checkbox
                        checked={checked}
                        onCheckedChange={(val) => setChecked(val)}
                    />
                </div>

                <div className={'w-full border mb-2'}></div>

                <Button onClick={() => {
                    console.log("Ürünlerin hepsi geldi, cari kontrol ediliyor... otomatik mail atılacak.")
                }} disabled={!checked} className={'w-full transition-all duration-300'}>
                    Cariyi Kontrol Et
                </Button>
            </div>
        </div>
    )
}

export default Page