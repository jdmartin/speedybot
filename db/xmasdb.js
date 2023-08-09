require("dotenv").config();
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const sqlite3 = require("better-sqlite3");
const ExcelJS = require('exceljs');
const currentDate = new Date();
const currentYear = parseInt(currentDate.getFullYear());

//Other Tools
var SqlString = require("sqlstring");

let xmasdb = new sqlite3("./db/xmas.db");

class CreateXmasDatabase {
    startup() {
        var xmasDBPrep = xmasdb.prepare(
            "CREATE TABLE IF NOT EXISTS `elves` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT, `count` INTEGER, `notes` TEXT, `address` TEXT, year INTEGER)",
        );

        xmasDBPrep.run();
    }
}

class XmasTools {
    //Commands sanitize the input and add it to the DB.

    addElf(name, count, notes, address) {
        const selectElf = xmasdb.prepare("SELECT COUNT(*) AS count FROM elves WHERE name = ? AND year = ? LIMIT 1");
        var elfSelection = selectElf.pluck().get(name, currentYear);

        if (elfSelection > 0) {
            this.updateElfInDB(parseInt(count), name, SqlString.escape(notes), SqlString.escape(address));
        } else {
            this.addElfToDB(parseInt(count), name, SqlString.escape(notes), SqlString.escape(address));
        }
    }

    addElfToDB(count, name, notes, address) {
        const elfInsert = xmasdb.prepare("INSERT INTO elves(name, count, notes, address, year) VALUES (?,?,?,?,?)");
        elfInsert.run(name, count, notes, address, currentYear);
    }

    updateElfInDB(count, name, notes, address) {
        const elfUpdate = xmasdb.prepare("UPDATE elves SET count = ?, notes = ?, address = ? WHERE name = ? AND year = ?");
        elfUpdate.run(count, notes, address, name, currentYear);
    }
}

class XmasDisplayTools {
    async export() {
        const elfExport = xmasdb.prepare("SELECT * FROM elves");
        const rows = elfExport.all();

        // Create a new Excel workbook and worksheet
        const columnOrder = ['name', 'count', 'address', 'cust1', 'cust2', 'cust3', 'notes'];
        const columnMapping = {
            name: 'NAME',
            count: '# OF CARDS',
            notes: 'NOTES',
            address: 'ADDRESS',
            cust1: 'LIST SENT',
            cust2: 'LIST ACK',
            cust3: 'CARDS RECEIVED'
        };
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`elves-${currentYear}.xslx`);

        // Add headers to the worksheet
        const headerRow = worksheet.addRow(columnOrder.map(column => columnMapping[column]));
        // Set column widths (adjust values as needed)
        headerRow.eachCell((cell, colNumber) => {
            const columnWidths = [20, 20, 30, 10, 10, 15, 45]; // Example widths
            const columnIndex = colNumber - 1; // ExcelJS is 1-based index, array is 0-based
            worksheet.getColumn(colNumber).width = columnWidths[columnIndex];
        });

        // Add data rows to the worksheet
        rows.forEach(row => {
            // Replace newline characters with ', ' in the address field
            row.address = row.address.replace(/\\n/g, ', ');

            // If count is 'null', then we probably have a case where the person chose 'all'
            if (row.count == null) {
                row.count = "all (should verify)";
            }

            // Create an object representing the row with custom values
            const newRow = {
                ...row,
                cust1: '', // Add custom value for cust1
                cust2: '', // Add custom value for cust2
                cust3: ''  // Add custom value for cust3
            };

            // Map values to columns based on columnOrder
            const values = columnOrder.map(column => newRow[column]);
            worksheet.addRow(values);
        });

        // Save the Excel file to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create a Discord.js attachment
        const attachmentBuilder = new AttachmentBuilder(buffer, { name: `elves-${currentYear}.xlsx` });

        // Return both the attachment and buffer
        return {
            attachment: attachmentBuilder,
        };
    }

    show() {
        const elvesEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Good Little Elves 🧝").setFooter({
            text: "These good elves are known to the Infinite Speedyflight. (Addresses in attached spreadsheet) Use this information wisely.",
        });
        var elfSql = xmasdb.prepare("SELECT * FROM elves WHERE year = ? ORDER BY name ASC");
        var elfResults = elfSql.all(currentYear);
        if (elfResults.length > 0) {
            elfResults.forEach((row) => {
                let theCount = row.count;
                if (theCount == null) {
                    theCount = "all"
                }
                elvesEmbed.addFields({
                    name: row.name,
                    value: "Number of Cards: " + theCount + "\nNotes: " + row.notes,
                    inline: false,
                });
            });
        } else {
            elvesEmbed.addFields({
                name: "No one of consequence!",
                value: "No elves, yet!  Looks like everyone's getting coal...",
                inline: false,
            });
        }

        return elvesEmbed;
    }

    stats() {
        const elfStatsEmbed = new EmbedBuilder().setColor(0xffffff).setTitle("🧝‍♀️ Happy Little Stats 🧝").setFooter({ text: "(Does not count replies of 'all')", });

        var cardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves WHERE year = ?");
        var cardTotalResults = cardTotal.pluck().get(currentYear);

        var allTimeCardTotal = xmasdb.prepare("SELECT SUM(count) FROM elves");
        var allTimeCardTotalResults = allTimeCardTotal.pluck().get();

        if (cardTotalResults > 0) {
            elfStatsEmbed.addFields({
                name: `Total Cards for ${currentYear.toString()}:`,
                value: cardTotalResults.toString(),
                inline: false,
            });

            elfStatsEmbed.addFields({
                name: "All-Time Card Total:",
                value: allTimeCardTotalResults.toString(),
                inline: false,
            });
        } else {
            elfStatsEmbed.addFields({
                name: "Saddest Number of Cards:",
                value: "0",
                inline: false,
            });
        }

        return elfStatsEmbed;
    }
}

module.exports = {
    XmasTools,
    CreateXmasDatabase,
    XmasDisplayTools,
};
