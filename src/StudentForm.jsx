
import React, { useState } from "react";

function StudentForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    major: "CNTT",
    gpa: ""
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const gpa = Number(form.gpa);

    // Validate họ tên
    if (form.name.trim().length < 3) {
      newErrors.name = "Họ tên phải có ít nhất 3 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Validate GPA từ 0 đến 4
    if (form.gpa.trim() === "") {
      newErrors.gpa = "Vui lòng nhập GPA";
    } else if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4) {
      newErrors.gpa = "GPA phải nằm trong khoảng từ 0 đến 4";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      await onAdd({
        name: form.name.trim(),
        email: form.email.trim(),
        major: form.major,
        gpa: gpa
      });

      setForm({
        name: "",
        email: "",
        major: "CNTT",
        gpa: ""
      });

      setErrors({});
    } catch (err) {
      setErrors({
        submit: err.message || "Không thể thêm sinh viên"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Thêm sinh viên</h2>

      <div className="form-group">
        <label htmlFor="name">Họ tên</label>
        <div className="field">
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn An"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <div className="field">
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="an@ptit.edu.vn"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="major">Ngành</label>
        <div className="field">
          <select
            id="major"
            name="major"
            value={form.major}
            onChange={handleChange}
          >
            <option value="CNTT">CNTT</option>
            <option value="ATTT">ATTT</option>
            <option value="ĐTVT">ĐTVT</option>
            <option value="AIoT">AIoT</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="gpa">GPA</label>
        <div className="field">
          <input
            id="gpa"
            type="number"
            name="gpa"
            min="0"
            max="4"
            step="0.01"
            value={form.gpa}
            onChange={handleChange}
            placeholder="Nhập GPA (0 - 4)"
          />
          {errors.gpa && <p className="error">{errors.gpa}</p>}
        </div>
      </div>

      {errors.submit && <p className="error">{errors.submit}</p>}

      <div className="button-row">
        <button type="submit" disabled={saving}>
          {saving ? "Đang thêm..." : "Thêm sinh viên"}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
