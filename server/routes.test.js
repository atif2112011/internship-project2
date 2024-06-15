const request = require("supertest");
const app = require("./server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GetUserByEmail, AddNewUser, GetUserById } = require("./dbfunctions");
// Mocking the database functions
jest.mock("./dbfunctions", () => ({
  GetUserByEmail: jest.fn(),
  AddNewUser: jest.fn(),
  GetUserById: jest.fn(),
}));

describe("User Routes", () => {
  //for testing registration
  describe("POST /register", () => {
    it("should register a new user", async () => {
      GetUserByEmail.mockResolvedValue([]);
      AddNewUser.mockResolvedValue({ status: true });

      const res = await request(app).post("/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Registration Successful");
    });

    it("should return error if email already exists", async () => {
      GetUserByEmail.mockResolvedValue([{ email: "test@example.com" }]);

      const res = await request(app).post("/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password",
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Email Already Exists");
    });
  });

  //for testing login
  describe("POST /login", () => {
    it("should login a user and return a JWT", async () => {
      const hashedPassword = await bcrypt.hash("password", 10);
      GetUserByEmail.mockResolvedValue([
        { id: 1, email: "test@example.com", password: hashedPassword },
      ]);

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("User Logged Successfully");
      expect(res.body.token).toBeDefined();
    });

    it("should return error for wrong email", async () => {
      GetUserByEmail.mockResolvedValue([]);

      const res = await request(app)
        .post("/login")
        .send({ email: "wrong@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Wrong Email");
    });

    it("should return error for wrong password", async () => {
      const hashedPassword = await bcrypt.hash("password", 10);
      GetUserByEmail.mockResolvedValue([
        { id: 1, email: "test@example.com", password: hashedPassword },
      ]);

      const res = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Wrong Password");
    });
  });

  //testing profile

  describe("GET /profile", () => {
    it("should retrieve the logged-in user's profile information", async () => {
      const token = jwt.sign({ id: 1 }, "jwtsecret");
      GetUserById.mockResolvedValue([
        { id: 1, username: "testuser", email: "test@example.com" },
      ]);

      const res = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Profile Fetched Successfully");
      expect(res.body.data).toEqual({
        id: 1,
        username: "testuser",
        email: "test@example.com",
      });
    });

    it("should return error for invalid token", async () => {
      const res = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("jwt malformed");
    });
  });
});
