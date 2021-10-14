const express = require('express');
const mysql = require('mysql');
const faker = require('faker');

const PORT = 4012;

const app = express();

app.set('view engine', 'ejs'); //setting "ejs" as default view engine
app.use(express.static(__dirname + '/public')); //to let express know static files' path like CSS
app.use(express.urlencoded({ extended: true })); //body-parser parses the request body. when a request is sent, it extracts the data we require.

//defining database object and creating mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'donations_db',
    multipleStatements: true
});

//create fake data
let people = [];

for (let i = 0; i < 23; i++) {

    let fName = faker.name.firstName();
    let lName = faker.name.lastName();
    let email = faker.internet.email();
    let amount = faker.finance.amount(1, 999, 2);
    people.push([fName, lName, email, amount]);
}


app.get('/', (req, res) => {
        db.query('SELECT COUNT(*) AS count, FORMAT(SUM(donation_amount),2) AS total FROM donations;', (err, result) => {
            if (err) throw err;
            let count = result[0].count; //since query column is requested as "count". we can use "count" to get back the raw value
            let total = result[0].total;

            db.query('SELECT CONCAT(last_name, ", ", first_name) AS latest_donator, donation_amount AS amount FROM donations ORDER BY donation_time DESC LIMIT 1;', (err, result) => {
                if (err) throw err;
                let donatorName = result[0].latest_donator;
                let amount = result[0].amount;
                res.render('home', { donatorName: donatorName, amount: amount, count: count, total: total }); // just the file name is enough. ejs engine looks up the file name in the "views" folder

            });
        });

       
});

//insert fake data
app.get('/insertRows', (req, res) => {
    db.query('INSERT INTO donations(first_name, last_name, email, donation_amount) VALUES ?;', [people], (err, result) => {
        if (err) throw err;
        res.send('Donations Have Been Made!');
    });
});

app.get('/donate', (req,res) => {
    res.render('donate');
});

app.post('/donate', (req, res) => {

    let donator = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        donation_amount: req.body.donation_amount
    };

    db.query('INSERT INTO donations SET ?;', donator, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})