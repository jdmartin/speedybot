import { chmodSync, existsSync, unlinkSync } from 'node:fs';
import { access, unlink } from 'node:fs/promises';
import { get } from 'node:http';
import { createServer } from 'node:net';

export class Heartbeat {
    constructor() {
        this.cachedResponse = this.generateResponse();
    }

    startPushing() {
        function callURL() {
            const url = process.env.MONITOR_URL;

            get(url, (response) => {
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

    async handleShutdown() {
        const socketPath = '/tmp/speedybot-socket.sock';
        console.log('Shutting down server...');

        try {
            await access(socketPath);
            await unlink(socketPath);
            console.log('Socket file removed');
        } catch (err) {
            console.error('Error removing socket file:', err);
        }

        console.log('Server closed');
        process.exit(0);
    }

    startSocket() {
        const socketPath = '/tmp/speedybot-socket.sock';
        // Remove the socket file if it exists
        if (existsSync(socketPath)) {
            unlinkSync(socketPath);
        }

        const unixServer = createServer((client) => {
            // Use an arrow function to maintain the class instance as 'this'
            client.write(this.cachedResponse);
            client.end();
        });

        // Start listening on the Unix socket
        unixServer.listen(socketPath, function () {
            chmodSync(socketPath, '775');
            console.log('Speedy socket started...');
            console.log("Speedy Standing By!");
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            this.handleShutdown();
        });
    }

    generateResponse() {
        // HTTP response components (because nginx)
        const responseComponents = [];
        responseComponents.push('HTTP/1.1 200 OK');
        responseComponents.push('Content-Type: text/plain\r\n');
        responseComponents.push('TRTL!\n');

        return responseComponents.join('\r\n');
    }
}
