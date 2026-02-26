/*Importation du transporteur (le mail qui va envoyer le formulaire à
l'adresse mail spécifiée)*/
import mailTransporter from "../utils/mail.js";

export default class ContactServices {

  async sendMail (formulaire) {
    try {
      return mailTransporter.sendMail({
        from: `${process.env.SMTP_USER}`, // L'email qui va envoyer le formulaire
        replyTo: formulaire.email, // L'email auquel le destinataire va répondre
        to: `${process.env.RECEIVER}`, // L'email du destinataire
        subject: `${formulaire.subject}`, // L'objet du mail
        text: `${formulaire.message}`
      });
    } catch (error) {
      throw error;
    }
  }
}
