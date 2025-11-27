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
- Docker & Docker Compose
- Joi para validación de datos
- JWT para autenticación
- Apidoc para documentación de la API

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

### 📝 Scripts npm disponibles

> ⚠️ Los scripts que se muestran a continuación no deben ejecutarse manualmente, ya que la aplicación los ejecuta automáticamente en el momento adecuado. Se incluyen en esta documentación únicamente con fines informativos.

- `npm run start:dev` → Levanta el servidor en modo desarrollo.
- `npm run apidoc` → Genera la documentación de la API en la carpeta `apidoc`.
- `npm run apidoc:serve` → Sirve la documentación generada en `http://localhost:8080`.

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

### Conexión a pgAdmin

La base de datos PostgreSQL y la herramienta de administración pgAdmin también están dockerizadas, por lo que no es necesario instalarlas localmente.

Para acceder a pgAdmin y ver la base de datos:

1. Abre tu navegador y visita la siguiente URL:

   ```bash
   http://localhost:5050
   ```

2. Inicia sesión utilizando las credenciales definidas en tu archivo `.env`:

   ```bash
   PGADMIN_DEFAULT_EMAIL
   PGADMIN_DEFAULT_PASSWORD
   ```

3. Una vez dentro del panel de pgAdmin:
   - Haz clic derecho en la sección **Servers** (barra lateral izquierda).
   - Selecciona **Register** > **Server**.

4. En el formulario de configuración:

   🧾 **Pestaña General**
   - **Name**: Ingresa un nombre descriptivo, por ejemplo: `StockFlow`.

   🔌 **Pestaña Connection**
   - **Host name/address**: Definido en la variable `DATABASE_HOST` del archivo `.env`
   - **Port**: Definido en la variable `DATABASE_PORT` del archivo `.env`
   - **Username**: Definido en la variable `DATABASE_USER` del archivo `.env`
   - **Password**: Definido en la variable `DATABASE_PASSWORD` del archivo `.env`
   - Opcional: Marca la casilla *Save password* para no tener que ingresarla cada vez.
  
5. Haz clic en **Save** para guardar la configuración y conectarte.

   Una vez creada la conexión, puedes explorar las bases de datos, ver las tablas, ejecutar consultas y gestionar los datos desde la interfaz de pgAdmin.

## 👨‍💻 Autor

Desarrollado por **Jeison Rojas Mora** - *Fullstack Developer*

- [https://github.com/jeisonrojasm](https://github.com/jeisonrojasm)
- [https://www.linkedin.com/in/jeison-rojas-mora/](https://www.linkedin.com/in/jeison-rojas-mora/)
