const express = require('express');
const app = express();
const port = 3000;

require('dotenv').config();

app.use('/', express.static('public'));

app.listen(port, () => console.log(`Listening on port ${port}!`));
app.get('/sub', (req, res) => {
    res.send({
        'subkey': process.env.FACE_SUBSCRIPTION_KEY,
        'subregion': process.env.FACE_SUBSCRIPTION_REGION
    });
});
