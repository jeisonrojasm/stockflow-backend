# StockFlow Backend

**StockFlow** es una API RESTful desarrollada con **Node.js**, **Sequelize** y **PostgreSQL**, diseñada para gestionar un inventario de productos y las compras de los clientes. La aplicación está completamente **dockerizada**, permitiendo un despliegue rápido y reproducible tanto en desarrollo como en producción.

---

## Características principales

### Gestión de usuarios

- Registro y login de usuarios.
- Los usuarios pueden tener roles **Administrador** o **Cliente**.
- Autenticación mediante **JWT**.

### Funcionalidades de Administrador

- **CRUD de productos** del inventario:
  - Número de lote
  - Nombre del producto
  - Precio
  - Cantidad disponible
  - Fecha de ingreso
- Visualización de **todas las compras realizadas** por los clientes:
  - Fecha de compra
  - Cliente que realizó la compra
  - Productos comprados, cantidad y precio total

### Funcionalidades de Cliente

- Módulo de compras:
  - Selección de 1 o varios productos con cantidades específicas
  - Actualización automática del inventario
- Visualización de facturas detalladas de cada compra
- Historial completo de productos comprados

## 🛠️ Construido con

- Node.js
- Sequelize
- PostgreSQL
- Docker

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- ✅ [*Git*](https://git-scm.com/)
- ✅ [*Docker* y Docker Compose](https://www.docker.com/get-started) instalados y en ejecución

## 📥 Obtener el proyecto

Clona el repositorio:

```bash
#Clona el repositorio
git clone https://github.com/jeisonrojasm/stockflow-backend.git
cd stockflow-backend
```

## 🚀 Ejecutar

### 1. **Archivo `.env` requerido**

Normalmente, el archivo `.env` **no debería incluirse** en un repositorio público, ya que puede contener valores de configuración sensibles.  
Sin embargo, con fines de demostración y evaluación —y dado que este no es un proyecto de producción— el archivo `.env` está incluido en el repositorio para que cualquiera pueda ejecutar el proyecto sin configuraciones adicionales.

El archivo `.env` ya se encuentra ubicado en la raíz del proyecto.

### 2. Levantar el entorno de desarrollo con Docker

Basta con ejecutar el siguiente comando desde la raíz del proyecto para construir la imagen y levantar el contenedor del backend:

```bash
docker-compose up --build
```

Una vez finalizado el proceso, el backend quedará disponible en:

```arduino
http://localhost:3000
```

## 📚 Documentación con Apidoc

Esta API cuenta con documentación interactiva generada automáticamente con Apidoc gracias a la integración con `apidoc`.

### ¿Qué puedes hacer desde Apidoc?

- Ver todos los endpoints disponibles (GET, POST, PATCH, etc.)
- Ver ejemplos de solicitudes y respuestas.

### Acceso a la documentación

Una vez el backend esté corriendo, puedes acceder a la documentación por medio de:

```bash
http://localhost:8080
```

## 👨‍💻 Autor

Desarrollado por **Jeison Rojas Mora** - *Fullstack Developer*

- [https://github.com/jeisonrojasm](https://github.com/jeisonrojasm)
- [https://www.linkedin.com/in/jeison-rojas-mora/](https://www.linkedin.com/in/jeison-rojas-mora/)
