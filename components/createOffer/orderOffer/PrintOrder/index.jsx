/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { FaPrint } from 'react-icons/fa6';

import { useReactToPrint } from 'react-to-print';

const langs = {
  order: {
    tr: 'SIRA',
    ua: 'ПОРЯДОК',
    en: 'ORDER',
  },
  image: {
    tr: 'RESİM',
    ua: 'ЗОБРАЖЕННЯ',
    en: 'IMAGE',
  },
  productFeatures: {
    tr: 'ÜRÜN ÖZELLİKLERİ',
    ua: 'ХАРАКТЕРИСТИКИ ТОВАРУ',
    en: 'PRODUCT FEATURES',
  },
  price: {
    tr: 'FİYAT',
    ua: 'ЦІНА',
    en: 'PRICE',
  },
  quantity: {
    tr: 'ADET',
    ua: 'КІЛЬ',
    en: 'QUANTITY',
  },
  total: {
    tr: 'TOPLAM',
    ua: 'СУМА',
    en: 'TOTAL',
  },
  indirimTutari: {
    tr: 'İNDİRİM TUTARI',
    ua: 'ССУМА ЗНИЖКИУМА',
    en: 'DISCOUNT AMOUNT',
  },
  sonTutar: {
    tr: 'SON TUTAR',
    ua: 'ОСТАТОЧНА СУМА',
    en: 'FINAL AMOUNT',
  },
  notFound: {
    tr: 'Bulunamadı',
    ua: 'Не знайдено',
    en: 'Not Found',
  },
  teklifNo: {
    tr: 'Teklif no',
    ua: 'Тендер №',
    en: 'Quotation No',
  },
  invoice: {
    tr: 'Fatura',
    ua: 'Рахунок',
    en: 'Invoice',
  },
  date: {
    tr: 'Tarih',
    ua: 'Дата',
    en: 'Date',
  },
  firmaBilgileri: {
    tr: 'Firma Bilgileri',
    ua: 'Інформація про компанію',
    en: 'Company Information',
  },
  toplam: {
    tr: 'Toplam',
    ua: 'Всього',
    en: 'Total',
  },
  vergi: {
    tr: 'Vergi',
    ua: 'Податок',
    en: 'Tax',
  },
  genelToplam: {
    tr: 'Genel Toplam',
    ua: 'Загальна сума',
    en: 'Grand Total',
  },
  indirmeButonu: {
    tr: 'Teklifi İndir',
    ua: 'Завантажити пропозицію',
    en: 'Download Offer',
  },
};

const Invoice = ({ data, lang }) => {
  const printRef = useRef(null);
  const [indirimOrani, setIndirimOrani] = useState(0);
  const [kdvOrani, setKdvOrani] = useState(0);

  function filterDataByOrderId() {
    {
      /* Datayı başlangıç için hazırlıyoruz müşteri verileri */
    }
    const res = {
      order_no: data.orderCode,
      musteri: {
        name: data.Müşteri[0].name + ' ' + data.Müşteri[0].surname,
        phone: data.Müşteri[0].phoneNumber,
        adress: data.Müşteri[0].address,
        email: data.Müşteri[0].mailAddress,
        father_name: data.Müşteri[0].father_name,
      },
      products: [],
    };

    {
      /* Data içindeki Oders ların hepsinin içinde geziyoruz */
    }
    data.Orders.forEach((value) => {
      {
        /* Orderımızın id'si */
      }
      const or_id = value.id;

      {
        /* Product'ın id si */
      }
      const pr_id = value.productId;

      {
        /* ürün datası için başlangıç verisi (ürün notu) */
      }
      let x_d = {
        note: value.orderNote,
      };

      {
        /* tüm ürünler'de filter ile product id'miz ve ürün id si aynı olanların içerisinde gezip info, quantity gibi ürün bilgilerini x_d yani ürün datasına gönderiyoruz */
      }
      data.Ürünler
        .filter((x_f) => x_f.id === pr_id)
        .forEach((x_m) => {
          x_d = {
            ...x_d,
            info: x_m.productType,
            quantity: Number(value.stock),
            price:
              Number(value.productPrice) + Number(value.productFeaturePrice),
            totalPrice:
              (Number(value.productPrice) + Number(value.productFeaturePrice)) *
              Number(value.stock),
            id: x_m.id,
            name: x_m.productName,
          };
        });

      {
        /* Extralar içerisinde gezip orderId product id ile eşit olanların içerisinde gezip extras yani ürün özelliklerine bu datayı gödneriyoruz */
      }
      if (Array.isArray(data.Extralar) && data.Extralar.length > 0) {
        data.Extralar?.filter((x_f) => x_f?.orderId === pr_id)?.forEach(
          (x_k) => {
            x_d = {
              ...x_d,
              extras: x_d?.extras
                ? [
                    ...x_d.extras,
                    {
                      name: 'Extra',
                      value: x_k.extravalue,
                    },
                  ]
                : [
                    {
                      name: 'Extra',
                      value: x_k.extravalue,
                    },
                  ],
            };
          }
        );
      }

      {
        /* Kunaşlar içerisinde gezip orderId - order id ile eşit olanların içerisinde gezip extras yani ürün özelliklerine bu datayı gödneriyoruz */
      }
      if (Array.isArray(data?.Kumaşlar) && data?.Kumaşlar.length > 0) {
        data?.Kumaşlar?.filter((x_f) => x_f?.orderId === or_id)?.forEach(
          (x_k) => {
            x_d = {
              ...x_d,
              extras: x_d?.extras
                ? [
                    ...x_d.extras,
                    {
                      name: 'Kumaş',
                      value: x_k.fabricType,
                    },
                  ]
                : [
                    {
                      name: 'Kumaş',
                      value: x_k.fabricType,
                    },
                  ],
            };
          }
        );
      }

      {
        /* Metaller içerisinde gezip orderId - order id ile eşit olanların içerisinde gezip extras yani ürün özelliklerine bu datayı gödneriyoruz */
      }
      if (Array.isArray(data?.Metaller) && data?.Metaller.length > 0) {
        data.Metaller?.filter((x_f) => x_f.orderId === or_id)?.forEach(
          (x_m) => {
            x_d = {
              ...x_d,
              extras: x_d?.extras
                ? [
                    ...x_d.extras,
                    {
                      name: 'Metal',
                      value: x_m.metalType,
                    },
                  ]
                : [
                    {
                      name: 'Metal',
                      value: x_m.metalType,
                    },
                  ],
            };
          }
        );
      }

      {
        /* Renkler içerisinde gezip orderId - order id ile eşit olanların içerisinde gezip extras yani ürün özelliklerine bu datayı gödneriyoruz */
      }
      if (Array.isArray(data?.Renkler) && data?.Renkler.length > 0) {
        data.Renkler.filter((x_f) => x_f && x_f?.orderId === or_id).forEach(
          (x_m) => {
            x_d = {
              ...x_d,
              extras: x_d?.extras
                ? [
                    ...x_d.extras,
                    {
                      name: 'Renk',
                      value:
                        x_m.colourHex === ''
                          ? x_m.colourDescription
                          : x_m.colourHex,
                    },
                  ]
                : [
                    {
                      name: 'Renk',
                      value:
                        x_m.colourHex === ''
                          ? x_m.colourDescription
                          : x_m.colourHex,
                    },
                  ],
            };
          }
        );
      }

      {
        /* Ölçüler içerisinde gezip orderId - order id ile eşit olanların içerisinde gezip extras yani ürün özelliklerine bu datayı gödneriyoruz */
      }
      if (Array.isArray(data?.Ölçüler) && data?.Ölçüler.length > 0) {
        data.Ölçüler
          .filter((x_f) => x_f.orderId === or_id)
          .forEach((x_m) => {
            const formated = x_m.firstValue + x_m.unit + x_m.secondValue;

            x_d = {
              ...x_d,
              extras: x_d?.extras
                ? [
                    ...x_d.extras,
                    {
                      name: 'Ölçü',
                      value: formated,
                    },
                  ]
                : [
                    {
                      name: 'Ölçü',
                      value: formated,
                    },
                  ],
            };
          });
      }

      res.products.push(x_d);
    });

    return res;
  }

  {
    /* Sayfanın print özelliğini tetikleyip yazdılacak divin referansını veriyorum content'de, ve pageStyle ile kenarlardan margin veriyoruz */
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `margin: 2.5%`,
  });

  {
    /* ücreti yani fiyatı normalize etme işlemi. */
  }
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ua-UA', {
      currency: 'UAH',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  {
    /* tüm products içinde gezip ürünlerin fiyatlarını hesaplayıp kdv ekliyoruz ve return ediyoruz
     output: total = kdv hariç,
     tax = kdv,
     grandTotal = kdv dahil*/
  }
  const calculateTotals = (products) => {
    let total = 0;
    let indirimliTutar = 0;
    let tax = 0;
    let kdvHaricTutar = 0;

    products.forEach((product) => {
      console.log('product.totalPrice: ', product.totalPrice);
      total += product.totalPrice;
      indirimliTutar += (product.totalPrice * indirimOrani) / 100;
    });

    kdvHaricTutar = total - indirimliTutar;

    tax = total * (kdvOrani / 100);

    const grandTotal = kdvHaricTutar + tax;
    return {
      total: formatCurrency(total),
      tax: formatCurrency(tax),
      grandTotal: formatCurrency(grandTotal),
      indirimliTotal: formatCurrency(indirimliTutar),
      kdvHaricTotal: formatCurrency(kdvHaricTutar),
    };
  };

  const calculateIndirimOrani = (product, amount) => {
    let productTotal = product * amount;
    let indirimTotal = 0;
    let kdvHaric = 0;
    indirimTotal = (productTotal * indirimOrani) / 100;
    kdvHaric = productTotal - indirimTotal;
    return {
      indirimTutar: formatCurrency(indirimTotal),
      kdvHaricTutar: formatCurrency(kdvHaric),
    };
  };

  const details = filterDataByOrderId();
  const total = calculateTotals(details.products);

  const todayDate = () => {
    const today = new Date();

    // Günü, ayı ve yılı al
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 eklenir
    const year = today.getFullYear();

    // İstenen formatta tarihi oluştur
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  };

  return (
    <div className='flex flex-col h-fit overflow-auto gap-6 relative m-auto w-[29.7cm]'>
      <button
        className='px-8 py-2 w-[29.7cm] bg-green-500 text-white font-bold rounded-md hover:opacity-75 transition-all duration-200 active:bg-green-400'
        onClick={handlePrint}
      >
        <div className='flex justify-center gap-4 items-center'>
          <span className='text-lg'>{langs.indirmeButonu[lang]}</span>{' '}
          <FaPrint size={20} />
        </div>
      </button>

      <div ref={printRef} className='a4 overflow-y-auto'>
        {/* Header */}
        <header className='flex items-center justify-end mb-6 px-4'>
          <Image
            src='/Logo.png'
            width={300}
            height={300}
            alt=''
            className='mr-auto'
          />

          <div className='flex flex-col gap-1'>
            <span className='text-[#000] text-[19.125pt] font-bold'>
              {details.musteri.name}
            </span>
            <span className='text-[13.5pt] text-[#000] font-bold'>
              {details.musteri.phone}
            </span>
            <span className='text-[13.5pt] text-[#000] font-bold'>
              {details.musteri.email}
            </span>
            <span className='text-[13.5pt] text-[#000] font-bold'>
              {details.musteri.adress}
            </span>
            <span className='text-[13.5pt] text-[#000] font-bold'>
              {details.musteri.father_name}
            </span>
          </div>
        </header>

        <table className='w-full break-inside-auto'>
          <thead className='h-[50px] w-full'>
            <tr>
              <th>
                <span className='text-[10pt] text-[#000] font-bold'>
                  {langs.teklifNo[lang]}:
                </span>
              </th>
              <th>
                <span className='text-[10pt] text-[#000] font-bold'>
                  {details.order_no}
                </span>
              </th>
              <th />
              <th />
              <th>
                <span className='text-[10pt] text-[#000] font-bold'>
                  {langs.date[lang]}:
                </span>
              </th>
              <th>
                <span className='text-[10pt] text-[#000] font-bold'>
                  {data.Orders.map(
                    (orders, index) =>
                      index == 0 &&
                      orders.createdAt
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                  )}
                </span>
              </th>
            </tr>
          </thead>

          <thead className='border border-black [&_tr_th]:text-center  [&_tr_th]:text-black'>
            <tr className='h-8'>
              <th className='px-1 w-fit !font-serif'>{langs.order[lang]}</th>
              <th className='px-1 w-min !font-serif'>{langs.image[lang]}</th>
              <th className='!font-serif'>{langs.productFeatures[lang]}</th>
              <th className='!font-serif'>{langs.price[lang]}</th>
              <th className='!font-serif'>{langs.quantity[lang]}</th>
              <th className='!font-serif'>{langs.total[lang]}</th>
              <th className='!font-serif'>{langs.indirimTutari[lang]}</th>
              <th className='!font-serif'>{langs.sonTutar[lang]}</th>
            </tr>
          </thead>
          <tbody className='[&_tr_td]:p-[6px] [&_tr_td]:text-center [&_tr_th]:text-[#000]'>
            {details?.products?.map((product, idx) => (
              <tr
                key={idx}
                className='even:bg-[#F2F2F2] bg-white break-inside-avoid'
              >
                <td className='border border-black text-[13.5pt] text-[#000] font-bold'>
                  {idx + 1}
                </td>
                <td className='border border-black'>
                  {product?.image ? (
                    <Image
                      src={product?.image}
                      height={75}
                      alt=''
                      className='object-contain m-auto'
                    />
                  ) : (
                    <Image
                      src='/no-image2.png'
                      width={200}
                      height={50}
                      alt=''
                      className='object-contain m-auto max-h-16'
                    />
                  )}
                </td>
                <td className='border border-black overflow-hidden'>
                  <div className='!max-h-fit overflow-hidden gap-2 flex flex-wrap'>
                    <span className='px-2.5 py-1 text-[9pt] text-black border border-black rounded-md font-semibold rounded-full w-fit'>
                      {product.name}
                    </span>

                    <span className='px-2.5 py-1 text-[9pt] text-black border border-black rounded-md font-semibold rounded-full w-fit'>
                      {product.info}
                    </span>

                    {product?.extras?.map((feature, idx) => (
                      <div
                        key={'feature-' + idx}
                        className='px-2 py-1 text-center align-middle flex gap-1 [&_span]:text-black border border-black rounded-full [&_span]:text-[10pt] items-center'
                      >
                        <span>{feature.value}</span>
                      </div>
                    ))}

                    {product.note && product.note !== '' && (
                      <div className='px-2 py-1 flex gap-1 [&_span]:text-black border border-black rounded-md [&_span]:text-[10pt] items-center w-full'>
                        <span>{product.note}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className='border border-black whitespace-nowrap '>
                  {formatCurrency(product.price)} грн
                </td>
                <td className='border border-black whitespace-nowrap'>
                  {product.quantity} грн
                </td>
                <td className='border border-black whitespace-nowrap'>
                  {formatCurrency(product.quantity * product.price)} грн
                </td>
                <td className='border border-black whitespace-nowrap'>
                  {
                    calculateIndirimOrani(product.quantity, product.price)
                      .indirimTutar
                  }{' '}
                  грн
                </td>
                <td className='border border-black whitespace-nowrap'>
                  {
                    calculateIndirimOrani(product.quantity, product.price)
                      .kdvHaricTutar
                  }{' '}
                  грн
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <footer className='flex justify-between break-inside-avoid mx-2'>
          <div className='mt-[24px] flex flex-col h-full'>
            <span className='text-[#000] text-[15pt] font-bold'>
              {langs.firmaBilgileri[lang]}
            </span>
            <span className='text-[10pt] text-[#000] font-bold'>
              {data && data.Company[0].name}
            </span>
            <span className='text-[10pt] text-[#000] font-bold'>
              {data && data.Company[0].address}
            </span>
            <span className='text-[10pt] text-[#000] font-bold'>
              {data && data.Company[0].vergino}
            </span>
          </div>

          <div className='flex flex-col items-end gap-2 mt-[24px]'>
            {data && data?.Company[0]?.kdvOrani > 0 && (
              <div className='flex items-center gap-6 px-1.5 w-[300px]'>
                <span className='text-[#000] text-[13pt] font-bold whitespace-nowrap'>
                  {langs.kdvTutari[lang]} :
                </span>
                <p className='ml-auto text-[#000] text-[12pt] font-bold whitespace-nowrap'>
                  {total.tax} грн
                </p>
              </div>
            )}
            <div className='flex items-center gap-6 w-[300px] border-b border-b-black p-1.5 rounded-sm'>
              <span className='text-[#000] text-[13pt] font-bold whitespace-nowrap'>
                {data && data?.Company[0]?.kdvOrani > 0
                  ? langs.genelToplam[lang]
                  : langs.sonTutar[lang]}{' '}
                :
              </span>
              <p className='ml-auto text-[#000] text-[12pt] font-bold whitespace-nowrap'>
                {total.grandTotal} грн
              </p>
            </div>
          </div>
        </footer>
      </div>

      <button
        className='px-8 py-2 w-[29.7cm] bg-green-500 text-white font-bold rounded-md hover:opacity-75 transition-all duration-200 active:bg-green-400'
        onClick={handlePrint}
      >
        <div className='flex justify-center gap-4 items-center'>
          <span className='text-lg'>{langs.indirmeButonu[lang]}</span>{' '}
          <FaPrint size={20} />
        </div>
      </button>
    </div>
  );
};

export default Invoice;
