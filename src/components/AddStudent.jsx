import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    class: "",
    section: "",
    email: "",
  });

  const [existingStudents, setExistingStudents] = useState([]);

  useEffect(() => {
    fetchExistingStudents();
  }, []);

  const fetchExistingStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_students");
      const data = await response.json();
      if (response.ok) {
        setExistingStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching students");
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!student.name || !student.class || !student.section || !student.email) {
      Swal.fire("Error", "All fields are required!", "error");
      return false;
    }
    if (!emailRegex.test(student.email)) {
      Swal.fire("Error", "Invalid email format!", "error");
      return false;
    }

    // Duplicate check (optional)
    const duplicate = existingStudents.find(
      (s) =>
        s.name === student.name &&
        s.class === student.class &&
        s.section === student.section
    );

    if (duplicate) {
      Swal.fire(
        "Duplicate",
        "Student with same name, class, and section already exists!",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/add_student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", data.message, "success");
        setStudent({ name: "", class: "", section: "", email: "" });
        fetchExistingStudents(); // Refresh list
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add student!", "error");
    }
  };

  return (
    <div className="container">
      <h3>Add Student</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label>Class</label>
          <input
            type="text"
            className="form-control"
            value={student.class}
            onChange={(e) => setStudent({ ...student, class: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label>Section</label>
          <input
            type="text"
            className="form-control"
            value={student.section}
            onChange={(e) =>
              setStudent({ ...student, section: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={student.email}
            onChange={(e) => setStudent({ ...student, email: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
