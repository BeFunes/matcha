// const faker = require('faker');

const faker = require('faker/locale/fr');
faker.seed(123);


const randomName = faker.name.findName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// const randomCard = faker.helpers.createCard(); // random contact card containing many properties
const usercard = faker.address()


console.log(randomName)
console.log(randomEmail)
// console.log(randomCard)
// console.log(faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}} {{internet.email}}"));

// console.log(faker.fake("{{address}}"));

console.log(usercard)