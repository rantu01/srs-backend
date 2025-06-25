Here’s a clean and professional `README.md` file tailored for your **[SRS Backend](https://github.com/rantu01/srs-backend)** repository — the backend for your **Service Review System** project.

---

```markdown
# 💬 Service Review System - Backend

This is the **backend** for the [Service Review System (SRS)](https://github.com/rantu01/SRS), a full-stack web application where users can add services, write reviews, and explore feedback from others. This backend is built using **Node.js**, **Express.js**, and **MongoDB**, and uses **JWT with cookies** for secure authentication.

> 🔗 **Frontend Repository:** [SRS Frontend](https://github.com/rantu01/SRS)

---

## ⚙️ Features

- 🔐 JWT authentication with secure HTTP-only cookies
- ➕ Add new services with details (image, title, description, etc.)
- 💬 Post, update, and delete service reviews
- 🧑 Routes protected by user authentication middleware
- 📅 Auto timestamp for services and reviews
- 📁 Organized route and controller structure
- 🌐 CORS-enabled API to connect with frontend

---

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [CORS](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## 📁 Folder Structure

```

srs-backend/
├── controllers/
│   ├── authController.js
│   ├── serviceController.js
│   └── reviewController.js
├── middlewares/
│   └── verifyJWT.js
├── models/
│   ├── Service.js
│   ├── Review\.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   └── reviewRoutes.js
├── .env
├── index.js
├── package.json
└── README.md

````

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** and **npm**
- **MongoDB Atlas** or local MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rantu01/srs-backend.git
   cd srs-backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server**

   ```bash
   npm start
   ```

API will be running on `http://localhost:5000`

---

## 🔐 Authentication

* Users login/register and receive a JWT in an **HTTP-only cookie**
* Use `verifyJWT` middleware to protect routes
* Example request headers:

  ```
  Cookie: token=your_jwt_token
  ```

---

## 🔄 API Endpoints

### ✅ Auth Routes

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| POST   | `/api/register` | Register a new user      |
| POST   | `/api/login`    | Login and set JWT cookie |
| POST   | `/api/logout`   | Clear cookie and logout  |
| GET    | `/api/me`       | Get current user         |

### 📦 Service Routes

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/services`     | Get all services                |
| GET    | `/api/services/:id` | Get single service              |
| POST   | `/api/services`     | Add new service (auth required) |

### 💬 Review Routes

| Method | Endpoint           | Description                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/reviews`     | Get all reviews                 |
| GET    | `/api/reviews/:id` | Get reviews for a service       |
| POST   | `/api/reviews`     | Add a review (auth required)    |
| PATCH  | `/api/reviews/:id` | Update a review (auth required) |
| DELETE | `/api/reviews/:id` | Delete a review (auth required) |

---

## 🙋‍♂️ Author

**Rantu Mondal**
🔗 [LinkedIn](https://www.linkedin.com/in/rantubytes)
📧 [rantumondal06@gmail.com](mailto:rantumondal06@gmail.com)

---

## 📄 License

Licensed under the [MIT License](LICENSE)

---

## 🧑‍💻 Contributing

Contributions are welcome! Please fork this repo and submit a pull request with your changes.

---

## 🔗 Related

* Frontend: [SRS](https://github.com/rantu01/SRS)

```

---

Let me know if you'd like to include example request payloads, Swagger docs, or a Postman collection link!
```
