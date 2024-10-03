import { createNewData } from '@/services/serviceOperations';
import nodemailer from 'nodemailer';
import { getToken } from 'next-auth/jwt';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const mailOptions = {
  from: process.env.EMAIL,
};

const handler = async (req, res) => {
  //getServerSession:  Kullanıcının oturum açıp açmadığını kontrol eder. Eğer açılmışsa session değişkenine atar.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.method === 'POST') {
    try {
      const { email, url, orderCode } = req.body;
      const userRole = token && token?.user?.role;
      const userId = token && token?.user?.id;

      // mail gönderme işlemi
      transporter.sendMail({
        ...mailOptions,
        subject: `TEST`,
        html: `
                      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gabba - Sipariş fişiniz</title>
      </head>
      <body>
      <p>${url}</p>
      </body>
      </html>
                      `,
        to: email,
      });

      const response = await createNewData('Logs', {
        role: userRole,
        userId: userId,
        step: 1.1,
        stepName: 'Fişi Gör veya Gönder',
        orderCode: orderCode,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Şifre sıfırlama bağlantısı mail adresinize gönderildi.',
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  } else {
    return res.status(405).json({
      status: 'error',
      message: 'hatalı bir istek gerçekleştirdiniz.',
    });
  }
};

export default handler;
