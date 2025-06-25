🔥 Service Review System — Backend API
RESTful API powering the Service Review System (SRS) with secure authentication, CRUD operations, and MongoDB integration.

🔗 Live Demo: https://service-review-system-a0858.web.app/
📂 Frontend Repo: srs-frontend https://github.com/rantu01/SRS

🚀 Features
🔐 Secure Authentication

Firebase (Google Sign-In) + JWT token validation.

Protected routes using middleware.

📡 RESTful API Endpoints

Full CRUD for services and reviews.

Pagination, filtering, and sorting.

⚡ Optimized Performance

Async/await architecture.

Error handling and logging.

🔗 Frontend Integration

CORS configured for seamless React/Vite connectivity.

⚙️ Tech Stack
Category	Technologies
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
Authentication	Firebase Admin SDK, JWT
API Testing	Postman/Thunder Client
Deployment	Render/Vercel (or your hosting)
📡 API Endpoints
🔐 Authentication
Endpoint	Method	Description
/api/auth/login	POST	Google Firebase login → JWT.
🛎️ Services
Endpoint	Method	Description
/api/services	GET	Get all services (paginated).
/api/services/:id	GET	Get single service by ID.
/api/services/my-services	GET	Get logged-in user’s services.
/api/services	POST	Create a new service.
(Add more endpoints as needed.)

🛠️ Installation
Clone the repo:

bash
git clone https://github.com/rantu01/srs-backend.git
cd srs-backend
Install dependencies:

bash
npm install
Set up environment variables:
Create a .env file:

env
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
JWT_SECRET=your_jwt_secret_key
PORT=5000
Run the server:

bash
npm start
🌐 Deployment
Option 1: Render
Create a new Web Service on Render.

Link your GitHub repo.

Add environment variables in the dashboard.

Option 2: Vercel
Configure vercel.json for Node.js:

json
{
  "version": 2,
  "builds": [{ "src": "index.js", "use": "@vercel/node" }]
}
📜 API Documentation
For detailed request/response examples:

Postman Collection: Download Link (if available)

Sample Request:

bash
curl -X GET https://api.example.com/api/services
🤝 Contributing
Fork the repo.

Create a branch:

bash
git checkout -b feature/your-feature
Commit changes:

bash
git commit -m "Add your feature"
Push and open a Pull Request.

📄 License
MIT © Rantu Mondal