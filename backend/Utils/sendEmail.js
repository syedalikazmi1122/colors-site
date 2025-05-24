import nodemailer from 'nodemailer';

const createTransporter = async () => {
    try {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'musanifplatform@gmail.com',
                pass: 'ogrm emtp yvun btzy', 
            },
        });
    } catch (error) {
        console.error('Failed to create transporter:', error);
        throw new Error('Failed to create transporter');
    }
};

export const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: 'musanifplatform@gmail.com',
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};