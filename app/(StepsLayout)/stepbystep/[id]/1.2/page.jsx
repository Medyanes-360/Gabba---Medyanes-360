"use client";

import SendDocument from "@/components/stepbystep/SendDocument"
import { useParams } from "next/navigation";

const StepPage = () => {
  const { id } = useParams();

  return <div>
    Adımda da alınan ön ödeme miktarı girilecek ve cariye işlenecek. bir sonraki adıma geçilecek.
  </div>;
};

export default StepPage;
