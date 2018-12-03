const faker = require('faker/locale/fr');
const mysql = require('mysql2');
const datesBetween = require('dates-between')
const bcrypt = require('bcryptjs');
const listName = require('./nameList')

const db = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "Apple123",
 database: "matchadb"
});

const getOrientation = (gender, orientation) => {
	const oppositeSex = gender === 'M' ? 'F' : 'M'
	switch (orientation) {
		case "straight" :
			return oppositeSex
		case "gay" :
			return gender
		default:
			return "B"
	}
}

const dummyPassword = "$2a$12$rZHGfYxrMBjazgmd.OXq3OiH5wiocqYo6QB5Mxp6I2msv/JnGQL2K"

const getData = async function (gender, orient) {
	const genderCode = gender === 'M' ? 0 : 1
	const firstName = listName.fakeFirstName(genderCode);
	const lastName = faker.name.lastName(genderCode); // Kassandra.Haley@erich.biz
	const email = `${firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()}.${lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()}@hotmail.com`
	const password = dummyPassword
	const year = Math.floor(Math.random() * (2000-1970)) + 1970
	const date = faker.date.past().toLocaleDateString('zh-Hans-CN').replace(/\//g, "-")
	const dob = year.toString() + date.substr(4)
	const orientation = getOrientation(gender, orient)
	faker.locale = "en";
	const occupation = faker.name.jobTitle()
	const bio = faker.lorem.paragraph()
	const profilePicture = faker.image.avatar()
	return [firstName, lastName, email, password, dob, gender, orientation, occupation, bio, profilePicture]
}


const createUsersTableQuery = `CREATE TABLE users (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    first_name varchar(20),
    last_name varchar(30),
    email varchar(70)  NOT NULL,
    password varchar(70)  NOT NULL,
    dob date DEFAULT NULL,
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

const createInterestsTableQuery = `CREATE TABLE interests (
    title varchar(20) NOT NULL,
    user int
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

const populateTableQuery = `INSERT INTO users (first_name, last_name, email, password,
dob, gender, orientation, occupation, bio, profilePic, 
picture2, picture3, picture4, picture5, isOnboarded)
VALUES
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, 1)`
// const data = [firstName, lastName, email, password, dob, gender, orientation, occupation, bio, profilePicture];


const getRandomUser = () => {
	const sex = ['M', 'F']
	const orient = ['straight', 'gay', 'bisexual']
	return { gender : sex[Math.floor(Math.random()*sex.length)], orientation : orient[Math.floor(Math.random()*orient.length)]}
}


db.connect(async function (err) {
 if (err) throw err;
 console.log("Connected!");
	db.query("DROP TABLE IF EXISTS users", function (err, result) {
		if (err) throw err;
		console.log("Table users deleted");
	});
	db.query(createUsersTableQuery, function (err, result) {
		if (err) throw err;
		console.log("Table users created");
	});
	for (let i = 0; i < 300; i++) {
		let user = getRandomUser()
		const data = await getData(user.gender, user.orientation)
		db.query(populateTableQuery, data,  function (err, result) {
			if (err) throw err;
		});
	}
	console.log("User data Inserted");
	db.query("DROP TABLE IF EXISTS interests", function (err, result) {
		if (err) throw err;
		console.log("Table interests deleted");
	});
	db.query(createInterestsTableQuery, function (err, result) {
		if (err) throw err;
		console.log("Table interests created");
	});
	db.end()
});

