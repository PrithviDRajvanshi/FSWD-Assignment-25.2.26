process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../src/app");
const { connectDB, clearDatabase, disconnectDB } = require("../src/config/db");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Auth Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register with valid data", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "test@example.com", password: "password123" })
        .expect(201);

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Test User");
      expect(res.body).toHaveProperty("email", "test@example.com");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should fail when email already exists", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "test@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User 2", email: "test@example.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message.toLowerCase()).toMatch(/email already|already exists/);
    });

    it("should fail when missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Please provide all fields");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "Login User", email: "login@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "login@example.com", password: "password123" })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "login@example.com");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should fail login with wrong password", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "Login User", email: "login@example.com", password: "password123" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "login@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});
