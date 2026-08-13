# SentinelCore Enterprise Security Operations Platform

A cloud-native enterprise platform for monitoring and managing servers, cloud resources, network devices, and IT infrastructure.

## Tech Stack

- Java 21
- Spring Boot 4
- Spring Data JPA
- Spring Security
- PostgreSQL
- Maven
- Lombok

## Project Structure

```
src
├── controller
├── service
├── repository
├── entity
├── dto
├── config
├── exception
```

## Features

- Asset Management REST APIs
- Layered Architecture
- DTO Mapping
- PostgreSQL Integration
- Spring Security Configuration
- Global Exception Handling

## Implemented APIs

### Create Asset

```
POST /api/assets
```

### Get All Assets

```
GET /api/assets
```

### Get Asset By ID

```
GET /api/assets/{id}
```

## Database

PostgreSQL is used for storing asset information.

## Testing

The APIs were tested successfully using Postman.

## Upcoming Features

- React Dashboard
- Axios Integration
- Dashboard Summary API
- Charts using Recharts
- Redis Cache
- Kafka
- Keycloak Authentication

## Author

**Yash Jhade**
