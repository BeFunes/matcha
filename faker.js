// const faker = require(faker);
const mysql = require('mysql2');

const db = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "Apple123",
 database: "matcha"
});

db.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
 const query = `CREATE TABLE users (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    first_name varchar(20),
    last_name varchar(30),
    email varchar(70)  NOT NULL,
    password varchar(70)  NOT NULL,
    birthDate date DEFAULT NULL,
    gender char(1),
    orientation char(1),
    occupation varchar(50),
    bio varchar(3000),
    profilePic varchar(255),
    picture2 varchar(255),
    picture3 varchar(255),
    picture4 varchar(255),
    picture5 varchar(255),
    isOnboarded tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
 db.query(query, function (err, result) {
   if (err) throw err;
   console.log("Table created");
 });
 db.end()
});





// const db = pool.promise()
// db.query(CREATE TABLE users (
//     id int(9) unsigned NOT NULL AUTO_INCREMENT,
//     first_name varchar(20) NOT NULL,
//     last_name varchar(100) NOT NULL,
//     email varchar(40) NOT NULL,
//     password varchar(60) NOT NULL,
//     gender varchar(10) NOT NULL,
//     sexual_preference varchar(20) NOT NULL,
//     bio text NOT NULL,
//     interests set(item1,item2,item3) NOT NULL,
//     pictures set(item1,item2,item3) NOT NULL,
//     country varchar(40) NOT NULL,
//     city varchar(20) NOT NULL,
//     UNIQUE KEY email (email),
//     KEY id (id)
//    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;)

