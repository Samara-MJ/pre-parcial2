# PreParcial 2

Este proyecto corresponde al preparcial 2 de Programación Web. La aplicación permite consultar información de países usando un servicio externo (RestCountries) y guardar esa información en MongoDB como caché. También permite crear y consultar planes de viaje asociados a un país.

---

## 1. Cómo ejecutar el proyecto

### 1.1 Instalación

Después de clonar el repositorio, instalar las dependencias con:

```
npm install
```

### 1.2 Base de datos (MongoDB con Docker)

El proyecto incluye un archivo `docker-compose.yml` que levanta una instancia de MongoDB ya configurada. Para iniciarla:

```
docker compose up -d
```

Esta instancia utiliza:

* Usuario: root
* Contraseña: secret
* Base de datos: travel_planner
* Puerto: 27017

La API se conecta directamente usando esta URL que ya está en `app.module.ts`:

```
mongodb://root:secret@localhost:27017/travel_planner?authSource=admin
```

### 1.3 Ejecutar la API

Para ejecutar Nest en modo desarrollo:

```
npm run start:dev
```

La API quedará disponible en:

```
http://localhost:3000/api
```

### 1.4 Poblar datos iniciales (opcional)

El archivo `seed.js` agrega países y planes de viaje de ejemplo sin borrar los datos existentes. Para ejecutarlo:

```
node seed.js
```

---

## 2. Descripción de la API

El proyecto está organizado en dos módulos principales:

### 2.1 CountriesModule

Encargado de consultar, almacenar y devolver información de países.
Su funcionalidad principal consiste en:

* Revisar si un país ya está guardado en MongoDB.
* Si no existe, consultar la API externa RestCountries.
* Guardar el resultado en MongoDB para reutilizarlo como caché.
* Devolver la información al cliente.

### 2.2 TravelPlansModule

Permite crear y consultar planes de viaje.
Funciones principales:

* Crear un plan de viaje con título, fechas, notas y el país asociado.
* Listar todos los planes existentes.
* Consultar un plan específico por su id.

---

## 3. Endpoints implementados

### 3.1 Countries

#### GET /api/countries

Devuelve todos los países guardados en la base de datos.

#### GET /api/countries/:code

Consulta un país por su código alfa 3 (ejemplo: COL, USA).

Comportamiento:

* Si el país no está en MongoDB, se consulta en RestCountries y se guarda.
* Si ya está guardado, se devuelve desde la base de datos.

---

### 3.2 Travel Plans

#### GET /api/travel-plans

Devuelve todos los planes de viaje.

#### GET /api/travel-plans/:id

Devuelve un plan de viaje específico.

#### POST /api/travel-plans

Crea un plan de viaje.
Ejemplo de cuerpo:

```
{
  "countryCode": "COL",
  "title": "Viaje de ejemplo",
  "startDate": "2025-12-20",
  "endDate": "2025-12-30",
  "notes": "Notas opcionales"
}
```

---

## 4. Provider externo: RestCountries

La API utiliza un provider llamado `RestCountriesProvider`, el cual se encarga de realizar las solicitudes a la API pública RestCountries.

El proceso funciona así:

1. El CountriesService recibe el código del país.
2. Busca el país en MongoDB.
3. Si no existe:

   * Llama a `https://restcountries.com/v3.1/alpha/{code}`.
   * Extrae los datos principales (nombre, región, capital, población, bandera).
   * Guarda el resultado en MongoDB.
4. Devuelve el país al cliente.

Esto permite reducir el número de consultas externas y optimizar el rendimiento gracias al caché.

---

## 5. Modelo de datos

### Country

Contiene la información básica de un país:

* code: string (alpha-3)
* name: string
* region: string
* subregion: string
* capital: string
* population: number
* flagUrl: string
* createdAt / updatedAt

### TravelPlan

Representa un plan de viaje creado por el usuario:

* countryCode: string (alpha-3)
* title: string
* startDate: Date
* endDate: Date
* notes: string (opcional)
* createdAt

---

## 6. Pruebas básicas sugeridas

### 6.1 Consultar un país no cacheado

Primera llamada:

```
GET http://localhost:3000/api/countries/ATG
```

Resultado esperado: la API debería consultar RestCountries y luego guardar el país.

### 6.2 Consultar un país ya cacheado

Segunda llamada:

```
GET http://localhost:3000/api/countries/ATG
```

Resultado esperado: ahora el país debería devolverse desde MongoDB.

### 6.3 Crear un plan de viaje

```
POST http://localhost:3000/api/travel-plans
```

Body:

```
{
  "countryCode": "COL",
  "title": "Plan de prueba",
  "startDate": "2025-12-20",
  "endDate": "2025-12-30",
  "notes": "Prueba de creación"
}
```

Resultado esperado: se crea un documento nuevo en MongoDB con un id único.

## 7. Extensión de la API

 Se amplio el modulo de Countres al agregar un nuevo endpoint de borrado el cual permite eliminar un pais almacenado en la cache local (MongoDB).Esta funcionalidad no existía en la versión original de la API, por lo que fue necesario modificar el CountriesModule para incluir el modelo de TravelPlans y permitir que el servicio de países verificara si existían planes asociados antes de permitir el borrado. También se añadió un método nuevo en el CountriesService encargado de validar la existencia del país, revisar posibles dependencias y ejecutar la eliminación cuando las condiciones lo permiten.

Tambien se implementó un mecanismo de autorización para proteger el nuevo endpoint. Entonces se creo un gurad que valida la presencia de un token en el header de la peticion. Solo se aplico al endpoint de borrado, evitando afectar,  afectar el resto de funcionalidades.

### 7.1 Funcionamiento del enpoint 

1. Funcionamiento del endpoint protegido

El endpoint DELETE /countries/:alpha3Code permite borrar un país almacenado en la caché local de MongoDB. Antes de ejecutar el borrado, la API realiza tres validaciones:

Verifica que el país exista en la colección countries.

Revisa si existen planes de viaje asociados a ese país en la colección travelplans. Si existen, el borrado se bloquea.

Requiere que la petición incluya el header x-api-key con un token válido.

Solo si todas las condiciones se cumplen, el país se elimina y la API responde con un mensaje de éxito.

2. Funcionamiento del guard de autorización

El guard es una clase que intercepta la petición antes de llegar al controlador. Su trabajo es revisar si la solicitud incluye el header x-api-key y si su valor coincide con el token configurado en el guard.

Si el header no existe o el token es incorrecto,entonces el guard interrumpe la petición y responde con 403 Forbidden.

Si el token es válido entonces, la petición continúa hacia el controlador.

Este guard se aplica únicamente al endpoint DELETE usando el decorador @UseGuards(ApiKeyGuard), lo que permite que el resto de la API continúe siendo pública.

### 7.2 Validaciones

A. Sin token → debe fallar

```
DELETE http://localhost:3000/api/countries/ITA
```

Respuesta esperada:
```
403 Forbidden – No autorizado. Proporcione x-api-key.
```

B. Con token correcto funciona

Header requerido:

```
x-api-key: PREPARCIAL2025
```

C. Intentar borrar país inexistente

Debe responder 404.

D. Intentar borrar país con planes asociados

Debe responder 400.
