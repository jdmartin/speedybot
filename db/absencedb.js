const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
let absencedb = new sqlite3.Database('./absence.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the absence database.');
  });

// class CreateDatabase {
//     startup() {
//         absencedb.serialize(function () {
//             absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `start` TEXT, `end` TEXT, `comment` TEXT)"),
//             absencedb.run("CREATE TABLE IF NOT EXISTS `foo` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `start` TEXT, `end` TEXT, `comment` TEXT)");
//         });
//     }
// }

class DatabaseTools {
    success(command) {
        absencedb.run('UPDATE commands SET count = count + 1 WHERE name = (?)', [command]);
    }

    error(command) {
        absencedb.run('UPDATE commands SET errors = errors + 1 WHERE name = (?)', [command]);
    }
}

module.exports = {
    //CreateDatabase,
    DatabaseTools,
};