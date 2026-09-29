# Contributing to SocietyOS 🤝

Thank you for your interest in contributing to **SocietyOS**! We welcome contributions from developers, designers, and civic-tech enthusiasts.

---

## 🛠 Development Workflow

1. **Fork the Repository**
   Click the **Fork** button on [GitHub](https://github.com/rangeshsha-Rookie/SocietyOS) to create your personal copy.

2. **Clone your Fork**
   ```bash
   git clone https://github.com/<your-username>/SocietyOS.git
   cd SocietyOS
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

4. **Install Dependencies**
   - **Backend**:
     ```bash
     cd SocietyOS/backend
     npm install
     cp .env.example .env
     npx prisma db push
     npx prisma db seed
     ```
   - **Mobile**:
     ```bash
     cd SocietyOS/mobile
     npm install
     ```

5. **Run Typechecks & Tests**
   ```bash
   # In SocietyOS/backend
   npx tsc --noEmit

   # In SocietyOS/mobile
   npx tsc --noEmit
   ```

6. **Commit & Push**
   ```bash
   git commit -m "feat(mobile): add new feature description"
   git push origin feature/my-new-feature
   ```

7. **Open a Pull Request**
   Submit a PR against the `main` branch with a clear description of your changes.

---

## 📋 Code Standards

- **TypeScript**: Strict typechecking is enabled. Avoid using `any`.
- **Formatting**: Keep code clean, modular, and well-commented.
- **Security**: Never commit `.env` files or API secrets.

---

## 💬 Community & Support

If you encounter issues or have suggestions, please open an issue in the [GitHub Issue Tracker](https://github.com/rangeshsha-Rookie/SocietyOS/issues).
