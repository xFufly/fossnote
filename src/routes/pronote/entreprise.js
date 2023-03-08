const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { is_compatible, generate_session_id } = require('../../helpers');

router.get('/', (req, res) => {
  /*if (!is_compatible(req.headers['user-agent'])) {
    res.status(400).send('Client is incompatible');
    return;
  }*/
  const session_id = generate_session_id();
  const session_params = {
    h: session_id,
    sCrA: true,
    sCoA: true,
    a: 16,
    d: false,
    MR: 'LONG NUMBER',
    ER: 'ANOTHER INSANELY LONG NUMBER'
  };
  const file_path = path.join(__dirname, '../../views/pronote/direction.html');
  const html_content = fs.readFileSync(file_path, { encoding: 'utf-8' });
  const updated_html = html_content.replace('Start ()', `Start (${JSON.stringify(session_params)})`);
  res.send(updated_html);
});

module.exports = router;