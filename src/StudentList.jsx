
import React from "react";

function StudentList({
  students,
  onDelete,
  deletingId,
  hasSearch
}) {
  if (students.length === 0) {
    return (
      <p className="empty">
        {hasSearch
          ? "Không tìm thấy sinh viên phù hợp"
          : "Chưa có sinh viên"}
      </p>
    );
  }

  return (
    <div className="student-list">
      {students.map((student) => {
        const gpa = student.gpa == null || student.gpa === ""
          ? NaN
          : Number(student.gpa);

        return (
          <div className="student-item" key={student.id}>
            <div className="student-info">
              <strong>{student.name}</strong>

              <span>Ngành: {student.major}</span>

              <small>Email: {student.email}</small>

              <small>
                GPA: {Number.isFinite(gpa)
                  ? `${gpa.toFixed(2)}/4.00`
                  : "Chưa cập nhật"}
              </small>
            </div>

            <button
              type="button"
              className="delete-btn"
              disabled={deletingId !== null}
              onClick={() => onDelete(student)}
            >
              {deletingId === String(student.id)
                ? "Đang xóa..."
                : "Xóa"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default StudentList;
