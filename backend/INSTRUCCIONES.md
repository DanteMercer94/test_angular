ESTRUCTURA DEL BACKEND:

backend/
├── pom.xml
├── .gitignore
├── src/
│   ├── main/
│   │   ├── java/com/crud/producto/
│   │   │   ├── ProductoCrudApplication.java
│   │   │   ├── controller/
│   │   │   │   └── ProductoController.java
│   │   │   ├── model/
│   │   │   │   └── Producto.java
│   │   │   ├── repository/
│   │   │   │   └── ProductoRepository.java
│   │   │   └── service/
│   │   │       └── ProductoService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/crud/producto/
│           └── ProductoCrudApplicationTests.java
└── database/
    └── schema.sql

PASOS PARA CREAR EL PROYECTO:

1. Crear la carpeta backend en la raíz del proyecto
2. Crear el archivo pom.xml (ya incluido)
3. Crear la estructura de carpetas Java
4. Copiar los archivos Java en sus respectivas carpetas
5. Crear la carpeta resources y el archivo application.properties
6. Crear la carpeta database y el archivo schema.sql

DEPENDENCIAS INCLUIDAS EN POM.XML:

- Spring Boot Web
- Spring Boot Data JPA
- MySQL Connector
- Lombok
- Spring Boot Test

COMANDOS MAVEN:

Compilar el proyecto:
mvn clean compile

Construir el proyecto:
mvn clean install

Ejecutar el proyecto:
mvn spring-boot:run

Ejecutar tests:
mvn test

VARIABLES DE ENTORNO (application.properties):

spring.datasource.url=jdbc:mysql://localhost:3306/crud_productos
spring.datasource.username=root
spring.datasource.password=

Si tu contraseña de MySQL es diferente, actualiza el archivo application.properties

ENDPOINTS DISPONIBLES:

GET  /api/productos           - Obtener todos los productos
GET  /api/productos/{id}      - Obtener un producto por ID
POST /api/productos           - Crear un nuevo producto
PUT  /api/productos/{id}      - Actualizar un producto existente
DELETE /api/productos/{id}    - Eliminar un producto

PAYLOAD PARA POST Y PUT:

{
  "nombre": "Nombre del Producto",
  "descripcion": "Descripción del producto",
  "precio": 99.99,
  "cantidad": 10,
  "estado": true
}

CORS CONFIGURADO PARA:

- http://localhost:4200 (Angular por defecto)
- http://localhost:5173 (Vite por defecto)
 