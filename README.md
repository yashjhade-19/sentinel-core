# SentinelCore Enterprise Security Operations Platform

SentinelCore is a cloud-based security monitoring and infrastructure management platform designed to monitor enterprise assets, evaluate infrastructure health, detect critical conditions, manage security alerts, and notify administrators.

The platform provides a secure Spring Boot backend, JWT-based authentication, role-based access control, infrastructure monitoring, alert management, search and filtering, email/SMS notifications, and a React-based monitoring dashboard.

---

## Overview

SentinelCore provides a centralized platform for monitoring infrastructure assets such as servers, network devices, and other enterprise resources.

The system monitors infrastructure metrics including:

- CPU usage
- Memory usage
- Disk usage
- Network usage
- Asset status
- Risk level

When configured thresholds are exceeded, SentinelCore automatically generates alerts and can notify administrators through email and SMS.

---

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Short-lived access tokens
- Long-lived refresh tokens
- Automatic access-token refresh
- BCrypt password hashing
- Role-based access control
- ADMIN and VIEWER roles
- Protected REST endpoints

### Asset Management

- Create infrastructure assets
- Update existing assets
- View asset inventory
- Monitor CPU, memory, disk, and network usage
- Track asset status
- Calculate asset risk levels
- Search assets
- Filter assets by status
- Filter assets by risk

### Infrastructure Health Monitoring

The backend periodically evaluates registered assets.

Current monitoring thresholds include:

| Metric | Threshold | Result |
|--------|-----------|--------|
| CPU | ≥ 90% | Critical |
| Disk | ≥ 90% | Critical |
| Memory | ≥ 80% | Warning |

Risk levels are calculated based on infrastructure utilization.

---

## Alert Management

SentinelCore supports the following alert severities:

- LOW
- MEDIUM
- HIGH
- CRITICAL

Alerts contain:

- Asset information
- Severity
- Message
- Status
- Creation time
- Resolution time

The monitoring service prevents repeated creation of the same OPEN alert for an asset and severity.

---

## Notifications

High and critical alerts can trigger automated notifications.

### Email

Email notifications are implemented using:

- Spring Boot Mail
- Gmail SMTP
- JavaMailSender

### SMS

SMS notifications are implemented using:

- Twilio
- Twilio Java SDK

Email and SMS notifications are handled independently so that a failure in one notification channel does not prevent the other channel from being processed.

---

## Technology Stack

### Backend

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- Spring Security
- Spring Boot Mail
- JWT
- Lombok
- Maven

### Database

- PostgreSQL

### Frontend

- React
- JavaScript
- Vite
- Axios
- React Router

### Notifications

- Gmail SMTP
- Twilio SMS

### Development Tools

- IntelliJ IDEA
- Visual Studio Code
- Git
- GitHub
- GitLab
- Postman
- PostgreSQL

---

## Project Structure

```text
sentinel-core/
│
├── sentinel-core-backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/infosys/sentinelcorebackend/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── exception/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       ├── service/
│   │   │   │       └── util/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── sentinel-core-frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
