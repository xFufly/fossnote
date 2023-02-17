const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { is_compatible, generate_session_id, get_metadata } = require('../../helpers');
const { generateRSAInfos } = require('../../cipher');
const session = require('../../databases/session');
var forge = require('node-forge');


router.get('/', (req, res) => {
  if (!is_compatible(req.headers['user-agent'])) {
    res.status(400).send('Client is incompatible');
    return;
  }
  const session_id = generate_session_id();
  const metadata = get_metadata();
  const rsaData = generateRSAInfos();

  const session_params = {
    h: session_id,
    sCrA: true,
    sCoA: true,
    poll: false,
    a: 1,
    d: false,
    MR: rsaData.publicKeyModulus,
    ER: rsaData.publicKeyExponent
  };

  var key = new forge.util.ByteBuffer();
  key = forge.md.md5.create().update(key.bytes()).digest().toHex();

  session.createSession(session_id, 0, session_params, rsaData.privateKeyPem, {key: key, iv: null}, {});

  const file_path = path.join(__dirname, '../../views/pronote/professeur.html');
  const html_content = fs.readFileSync(file_path, { encoding: 'utf-8' });
  var updated_html = html_content.replace("Start ()", "Start ({h:'" + session_params.h + "',d:" + session_params.d + ",sCrA:" + session_params.sCrA + ",sCoA:" + session_params.sCoA + ",poll:" + session_params.poll + ",a:" + session_params.a + ",MR:'" + session_params.MR + "',ER:'" + session_params.ER + "'})");
  updated_html = updated_html.replace("${metadata.title}", metadata.title);
  updated_html = updated_html.replace("${metadata.DC_title}", metadata.title);
  updated_html = updated_html.replace("${metadata.description}", metadata.description);
  updated_html = updated_html.replace("${metadata.DC_description}", metadata.description);
  updated_html = updated_html.replace("${metadata.DC_creator}", metadata.DC_creator);
  updated_html = updated_html.replace("${metadata.DC_publisher}", metadata.DC_publisher);
  res.send(updated_html);
});

module.exports = router;
