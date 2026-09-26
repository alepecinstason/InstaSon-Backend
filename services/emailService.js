const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
const useSSL = smtpPort === 465 || smtpHost.includes('hostinger');
const transporter = nodemailer.createTransport({
  host: smtpHost, port: smtpPort, secure: useSSL,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: useSSL ? { rejectUnauthorized: false } : undefined
});
async function sendSongEmail(order) {
  try {
    const { email, id, audioUrl, data } = order;
    const { q1_nom } = data;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 20);
    const expiryStr = expiryDate.toLocaleDateString('fr-FR');
    const result = await transporter.sendMail({
      from: '"InstaSon" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: 'Votre chanson pour ' + q1_nom + ' est prete !',
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;">
<div style="background:linear-gradient(135deg,#7C3AED,#EC4899);padding:40px;text-align:center;color:white;">
<h1 style="margin:0;font-size:32px;">InstaSon</h1><p style="margin:10px 0 0 0;font-size:18px;">Votre chanson personnalisee</p></div>
<div style="padding:40px;background:#f9fafb;">
<h2 style="color:#1f2937;">Bonjour !</h2>
<p style="color:#4b5563;">Votre chanson pour <strong>${q1_nom}</strong> est prete !</p>
<div style="background:white;border-radius:12px;padding:30px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
<p style="color:#7C3AED;font-size:48px;">🎵</p>
<h3 style="color:#1f2937;">Votre chanson InstaSon</h3>
<a href="${audioUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;padding:15px 40px;border-radius:50px;text-decoration:none;font-weight:600;">🎧 Ecouter ma chanson</a><br><br>
<a href="${audioUrl}&download=1" style="display:inline-block;background:#10B981;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:600;">📥 Telecharger</a></div>
<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:20px;border-radius:8px;"><p style="margin:0;color:#92400e;"><strong>⏰ Important :</strong> Ce lien est valable jusqu'au <strong>${expiryStr}</strong>.<br>Telechargez votre chanson des maintenant pour la conserver !</p></div>
<div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:20px;border-radius:8px;"><p style="margin:0;color:#1e40af;"><strong>💚 Projet solidaire :</strong> Un pourcentage de votre achat est reverse a l'association Pure Energie Positive.</p></div></div>
<div style="background:#1f2937;padding:20px;text-align:center;color:#9ca3af;"><p>InstaSon - Fait en Suisse avec amour</p></div></div>`
    });
    console.log('Email envoye:', result.messageId);
    return result;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
}
router.get('/config', (req, res) => { res.json({ host: smtpHost, port: smtpPort, secure: useSSL }); });
router.post('/send-song', async (req, res) => {
  try {
    const result = await sendSongEmail(req.body);
    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/status', (req, res) => {
  res.json({ provider: smtpHost.includes('gmail') ? 'Gmail' : 'Hostinger', host: smtpHost, port: smtpPort, secure: useSSL });
});
module.exports = router;
router.sendSongEmail = sendSongEmail;
