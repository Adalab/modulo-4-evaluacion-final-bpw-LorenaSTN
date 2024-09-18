const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

require("dotenv").config();

const server = express();

server.use(cors());
server.use(express.json({ limit: "25mb" }));
server.set("view engine", "ejs");

const serverPort = process.env.PORT;
server.listen(serverPort, () => {
  console.log(`Server listening at: http://localhost:${serverPort}`);
});

async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    database: "gymcode",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  connection.connect();
  return connection;
}

server.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Leer las entradas - ver clases
server.get("/clases", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const query =
      "SELECT class.class, class.day, class.hour, teachers.name, teachers.fk_teachers FROM class, teachers WHERE class.id_Classes = teachers.fk_teachers";

    const [result] = await connection.query(query);

    connection.end();

    res.status(200).json({
      results: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error Interno del Servidor",
    });
  }
});

//Insertar entrada - crear nueva clase
server.post("/clases", async (req, res) => {
  const { className, day, hour, name, lastname } = req.body;

  if (!className || !day || !hour || !name || !lastname) {
    res.status(400).json({
      status: "error",
      message: "Campos obligatorios: className, day, hour, name, lastname ",
    });
  }

  try {
    const connection = await getDBConnection();

    const classQuery = "INSERT INTO class (class, day, hour) VALUES (?, ?, ?)";

    const [classResult] = await connection.query(classQuery, [
      className,
      day,
      hour,
    ]);

    const classId = classResult.insertId;

    const teacherQuery =
      "INSERT INTO teachers (name, lastname, fk_teachers) VALUES (?,?,?)";

    const [teacherResult] = await connection.query(teacherQuery, [
      name,
      lastname,
      classId,
    ]);

    connection.end();

    res.status(201).json({
      status: true,
      message: "Clase y profesor añadidos correctamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error Interno del Servidor",
    });
  }
});

// Actualizar entrada - modificar clase
server.put("/clases/:id", async (req, res) => {
  const id = req.params.id;
  const { className, day, hour, name, lastname } = req.body;

  try {
    const connection = await getDBConnection();

    if (className || day || hour) {
      const queryClassUpdate = `
        UPDATE class 
        SET class = COALESCE(?, class),
        day = COALESCE(?, day),
        hour = COALESCE(?, hour)
        WHERE id_Classes = ?;
      `;
      await connection.query(queryClassUpdate, [className, day, hour, id]);
    }

    if (name || lastname) {
      const queryTeacherUpdate = `
        UPDATE teachers 
        SET name = COALESCE(?, name),
        lastname = COALESCE(?, lastname)
        WHERE fk_teachers = ?; 
      `;
      await connection.query(queryTeacherUpdate, [name, lastname, id]);
    }

    connection.end();

    res.json({
      status: "success",
      message: "Información actualizada",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error Interno del Servidor",
    });
  }
});

// Elimina una entrada - elimina clase
server.delete("/clases/:id", async (req, res) => {
  const id = req.params.id;
  let connection;

  try {
    connection = await getDBConnection();

    await connection.query("DELETE FROM teachers WHERE fk_teachers = ?", [id]);

    const result = await connection.query(
      "DELETE FROM class WHERE id_Classes = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Clase no encontrada",
      });
    }

    connection.end();

    res.status(200).json({
      status: "success",
      message: "Recurso eliminado",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar el recurso",
    });
  }
});
