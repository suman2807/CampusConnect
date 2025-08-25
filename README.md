



# Campus Connect 🎓

<p align="right">
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status"/>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"/>
  <img src="https://img.shields.io/badge/made%20with-React-blue" alt="React"/>
</p>


> **Modern campus life, connected.**

---

## 📚 About

Campus Connect is a unified platform designed to simplify student life by connecting peers, organizing activities, and streamlining campus collaboration. Whether you want to find a roommate, join a sports team, or manage lost & found, Campus Connect brings it all together.
---
![img_alt](https://github.com/suman2807/CampusConnect/blob/main/Screenshot%202025-08-26%20023919.png?raw=true)

## 🗂️ Project Structure

```
CampusConnect/
├── client/   # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/   # Node.js backend
│   ├── models/
│   ├── routes/
│   └── ...
└── README.md
```
---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory:

```
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
# Optional: Hugging Face API Key for profanity detection
HF_API_KEY=your_hugging_face_api_key
```
---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## ✨ Features

- Organize sports, trips, and events
- Find teammates and roommates
- Real-time chat with AI-powered profanity filter
- Lost & found management
- Secure authentication (Clerk)

---

## 🚀 Quick Start

1. **Clone & install dependencies**
   ```bash
   git clone <repository-url>
   cd CampusConnect
   cd client && npm install
   cd ../server && npm install
   ```
2. **Configure environment variables** in `server/.env` (see `.env.example`).
3. **Start servers**
   - Backend: `cd server && npm start`
   - Frontend: `cd client && npm run dev`
4. Visit [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Tech Stack

- React, Vite, Tailwind CSS, Clerk
- Node.js, Express, MongoDB, Mongoose

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For support or suggestions, [open an issue](https://github.com/suman2807/CampusConnect/issues).

---

<p align="center"><sub>Built with ❤️ by students, for students.</sub></p>
