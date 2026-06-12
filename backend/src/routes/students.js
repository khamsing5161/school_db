const express = require('express');
const router  = express.Router();
const db      = require('../db/connection'); // ใช้ neon client

// ── Query ซ้ำกัน ดึงออกมาเป็น helper ──
const SELECT_FIELDS = `
  SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.department,
    s.field_of_study,
    s.sauanum,
    s.women,
    s.kammaban,
    s.phone_number,
    s.birth_date,
    s.enrollment_date,

    ca.village  AS current_village,
    ca.district AS current_district,
    ca.province AS current_province,

    pa.village  AS permanent_village,
    pa.district AS permanent_district,
    pa.province AS permanent_province

  FROM students s
  LEFT JOIN current_addresses   ca ON ca.student_id = s.id
  LEFT JOIN permanent_addresses pa ON pa.student_id = s.id
`;

// GET /students — ดึงทั้งหมด
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`${SELECT_FIELDS} ORDER BY s.id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// GET /students/sauanum
router.get('/sauanum', async (req, res) => {
  try {
    const { rows } = await db.query(`${SELECT_FIELDS} WHERE s.sauanum = TRUE ORDER BY s.id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// GET /students/women
router.get('/women', async (req, res) => {
  try {
    const { rows } = await db.query(`${SELECT_FIELDS} WHERE s.women = TRUE ORDER BY s.id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// GET /students/kammaban
router.get('/kammaban', async (req, res) => {
  try {
    const { rows } = await db.query(`${SELECT_FIELDS} WHERE s.kammaban = TRUE ORDER BY s.id`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// GET /students/:id — ดึงรายคน
router.get('/:id', async (req, res) => {
  try {
    // PostgreSQL ใช้ $1 แทน ?
    const { rows } = await db.query(
      `${SELECT_FIELDS} WHERE s.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// POST /students — เพิ่มนักศึกษาพร้อมที่อยู่
router.post('/', async (req, res) => {
  const client = await db.connect(); // PostgreSQL ใช้ client แทน connection
  try {
    await client.query('BEGIN');

    const {
      first_name, last_name, department, field_of_study,
      sauanum = false, women = false, kammaban = false,
      phone_number, birth_date, enrollment_date,
      current_village, current_district, current_province,
      permanent_village, permanent_district, permanent_province,
    } = req.body;

    // 1. insert นักศึกษา — RETURNING id แทน insertId
    const { rows: [student] } = await client.query(
      `INSERT INTO students
        (first_name, last_name, department, field_of_study,
         sauanum, women, kammaban,
         phone_number, birth_date, enrollment_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [first_name, last_name, department, field_of_study,
       sauanum, women, kammaban,
       phone_number, birth_date, enrollment_date]
    );
    const studentId = student.id;

    // 2. insert ที่อยู่ปัจจุบัน
    await client.query(
      `INSERT INTO current_addresses (student_id, village, district, province)
       VALUES ($1,$2,$3,$4)`,
      [studentId, current_village, current_district, current_province]
    );

    // 3. insert ที่อยู่ถาวร
    await client.query(
      `INSERT INTO permanent_addresses (student_id, village, district, province)
       VALUES ($1,$2,$3,$4)`,
      [studentId, permanent_village, permanent_district, permanent_province]
    );

    await client.query('COMMIT');
    res.status(201).json({ id: studentId, message: 'เพิ่มสำเร็จ' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  } finally {
    client.release();
  }
});

// PUT /students/:id — แก้ไข
router.put('/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const {
      first_name, last_name, department, field_of_study,
      sauanum, women, kammaban,
      phone_number, birth_date, enrollment_date,
      current_village, current_district, current_province,
      permanent_village, permanent_district, permanent_province,
    } = req.body;

    await client.query(
      `UPDATE students
       SET first_name=$1, last_name=$2, department=$3, field_of_study=$4,
           sauanum=$5, women=$6, kammaban=$7,
           phone_number=$8, birth_date=$9, enrollment_date=$10
       WHERE id=$11`,
      [first_name, last_name, department, field_of_study,
       sauanum, women, kammaban,
       phone_number, birth_date, enrollment_date,
       req.params.id]
    );

    await client.query(
      `UPDATE current_addresses
       SET village=$1, district=$2, province=$3
       WHERE student_id=$4`,
      [current_village, current_district, current_province, req.params.id]
    );

    await client.query(
      `UPDATE permanent_addresses
       SET village=$1, district=$2, province=$3
       WHERE student_id=$4`,
      [permanent_village, permanent_district, permanent_province, req.params.id]
    );

    await client.query('COMMIT');
    res.json({ message: 'แก้ไขสำเร็จ' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  } finally {
    client.release();
  }
});

// DELETE /students/:id
router.delete('/:id', async (req, res) => {
  try {
    // rowCount แทน affectedRows
    const { rowCount } = await db.query(
      'DELETE FROM students WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

module.exports = router;