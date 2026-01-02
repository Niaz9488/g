/**
 * my-license-server/api/check-key.js
 *
 * Simple Express-compatible handler that validates a license key.
 * - Reads key from header `x-license-key`, body `key`, or query `key`.
 * - Performs a basic format check and verifies against LICENSE_KEYS env var (comma-separated)
 * - Responds with JSON { valid: boolean, message: string }
 *
 * Usage (with express):
 *   const express = require('express');
 *   const app = express();
 *   app.use(express.json());
 *   const checkKey = require('./api/check-key');
 *   app.post('/api/check-key', checkKey);
 */

const VALID_KEYS = (process.env.LICENSE_KEYS || 'demo-key-123').split(',').map(k => k.trim()).filter(Boolean);

function isValidKeyFormat(key) {
  // Basic sanity: allow alphanumeric, dash and underscore, 8-64 chars
  return typeof key === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(key);
}

module.exports = function checkKeyHandler(req, res) {
  const key = (req.headers && (req.headers['x-license-key'] || req.headers['X-License-Key'])) ||
              (req.body && req.body.key) ||
              (req.query && req.query.key);

  if (!key) {
    return res.status(400).json({ valid: false, message: 'license key missing' });
  }

  if (!isValidKeyFormat(key)) {
    return res.status(400).json({ valid: false, message: 'invalid key format' });
  }

  const valid = VALID_KEYS.includes(key);

  return res.json({ valid, message: valid ? 'key is valid' : 'key not recognized' });
};

/*
Example curl:
  LICENSE_KEYS=demo-key-123 node server.js
  curl -X POST http://localhost:3000/api/check-key -H "x-license-key: demo-key-123"
*/
