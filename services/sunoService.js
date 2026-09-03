/**
 * SERVICE SUNO API
 * Generation de musique via l'API Suno
 */

const axios = require('axios');

const SUNO_API_KEY = process.env.SUNO_API_KEY;
const SUNO_API_URL = 'https://api.suno.ai/v1'; // URL a verifier selon la doc officielle

/**
 * Generer les paroles a partir des reponses du questionnaire
 */
function generateLyrics(data) {
  const {
    q1_nom, q1_occasion,
    q2_description, q2_qualite,
    q3_moments, q3_fierte,
    q4_phrase, q4_surnom,
    q5_emotion, q5_message,
    q6_souvenir,
    q7_element, q7_pourquoi
  } = data;

  let lyrics = `[Verse 1]\n`;
  
  // Intro avec le nom
  lyrics += `Pour ${q1_nom}, une chanson unique\n`;
  
  if (q2_description) {
    lyrics += `Tu es ${q2_description.toLowerCase()}\n`;
  }
  
  if (q3_moments) {
    lyrics += `On se souvient de ${q3_moments.toLowerCase()}\n`;
  }
  
  lyrics += `\n[Chorus]\n`;
  
  // Message principal
  if (q5_message) {
    lyrics += `${q5_message}\n`;
  } else {
    lyrics += `${q1_nom}, tu es speciale pour nous\n`;
  }
  
  if (q2_qualite) {
    lyrics += `Tes qualites : ${q2_qualite}\n`;
  }
  
  lyrics += `\n[Verse 2]\n`;
  
  if (q6_souvenir) {
    lyrics += `Ce souvenir inoubliable : ${q6_souvenir.toLowerCase()}\n`;
  }
  
  if (q4_phrase) {
    lyrics += `On pense a toi quand on entend : "${q4_phrase}"\n`;
  }
  
  if (q7_element && q7_pourquoi) {
    lyrics += `Comme ${q7_element}, ${q7_pourquoi.toLowerCase()}\n`;
  }
  
  lyrics += `\n[Bridge]\n`;
  
  if (q3_fierte) {
    lyrics += `On est fier de toi pour ${q3_fierte.toLowerCase()}\n`;
  }
  
  lyrics += `Cette chanson est pour toi, ${q1_nom}\n`;
  
  // Occasion
  if (q1_occasion) {
    const occasions = {
      'anniversaire': 'Joyeux Anniversaire',
      'mariage': 'Vive les maries',
      'amour': 'Notre amour est eternel',
      'naissance': 'Bienvenue au monde',
      'retraite': 'Bonne retraite',
      'remerciement': 'Merci pour tout',
      'hommage': 'En ta memoire',
      'soutien': 'On est avec toi',
      'demenagement': 'Bonne chance',
      'rupture': 'Tu vas t en sortir',
      'protesta': 'La lutte continue',
      'autre': 'Ceci est pour toi'
    };
    lyrics += `${occasions[q1_occasion] || 'C est pour toi'}\n`;
  }
  
  return lyrics;
}

/**
 * Creer une chanson via l'API Suno
 */
async function createSong({ lyrics, style, title, voice, energy }) {
  try {
    if (!SUNO_API_KEY || SUNO_API_KEY === 'YOUR_SUNO_API_KEY_HERE') {
      throw new Error('CLE API SUNO NON CONFIGUREE');
    }

    const response = await axios.post(`${SUNO_API_URL}/generate`, {
      prompt: lyrics,
      style: style.join(', '),
      title: title,
      make_instrumental: false,
      wait_audio: false
    }, {
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      id: response.data.id,
      status: 'pending'
    };

  } catch (error) {
    console.error('Erreur API Suno:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Verifier le statut d'une generation
 */
async function checkStatus(sunoId) {
  try {
    const response = await axios.get(`${SUNO_API_URL}/generate/${sunoId}`, {
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`
      }
    });

    return {
      completed: response.data.status === 'completed',
      audioUrl: response.data.audio_url,
      status: response.data.status
    };

  } catch (error) {
    console.error('Erreur check status:', error.message);
    throw error;
  }
}

module.exports = {
  generateLyrics,
  createSong,
  checkStatus
};
