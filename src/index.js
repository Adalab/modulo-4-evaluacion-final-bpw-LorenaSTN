//Importar los modulos de NPM que necesito
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

require("dotenv").config();

//Crear el servidor.
const server = express();

//Configurar el servidor.
server.use(cors());
server.use(express.json({ limit: "25mb" }));
server.set("view engine", "ejs");

//Arrancar en un puerto:
const serverPort = 5001;
server.listen(serverPort, () => {
  console.log(`Server listening at: http://localhost:${serverPort}`);
});

async function getConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    database: "empleados",
    user: "root",
    password: "tuPassword",
  });
  await connection.connect();
}
