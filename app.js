require('dotenv').config();
const express = require('express');
const app = express();
const Auth = require('./Auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/', Auth.createAuth);
app.get('/validate/:token', Auth.validateCode);

app.listen(process.env.PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});