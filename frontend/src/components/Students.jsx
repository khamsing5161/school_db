import { useState, useEffect, useMemo } from "react";
import StudentsDetailModal from "./StudentsDetailModal";
import axios from "axios";
import API from "../api/axios";

// const API = "http://localhost:3000/students";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  department: "",
  field_of_study: "",
  sauanum: false,
  women: false,
  kammaban: false,
  phone_number: "",
  birth_date: "",
  enrollment_date: "",
  current_village: "",
  current_district: "",
  current_province: "",
  permanent_village: "",
  permanent_district: "",
  permanent_province: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    fetchStudents();

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  async function fetchStudents() {
    setLoading(true);

    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      showToast("ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້", "error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(
    msg,
    type = "success"
  ) {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(s) {
    setForm({
      first_name: s.first_name || "",
      last_name: s.last_name || "",
      department: s.department || "",
      field_of_study:
        s.field_of_study || "",
      sauanum: !!s.sauanum,
      women: !!s.women,
      kammaban: !!s.kammaban,
      phone_number:
        s.phone_number || "",
      birth_date:
        s.birth_date?.slice(0, 10) ||
        "",
      enrollment_date:
        s.enrollment_date?.slice(
          0,
          10
        ) || "",
      current_village:
        s.current_village || "",
      current_district:
        s.current_district || "",
      current_province:
        s.current_province || "",
      permanent_village:
        s.permanent_village || "",
      permanent_district:
        s.permanent_district || "",
      permanent_province:
        s.permanent_province || "",
    });

    setEditId(s.id);
    setShowForm(true);
  }

  function handleChange(e) {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    if (editId) {
      await API.put(`/students/${editId}`, form);
    } else {
      await API.post("/students", form);
    }

    showToast(
      editId ? "ແກ້ໄຂສຳເລັດ" : "ເພີ່ມສຳເລັດ"
    );

    setShowForm(false);
    fetchStudents();
  } catch (err) {
    console.error(err);
    showToast("ເກີດຂໍ້ຜິດພາດ", "error");
  }
}

  async function handleDelete(id) {
    if (!confirm("ຢືນຢັນການລົບ?")) return;

    try {
      await API.delete(`/students/${id}`);

      showToast("ລົບສຳເລັດ");
      fetchStudents();
    } catch (err) {
      console.error(err);
      showToast("ລົບບໍ່ໄດ້", "error");
    }
  }

  const filtered = useMemo(() => {
    return students.filter((s) =>
      `${s.first_name} ${s.last_name} ${s.department}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [students, search]);

  return (
    <div
      style={{
        ...styles.page,
        padding: isMobile
          ? 10
          : 24,
      }}
    >
      {toast && (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "error"
                ? "#ef4444"
                : "#22c55e",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div style={styles.header}>
        <div>
          <div
            style={{
              ...styles.headerTitle,
              fontSize: isMobile
                ? 22
                : 28,
            }}
          >
            ລະບົບຂໍ້ມູນນັກສຶກສາ
          </div>

          <div style={styles.headerSub}>
            {students.length} ຄົນທັງໝົດ
          </div>
        </div>

        <button
          style={{
            ...styles.btnPrimary,
            width: isMobile
              ? "100%"
              : "auto",
          }}
          onClick={openAdd}
        >
          + ເພີ່ມນັກສຶກສາ
        </button>
      </div>

      <input
        style={styles.search}
        placeholder="ຄົ້ນຫາ..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.loading}>
            ກຳລັງໂຫຼດ...
          </div>
        ) : isMobile ? (
          <div style={styles.cardList}>
            {filtered.length === 0 ? (
              <div style={styles.empty}>
                ບໍ່ພົບຂໍ້ມູນ
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  style={styles.card}
                  onClick={() =>
                    setDetailId(s.id)
                  }
                >
                  <div
                    style={styles.cardTop}
                  >
                    <div>
                      <div
                        style={
                          styles.cardName
                        }
                      >
                        {s.first_name}{" "}
                        {s.last_name}
                      </div>

                      <div
                        style={
                          styles.cardSub
                        }
                      >
                        {s.department ||
                          "-"}{" "}
                        •{" "}
                        {s.field_of_study ||
                          "-"}
                      </div>
                    </div>

                    <div
                      style={
                        styles.cardId
                      }
                    >
                      #{s.id}
                    </div>
                  </div>

                  <div
                    style={
                      styles.cardInfo
                    }
                  >
                    <div>
                      <b>ເບີ:</b>{" "}
                      {s.phone_number ||
                        "-"}
                    </div>

                    <div>
                      <b>
                        ປັດຈຸບັນ:
                      </b>{" "}
                      {s.current_village
                        ? `${s.current_village}, ${s.current_province}`
                        : "-"}
                    </div>

                    <div>
                      <b>
                        ຖາວອນ:
                      </b>{" "}
                      {s.permanent_village
                        ? `${s.permanent_village}, ${s.permanent_province}`
                        : "-"}
                    </div>
                  </div>

                  <div
                    style={
                      styles.badgeRow
                    }
                  >
                    <span
                      style={
                        styles.badge
                      }
                    >
                      {s.sauanum
                        ? "ສາວອານຸ ✓"
                        : "ສາວອານຸ -"}
                    </span>

                    <span
                      style={
                        styles.badge
                      }
                    >
                      {s.women
                        ? "ສະຕີ ✓"
                        : "ສະຕີ -"}
                    </span>

                    <span
                      style={
                        styles.badge
                      }
                    >
                      {s.kammaban
                        ? "ກໍາມະບານ ✓"
                        : "ກໍາມະບານ -"}
                    </span>
                  </div>

                  <div
                    style={
                      styles.cardActions
                    }
                  >
                    <button
                      style={
                        styles.btnEdit
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(s);
                      }}
                    >
                      ແກ້ໄຂ
                    </button>

                    <button
                      style={
                        styles.btnDelete
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          s.id
                        );
                      }}
                    >
                      ລົບ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "ID",
                  "ຊື່",
                  "ນາມສະກຸນ",
                  "ພາກວິຊາ",
                  "ສາຂາ",
                  "ສາວໜຸ່ມ",
                  "ແມ່ຍິງ",
                  "ກໍາມະບານ",
                  "ເບີໂທ",
                  "ທີ່ຢູ່",
                  "ຈັດການ",
                ].map((h) => (
                  <th
                    key={h}
                    style={styles.th}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    style={styles.empty}
                  >
                    ບໍ່ພົບຂໍ້ມູນ
                  </td>
                </tr>
              ) : (
                filtered.map(
                  (s, i) => (
                    <tr
                      key={s.id}
                      style={
                        i % 2 === 0
                          ? styles.trEven
                          : styles.trOdd
                      }
                      onClick={() =>
                        setDetailId(
                          s.id
                        )
                      }
                    >
                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.id}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.first_name}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.last_name}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.department ||
                          "-"}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.field_of_study ||
                          "-"}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          textAlign:
                            "center",
                        }}
                      >
                        {s.sauanum
                          ? "✓"
                          : "-"}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          textAlign:
                            "center",
                        }}
                      >
                        {s.women
                          ? "✓"
                          : "-"}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          textAlign:
                            "center",
                        }}
                      >
                        {s.kammaban
                          ? "✓"
                          : "-"}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.phone_number ||
                          "-"}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {s.current_village
                          ? `${s.current_village}, ${s.current_province}`
                          : "-"}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          minWidth: 150,
                        }}
                      >
                        <div
                          style={
                            styles.actionWrap
                          }
                        >
                          <button
                            style={
                              styles.btnEdit
                            }
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();
                              openEdit(
                                s
                              );
                            }}
                          >
                            ແກ້ໄຂ
                          </button>

                          <button
                            style={
                              styles.btnDelete
                            }
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();
                              handleDelete(
                                s.id
                              );
                            }}
                          >
                            ລົບ
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div
          style={styles.overlay}
          onClick={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setShowForm(false);
            }
          }}
        >
          <div
            style={{
              ...styles.modal,
              borderRadius:
                isMobile
                  ? 18
                  : 28,
            }}
          >
            <div
              style={
                styles.modalHeader
              }
            >
              <span
                style={
                  styles.modalTitle
                }
              >
                {editId
                  ? "ແກ້ໄຂນັກສຶກສາ"
                  : "ເພີ່ມນັກສຶກສາ"}
              </span>

              <button
                style={
                  styles.btnClose
                }
                onClick={() =>
                  setShowForm(false)
                }
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              style={styles.form}
            >
              <Section title="ຂໍ້ມູນທົ່ວໄປ">
                <div
                  style={
                    styles.formGrid
                  }
                >
                  <Field
                    label="ຊື່"
                    name="first_name"
                    value={
                      form.first_name
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ນາມສະກຸນ"
                    name="last_name"
                    value={
                      form.last_name
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ພາກວິຊາ"
                    name="department"
                    value={
                      form.department
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ສາຂາ"
                    name="field_of_study"
                    value={
                      form.field_of_study
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ເບີໂທ"
                    name="phone_number"
                    value={
                      form.phone_number
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    type="date"
                    label="ວັນເກີດ"
                    name="birth_date"
                    value={
                      form.birth_date
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    type="date"
                    label="ວັນລົງທະບຽນ"
                    name="enrollment_date"
                    value={
                      form.enrollment_date
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </Section>

              <Section title="ສັງກັດ">
                <div
                  style={
                    styles.checkRow
                  }
                >
                  {[
                    [
                      "sauanum",
                      "ສາວອານຸ",
                    ],
                    [
                      "women",
                      "ສະຕີ",
                    ],
                    [
                      "kammaban",
                      "ກໍາມະບານ",
                    ],
                  ].map(
                    ([
                      name,
                      label,
                    ]) => (
                      <label
                        key={name}
                        style={
                          styles.checkLabel
                        }
                      >
                        <input
                          type="checkbox"
                          name={name}
                          checked={
                            form[
                            name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          style={
                            styles.checkbox
                          }
                        />

                        {label}
                      </label>
                    )
                  )}
                </div>
              </Section>

              <Section title="ທີ່ຢູ່ປັດຈຸບັນ">
                <div
                  style={
                    styles.formGrid
                  }
                >
                  <Field
                    label="ບ້ານ"
                    name="current_village"
                    value={
                      form.current_village
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ເມືອງ"
                    name="current_district"
                    value={
                      form.current_district
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ແຂວງ"
                    name="current_province"
                    value={
                      form.current_province
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </Section>

              <Section title="ທີ່ຢູ່ຖາວອນ">
                <div
                  style={
                    styles.formGrid
                  }
                >
                  <Field
                    label="ບ້ານ"
                    name="permanent_village"
                    value={
                      form.permanent_village
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ເມືອງ"
                    name="permanent_district"
                    value={
                      form.permanent_district
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Field
                    label="ແຂວງ"
                    name="permanent_province"
                    value={
                      form.permanent_province
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              </Section>

              <div
                style={
                  styles.formFooter
                }
              >
                <button
                  type="button"
                  style={
                    styles.btnCancel
                  }
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  ຍົກເລີກ
                </button>

                <button
                  type="submit"
                  style={
                    styles.btnPrimary
                  }
                >
                  {editId
                    ? "ບັນທຶກ"
                    : "ເພີ່ມ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailId && (
        <StudentsDetailModal
          order={detailId}
          onClose={() =>
            setDetailId(null)
          }
        />
      )}
    </div>
  );
}

function Section({
  title,
  children,
}) {
  return (
    <div style={styles.section}>
      <div
        style={styles.sectionTitle}
      >
        {title}
      </div>

      {children}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
      </label>

      <input
        style={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

const C = {
  bg: "#0b1020",
  border: "#263248",
  accent: "#6366f1",
  accent2: "#8b5cf6",
  text: "#e5e7eb",
  muted: "#94a3b8",
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: C.bg,
    color: C.text,
    fontFamily:
      "'Noto Sans Lao','Noto Sans',sans-serif",
    boxSizing: "border-box",
  },

  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 9999,
    padding: "12px 16px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  headerTitle: {
    fontWeight: 800,
  },

  headerSub: {
    color: C.muted,
    marginTop: 4,
  },

  search: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    background: "#111827",
    color: C.text,
    marginBottom: 20,
    boxSizing: "border-box",
    outline: "none",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling:
      "touch",
    borderRadius: 20,
    border: `1px solid ${C.border}`,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 900,
  },

  th: {
    padding: "14px 12px",
    textAlign: "left",
    background: "#111827",
    color: C.muted,
    fontSize: 13,
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 12px",
    borderBottom:
      "1px solid rgba(255,255,255,.05)",
    whiteSpace: "nowrap",
  },

  trEven: {
    background:
      "rgba(255,255,255,.02)",
    cursor: "pointer",
  },

  trOdd: {
    cursor: "pointer",
  },

  empty: {
    padding: 40,
    textAlign: "center",
    color: C.muted,
  },

  loading: {
    padding: 40,
    textAlign: "center",
  },

  cardList: {
    display: "grid",
    gap: 12,
    padding: 12,
  },

  card: {
    background: "#111827",
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    padding: 14,
    display: "grid",
    gap: 12,
    cursor: "pointer",
  },

  cardTop: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  cardName: {
    fontSize: 18,
    fontWeight: 800,
  },

  cardSub: {
    color: C.muted,
    fontSize: 13,
    marginTop: 4,
  },

  cardId: {
    fontSize: 12,
    color: C.muted,
  },

  cardInfo: {
    display: "grid",
    gap: 6,
    fontSize: 13,
  },

  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background:
      "rgba(255,255,255,.06)",
    border:
      "1px solid rgba(255,255,255,.08)",
  },

  cardActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  btnPrimary: {
    padding: "12px 18px",
    border: "none",
    borderRadius: 14,
    background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  btnEdit: {
    padding: "8px 12px",
    border: "none",
    borderRadius: 10,
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
  },

  btnDelete: {
    padding: "8px 12px",
    border: "none",
    borderRadius: 10,
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },

  actionWrap: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: 850,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#111827",
    border: `1px solid ${C.border}`,
  },

  modalHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: 20,
    borderBottom: `1px solid ${C.border}`,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 800,
  },

  btnClose: {
    background: "none",
    border: "none",
    color: C.text,
    fontSize: 20,
    cursor: "pointer",
  },

  form: {
    padding: 20,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px,1fr))",
    gap: 14,
  },

  section: {
    marginBottom: 24,
    padding: 18,
    borderRadius: 18,
    background:
      "rgba(255,255,255,.02)",
    border:
      "1px solid rgba(255,255,255,.05)",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#a5b4fc",
    fontWeight: 800,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: ".08em",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    color: C.muted,
    fontSize: 13,
  },

  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: "#0f172a",
    color: C.text,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  },

  checkRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },

  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 12,
    background:
      "rgba(255,255,255,.03)",
    border:
      "1px solid rgba(255,255,255,.05)",
    cursor: "pointer",
  },

  checkbox: {
    width: 16,
    height: 16,
    accentColor: "#6366f1",
  },

  formFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },

  btnCancel: {
    padding: "12px 18px",
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    background: "transparent",
    color: C.text,
    cursor: "pointer",
  },
};