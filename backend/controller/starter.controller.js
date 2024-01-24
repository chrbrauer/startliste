var _ = require('lodash');
const fs = require('fs');
const fsp = require('fs/promises');
var os = require('os');
var child_process = require('child_process');
var request = require('request');
const e = require("express");
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', user: 'root', password: 'password', charset: 'utf8mb4'
});


connection.connect((err) => {
    if (err) throw err;
    console.log('Verbindung zur MySQL-Datenbank hergestellt!');

    // Erstelle die Datenbank
    connection.query('CREATE DATABASE IF NOT EXISTS StarterListeDatabase', (err) => {
        if (err) throw err;
        console.log('Datenbank "meineDatenbank" erstellt!');

        // Wähle die Datenbank aus
        connection.query('USE StarterListeDatabase', (err) => {
            if (err) throw err;
            console.log('Benutze Datenbank "StarterlisteDatabase"');

            // Erstelle Tabellen oder führe andere erforderliche Schritte aus
            // Erstelle die Tabelle für Schützen
            const createWettkampfTableQuery = `
CREATE TABLE IF NOT EXISTS Wettkampf (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);`;
            connection.query(createWettkampfTableQuery, (err) => {
                if (err) throw err;
                console.log('Tabelle "Wettkampf" erstellt!');
            });

            // Erstelle Tabellen oder führe andere erforderliche Schritte aus
            // Erstelle die Tabelle für Schützen
            const createStarterTableQuery = `
CREATE TABLE IF NOT EXISTS Starter (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bahn INT NOT NULL,
    zeit INT NOT NULL,
    status INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    disziplin VARCHAR(255) NOT NULL,
    wettkampf_id INT,
    FOREIGN KEY (wettkampf_id) REFERENCES Wettkampf(id)
);`;
            connection.query(createStarterTableQuery, (err) => {
                if (err) throw err;
                console.log('Starterliste erstellt!');
            });
        });
    });
});

module.exports.getAllWettkampf = (req, res) => {
    const query = 'SELECT * from Wettkampf'
    connection.query(query, (error, results) => {
        if (error) throw error;

        return res.status(200).json({status: true, content: results})
    });
}



function converter(word) {
    word = word.replace('ä', 'Ã¤');
    word = word.replace('ö', 'Ã¶');
    word = word.replace('ü', 'Ã¼');
    word = word.replace('ß', 'ÃŸ');
    word = word.replace('Ä', 'Ã„');
    word = word.replace('Ö', 'Ã–');
    word = word.replace('Ü', 'Ãœ');
    return word
}

module.exports.createWettkampf = (req, res) => {
    const query = "INSERT INTO Wettkampf(name) VALUES (?);"
    connection.query(query, [converter(req.query['name'])], (error2, results2) => {
        if (error2) throw error2;
        return res.status(200).json({status: false, content: results2})
    });
}

module.exports.createStart = (req, res) => {
    const query = 'INSERT INTO Starter(name, disziplin, wettkampf_id, zeit, bahn, status) VALUES (?,?,?,?,?,?)';
    connection.query(query, [converter(req.query['name']), converter(req.query['disziplin']), req.query['wettkampf_id'], req.query['zeit'], req.query['bahn'], '0'], (error, results) => {
        if (error) throw error;
        return res.status(200).json({status: true, content: results})
    });
}

module.exports.getStarterliste = (req, res) => {
    const query = 'SELECT starter.name, starter.disziplin, starter.zeit, starter.bahn, starter.status, starter.id from Starter JOIN Wettkampf ON Wettkampf.id = starter.wettkampf_id WHERE starter.wettkampf_id = ?'
    connection.query(query, [req.query['wettkampf_id']], (error, results) => {
        if (error) throw error;

        return res.status(200).json({status: true, content: results})
    });
}

module.exports.UpdateStarter = (req, res) => {
    const query = 'UPDATE Starter SET zeit = ?, bahn = ?, status = ? WHERE id = ?';
    connection.query(query, [req.query['zeit'], req.query['bahn'], req.query['status'], req.query['starter_id']], (error, results) => {
        if (error) throw error;
        return res.status(200).json({status: true, content: results})
    });
}

module.exports.DeleteStarter = (req, res) => {
    const query = 'DELETE FROM Starter WHERE id = ?';
    connection.query(query, [req.query['starter_id']], (error, results) => {
        if (error) throw error;
        return res.status(200).json({status: true, content: results})
    });
}


