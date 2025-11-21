
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


# Travel Planner API — NestJS + MongoDB

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
GET http://localhost:3000/api/countries/COL
```

Resultado esperado: la API debería consultar RestCountries y luego guardar el país.

### 6.2 Consultar un país ya cacheado

Segunda llamada:

```
GET http://localhost:3000/api/countries/COL
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


