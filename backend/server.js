const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var assert = require('assert');


const app = express();
app.use(cors());
app.use(express.json());


var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'projectone',
    authPlugins: {
        mysql_native_password: () => {
            return Buffer.from('root'); // Provide your password here
        },
    },
});

function SendEmail(req) {

    var text = req.body.Email + "&" + req.body.Role;

    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "devang.techcronus@gmail.com",
            pass: "xqnt mqiy njcw zhhm"
        }
    });

    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    host = req.get('host');
    link = "http://localhost:5173/verify?id=" + encrypted;
    mailOptions = {
        to: req.body.Email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
    //});
}

app.post('/verify', (req, res) => {
    if (req) {
        var decipher = crypto.createDecipher(algorithm, key);
        var decrypted = decipher.update(req.body.id, 'hex', 'utf8') + decipher.final('utf8');
        var decryptedValue = decrypted.split('&');
        var sql = "UPDATE  users SET IsVarified = 1 WHERE ";
        var fields = [{ fieldName: "Email", value: decryptedValue[0], operator: "AND" },
        { fieldName: "Role", value: decryptedValue[1], operator: "" }];

        fields.forEach((f) => {
            sql = sql + `${f.fieldName} ='${f.value}' `
            if (f.operator != "") sql = sql + f.operator + " "
        });
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(400).json({ error: "Error.." });
            }
            else {
                return res.status(200).json({ error: "Email Varified Successfully" });
            }
        });
    }

});

app.post('/signup', (req, res) => {

    SendEmail(req);
    const sql = "INSERT INTO users(FirstName,LastName,Email,Password,Role,IsVarified) VALUES(?)";

    const values = [
        req.body.FirstName,
        req.body.LastName,
        req.body.Email,
        req.body.Password,
        req.body.Role,
        req.body.IsVarified
    ];


    var sqlCheck = "SELECT * FROM users WHERE ";
    var fields = [{ fieldName: "Email", value: req.body.Email, operator: "AND" }, { fieldName: "Role", value: req.body.Role, operator: "" }];

    fields.forEach((f) => {
        sqlCheck = sqlCheck + `${f.fieldName} ='${f.value}' `
        if (f.operator != "") sqlCheck = sqlCheck + f.operator + " "
    });


    db.query(sqlCheck, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        else if (data.length == 0) {
            db.query(sql, [values], (err, data) => {
                if (err) {
                    return res.json("Error");
                }
                return res.json(data);
            });
        }
        else {
            return res.status(400).json({ error: "Email already exists" });
        }
    });


});

// Customer Login API
app.post('/login', (req, res) => {
    var sql = "SELECT * FROM users WHERE ";
    var fields = [
        { fieldName: "Email", value: req.body.email, operator: "AND" },
        { fieldName: "Password", value: req.body.password, operator: "" }
    ];

    fields.forEach((f, index) => {
        sql += `${f.fieldName} ='${f.value}'`;
        if (index < fields.length - 1) {
            sql += ` ${f.operator} `;
        }
    });

    db.query(sql, (err, data) => {
        if (err) {
            return res.status(400).json({ error: "Database error: " + err.message });
        } else if (data.length > 0) {

            if (data[0].IsVerified === 0) {
                return res.status(400).json({ error: "User not verified" });
            } else if (data[0].Role === "Customer") {
                return res.status(400).json({ error: "You are not allowed to login from here" });
            } else {
                return res.json(data[0]);
            }
        } else {
            return res.status(400).json({ error: "Invalid email or password" });
        }
    });
});





app.listen(8081, () => {
    console.log("listining");
});

