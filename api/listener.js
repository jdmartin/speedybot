const http = require('http');
const querystring = require('querystring');
const SqlString = require("sqlstring");
const sqlite3 = require("better-sqlite3");
const apiAttendanceTools = require('./apiAttendance.js');

class Server {
    constructor() {
        this.db = new sqlite3("./db/apiAttendance.db");
    }

    createDB() {
        var apiDBPrep = this.db.prepare(
            "CREATE TABLE IF NOT EXISTS `attendance` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `start_year` TEXT, `start_month` TEXT, `start_day` TEXT, `end_date` TEXT, `comment` TEXT, `kind` TEXT NOT NULL, `code` TEXT)",
        );
        apiDBPrep.run();
    }

    prepareDateForProcessing(givenDate) {
        let date_parts = [];

        if (givenDate) {
            let extracted_values = givenDate.split('-');
            let month = Number(extracted_values[1] - 1);
            let day = Number(extracted_values[2]);
            let year = Number(extracted_values[0]);

            date_parts.push(year, month, day, givenDate);
            return date_parts
        }
        else {
            return givenDate
        }
    }

    startListening() {
        const apiAttendance = new apiAttendanceTools.attendanceTools();

        const server = http.createServer((req, res) => {
            if (req.method === 'POST' && req.url === '/submit') {
                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                });

                req.on('end', () => {
                    const formData = querystring.parse(data);

                    // Send a response that can be captured by the iframe
                    const successMessage = 'Form submitted successfully';

                    if (formData.action === "cancel") {
                        apiAttendance.cancelAbsence(formData.cancelCode);
                    } else {
                        // Validate the user's inputs
                        let comment = "";
                        let restriction = "none";

                        if (formData.comment.length > 0) {
                            comment = SqlString.escape(formData.comment);
                        }

                        if (formData.restriction !== "nores") {
                            restriction = formData.restriction;
                        }

                        // Handle given values
                        let start_date = this.prepareDateForProcessing(formData.date);
                        let processed_end_date = this.prepareDateForProcessing(formData.endDate);
                        let start_year = start_date[0];
                        let start_month = start_date[1];
                        let start_day = start_date[2];
                        let full_start_date = start_date[3];
                        let end_year = processed_end_date[0];
                        let end_month = processed_end_date[1];
                        let end_day = processed_end_date[2];
                        let full_end_date = processed_end_date[3];

                        // We still need something if the user chose a single date, because of later checks.
                        if (typeof full_end_date === 'undefined') {
                            full_end_date = full_start_date;
                            end_year = start_year;
                            end_month = start_month;
                            end_day = start_day;
                        }

                        switch (formData.action) {
                            case "absent":
                                apiAttendance.processDBUpdate(formData.name, "absent", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day);
                                apiAttendance.generateResponse(formData.name, "absent", full_start_date, full_end_date, comment, restriction);
                                break;
                            case "late":
                                apiAttendance.processDBUpdate(formData.name, "late", comment, restriction, start_year, start_month, start_day, end_year, end_month, end_day);
                                apiAttendance.generateResponse(formData.name, "late", full_start_date, full_end_date, comment, restriction);
                                break;
                        }
                    }

                    // Set the appropriate response headers
                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*' // This allows cross-origin communication
                    });

                    // Send the success message as the response
                    res.end(successMessage);
                });
            } else {
                // Handle other requests or show an error page
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        const PORT = process.env.api_listener_port;
        const HOST = process.env.api_listener_host; // Bind to localhost
        server.listen(PORT, HOST, () => {
            console.log(`API is listening on http://${HOST}:${PORT}`);
        });
    }
}

module.exports = {
    Server
}