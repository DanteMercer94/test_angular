EJEMPLOS DE USO DE LA API CON CURL

OBTENER TODOS LOS PRODUCTOS:
curl -X GET http://localhost:8080/api/productos

OBTENER PRODUCTO POR ID:
curl -X GET http://localhost:8080/api/productos/1

CREAR UN NUEVO PRODUCTO:
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Producto",
    "descripcion": "Descripción del producto",
    "precio": 49.99,
    "cantidad": 20,
    "estado": true
  }'

ACTUALIZAR UN PRODUCTO:
curl -X PUT http://localhost:8080/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Actualizado",
    "descripcion": "Nueva descripción",
    "precio": 59.99,
    "cantidad": 15,
    "estado": false
  }'

ELIMINAR UN PRODUCTO:
curl -X DELETE http://localhost:8080/api/productos/1

RESPUESTA EXITOSA (200/201):
{
  "id": 1,
  "nombre": "Laptop Dell",
  "descripcion": "Laptop Dell Inspiron 15, Intel i7, 16GB RAM, 512GB SSD",
  "precio": 999.99,
  "cantidad": 5,
  "estado": true
}

RESPUESTA DE ERROR (404):
{
  "error": "Producto no encontrado"
}

RESPUESTA DE ERROR (400):
{
  "error": "Datos inválidos"
}
 