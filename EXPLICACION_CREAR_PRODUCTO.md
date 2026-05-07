# Explicación de `crearProducto` y cómo inserta datos en la tabla

## Método en `ProductoService`

```java
public Producto crearProducto(Producto producto) {
    return productoRepository.save(producto);
}
```

### Qué hace este método

1. Recibe un objeto `Producto` con los datos que se deben guardar.
2. Llama a `productoRepository.save(producto)`.
3. Devuelve el mismo objeto `Producto`, ahora con su `id` generado si se creó correctamente.

---

## Qué es `productoRepository`

- `productoRepository` es una instancia de `ProductoRepository`.
- `ProductoRepository` extiende `JpaRepository<Producto, Long>`.
- `JpaRepository` es una interfaz de Spring Data JPA que ya incluye métodos para guardar, buscar, actualizar y eliminar entidades.

En el proyecto, `ProductoRepository` se define así:

```java
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
```

Spring crea automáticamente la implementación de `save(...)` durante el arranque de la aplicación.

---

## Qué hace `save(producto)` internamente

Cuando se llama a `productoRepository.save(producto)`, Spring Data JPA realiza lo siguiente:

1. Verifica si el objeto `producto` tiene un `id`.
   - Si el `id` es `null`, se trata como una nueva fila y se inserta en la tabla.
   - Si el `id` ya existe, se trata como una actualización de esa fila.
2. Convierte el objeto `Producto` en una entidad JPA.
3. Genera SQL `INSERT` o `UPDATE` según corresponda.
4. Envía esa orden al motor de base de datos MySQL.
5. Si se genera una nueva fila, JPA lee el `id` auto-generado y lo asigna de vuelta al objeto `producto`.

---

## Modelo de entidad `Producto`

La entidad JPA `Producto` define cómo se mapea la clase a la tabla SQL:

```java
@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Boolean estado;
}
```

- `@Entity` indica que esta clase se almacena en la base de datos.
- `@Table(name = "productos")` define el nombre de la tabla.
- `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)` indican que `id` es clave primaria y se genera automáticamente en MySQL.

---

## Flujo completo de inserción desde la petición HTTP

1. El frontend Angular envía una petición `POST` a:
   - `http://localhost:8080/api/productos`
2. El controlador Spring Boot recibe la petición en `ProductoController.crearProducto(...)`:

```java
@PostMapping
public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
    Producto productoCreado = productoService.crearProducto(producto);
    return ResponseEntity.status(HttpStatus.CREATED).body(productoCreado);
}
```

3. Spring transforma el cuerpo JSON de la petición en un objeto Java `Producto`.
4. El controlador llama a `productoService.crearProducto(producto)`.
5. El servicio llama a `productoRepository.save(producto)`.
6. JPA ejecuta el SQL `INSERT` en la tabla `productos`.
7. El backend responde al frontend con el objeto creado y el código HTTP `201 Created`.

---

## Ejemplo de datos enviados desde el frontend

El cuerpo JSON puede ser similar a:

```json
{
  "nombre": "Camiseta",
  "descripcion": "Camiseta deportiva",
  "precio": 19.99,
  "cantidad": 10,
  "estado": true
}
```

Después de `save`, el backend devolverá:

```json
{
  "id": 1,
  "nombre": "Camiseta",
  "descripcion": "Camiseta deportiva",
  "precio": 19.99,
  "cantidad": 10,
  "estado": true
}
```

---

## Conexión con la tabla MySQL

La tabla SQL se genera o debe existir para `productos`.

`save(...)` inserta directamente en esa tabla usando la configuración de JPA y la conexión a MySQL.

El documento `CONFIGURACION_MYSQL.md` y el `schema.sql` del proyecto contienen la configuración y la definición del esquema.

---

## Resumen

- `crearProducto` es la capa de servicio que escribe en la base de datos.
- `productoRepository.save(producto)` es la operación que persiste la entidad.
- Si `producto.id` es `null`, JPA hace un `INSERT`.
- El objeto resultante vuelve al frontend con su `id` generado.
- Todo esto ocurre dentro de la transacción de Spring Boot y MySQL.
