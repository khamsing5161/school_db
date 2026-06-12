import { useState, useEffect } from "react";
import API from "../api/axios";

const C = {
  bg: "#0f1117",
  surface: "#1a1d27",
  surface2: "#12141e",
  border: "#2a2d3e",
  accent: "#6366f1",
  text: "#e2e8f0",
  muted: "#94a3b8",
  success: "#22c55e",
};

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "min(560px,95vw)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.6)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${C.border}` },
  title: { fontSize: 16, fontWeight: 700, color: C.text },
  btnClose: { background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 },
  body: { padding: "20px 24px" },
  avatar: { width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, #818cf8)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 14 },
  name: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 },
  dept: { fontSize: 13, color: C.muted, marginBottom: 16 },
  badges: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  section: { marginBottom: 18 },
  secTitle: { fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" },
  item: { background: C.surface2, borderRadius: 8, padding: "10px 12px" },
  itemLabel: { fontSize: 11, color: C.muted, marginBottom: 3 },
  itemValue: { fontSize: 13, color: C.text, fontWeight: 500 },
  loading: { padding: 40, textAlign: "center", color: C.muted },
};



export default function StudentsDetailModal({ order: id, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function fetchStudent() {
      try {
        setLoading(true);

        const res = await API.get(`/students/${id}`);

        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  function initial(s) {
    if (!s) return "?";
    return (s.first_name?.[0] || "") + (s.last_name?.[0] || "");
  }

  function fmt(val) {
    if (!val) return "-";

    const date = new Date(val);

    return date.toLocaleDateString("en-GB");
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>ຂໍ້ມູນລາຍລະອຽດ</span>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          {loading ? (
            <div style={styles.loading}>ກຳລັງໂຫຼດ...</div>
          ) : !data || data.message ? (
            <div style={styles.loading}>ບໍ່ພົບຂໍ້ມູນ</div>
          ) : (
            <>
              {/* Avatar + ชื่อ */}
              <div style={styles.avatar}>{initial(data)}</div>
              <div style={styles.name}>{data.first_name} {data.last_name}</div>
              <div style={styles.dept}>{data.department || "-"} {data.field_of_study ? `· ${data.field_of_study}` : ""}</div>

              {/* Badge สังกัด */}
              <div style={styles.badges}>
                {data.sauanum ? <span style={{ ...styles.badge, background: "#312e81", color: "#a5b4fc" }}>ສາວອານຸ</span> : null}
                {data.women ? <span style={{ ...styles.badge, background: "#4a1d96", color: "#d8b4fe" }}>ສະຕີ</span> : null}
                {data.kammaban ? <span style={{ ...styles.badge, background: "#1e3a5f", color: "#93c5fd" }}>ກໍາມະບານ</span> : null}
                {!data.sauanum && !data.women && !data.kammaban &&
                  <span style={{ ...styles.badge, background: "#1f2937", color: C.muted }}>ບໍ່ມີສັງກັດ</span>
                }
              </div>

              {/* ข้อมูลทั่วไป */}
              <div style={styles.section}>
                <div style={styles.secTitle}>ຂໍ້ມູນທົ່ວໄປ</div>
                <div style={styles.grid}>
                  <InfoItem label="ລະຫັດນັກສຶກສາ" value={`#${data.id}`} />
                  <InfoItem label="ເບີໂທ" value={data.phone_number || "-"} />
                  <InfoItem label="ວັນເກີດ" value={fmt(data.birth_date)} />
                  <InfoItem label="ວັນທີ່ລົງທະບຽນ" value={fmt(data.enrollment_date)} />
                </div>
              </div>

              {/* ที่อยู่ปัจจุบัน */}
              <div style={styles.section}>
                <div style={styles.secTitle}>ທີ່ຢູ່ປັດຈຸບັນ</div>
                <div style={styles.grid}>
                  <InfoItem label="ບ້ານ" value={data.current_village || "-"} />
                  <InfoItem label="ເມືອງ" value={data.current_district || "-"} />
                  <InfoItem label="ແຂວງ" value={data.current_province || "-"} />
                </div>
              </div>

              {/* ที่อยู่ถาวร */}
              <div style={styles.section}>
                <div style={styles.secTitle}>ທີ່ຢູ່ຖາວອນ</div>
                <div style={styles.grid}>
                  <InfoItem label="ບ້ານ" value={data.permanent_village || "-"} />
                  <InfoItem label="ເມືອງ" value={data.permanent_district || "-"} />
                  <InfoItem label="ແຂວງ" value={data.permanent_province || "-"} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.item}>
      <div style={styles.itemLabel}>{label}</div>
      <div style={styles.itemValue}>{value}</div>
    </div>
  );
}