import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateStudent = () => {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    email: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/get_student_by_id/${student_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.student) {
          setFormData({
            name: data.student.name || "",
            class: data.student.class || "",
            section: data.student.section || "",
            email: data.student.email || "",
          });
        } else {
          alert("Error fetching student");
        }
      })
      .catch(() => alert("Network error"));
  }, [student_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/update_student", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: Number(student_id), // Important: send student_id
          ...formData,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        navigate("/"); // Redirect to home (view students)
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      alert("An error occurred while updating");
    }
  };

  return (
    <div className="container">
      <h3>Update Student</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Class</label>
          <input
            name="class"
            className="form-control"
            value={formData.class}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Section</label>
          <input
            name="section"
            className="form-control"
            value={formData.section}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Student
        </button>
      </form>
    </div>
  );
};

export default UpdateStudent;
