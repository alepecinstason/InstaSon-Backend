/**
 * SERVICE SUNO API
 * Generation de musique via l'API Suno
 * Placeholder - a completer avec votre cle API
 */

// const axios = require('axios'); // Decommenter quand vous aurez la cle

const SUNO_API_KEY = process.env.SUNO_API_KEY;

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
  
  lyrics += `Pour ${q1_nom}, une chanson unique\n`;
  
  if (q2_description) {
    lyrics += `Tu es ${q2_description.toLowerCase()}\n`;
  }
  
  if (q3_moments) {
    lyrics += `On se souvient de ${q3_moments.toLowerCase()}\n`;
  }
  
  lyrics += `\n[Chorus]\n`;
  
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
  
  if (q1_occasion) {
    lyrics += `${occasions[q1_occasion] || 'C est pour toi'}\n`;
  }
  
  return lyrics;
}

/**
 * Creer une chanson via l'API Suno
 * Placeholder - a implementer avec l'API reelle
 */
async function createSong({ lyrics, style, title }) {
  // Verifier si la cle est configuree
  if (!SUNO_API_KEY || SUNO_API_KEY === 'YOUR_SUNO_API_KEY_HERE' || SUNO_API_KEY === 'TEMPORAIRE') {
    console.log('Suno API Key non configuree - simulation mode');
    return {
      id: 'SIMULATED_' + Date.now(),
      status: 'simulated',
      message: 'Mode simulation - ajoutez votre cle Suno API dans les variables d\'environnement'
    };
  }

  // TODO: Implementer l'appel reel a l'API Suno quand vous aurez la cle
  // const response = await axios.post(...)
  
  return {
    id: 'PENDING_' + Date.now(),
    status: 'pending'
  };
}

/**
 * Verifier le statut d'une generation
 */
async function checkStatus(sunoId) {
  if (sunoId.startsWith('SIMULATED_')) {
    return {
      completed: false,
      status: 'simulated',
      audioUrl: null
    };
  }

  return {
    completed: false,
    status: 'pending',
    audioUrl: null
  };
}

module.exports = {
  generateLyrics,
  createSong,
  checkStatus
};
