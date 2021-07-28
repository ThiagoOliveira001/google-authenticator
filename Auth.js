const speakyeasy = require('speakeasy');
const qrcode = require('qrcode');
let authKey = null;

class Auth {

    createAuth(req, res) {
        const secret = speakyeasy.generateSecret({
            name: 'Teste Authenticator'
        });

        qrcode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Ocorreu um erro inesperado' });
            }

            authKey = secret.ascii;
            const template = `
                <style>
                    a {
                        padding: 20;
                        background-color: #4caf50; 
                        text-decoration: none;
                        color: black;
                        border-radius: 5px;
                        box-shadow: 5px 5px 5px 5px grey;
                    }

                    a:hover {
                        background-color: #388e3c;
                    }
                </style>
                <div style="display: flex; flex-direction: column; align-items: center">
                    <h1>Use o QR ou clique em abrir com authenticator</h1>
                    <img src="${data}" width="300" height="300"/>
                    <a href="${secret.otpauth_url}" target="_blank" style="">
                        Abrir com authenticator
                    </a>
                </div>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(template);
            return res.end();
        });
    }

    validateCode(req, res) {
        const valid = speakyeasy.totp.verify({
            secret: authKey,
            encoding: 'ascii',
            token: req.params.token
        });

        return res.status(200).json({ valid });
    }
}

module.exports = new Auth();