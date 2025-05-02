import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStudentId, setModalStudentId] = useState(null);
  const [modalStudentName, setModalStudentName] = useState("");
  const [showAddMarkForm, setShowAddMarkForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newScore, setNewScore] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while fetching students", "error");
    }
  };

  const handleViewMarks = async (student_id, student_name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/get_student_by_id/${student_id}`
      );
      const data = await response.json();
      if (response.ok) {
        setMarks(data.student.marks || []);
        setModalStudentName(student_name);
        setModalStudentId(student_id);
        setShowModal(true);
      } else {
        Swal.fire("Error", "Error fetching marks", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error fetching marks", "error");
    }
  };

  const handleDelete = async (student_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This student will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:5000/delete_student/${student_id}`,
            { method: "DELETE" }
          );
          const data = await response.json();
          if (response.ok) {
            Swal.fire("Deleted!", data.message, "success");
            fetchStudents(); // Refresh list
          } else {
            Swal.fire("Error", "Error deleting student", "error");
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while deleting", "error");
        }
      }
    });
  };

  const generateReportCard = async (student_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/generate_report_card/${student_id}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        Swal.fire("Success", "Report card generated and opened", "success");
      } else {
        Swal.fire(
          "Error",
          "An error occurred while generating the report card",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", `An error occurred: ${error.message}`, "error");
    }
  };

  // ✅ Export Marks CSV
  const exportMarksCSV = () => {
    if (marks.length === 0) {
      Swal.fire("Error", "No marks to export!", "error");
      return;
    }

    let csv = "Subject,Score\n";
    marks.forEach((mark) => {
      csv += `${mark.subject},${mark.score}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${modalStudentName}_Marks.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
    Swal.fire("Success", "Marks CSV exported!", "success");
  };

  // ✅ Export All Students CSV
  const exportAllStudentCSV = () => {
    if (students.length === 0) {
      Swal.fire("Error", "No students to export!", "error");
      return;
    }

    let csv = "Student ID,Name,Class,Section,Email\n";
    students.forEach((student) => {
      csv += `${student.student_id},${student.name},${student.class},${student.section},${student.email}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Students.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
    Swal.fire("Success", "Students CSV exported!", "success");
  };

  // ✅ Add Marks Submit
  const handleAddMarkSubmit = async (e) => {
    e.preventDefault();

    if (!newSubject || !newScore) {
      Swal.fire("Error", "Please enter subject and score", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add_mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: modalStudentId,
          subject: newSubject,
          score: parseInt(newScore),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Mark added!", "success");
        // Refresh marks
        handleViewMarks(modalStudentId, modalStudentName);
        setShowAddMarkForm(false);
        setNewSubject("");
        setNewScore("");
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while adding mark", "error");
    }
  };

  return (
    <div className="container">
      <h3>View Students</h3>
      <button className="btn btn-secondary mb-2" onClick={fetchStudents}>
        🔄 Refresh List
      </button>
      <button className="btn btn-success mb-2" onClick={exportAllStudentCSV}>
        📥 Export All Students
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Email</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.section}</td>
              <td>{student.email}</td>
              <td>
                <button
                  onClick={() =>
                    handleViewMarks(student.student_id, student.name)
                  }
                  className="btn btn-info btn-sm"
                >
                  View Marks
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/update_student/${student.student_id}`)
                  }
                  className="btn btn-warning btn-sm me-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(student.student_id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => generateReportCard(student.student_id)}
                  className="btn btn-primary btn-sm ms-2"
                >
                  Generate Report Card
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show fade" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Marks for {modalStudentName}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {marks.length > 0 ? (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((mark, index) => (
                          <tr key={index}>
                            <td>{mark.subject}</td>
                            <td>{mark.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-success me-2"
                      onClick={exportMarksCSV}
                    >
                      Export Marks CSV
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAddMarkForm(!showAddMarkForm)}
                    >
                      ➕ Add Marks
                    </button>
                  </>
                ) : (
                  <>
                    <p>No marks available.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAddMarkForm(!showAddMarkForm)}
                    >
                      ➕ Add Marks
                    </button>
                  </>
                )}

                {showAddMarkForm && (
                  <form onSubmit={handleAddMarkSubmit} className="mt-3">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Score"
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
