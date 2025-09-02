# 🚆 Train Trip Scheduling & Ticketing Platform

> A full-stack project built with **.NET 9 (CQRS + Mediator + FluentValidation)**, **Next.js 15**, and **MySQL**, demonstrating clean architecture, domain events, and modern software shipping with Docker Compose.

---

## ✨ Features

- ✅ User can **search for trips** between stations.
- ✅ Trips can be **scheduled, delayed, or updated**.
- ✅ **Tickets** are linked to trips and updated on trip delay events (Domain Events).
- ✅ **Validation rules** (e.g., departure before arrival, trips not in the past).
- ✅ **CQRS pattern** with MediatR for request/response separation.
- ✅ **FluentValidation** for robust input validation.
- ✅ **JWT Authentication** with expiration validation, and injection in cookies.
- ✅ **Dockerized deployment** for MySQL, .NET backend, and Next.js frontend.

---

## 📐 Architecture

The solution follows a **Clean Architecture + CQRS** approach:

# Project Structure

## 📦 Back-end

- **Application** → Commands, Queries, Validators, Handlers
  - 📂 Common → Pipeline behaviors (Validation)
  - 📂 Commands
  - 📂 Handlers
  - 📂 Queries
  - 📂 Interfaces
- **Domain** → Entities (Trip, Ticket, Station...etc) + Domain Events + Exceptions
- **Infrastructure** → EF Core DbContext, Repositories, Services
- **API** → Controllers, Middleware

## 📦 Front-end (Next.js 15)

## 📦 Back-end unit tests (XUnit/FluentAssertions and Moq)

---

## 🧩 Business Requirements

1. **Trip Scheduling**

   - A trip has departure & arrival stations, departure date, and tickets.
   - Stations must differ, and departure must be in the future.

2. **Trip Delay**

   - When a trip is delayed, a **`TripDelayedEvent`** is raised.
   - All related tickets are updated with the new departure time.

3. **Validation Examples**

   - Same station for departure & arrival ➝ ❌ Invalid
   - Past departure date ➝ ❌ Invalid
   - Missing fields ➝ ❌ Validation error (400).

4. **Service Discovery / Decoupling**
   - API is exposed via **MediatR** handlers.
   - Frontend consumes API through fetch with credentials.

---

➡️ Run the project:
`docker-compose up`

# Notes

1. Database is seeded for the authentification part,and the password is **12345** for the built-in users
2. Some technical and business requirements were simplified for the sake of the assessment, for example:

- The primary key of most tables is used alone, the common practice is to generate UUID that are hard to guess in order to hide sensitive data.
- Trips only consist of 2 stations : the departure and the arrival.
- Not all attributes influence the business logic, for ex the train capacity does not enforce a limit on tickets.
- Unit tests were divided by layers, and for instance aim to test Trips business logic.
