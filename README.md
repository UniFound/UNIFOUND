
# 🚀 UniFound - Full Stack MERN Application

UniFound is a full-stack platform built using the MERN stack (MongoDB, Express, React, Node.js). The project is fully containerized using Docker for easy setup and deployment.

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed on your machine:
* **Docker Desktop** (Highly recommended: includes Docker Compose, Node.js, and MongoDB environments)
* **Git**

---

## 🏃 Getting Started

### 1. Clone the Repository
First, clone the project to your local machine:
```bash
git clone <your-repository-url>
cd <project-folder-name>

```

### 2. Configure Environment Variables (.env)

Environment files are not pushed to GitHub for security reasons. You must create them manually inside the respective folders.

**For Backend:** Create `UniFound-Backend/.env`

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/UniFoundDB?retryWrites=true&w=majority
PORT=5000
SECRET=UniFound123

```

**For Frontend:** Create `UniFound-Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api

```

### 3. Run the Application with Docker

You don't need to install Node.js or MongoDB locally. Simply run:

```bash
docker-compose up --build

```

Once the process finishes:

* **Frontend:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Backend API:** [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)

---

## 📁 Project Structure

* `UniFound-Backend/` - Node.js & Express API
* `UniFound-Frontend/` - React (Vite) Frontend
* `docker-compose.yml` - Docker orchestration file

---

## 🤝 Contribution Workflow

To keep the code clean and updated, please follow these steps:

1. **Pull Latest Changes:** `git pull origin main`
2. **Commit Changes:** Use descriptive messages like `feat: added login page` or `fix: resolved db connection issue`.
3. **Rebuild Docker:** If you install new npm packages, run `docker-compose up --build` again to update the containers.

```

---

### 💡 **Quick Summary of Commands for Your Team**

Give these 3 commands to your members for a quick start:

1.  **Clone:** `git clone <repo-url>`
2.  **Setup Env:** (Manually create `.env` files in Backend and Frontend folders).
3.  **Run:** `docker-compose up --build`

---

### ⚠️ **A Few Technical Notes for the Team**

* **Database Access:** Make sure the team members' IP addresses are added to the **Network Access** tab in MongoDB Atlas, or set it to **"Allow Access from Anywhere" (0.0.0.0/0)** so they can connect without errors.
* **Port Conflicts:** If someone is already running a service on port 5000 or 5173, they should stop it before running Docker.



**Everything is ready to go! Would you like me to help you draft the first set of tasks for your team members on the Frontend?**

```
