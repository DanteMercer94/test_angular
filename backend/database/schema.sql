CREATE DATABASE IF NOT EXISTS crud_productos;
USE crud_productos;

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_estado (estado)
);

INSERT INTO productos (nombre, descripcion, precio, cantidad, estado) VALUES
('Laptop Dell', 'Laptop Dell Inspiron 15, Intel i7, 16GB RAM, 512GB SSD', 999.99, 5, TRUE),
('Mouse Logitech', 'Mouse inalámbrico Logitech MX Master 3S', 99.99, 15, TRUE),
('Teclado Mecánico', 'Teclado mecánico RGB Corsair K95 Platinum', 199.99, 8, TRUE),
('Monitor LG 27', 'Monitor LG 27 pulgadas 4K UHD', 449.99, 3, TRUE),
('Auriculares Sony', 'Auriculares Sony WH-1000XM5 con cancelación de ruido', 349.99, 10, TRUE),
('Webcam Logitech', 'Webcam Logitech 4K Pro', 149.99, 12, TRUE),
('Micrófono USB', 'Micrófono USB Blue Yeti', 129.99, 7, FALSE),
('Hub USB-C', 'Hub USB-C 7 en 1 con HDMI y carga rápida', 79.99, 20, TRUE),
('Cable HDMI 2.1', 'Cable HDMI 2.1 2 metros 8K 60Hz', 29.99, 30, TRUE),
('Fuente de Poder', 'Fuente de poder 850W 80+ Gold modular', 189.99, 4, TRUE);
