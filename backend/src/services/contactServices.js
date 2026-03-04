// Service pour envoyer un email depuis un formulaire de contact

/*Importation du transporteur (le mail qui va envoyer le formulaire à
l'adresse mail spécifiée)*/
import mailTransporter from "../utils/mail.js";
// Importation de la classe Contact Form pour vérfier les données du formulaire
import ContactForm from "../classes/ContactForm.js";

export default class ContactServices {

  async sendMail (formulaire) {
    try {
      new ContactForm(formulaire);
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
