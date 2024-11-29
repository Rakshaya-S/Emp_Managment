import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome({ isLogged }) {
    const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
    const [employees, setEmployees] = useState([]);
    const [showEmpList, setShowEmpList] = useState(false);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    // Fetch user role on component load
    useEffect(() => {
        async function fetchUserRole() {
            try {
                const response = await fetch(process.env.REACT_APP_LOGIN_URL + "/currentUser", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                const result = await response.json();

                if (result.success && result.data.role === "admin") {
                    setIsAdmin(true); // Show the "Employee List" button if the user is admin
                }
            } catch (err) {
                setErr("Error fetching user role.");
            }
        }

        fetchUserRole();
    }, []);

    // Fetch employee list when button is clicked
    async function handleShowEmployees() {
        setShowEmpList(true);
        try {
            const response = await fetch(process.env.REACT_APP_LOGIN_URL + "/employeeList", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            const result = await response.json();

            if (result.success) {
                setEmployees(result.data || []);
            } else {
                setErr("Failed to fetch employee list.");
            }
        } catch (err) {
            setErr("Error fetching employee list.");
        }
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        isLogged(false);
        navigate("/");
    }

    return (
        <div className="welcome-container">
            <h1>Welcome</h1>
            <button onClick={handleLogout}>Logout</button>
            {isAdmin && ( // Show "Employee List" button only if the user is admin
                <button onClick={handleShowEmployees}>Employee List</button>
            )}
            {showEmpList && (
                <div>
                    <h2>Employee List</h2>
                    {employees.length > 0 ? (
                        <ul>
                            {employees.map((emp) => (
                                <li key={emp.id}>
                                    {emp.username} - {emp.email} - {emp.role}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No employees found.</p>
                    )}
                </div>
            )}
            {err && <p style={{ color: "red" }}>{err}</p>}
        </div>
    );
}

export default Welcome;
