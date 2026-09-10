/**
 * ROUTES API - Questionnaire et Generation
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const emailService = require('../services/emailService');

// Stockage temporaire des commandes
const orders = new Map();

/**
 * POST /api/order - Creer une nouvelle commande
 */
router.post('/order', async (req, res) => {
  try {
    const { 
      email, 
      offer,
      q1_nom, q1_age, q1_langue, q1_occasion,
      q2_description, q2_qualite, q2_ressenti,
      q3_moments, q3_epreuves, q3_fierte,
      q4_phrase, q4_habitude, q4_surnom, q4_objet,
      q5_emotion, q5_message,
      q6_souvenir, q6_anecdote,
      q7_element, q7_pourquoi,
      q8_style, q8_voix, q8_energie
    } = req.body;

    // Validation
    if (!email || !q1_nom || !q1_langue || !q1_occasion) {
      return res.status(400).json({ 
        error: 'Champs obligatoires manquants',
        fields: ['email', 'q1_nom', 'q1_langue', 'q1_occasion']
      });
    }

    // Generer ID unique
    const orderId = uuidv4().split('-')[0].toUpperCase();
    
    // Creer la commande
    const order = {
      id: orderId,
      email,
      offer: offer || 'basic',
      status: 'pending',
      createdAt: new Date(),
      data: {
        q1_nom, q1_age, q1_langue, q1_occasion,
        q2_description, q2_qualite, q2_ressenti,
        q3_moments, q3_epreuves, q3_fierte,
        q4_phrase, q4_habitude, q4_surnom, q4_objet,
        q5_emotion, q5_message,
        q6_souvenir, q6_anecdote,
        q7_element, q7_pourquoi,
        q8_style, q8_voix, q8_energie
      }
    };

    // Sauvegarder
    orders.set(orderId, order);

    console.log('Nouvelle commande creee:', orderId);

    // Envoyer email de confirmation
    await emailService.sendOrderConfirmation(order);

    res.json({
      success: true,
      orderId,
      message: 'Commande enregistree avec succes'
    });

  } catch (error) {
    console.error('Erreur creation commande:', error);
    res.status(500).json({ error: 'Erreur lors de la creation de la commande' });
  }
});

/**
 * POST /api/generate - Generer la chanson
 */
router.post('/generate', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvee' });
    }

    // Pour l'instant, on simule la generation
    // Quand tu auras la cle Suno, on connectera l'API reelle
    order.status = 'processing';
    orders.set(orderId, order);

    res.json({
      success: true,
      message: 'Generation de la chanson lancee',
      orderId,
      note: 'Connexion a Suno API necessaire - ajoutez votre cle dans les variables d\'environnement'
    });

  } catch (error) {
    console.error('Erreur generation:', error);
    res.status(500).json({ error: 'Erreur lors de la generation' });
  }
});

/**
 * GET /api/status/:orderId - Verifier le statut
 */
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvee' });
    }

    res.json({
      orderId,
      status: order.status,
      createdAt: order.createdAt
    });

  } catch (error) {
    console.error('Erreur statut:', error);
    res.status(500).json({ error: 'Erreur lors de la verification' });
  }
});

module.exports = router;
