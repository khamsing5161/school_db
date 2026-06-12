import { useState } from "react";
import Navbar   from "./components/Navbar";
import Students from "./components/Students";
import Sauanum  from "./components/Sauanum";
import Women   from "./components/Women";
import Kammaban from "./components/Kammaban";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Lecturers from "./components/Lecturers"; // เปิดเมื่อทำหน้า Lecturers แล้ว

export default function App() {
  const [page, setPage] = useState("/students");

  return (
    <BrowserRouter>
      <div style={{ minHeight:"100vh", background:"#0f1117", fontFamily:"'Noto Sans Lao','Noto Sans',sans-serif" }}>
        <Navbar current={page} onChange={setPage} />

        <main>
          <Routes>
            <Route path="/" element={<Students />} />
            <Route path="/sauanum" element={<Sauanum />} />
            <Route path="/women" element={<Women />} />
            <Route path="/kammaban" element={<Kammaban />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}