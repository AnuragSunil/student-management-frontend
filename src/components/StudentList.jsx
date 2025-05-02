import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter students by name, class, section (case-insensitive)
  const filteredStudents = students.filter((s) =>
    `${s.name} ${s.class} ${s.section}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    let csv = "Name,Class,Section,Email\n";
    filteredStudents.forEach((s) => {
      csv += `${s.name},${s.class},${s.section},${s.email}\n`;
    });

    // Trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-4">
      <h3>Student List</h3>

      {/* Search */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, class, section"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success ms-2" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.student_id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.section}</td>
              <td>{s.email}</td>
            </tr>
          ))}
          {filteredStudents.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No students found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
