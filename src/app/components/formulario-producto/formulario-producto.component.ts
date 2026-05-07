import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="formulario">
      <h2>{{ producto.id ? 'Editar Producto' : 'Nuevo Producto' }}</h2>

      <div class="grupo-formulario">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          [(ngModel)]="producto.nombre"
          name="nombre"
          required
          placeholder="Ingrese el nombre del producto"
        />
      </div>

      <div class="grupo-formulario">
        <label for="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          [(ngModel)]="producto.descripcion"
          name="descripcion"
          required
          placeholder="Ingrese la descripción del producto"
          rows="3"
        ></textarea>
      </div>

      <div class="fila">
        <div class="grupo-formulario">
          <label for="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            [(ngModel)]="producto.precio"
            name="precio"
            required
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div class="grupo-formulario">
          <label for="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            [(ngModel)]="producto.cantidad"
            name="cantidad"
            required
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div class="grupo-formulario">
        <label for="estado">
          <input
            type="checkbox"
            id="estado"
            [(ngModel)]="producto.estado"
            name="estado"
          />
          Activo
        </label>
      </div>

      <div class="botones">
        <button type="submit" class="btn-guardar" [disabled]="!esValido()">Guardar</button>
        <button type="button" class="btn-cancelar" (click)="onCancelar()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .formulario {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #333;
      margin-top: 0;
      margin-bottom: 20px;
    }

    .grupo-formulario {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 5px;
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }

    input[type="text"],
    input[type="number"],
    textarea {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    textarea:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
    }

    input[type="checkbox"] {
      margin-right: 8px;
      cursor: pointer;
    }

    .fila {
      display: flex;
      gap: 20px;
    }

    .fila .grupo-formulario {
      flex: 1;
    }

    .botones {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn-guardar,
    .btn-cancelar {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .btn-guardar {
      background-color: #4CAF50;
      color: white;
    }

    .btn-guardar:hover:not(:disabled) {
      background-color: #45a049;
    }

    .btn-guardar:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .btn-cancelar {
      background-color: #999;
      color: white;
    }

    .btn-cancelar:hover {
      background-color: #777;
    }

    @media (max-width: 600px) {
      .fila {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class FormularioProductoComponent {
  @Input() set producto(value: Producto | null) {
    if (value) {
      this.productoLocal.set({ ...value });
    } else {
      this.productoLocal.set({
        nombre: '',
        descripcion: '',
        precio: 0,
        cantidad: 0,
        estado: true
      });
    }
  }

  @Output() guardar = new EventEmitter<Producto>();
  @Output() cancelar = new EventEmitter<void>();

  productoLocal = signal<Producto>({
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    estado: true
  });

  get producto(): Producto {
    return this.productoLocal();
  }

  esValido(): boolean {
    return !!(this.producto.nombre.trim() &&
      this.producto.descripcion.trim() &&
      this.producto.precio >= 0 &&
      this.producto.cantidad >= 0);
  }

  onSubmit() {
    if (this.esValido()) {
      this.guardar.emit(this.producto);
    }
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
