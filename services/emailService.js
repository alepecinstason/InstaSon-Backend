/**
 * SERVICE EMAIL
 * Envoi des emails via Hostinger SMTP
 */

const nodemailer = require('nodemailer');

// Configuration SMTP Hostinger
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // SSL pour port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Envoyer l'email de confirmation de commande
 */
async function sendOrderConfirmation(order) {
  try {
    const { email, id, data } = order;
    const { q1_nom, q1_occasion } = data;

    const mailOptions = {
      from: '"InstaSon" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: 'Confirmation de votre commande InstaSon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0;">InstaSon</h1>
            <p style="margin: 10px 0 0 0;">Votre chanson personnalisee</p>
          </div>
          
          <div style="padding: 40px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Merci pour votre commande !</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Votre chanson pour <strong>${q1_nom}</strong> est en cours de creation.
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #7C3AED; font-size: 48px; margin: 0;">🎵</p>
              <h3 style="color: #1f2937; margin: 15px 0;">Commande #${id}</h3>
              <p style="color: #6b7280;">Occasion: ${q1_occasion || 'Personnalisee'}</p>
            </div>
            
            <p style="color: #4b5563;">
              Vous recevrez un email des que votre chanson sera prete (24-48h).
            </p>
            
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;">
                <strong>💚 Projet solidaire :</strong> Un pourcentage de votre achat est reversé à l'association Pure Energie Positive.
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af;">
            <p>InstaSon - Fait en Suisse avec amour</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoye:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur email confirmation:', error);
    // On n'arrete pas tout si l'email echoue
    return null;
  }
}

/**
 * Envoyer l'email avec le lien de la chanson (quand elle sera prete)
 */
async function sendSongEmail(order, audioUrl) {
  try {
    const { email, id, data } = order;
    const { q1_nom, q1_occasion } = data;

    // Date d'expiration (20 jours)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 20);
    const expiryStr = expiryDate.toLocaleDateString('fr-FR');

    const mailOptions = {
      from: '"InstaSon" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: 'Votre chanson pour ' + q1_nom + ' est prete !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">InstaSon</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Votre chanson personnalisee</p>
          </div>
          
          <div style="padding: 40px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Bonjour !</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Votre chanson pour <strong>${q1_nom}</strong> est prete !
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #7C3AED; font-size: 48px; margin: 0;">🎵</p>
              <h3 style="color: #1f2937; margin: 15px 0;">Votre chanson InstaSon</h3>
              
              <a href="${audioUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px; margin: 20px 0;">
                🎧 Ecouter ma chanson
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⏰ Important :</strong> Ce lien est valable jusqu'au <strong>${expiryStr}</strong>.
                <br>Téléchargez votre chanson dès maintenant pour la conserver !
              </p>
            </div>
            
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;">
                <strong>💚 Projet solidaire :</strong> Un pourcentage de votre achat est reversé à l'association Pure Energie Positive.
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af;">
            <p>InstaSon - Fait en Suisse avec amour</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email avec chanson envoye:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur envoi email chanson:', error);
    throw error;
  }
}

module.exports = {
  sendOrderConfirmation,
  sendSongEmail
};
