import express from "express";
import { db } from "../connectdb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  // Import jwt to create the token

const router = express.Router();

// Route to create a user
router.post("/createUser", async (req, res) => {
    try {
        const { name, email, mobileNumber, role, gender, courses, password } = req.body;
        console.log("Request body:", req.body);

        // Ensure courses is an array of strings
        const parsedCourses = Array.isArray(courses) ? courses : courses.split(",").map(course => course.trim());

        const hashedPass = await bcrypt.hash(password, 10);

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            return res.json({
                success: false,
                message: "Enter valid email"
            });
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(mobileNumber)) {
            return res.json({
                success: false,
                message: "Enter valid number"
            });
        }

        console.log("Inserting user with details:", {
            name, email, mobileNumber, role, gender, parsedCourses, hashedPass
        });

        // Insert the user into the database
        await db.query("INSERT INTO employee (username, email, mobilenumber, role, gender, courses, password) VALUES ($1,$2,$3,$4,$5,$6,$7)",
            [name, email, mobileNumber, role, gender, JSON.stringify(parsedCourses), hashedPass]
        );

        console.log("Generating JWT for user:", { email, role });

        const token = jwt.sign(
            { email, role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send success response with the token
        res.json({
            success: true,
            message: "Employee created successfully",
            data: { token }  // Include the token in the response
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the user",
        });
    }
});

// Route to fetch the list of employees
router.get("/employeeList", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM employee");

        res.json({
            success: true,
            data: result.rows  // Correctly return all rows
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error while getting data"
        });
    }
});

export default router;
