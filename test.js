const sqlite3 = require('sqlite3').verbose();

//Singleton initializations
var db = new sqlite3.Database('mydb.db');

db.each("SELECT * FROM user_info", function (err, row) {
    console.log(row);
});

// db.each("SELECT * FROM admin_info", function (err, row) {
//     console.log(row);
// });
// var query = `ALTER TABLE user_info ADD COLUMN rating NUMBER`;

// db.run(query);

// db.run("DROP TABLE admin_info");
// db.run("DROP TABLE user_info");