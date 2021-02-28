const express = require('express');
const app = express();
const helmet = require('helmet');

class Heartbeat {
    startBeating() {
        app.use(helmet())

        app.get('/', (req, res) => {
            res.send('🐢')
        })

        app.listen('/run/speedysock/speedysock', () => {
            console.log(`Heartbeat beating on socket: /run/speedysock/speedysock`)
        })
    }
};

module.exports = {
    Heartbeat
}