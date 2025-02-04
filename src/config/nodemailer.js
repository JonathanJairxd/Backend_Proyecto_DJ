import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});


// send mail with defined transport object
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: 'sistemaGestionDj@dj.com',
        to: userMail,
        subject: "Recuperación de contraseña - Sistema de gestión de Edwin DJ",
        html: `
        <h1>Recupera tu contraseña</h1>
        <p>Hola, hemos recibido una solicitud para recuperar tu contraseña en el sistema de gestión de Edwin DJ.</p>
        <p>Si fuiste tú quien hizo esta solicitud, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${process.env.URL_BACKEND}recuperar-password/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo. No se realizarán cambios en tu cuenta.</p>
        <hr>
        <footer>
            <p>Gracias por usar el sistema de gestión de Edwin DJ. ¡Estamos aquí para ayudarte!</p>
        </footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}



export {
    sendMailToRecoveryPassword
}