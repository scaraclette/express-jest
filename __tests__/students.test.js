process.env.NODE_ENV = "test";
const db = require("../db");

var request = require('supertest');
var app = require('../app');

/**         CRUD Testing
 * Handling database test in application
 * 1. (beforeAll) - Before all the tests run, create a table called students.
 * 2. (beforeEach) - Before each test, seed the database with a couple of rows of data.
 * 3. (afterEach) - After each test, delete all the rows in the students table (so we can be consistent)
 * 4. (afterAll) - After all the tests run, drop the table called students and close the database connection
 * 
 */

beforeAll(async () => {
    await db.query("CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT)")
});

beforeEach(async () => {
    await db.query("INSERT INTO students (name) VALUES ('Ellie'), ('Matt')");
});

afterEach(async () => {
    await db.query("DELETE FROM students");
});

afterAll(async () => {
    await db.query("DROP TABLE students");
    db.end();
});

describe("GET /students", () => {
    test("It responds with an array of students", async () => {
        const response = await request(app).get("/students");
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.statusCode).toBe(200);
    });
});

describe("POST /students", () => {
    test("It responds with the newly created student", async () => {
        const newStudent = await request(app)
            .post("/students")
            .send({
                name: "New Student"
            });

        // make sure we add it correctly
        expect(newStudent.body).toHaveProperty("id");
        expect(newStudent.body.name).toBe("New Student");
        expect(newStudent.statusCode).toBe(200);

        // make sure we have 3 students now
        const response = await request(app).get("/students");
        expect(response.body.length).toBe(3);
    });
});

describe("PATCH /students/1", () => {
    test("It responds with an update student", async() => {
        // Create new student and post
        const newStudent = await request(app)
            .post("/students")
            .send({
                name: "Another one"
            });
        // Update newStudent name from "Another one" to "updated"
        const updatedStudent = await request(app)
            .patch(`/students/${newStudent.body.id}`)
            .send({ name: "updated" });
        expect(updatedStudent.body.name).toBe("updated");
        expect(updatedStudent.body).toHaveProperty("id");
        expect(updatedStudent.statusCode).toBe(200);

        // Make sure we have 3 students
        const response = await request(app).get("/students");
        expect(response.body.length).toBe(3);
    });
});

describe("DELETE /students/1", () => {
    test("It responds with a message of Deleted", async () => {
        const newStudent = await request(app)
            .post("/students")
            .send({
                name: "Another one"
            });
        const removedStudent = await request(app).delete(`/students/${newStudent.body.id}`);
        expect(removedStudent.body).toEqual({ message: "Deleted" });
        expect(removedStudent.statusCode).toBe(200);

        // Make sure we now have 2 students
        const response = await request(app).get("/students");
        expect(response.body.length).toBe(2);
    });
})

