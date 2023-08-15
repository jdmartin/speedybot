require("dotenv").config();
const fs = require('fs');
const http = require("http");
const net = require('net');

class Heartbeat {
    startPushing() {
        function callURL() {
            const url = process.env.MONITOR_URL;

            http.get(url, (response) => {
            }).on('error', (error) => {
                console.error(`Error calling URL: ${error.message}`);
            });

            console.log("Speedy Standing By!");
        }

        callURL();

        // Call the URL every 300 seconds (3 minutes) using the interval timer
        const interval = 298000; // 298 seconds * 1000 milliseconds
        setInterval(callURL, interval);
    }

    startSocket() {
        const socketPath = '/tmp/speedybot-socket.sock';
        // Remove the socket file if it exists
        if (fs.existsSync(socketPath)) {
            fs.unlinkSync(socketPath);
        }

        const unixServer = net.createServer(function (client) {
            // HTTP response components (because nginx)
            const responseStatusLine = 'HTTP/1.1 200 OK';
            const responseHeaders = 'Content-Type: text/plain\r\n';
            const responseBody = 'TRTL!\n';

            // Combine the components to create the full response
            const response = `${responseStatusLine}\r\n${responseHeaders}\r\n${responseBody}`;

            // Send the response to the connected client
            client.write(response);

            // Close the connection after sending the response
            client.end();
        });

        // Start listening on the Unix socket
        unixServer.listen(socketPath, function () {
            fs.chmodSync(socketPath, '775');
            console.log('Speedy socket started...');
            console.log("Speedy Standing By!");
        });

        // Graceful shutdown
        process.on('SIGINT', function () {
            console.log('Shutting down server...');

            unixServer.close(function () {
                // Remove the socket file after server is closed
                if (fs.existsSync(socketPath)) {
                    fs.unlinkSync(socketPath);
                }
                console.log('Server closed');
                process.exit(0);
            });
        });
    }
}


module.exports = {
    Heartbeat,
};
