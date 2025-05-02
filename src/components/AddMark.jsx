import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AddMark = () => {
  const [mark, setMark] = useState({
    student_id: "",
    subject: "",
    score: "",
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students!", "error");
    }
  };

  const validateForm = () => {
    if (!mark.student_id || !mark.subject || !mark.score) {
      Swal.fire("Error", "All fields are required!", "error");
      return false;
    }
    if (isNaN(mark.score)) {
      Swal.fire("Error", "Score must be numeric!", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/add_mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mark),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Success", data.message, "success");
        setMark({ student_id: "", subject: "", score: "" });
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add mark!", "error");
    }
  };

  return (
    <div className="container">
      <h3>Add Mark</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Select Student</label>
          <select
            className="form-control"
            value={mark.student_id}
            onChange={(e) => setMark({ ...mark, student_id: e.target.value })}
            required
          >
            <option value="">-- Select --</option>
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} ({s.class} {s.section})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Subject</label>
          <input
            type="text"
            className="form-control"
            value={mark.subject}
            onChange={(e) => setMark({ ...mark, subject: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <label>Score</label>
          <input
            type="number"
            className="form-control"
            value={mark.score}
            onChange={(e) => setMark({ ...mark, score: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Mark
        </button>
      </form>
    </div>
  );
};

export default AddMark;
