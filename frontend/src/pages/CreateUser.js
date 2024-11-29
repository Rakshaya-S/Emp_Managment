import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser(props) {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
        mobileNumber: "",
        role: "",
        gender: "",
        courses: [],
    })
    const [err, setError] = useState("");
    const navigate = useNavigate();
    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prevState) => {
                const updatedCourse = checked ?
                    [...prevState.courses, value] :
                    prevState.courses.filter(course => course !== value);
                return { ...prevState, courses: updatedCourse }
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }
    async function handleSubmit() {
        setError("")
        if (!formData.name ||
            !formData.email ||
            !formData.role ||
            !formData.mobileNumber ||
            !formData.gender ||
            !formData.courses ||
            !formData.password) {
            setError("please fill all fields");
            return;
        }

        try {
            console.log(formData.courses);
            console.log("Email submitted:", formData.email);

            const form = new FormData();
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("mobileNumber", formData.mobileNumber);
            form.append("role", formData.role);
            form.append("gender", formData.gender);

            // Ensure courses is an array before joining, or handle it differently if needed
            if (Array.isArray(formData.courses)) {
                form.append("courses", formData.courses.join(", "));
            } else {
                form.append("courses", ""); // Empty string if courses is not an array
            }

            form.append("password", formData.password);
            console.log("Form data being sent:", formData);

            const response = await axios.post(process.env.REACT_APP_LOGIN_URL + "/createUser", formData, {
                headers: {
                    'Content-Type': 'application/json',  // Ensure content type is set
                }
            });
            if (response.data.success) {
                alert("User Created successfully")
                navigate("/");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("An error occurred");
            console.log(err);
        }

    }
    return (
        <div className="glass-container">
            <h1>Sign up</h1>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <label>Mobile number</label>
            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            <div className="inline-select">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}  >
                    <option value="">Select</option>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
            </div>
            <div className="gender">
                <label style={{ fontSize: "20px" }}>Gender</label>
                <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} />Male</label>
                <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} />Female</label>
                <label><input type="radio" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleChange} />Other</label>
            </div>
            <label>Course</label>
            <div className="course">
                <label><input type="checkbox" name="courses" value="MongoDB" checked={formData.courses.includes("MongoDB")} onChange={handleChange} />MongoDB</label>
                <label><input type="checkbox" name="courses" value="Express Js" checked={formData.courses.includes("Express Js")} onChange={handleChange} />Express js</label>
                <label><input type="checkbox" name="courses" value="React Js" checked={formData.courses.includes("React Js")} onChange={handleChange} />React js</label>
                <label><input type="checkbox" name="courses" value="Node js" checked={formData.courses.includes("Node js")} onChange={handleChange} />Node js</label>
            </div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            <button onClick={handleSubmit}>Submit</button>
            {err && <h1 style={{ color: "red" }} className="error">{err}</h1>}
        </div>
    )
}

export default CreateUser;