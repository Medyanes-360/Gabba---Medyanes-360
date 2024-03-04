import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export const mailOptions = {
    from: process.env.EMAIL,
}

const handler = async (req, res) => {
    //getServerSession:  Kullanıcının oturum açıp açmadığını kontrol eder. Eğer açılmışsa session değişkenine atar.

    if (req.method === 'POST') {
        try {
            const { email, message } = req.body;

            //mail gönderme işlemi
            transporter.sendMail({
                ...mailOptions,
                subject: `TEST`,
                text: message,
                to: email,
            })

            return res.status(200).json({ status: "success", message: "Şifre sıfırlama bağlantısı mail adresinize gönderildi." });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }
    else {
        return res.status(405).json({ status: "error", message: "hatalı bir istek gerçekleştirdiniz." });
    }
};

export default handler;