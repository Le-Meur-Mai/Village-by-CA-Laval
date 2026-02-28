import nodemailer from "nodemailer";

/*Transporteur Simple Mail Transfer Protocol utilisé pour envoyer les emails.
  Il s'authentifie auprès de outlook avec l'adresse et le mot de passe d'application
  définis dans les variables d'environnement. Les emails envoyés proviennent
  toujours de cette adresse SMTP, jamais de l'adresse du client.*/


const mailTransporter = nodemailer.createTransport({
  host:"smtp.office365.com",
  /*Pour le http et outlook qui l'utilise, sinon le port est le https 465.
  Ici ça utilise la méthode STARTLS qui commence la connexion en claire et la chiffre après.*/
  port: 587, 
  secure: false, // true pour le https
  auth: {
    // Sert à authentifier le serveur auprès du Simple Mail Transfer Protocol de outlook
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export default mailTransporter;
