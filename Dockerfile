# Build-stage (prepara código y dependencias) 
FROM node:20-alpine AS builder 

WORKDIR /usr/src/app 

# Copiar package.json y lockfile 
COPY package.json package-lock.json* ./ 

# Instalar todas las dependencias (incluye devDeps necesarios para dev) 
RUN npm install 

# Copiar el resto del código fuente (sin compilar) 
COPY . . 

# Run-stage (hereda todo desde builder y arranca en modo desarrollo) 
FROM node:20-alpine 

WORKDIR /usr/src/app

ENV NODE_ENV=development 

# Copiar todo el workspace preparado en el builder (incluye node_modules) 
COPY --from=builder /usr/src/app /usr/src/app 

# Exponer puerto
EXPOSE 3000 

# Ejecutar en modo desarrollo. 
CMD ["node", "src/index.js"]