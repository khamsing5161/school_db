-- ==============================
--  DATABASE SCHEMA (Final)
-- ==============================

CREATE DATABASE IF NOT EXISTS school_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_db;

-- ==============================
--  TABLE: students
-- ==============================
-- ==============================
--  DATABASE SCHEMA (Final)
-- ==============================

CREATE DATABASE IF NOT EXISTS school_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_db;

-- ==============================
--  TABLE: students
-- ==============================
CREATE TABLE students (
  id              INT          NOT NULL AUTO_INCREMENT,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  department      VARCHAR(150),
  field_of_study  VARCHAR(150),
  sauanum         BOOLEAN      DEFAULT FALSE,  -- สังกัดสาวอนุม
  women           BOOLEAN      DEFAULT FALSE,  -- สังกัดสตรี
  kammaban        BOOLEAN      DEFAULT FALSE,  -- สังกัดกรรมบาน
  phone_number    VARCHAR(20),
  birth_date      DATE,
  enrollment_date DATE,
  PRIMARY KEY (id)
);

-- ==============================
--  TABLE: lecturers
-- ==============================
CREATE TABLE lecturers (
  id               INT          NOT NULL AUTO_INCREMENT,
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100) NOT NULL,
  organization     VARCHAR(150),
  department       VARCHAR(150),
  education_level  VARCHAR(100),
  graduated_from   VARCHAR(150),
  job_title        VARCHAR(150),
  phone_number     VARCHAR(20),
  association_date DATE,
  birth_date       DATE,
  PRIMARY KEY (id)
);

-- ==============================
--  TABLE: permanent_addresses
-- ==============================
CREATE TABLE permanent_addresses (
  id          INT          NOT NULL AUTO_INCREMENT,
  student_id  INT          DEFAULT NULL,
  lecturer_id INT          DEFAULT NULL,
  village     VARCHAR(150),
  district    VARCHAR(100),
  province    VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_perm_student
    FOREIGN KEY (student_id)  REFERENCES students  (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_perm_lecturer
    FOREIGN KEY (lecturer_id) REFERENCES lecturers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_perm_insert
BEFORE INSERT ON permanent_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'permanent_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$

CREATE TRIGGER trg_perm_update
BEFORE UPDATE ON permanent_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'permanent_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$
DELIMITER ;

-- ==============================
--  TABLE: current_addresses
-- ==============================
CREATE TABLE current_addresses (
  id          INT          NOT NULL AUTO_INCREMENT,
  student_id  INT          DEFAULT NULL,
  lecturer_id INT          DEFAULT NULL,
  village     VARCHAR(150),
  district    VARCHAR(100),
  province    VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_curr_student
    FOREIGN KEY (student_id)  REFERENCES students  (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_curr_lecturer
    FOREIGN KEY (lecturer_id) REFERENCES lecturers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_curr_insert
BEFORE INSERT ON current_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'current_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$

CREATE TRIGGER trg_curr_update
BEFORE UPDATE ON current_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'current_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$
DELIMITER ;
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'permanent_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$

CREATE TRIGGER trg_perm_update
BEFORE UPDATE ON permanent_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'permanent_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$
DELIMITER ;

-- ==============================
--  TABLE: current_addresses
-- ==============================
CREATE TABLE current_addresses (
  id          INT          NOT NULL AUTO_INCREMENT,
  student_id  INT          DEFAULT NULL,
  lecturer_id INT          DEFAULT NULL,
  village     VARCHAR(150),
  district    VARCHAR(100),
  province    VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_curr_student
    FOREIGN KEY (student_id)  REFERENCES students  (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_curr_lecturer
    FOREIGN KEY (lecturer_id) REFERENCES lecturers (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_curr_insert
BEFORE INSERT ON current_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'current_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$

CREATE TRIGGER trg_curr_update
BEFORE UPDATE ON current_addresses
FOR EACH ROW
BEGIN
  IF NOT (
    (NEW.student_id IS NOT NULL AND NEW.lecturer_id IS NULL) OR
    (NEW.student_id IS NULL     AND NEW.lecturer_id IS NOT NULL)
  ) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'current_addresses: ต้องระบุ student_id หรือ lecturer_id อย่างใดอย่างหนึ่งเท่านั้น';
  END IF;
END$$
DELIMITER ;