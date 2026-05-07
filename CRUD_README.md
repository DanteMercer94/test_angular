CRUD PRODUCTOS - ANGULAR + SPRING BOOT + MYSQL

ESTRUCTURA DEL PROYECTO:

FRONTEND (Angular):
- src/app/components/lista-productos/ - Componente principal que lista los productos
- src/app/components/formulario-producto/ - Componente de formulario para crear/editar
- src/app/services/producto.service.ts - Servicio para comunicarse con el backend
- src/app/models/producto.ts - Modelo/interfaz de Producto

BACKEND (Spring Boot):
- backend/src/main/java/com/crud/producto/controller/ - Controlador REST
- backend/src/main/java/com/crud/producto/service/ - Lógica de negocio
- backend/src/main/java/com/crud/producto/repository/ - Acceso a datos
- backend/src/main/java/com/crud/producto/model/ - Entidad JPA

BASE DE DATOS (MySQL):
- backend/database/schema.sql - Script para crear la base de datos y tablas

INSTALACION Y CONFIGURACION:

1. MYSQL:
   - Instalar MySQL Server
   - Abrir MySQL Workbench o terminal MySQL
   - Ejecutar el script: backend/database/schema.sql

2. BACKEND (Spring Boot):
   - Navegar a la carpeta backend
   - Ejecutar: mvn clean install
   - Ejecutar: mvn spring-boot:run
   - El servidor estará en http://localhost:8080

3. FRONTEND (Angular):
   - En la carpeta raíz del proyecto
   - Ejecutar: npm install
   - Ejecutar: ng serve
   - Abrir: http://localhost:4200

ENDPOINTS DEL API:

GET /api/productos - Obtener todos los productos
GET /api/productos/{id} - Obtener producto por ID
POST /api/productos - Crear nuevo producto
PUT /api/productos/{id} - Actualizar producto
DELETE /api/productos/{id} - Eliminar producto

CONFIGURAR ANGULAR:

Para usar los componentes creados, actualizar app.ts:

import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};

Y en app.routes.ts agregar:

export const routes: Routes = [
  {
    path: 'productos',
    component: ListaProductosComponent
  }
];

O simplemente usar el componente en app.html:
<app-lista-productos></app-lista-productos>

NOTAS:
- El CORS está configurado para aceptar requests de http://localhost:4200 y http://localhost:5173
- La contraseña de MySQL por defecto es vacía (root)
- La base de datos se llama: crud_productos
- El proyecto ya viene con datos de ejemplo
 