const express = require('express');
const mysql = require('mysql');
const PORT = 3030;

const app = express();

app.set('view engine', 'ejs'); //setting "ejs" as default view engine
app.use(express.static(__dirname + '/public')); //to let express know static files' path like CSS


//defining database object and creating mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'donations_db'
});

app.get('/', (req, res) => {
    res.render('home'); // just the file name is enough. ejs engine looks up the file name in the "views" folder
});



app.get('/createdb', (req, res) => {
    let q = 'CREATE DATABASE donations_db';
    db.query(q, (err, results) => {
        if (err) throw err;
        console.log(`Database Created`);
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})