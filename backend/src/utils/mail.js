import nodemailer from "nodemailer";

/*On fait appel au protocole OAuth2 de google qui donne des tokens d'autorisation
à certaine APIs d'un compte google, de façon plus sécurisée et plus
contrôlée que les mots de passe d'application.*/

/*Le Gmail_Client_Id et le Gmail_Client_Secret sont des identifiants récupérés
auprès de googlecloud pour identifier notre application auprès du protocole
d'identification OAuth2 de Google. On a du faire une validation manuelle
pour autoriser l'accès à notre appli au service GMAIL la première fois pour
récupérer un refresh token.*/

/*On fournit à l'OAuth2Client un refresh token: un token longue durée qui permet
 d’obtenir des access_token valides sans redemander manuellement le consentement
  de l’utilisateur. Les access_token autorisent notre appli à envoyer des mails.*/

const mailTransporter = nodemailer.createTransport({
  service:"gmail", 
  auth: {
    // Sert à authentifier le serveur auprès du protocole OAuth2
    type: "OAuth2",
    user: process.env.SMTP_USER, // l'adresse Gmail d’envoi
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN

  }
});

export default mailTransporter;
