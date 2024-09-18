CREATE DATABASE gymcode;

USE gymcode;


CREATE TABLE class(
id_Classes INT AUTO_INCREMENT PRIMARY KEY, 
name VARCHAR(45) NOT NULL,
day ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes') NOT NULL,
hour TINYINT NOT NULL
);


CREATE TABLE teachers(
id_Teachers INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(45) NOT NULL,
lastname VARCHAR(45) NOT NULL,
fk_teachers INT NOT NULL,
FOREIGN KEY (fk_teachers) REFERENCES class (id_Classes)
);

INSERT INTO class (class, day, hour)
VALUES
('Pilates', 'Lunes', '11'),
('Yoga', 'Miercoles', '9'),
('Spinning', 'Jueves', '12'),
('GAP', 'Viernes', '10');

INSERT INTO teachers (name, lastname, fk_teachers)
VALUES 
('Ana', 'García', '2'),
('María', 'Hernandez', '3'),
('Claudia', 'Sánchez', '4'),
('Elena', 'Bonet', '1');





