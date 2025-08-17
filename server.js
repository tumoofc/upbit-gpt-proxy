
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

function createSignature(query, secret) {
  return crypto.createHmac('sha512', secret).update(query).digest('hex');
}

app.get('/balance', async (req, res) => {
  const access_key = process.env.UPBIT_ACCESS_KEY;
  const secret_key = process.env.UPBIT_SECRET_KEY;
  const nonce = Date.now().toString();
  const query = `access_key=${access_key}&nonce=${nonce}`;
  const signature = createSignature(query, secret_key);
  try {
    const result = await axios.get('https://api.upbit.com/v1/accounts', {
      headers: {
        Authorization: `Bearer ${access_key}`,
        'Content-Type': 'application/json',
        'Access-Nonce': nonce,
        'Access-Signature': signature
      }
    });
    res.json(result.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
