# Arquitectura del proyecto

## Visión general

Este proyecto es una aplicación CRUD de productos dividida en dos capas principales:

- **Frontend:** aplicación Angular que ejecuta la interfaz de usuario.
- **Backend:** API REST construida con Spring Boot / Spring Data JPA.

El frontend consume el backend usando llamadas HTTP a la ruta base `http://localhost:8080/api/productos`.

---

## Frontend (Angular)

### Estructura principal

Carpeta relevante:

- `src/app/`
  - `app.ts`: componente raíz de Angular.
  - `app.html`: contiene `<router-outlet>` para enrutar la vista.
  - `app.config.ts`: configura el enrutador e inyecta el cliente HTTP.
  - `app.routes.ts`: define las rutas de la aplicación.
  - `components/`: contiene componentes de UI.
  - `models/`: define interfaces de datos.
  - `services/`: encapsula llamadas HTTP al backend.

### Cómo arranca Angular

- `src/main.ts` ejecuta `bootstrapApplication(App, appConfig)`.
- `appConfig` incluye:
  - `provideRouter(routes)` para las rutas.
  - `provideHttpClient()` para permitir llamadas HTTP.
  - `provideClientHydration(withEventReplay())` para SSR y rehidratación de eventos.

### Enrutamiento

`src/app/app.routes.ts` define dos rutas:

- `/` → `ListaProductosComponent`
- `/productos` → `ListaProductosComponent`

Por tanto, la aplicación muestra una única vista donde se gestionan los productos.

### Componentes clave

#### `ListaProductosComponent`

- Es el componente principal de la UI.
- Usa `ProductoService` para obtener, crear, actualizar y eliminar productos.
- Maneja el estado local con señales (`signal`) de Angular:
  - `productos` - lista de productos.
  - `mostrarFormulario` - controla si se ve el formulario.
  - `productoEnEdicion` - producto que se está editando.
  - `mensaje`, `tipoMensaje` - alertas de éxito/error.
- Carga los datos desde el backend en `ngOnInit()` llamando a `cargarProductos()`.
- Muestra una tabla con los productos y botones de editar/eliminar.
- Muestra el componente `app-formulario-producto` cuando el usuario quiere crear o editar.

#### `FormularioProductoComponent`

- Componente independiente y reutilizable.
- Recibe un producto por `@Input()` y emite eventos con `@Output()`:
  - `guardar` cuando el formulario es válido y se envía.
  - `cancelar` cuando el usuario cancela.
- Valida campos básicos: nombre, descripción, precio y cantidad.
- Permite editar los datos y enviarlos al componente padre.

### Modelo de datos

`src/app/models/producto.ts` define la interfaz TypeScript:

- `id?: number`
- `nombre: string`
- `descripcion: string`
- `precio: number`
- `cantidad: number`
- `estado: boolean`

Esto coincide con el modelo de backend.

### Servicio HTTP

`src/app/services/producto.service.ts` encapsula las llamadas a la API:

- `obtenerProductos()` → `GET /api/productos`
- `obtenerProductoPorId(id)` → `GET /api/productos/{id}`
- `crearProducto(producto)` → `POST /api/productos`
- `actualizarProducto(id, producto)` → `PUT /api/productos/{id}`
- `eliminarProducto(id)` → `DELETE /api/productos/{id}`

El servicio usa `HttpClient` y la URL base del backend está definida como:

- `http://localhost:8080/api/productos`

---

## Backend (Spring Boot)

### Estructura principal

Carpeta relevante:

- `backend/src/main/java/com/crud/producto/`
  - `ProductoCrudApplication.java`: clase principal de Spring Boot.
  - `controller/ProductoController.java`: expone los endpoints REST.
  - `service/ProductoService.java`: lógica de negocio y acceso a datos.
  - `repository/ProductoRepository.java`: interfaz JPA para la base de datos.
  - `model/Producto.java`: entidad JPA que mapea la tabla `productos`.

### Dependencias y build

`backend/pom.xml` usa:

- `spring-boot-starter-web`: crea el servidor REST.
- `spring-boot-starter-data-jpa`: manejo de persistencia con JPA.
- `mysql-connector-j`: conector para MySQL.
- `lombok`: reduce boilerplate en la entidad.

Se usa Java 21 y Spring Boot 3.2.

### Clase principal y CORS

`ProductoCrudApplication.java` arranca la app con `SpringApplication.run(...)`.

También define un bean `WebMvcConfigurer` para habilitar CORS en rutas `/api/**` desde:

- `http://localhost:4200`
- `http://localhost:5173`

Esto permite que el frontend Angular haga llamadas al backend desde `localhost:4200`.

### Modelo de datos / Entidad

`Producto.java` define la entidad JPA con columnas:

- `id` (auto-generado)
- `nombre`
- `descripcion`
- `precio`
- `cantidad`
- `estado`

La tabla se llama `productos`.

### Repositorio

`ProductoRepository` extiende `JpaRepository<Producto, Long>`.

Esto proporciona métodos listos para usar:

- `findAll()`
- `findById(id)`
- `save(entity)`
- `deleteById(id)`
- `existsById(id)`

### Servicio de negocio

`ProductoService` actúa como capa intermedia:

- `obtenerProductos()` → trae todos los productos.
- `obtenerProductoPorId(id)` → busca por id.
- `crearProducto(producto)` → guarda nuevo producto.
- `actualizarProducto(id, producto)` → actualiza solo si existe.
- `eliminarProducto(id)` → borra por id.

### Controlador REST

`ProductoController` expone la API REST en `/api/productos`.

Endpoints:

- `GET /api/productos` → lista todos los productos.
- `GET /api/productos/{id}` → obtiene un producto por id.
- `POST /api/productos` → crea un nuevo producto.
- `PUT /api/productos/{id}` → actualiza un producto.
- `DELETE /api/productos/{id}` → elimina un producto.

El controlador usa `@CrossOrigin(...)` para permitir peticiones desde el frontend.

---

## Base de datos

Aunque no hay un archivo `application.properties` en esta inspección, el proyecto incluye un documento de configuración de MySQL (`CONFIGURACION_MYSQL.md`) y el esquema SQL en `backend/database/schema.sql`.

Esto indica que la aplicación espera una base de datos MySQL local.

### Conexión típica

- Host: `localhost`
- Puerto: `3306`
- Base de datos: probablemente `crud_productos` o similar según el script SQL.
- Usuario: `root` o un usuario configurado.
- Contraseña: según la configuración local.

El backend se conecta a MySQL usando Spring Data JPA y guarda los productos en la tabla `productos`.

---

## Flujo de datos y conexiones

1. El usuario abre la app Angular en el navegador (`http://localhost:4200`).
2. Angular carga `App` y luego `ListaProductosComponent`.
3. `ListaProductosComponent` llama a `ProductoService.obtenerProductos()`.
4. `ProductoService` hace `GET http://localhost:8080/api/productos`.
5. Spring Boot recibe la petición en `ProductoController.obtenerProductos()`.
6. El controlador delega a `ProductoService.obtenerProductos()` del backend.
7. El servicio del backend consulta `ProductoRepository.findAll()`, que usa JPA para leer de MySQL.
8. Los datos de productos regresan al frontend y se muestran en la tabla.

Para crear o actualizar:

1. El usuario abre el formulario.
2. Envía los datos con `guardarProducto()` en `ListaProductosComponent`.
3. Angular llama a `crearProducto()` o `actualizarProducto()` del servicio.
4. El backend recibe `POST /api/productos` o `PUT /api/productos/{id}`.
5. Spring Boot guarda el producto en MySQL y responde con el objeto creado/actualizado.
6. El frontend refresca la lista.

Para eliminar:

1. El usuario hace clic en "Eliminar".
2. Angular llama a `DELETE /api/productos/{id}`.
3. Backend borra el registro en MySQL.
4. Frontend actualiza la tabla local.

---

## Cómo ejecutar el proyecto

### Backend

1. Iniciar MySQL.
2. Crear la base de datos y la tabla con `backend/database/schema.sql`.
3. Ejecutar el backend con Maven desde `backend/`:

```bash
mvn spring-boot:run
```

Esto arranca el backend en `http://localhost:8080`.

### Frontend

1. Desde la raíz del proyecto (`e:\angular\test_angular`):

```bash
npm install
npm start
```

2. Abrir `http://localhost:4200`.

El frontend se conecta al backend en `http://localhost:8080/api/productos`.

---

## Resumen de responsabilidades

- Angular maneja la UI, estado local y llamadas HTTP.
- Spring Boot expone la API REST y controla la persistencia.
- MySQL almacena los productos.
- El modelo `Producto` es común a ambas capas.
- CORS permite la comunicación segura entre `localhost:4200` y `localhost:8080`.

---

## Observaciones importantes

- El frontend usa Angular v21 y señales (`signal`) para el estado.
- El backend usa Spring Boot 3.2 y JPA.
- No hay múltiples vistas; toda la gestión de productos ocurre en un solo componente.
- La URL base `http://localhost:8080/api/productos` es el puente entre frontend y backend.
