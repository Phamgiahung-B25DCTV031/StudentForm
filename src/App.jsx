
import React, { useMemo, useState } from "react";
import StudentForm from "./StudentForm";
import StudentList from "./StudentList";
import useFetch from "./useFetch";
import { useTheme } from "./ThemeContext";

const API_URL = (
  import.meta.env.VITE_MOCK_API_URL || ""
).replace(/\/+$/, "");

// Chuẩn hóa tên: bỏ dấu tiếng Việt, chuyển thành chữ thường
const normalizeName = (value) => {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
};

function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    data: students,
    loading,
    error,
    reload
  } = useFetch(API_URL);

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  // Tìm kiếm theo tên sinh viên
  const filteredStudents = useMemo(() => {
    const keyword = normalizeName(search.trim());

    return students.filter((student) =>
      normalizeName(student.name).includes(keyword)
    );
  }, [students, search]);

  // Thêm sinh viên vào MockAPI
  const handleAdd = async (student) => {
    if (!API_URL) {
      throw new Error("Chưa cấu hình MockAPI");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    if (!response.ok) {
      throw new Error("Không thể thêm sinh viên");
    }

    setActionError("");
    reload();
  };

  // Xóa sinh viên có xác nhận
  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sinh viên "${student.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(String(student.id));
    setActionError("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(student.id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa sinh viên");
      }

      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <div className="window-header">
        <span>● ● ●</span>
        <span>Quản lý sinh viên (Hooks)</span>
      </div>

      <div className="content">
        <div className="top-bar">
          <h1>Quản lý sinh viên</h1>

          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
          >
            {theme === "light"
              ? "🌙 Chế độ tối"
              : "☀️ Chế độ sáng"}
          </button>
        </div>

        <StudentForm onAdd={handleAdd} />

        <h2>Danh sách sinh viên</h2>

        {/* Tìm kiếm theo tên */}
        <div className="search-section">
          <label htmlFor="search">Tìm kiếm sinh viên</label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên sinh viên cần tìm..."
          />
        </div>

        {loading && <p>Đang tải dữ liệu...</p>}

        {error && <p className="error">{error}</p>}

        {actionError && (
          <p className="error">{actionError}</p>
        )}

        {!loading && !error && (
          <>
            <p className="search-count">
              Hiển thị {filteredStudents.length}/{students.length} sinh viên
            </p>

            <StudentList
              students={filteredStudents}
              onDelete={handleDelete}
              deletingId={deletingId}
              hasSearch={search.trim().length > 0}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
