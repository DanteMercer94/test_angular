import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FormularioProductoComponent } from '../formulario-producto/formulario-producto.component';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, FormularioProductoComponent],
  template: `
    <div class="container">
      <h1>Gestión de Productos</h1>

      <button (click)="toggleFormulario()" class="btn-agregar">
        {{ mostrarFormulario() ? 'Cancelar' : 'Agregar Producto' }}
      </button>

      @if (mostrarFormulario()) {
        <app-formulario-producto
          [producto]="productoEnEdicion()"
          (guardar)="guardarProducto($event)"
          (cancelar)="cancelarEdicion()">
        </app-formulario-producto>
      }

      @if (productos().length > 0) {
        <table class="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (producto of productos(); track producto.id) {
              <tr>
                <td>{{ producto.id }}</td>
                <td>{{ producto.nombre }}</td>
                <td>{{ producto.descripcion }}</td>
                <td>{{ "$" + producto.precio }}</td>
                <td>{{ producto.cantidad }}</td>
                <td>{{ producto.estado ? 'Activo' : 'Inactivo' }}</td>
                <td>
                  <button (click)="editarProducto(producto)" class="btn-editar">Editar</button>
                  <button (click)="eliminarProducto(producto.id!)" class="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="sin-datos">No hay productos disponibles</p>
      }

      @if (mensaje()) {
        <div [class]="'alerta ' + tipoMensaje()">
          {{ mensaje() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
    }

    .btn-agregar {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .btn-agregar:hover {
      background-color: #45a049;
    }

    .tabla {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tabla th, .tabla td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .tabla th {
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
    }

    .tabla tr:hover {
      background-color: #f5f5f5;
    }

    .btn-editar, .btn-eliminar {
      padding: 6px 12px;
      margin: 0 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-editar {
      background-color: #2196F3;
      color: white;
    }

    .btn-editar:hover {
      background-color: #0b7dda;
    }

    .btn-eliminar {
      background-color: #f44336;
      color: white;
    }

    .btn-eliminar:hover {
      background-color: #da190b;
    }

    .sin-datos {
      text-align: center;
      color: #666;
      padding: 40px;
      font-size: 16px;
    }

    .alerta {
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-weight: bold;
    }

    .alerta.exito {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alerta.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class ListaProductosComponent implements OnInit {
  private readonly productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);
  mostrarFormulario = signal(false);
  productoEnEdicion = signal<Producto | null>(null);
  mensaje = signal('');
  tipoMensaje = signal('');

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (datos) => {
        this.productos.set(datos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mostrarMensaje('Error al cargar los productos', 'error');
      }
    });
  }

  toggleFormulario() {
    if (this.mostrarFormulario()) {
      this.cancelarEdicion();
    } else {
      this.mostrarFormulario.set(true);
      this.productoEnEdicion.set(null);
    }
  }

  editarProducto(producto: Producto) {
    this.productoEnEdicion.set({ ...producto });
    this.mostrarFormulario.set(true);
  }

  guardarProducto(producto: Producto) {
    if (producto.id) {
      this.productoService.actualizarProducto(producto.id, producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto actualizado correctamente', 'exito');
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.mostrarMensaje('Error al actualizar el producto', 'error');
        }
      });
    } else {
      this.productoService.crearProducto(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto creado correctamente', 'exito');
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.mostrarMensaje('Error al crear el producto', 'error');
        }
      });
    }
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto eliminado correctamente', 'exito');
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.mostrarMensaje('Error al eliminar el producto', 'error');
        }
      });
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario.set(false);
    this.productoEnEdicion.set(null);
  }

  private mostrarMensaje(texto: string, tipo: string) {
    this.mensaje.set(texto);
    this.tipoMensaje.set(tipo);
    setTimeout(() => {
      this.mensaje.set('');
    }, 3000);
  }
}
