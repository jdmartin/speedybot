require("dotenv").config();
const express = require('express');
const app = express();
const port = ${process.env.speedyport}

const helmet = require('helmet');

class Heartbeat {
    startBeating() {
        app.use(helmet())

        app.get('/', (req, res) => {
            res.send('🐢')
        })

        app.listen(port, 'localhost', () => {
            console.log(`Heartbeat beating on http://localhost:${port}`)
        })
    }
};

module.exports = {
    Heartbeat
}