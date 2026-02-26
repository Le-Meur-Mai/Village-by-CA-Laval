import nodemailer from "nodemailer";

/*Transporteur Simple Mail Transfer Protocol utilisé pour envoyer les emails.
  Il s'authentifie auprès de Gmail avec l'adresse et le mot de passe d'application
  définis dans les variables d'environnement. Les emails envoyés proviennent
  toujours de cette adresse SMTP, jamais de l'adresse du client.*/


const mailTransporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    // Sert à authentifier le serveur auprès du Simple Mail Transfer Protocol de Gmail
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export default mailTransporter;
