/**
 * SERVICE EMAIL
 * Envoi des chansons par email
 */

const nodemailer = require('nodemailer');

// Configuration SMTP
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Envoyer l'email avec le lien de la chanson
 */
async function sendSongEmail(order) {
  try {
    const { email, id, audioUrl, data } = order;
    const { q1_nom, q1_occasion } = data;

    // Date d'expiration (20 jours)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 20);
    const expiryStr = expiryDate.toLocaleDateString('fr-FR');

    const mailOptions = {
      from: '"InstaSon" <info@pureenergiepositive.com>',
      to: email,
      subject: `Votre chanson pour ${q1_nom} est prete !`,
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
              
              <br><br>
              
              <a href="${audioUrl}&download=1" 
                 style="display: inline-block; background: #10B981; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 600;">
                📥 Telecharger
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
                <strong>💚 Projet solidaire :</strong> Un pourcentage de votre achat est reversé à l'association Pure Energie Positive pour soutenir les personnes neurodivergentes.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px;">
              Commande : <strong>#${id}</strong><br>
              Occasion : ${q1_occasion || 'Personnalisee'}<br>
              <br>
              Des questions ? Contactez-nous : <a href="mailto:info@pureenergiepositive.com">info@pureenergiepositive.com</a>
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>InstaSon - Fait en Suisse avec amour</p>
            <p>Un projet de Pure Energie Positive</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoye:', result.messageId);
    return result;

  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
}

/**
 * Envoyer un email de confirmation de commande
 */
async function sendOrderConfirmation(order) {
  try {
    const { email, id, data } = order;
    
    const mailOptions = {
      from: '"InstaSon" <info@pureenergiepositive.com>',
      to: email,
      subject: 'Confirmation de votre commande InstaSon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0;">InstaSon</h1>
          </div>
          
          <div style="padding: 40px;">
            <h2>Merci pour votre commande !</h2>
            <p>Votre chanson pour <strong>${data.q1_nom}</strong> est en cours de creation.</p>
            <p>Numéro de commande : <strong>#${id}</strong></p>
            <p>Vous recevrez un email dès qu'elle sera prête (24-48h).</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.error('Erreur confirmation:', error);
  }
}

module.exports = {
  sendSongEmail,
  sendOrderConfirmation
};
