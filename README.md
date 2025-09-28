# Kindergarten School Backend

Backend for **Contact Us** and **Admission Form** pages using Node.js, Express, MongoDB, and ES6 modules.

## 🚀 Features
- Express server with ES6 `import/export`
- MongoDB models for contact and admission forms
- Environment variables using dotenv
- Auto-reload with Nodemon in development

## 📂 Project Structure
```
school-backend/
│── server.js
│── models/
│     ├── Contact.js
│     ├── Admission.js
│── .env
│── package.json
```

## ⚡ Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start in development (auto-restart with nodemon):
   ```bash
   npm run dev
   ```

3. Start in production:
   ```bash
   npm start
   ```

## 🔗 API Endpoints

- `POST /api/contact` → Save contact form
- `POST /api/admission` → Save admission form

Both forms will be stored in MongoDB (`contacts` and `admissions` collections).
