"use client";

import SendDocument from "@/components/stepbystep/SendDocument"
import { useParams } from "next/navigation";

const StepPage = () => {
  const { id } = useParams();

  return <>
    <SendDocument lang={"tr"} id={id} />
    Müşteriye Fiş Maili gönderildiğinde bir sonraki adıma 1.1.adıma geçilecek (açılacak).
  </>;
};

export default StepPage;
