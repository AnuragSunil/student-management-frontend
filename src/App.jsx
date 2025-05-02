import React from "react";
import { Route, Routes } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import AddMark from "./components/AddMark";
import ViewStudents from "./components/ViewStudents";
import UpdateStudent from "./components/UpdateStudent";
import StudentList from "./components/StudentList"; // ✅ Import your new component
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Student Result Management System</h1>
        <Routes>
          {/* Home - View Students */}
          <Route path="/" element={<ViewStudents />} />

          {/* Add New Student */}
          <Route path="/add_student" element={<AddStudent />} />

          {/* Add Marks */}
          <Route path="/add_mark" element={<AddMark />} />

          {/* Update Student */}
          <Route
            path="/update_student/:student_id"
            element={<UpdateStudent />}
          />

          {/* New Route - Student List */}
          <Route path="/student_list" element={<StudentList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
