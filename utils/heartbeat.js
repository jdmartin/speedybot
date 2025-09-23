import { chmodSync, existsSync, unlinkSync } from 'node:fs';
import { platform } from 'node:os';
import { access } from 'node:fs/promises';
import { get } from 'node:http';
import { createServer } from 'node:net';

class Heartbeat {
    constructor() {
        this.cachedResponse = this.generateResponse();
        this.socketPath = this.setSocketPath();
    }

    setSocketPath() {
        return platform() === 'darwin'
            ? '/tmp/speedybot-socket.sock'
            : '/run/speedybot/speedybot-socket.sock';
    }

    startHttpListener() {
        const server = createServer((req, res) => this.handleRequest(req, res));
        const PORT = process.env.LISTENER_PORT || 8087;
        const HOST = process.env.LISTENER_HOST || '127.0.0.1';

        server.listen(PORT, HOST, () => {
            console.log(`HTTP listener started on http://${HOST}:${PORT}`);
        });
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

    handleShutdown() {
        console.log('Shutting down server...');

        try {
            access(this.socketPath);
            unlinkSync(this.socketPath);
            console.log('Socket file removed');
        } catch (err) {
            console.error('Error removing socket file:', err);
        }

        console.log('Server closed');
        process.exit(0);
    }

    startSocket() {
        // Remove the socket file if it exists
        if (existsSync(this.socketPath)) {
            unlinkSync(this.socketPath);
        }

        const unixServer = createServer((client) => {
            // Use an arrow function to maintain the class instance as 'this'
            client.write(this.cachedResponse);
            client.end();
        });

        // Start listening on the Unix socket
        unixServer.listen(this.socketPath, () => {
            chmodSync(this.socketPath, '775');
            console.log('Speedy socket started on:', this.socketPath);
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

export { Heartbeat };