const Discord = require("discord.js");
const sqlite3 = require('sqlite3');
let absencedb = new sqlite3.Database('./db/absence.db', sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the absence database.');
  });

class CreateDatabase {
    startup() {
        absencedb.serialize(function () {
            absencedb.run("CREATE TABLE IF NOT EXISTS `absences` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT UNIQUE, `start` TEXT, `end` TEXT, `comment` TEXT)");

//            var stmt = absencedb.prepare("INSERT INTO `absences` (`name`, `start`, `errors`) VALUES (?, 0, 0)");
//            commandFiles.forEach(name => {
//                var thisCommand = name.split(".", 1);
//                stmt.run(thisCommand);
//            })
//            stmt.finalize();
//        });
        })
    }
}

class DatabaseTools {
    success(command) {
        absencedb.run('UPDATE commands SET count = count + 1 WHERE name = (?)', [command]);
    }

    error(command) {
        absencedb.run('UPDATE commands SET errors = errors + 1 WHERE name = (?)', [command]);
    }
}

module.exports = {
    CreateDatabase,
    DatabaseTools,
};