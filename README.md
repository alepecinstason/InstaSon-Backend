# InstaSon Backend

Backend Node.js pour InstaSon - Generation de chansons personnalisees.

## Configuration

Copiez `.env.example` en `.env` et remplissez vos variables :

- SMTP_USER: info@instason.com
- SMTP_PASS: Votre mot de passe email
- SUNO_API_KEY: Votre cle API Suno (quand recue)
- FRONTEND_URL: https://instason.com

## Installation

```bash
npm install
npm start
```

## Deployement

Ce backend est deploye sur Render.com.

## Endpoints API

- POST /api/order - Creer une commande
- POST /api/generate - Generer une chanson
- GET /api/status/:orderId - Verifier le statut
- GET /health - Health check
