CONFIGURACION DE MYSQL

INSTALACION EN WINDOWS:

1. Descargar MySQL Server desde: https://dev.mysql.com/downloads/mysql/
2. Ejecutar el instalador
3. Seguir los pasos del asistente
4. En "Server Configuration" seleccionar:
   - TCP/IP Port: 3306
   - Windows Service: MySQL80 (o la versión que instales)
5. Configurar el usuario root con contraseña (o dejar en blanco)

INICIAR MYSQL SERVER:

Opción 1 (Terminal):
net start MySQL80

Opción 2 (Services):
Presionar Windows + R
Escribir: services.msc
Buscar MySQL80 y hacer clic derecho -> Start

VERIFICAR QUE MYSQL ESTA CORRIENDO:

mysql -u root -p

Si pide contraseña y no tienes, presiona Enter.
Si no tiene contraseña, ejecuta:
mysql -u root

CREAR LA BASE DE DATOS Y TABLAS:

Opción 1 (MySQL Command Line):
1. Abrir MySQL Command Line Client
2. Ingresar contraseña (o presionar Enter si no tiene)
3. Ejecutar:

source backend/database/schema.sql;

Opción 2 (MySQL Workbench):
1. Abrir MySQL Workbench
2. Conectar al servidor local
3. Abrir File -> Open SQL Script
4. Seleccionar: backend/database/schema.sql
5. Ejecutar

Opción 3 (Terminal):
mysql -u root < backend/database/schema.sql

O si tiene contraseña:
mysql -u root -p < backend/database/schema.sql

VERIFICAR QUE LA BASE DE DATOS SE CREO:

mysql -u root -p
SHOW DATABASES;
USE crud_productos;
SHOW TABLES;
SELECT * FROM productos;

REINICIAR MYSQL SERVER:

net stop MySQL80
net start MySQL80

CAMBIAR CONTRASEÑA DE ROOT:

1. Abrir terminal como administrador
2. Ejecutar:
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
FLUSH PRIVILEGES;
EXIT;

3. Actualizar application.properties en backend:
spring.datasource.password=nueva_contraseña

RESTAURAR BASE DE DATOS DESDE BACKUP:

mysql -u root -p crud_productos < backup.sql

HACER BACKUP DE LA BASE DE DATOS:

mysqldump -u root -p crud_productos > backup.sql

CREAR USUARIO ADICIONAL PARA LA APLICACION:

mysql -u root -p
CREATE USER 'crud_user'@'localhost' IDENTIFIED BY 'crud_password';
GRANT ALL PRIVILEGES ON crud_productos.* TO 'crud_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

Luego actualizar application.properties:
spring.datasource.username=crud_user
spring.datasource.password=crud_password

SOLUCIONAR PROBLEMAS:

Error: "Access denied for user 'root'@'localhost'":
- Verificar que la contraseña en application.properties sea correcta
- Verificar que MySQL server está corriendo

Error: "Unknown database 'crud_productos'":
- Ejecutar el script schema.sql nuevamente
- Verificar que no hay errores en la ejecución

Error: "Can't connect to MySQL server":
- Verificar que MySQL está corriendo: net start MySQL80
- Verificar que el puerto 3306 está disponible
- Reintentar la conexión después de iniciar el servicio
 