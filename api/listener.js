import { createServer } from 'node:http';
import { parse } from 'node:querystring';
import { existsSync, unlinkSync, chmodSync } from 'node:fs';
import SqlString from 'sqlstring';
import sqlite3 from 'better-sqlite3';
import { apiAttendanceTools } from './apiAttendance.js';

class Server {
    constructor() {
        this.db = new sqlite3("./db/apiAttendance.db");
    }

    createDB() {
        const apiDBPrep = this.db.prepare(
            "CREATE TABLE IF NOT EXISTS `attendance` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `end_date` TEXT, `comment` TEXT, `kind` TEXT NOT NULL, `code` TEXT)"
        );
        const messagesDBPrep = this.db.prepare(
            "CREATE TABLE IF NOT EXISTS `messages` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `code` TEXT, `messageID` TEXT)"
        );
        apiDBPrep.run();
        messagesDBPrep.run();
    }

    prepareDateForProcessing(givenDate) {
        if (!givenDate) return givenDate;
        const [year, month, day] = givenDate.split('-').map(Number);
        return [year, month - 1, day, givenDate];
    }

    handleRequest(req, res) {
        const apiAttendance = new apiAttendanceTools();

        if (req.method === 'POST' && req.url === '/submit') {
            let data = '';

            req.on('data', chunk => { data += chunk; });

            req.on('end', () => {
                try {
                    const formData = parse(data);

                    const successMessage = 'Form submitted successfully';

                    if (formData.action === "cancel") {
                        apiAttendance.cancelAbsence(formData.name, formData.cancelCode);
                    } else {
                        let comment = formData.comment ? SqlString.escape(formData.comment) : "";
                        let restriction = formData.restriction !== "nores" ? formData.restriction : "none";

                        const start_date = this.prepareDateForProcessing(formData.date);
                        const end_date = this.prepareDateForProcessing(formData.endDate) || start_date;

                        const [start_year, start_month, start_day, full_start_date] = start_date;
                        const [end_year, end_month, end_day, full_end_date] = end_date;

                        switch (formData.action) {
                            case "absent":
                                console.log(`Marking ${formData.name} absent from ${full_start_date} to ${full_end_date}`);
                                apiAttendance.processDBUpdate(formData.name, "absent", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day, formData.cancelCode);
                                apiAttendance.generateResponse(formData.name, "absent", full_start_date, full_end_date, comment, restriction, formData.cancelCode);
                                break;
                            case "late":
                                console.log(`Marking ${formData.name} late from ${full_start_date} to ${full_end_date}`);
                                apiAttendance.processDBUpdate(formData.name, "late", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day, formData.cancelCode);
                                apiAttendance.generateResponse(formData.name, "late", full_start_date, full_end_date, comment, restriction, formData.cancelCode);
                                break;
                            default:
                                console.warn(`⚠️ Unknown action: ${formData.action}`);
                        }
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(successMessage);
                } catch (err) {
                    console.error("❌ Error processing request:", err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }

    startHttpListener() {
        const server = createServer((req, res) => this.handleRequest(req, res));
        const PORT = process.env.API_LISTENER_PORT || 8086;
        const HOST = process.env.API_LISTENER_HOST || '127.0.0.1';

        server.listen(PORT, HOST, () => {
            console.log(`HTTP API listener started on http://${HOST}:${PORT}`);
        });
    }

    startSocketListener() {
        const socketPath = '/tmp/api-attendance.sock';

        if (existsSync(socketPath)) {
            unlinkSync(socketPath);
            console.log(`Removed existing socket at ${socketPath}`);
        }

        const server = createServer((req, res) => this.handleRequest(req, res));

        server.listen(socketPath, () => {
            chmodSync(socketPath, '775');
            console.log(`API socket listener started at ${socketPath}`);
        });

        process.on('SIGINT', () => {
            console.log('Shutting down socket server...');
            server.close(() => {
                if (existsSync(socketPath)) unlinkSync(socketPath);
                process.exit();
            });
        });
    }
}

export { Server };
