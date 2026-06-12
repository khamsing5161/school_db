import { useState, useEffect } from "react";

// const LINKS = [
//   {
//     label: "ນັກສຶກສາ",
//     path: "/students",
//     icon: "🎓",
//   },

// ];

export default function Navbar({
  current,
  onChange,
}) {
  const [open, setOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <>
      <nav style={styles.nav}>
        {/* LEFT */}
        <div style={styles.left}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>
              📚
            </div>

            <div>
              <div
                style={
                  styles.logoTitle
                }
              >
                ລະບົບຂໍ້ມູນ
              </div>

              <div
                style={styles.logoSub}
              >
                ວິທະຍາໄລ ເຕັກນິກ ວິຊາຊີບ ມິດຕະພາບ ວຽງຈັນ-ຮ່າໂນ້ຍ
              </div>
            </div>
          </div>

          {/* desktop menu */}
          {!isMobile && (
            <div style={styles.links}>
              <a
                href="/sauanum"
                style={
                  styles.topLink
                }
              >
                ຊາວໝຸ່ມ
              </a>

              <a
                href="/women"
                style={
                  styles.topLink
                }
              >
                ແມ່ຍິງ
              </a>

              <a
                href="/kammaban"
                style={
                  styles.topLink
                }
              >
                ກຳມະບານ
              </a>
            </div>
          )}
        </div>

        

        {/* MOBILE BURGER */}
        {isMobile && (
          <button
            style={styles.burger}
            onClick={() =>
              setOpen((o) => !o)
            }
          >
            {open ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {/* MOBILE MENU */}
      {isMobile && open && (
        <div style={styles.mobileMenu}>
          <div
            style={styles.mobileTop}
          >
            <a
              href="/sauanum"
              style={
                styles.mobileTopLink
              }
            >
              ຊາວໝຸ່ມ

            </a>

            <a
              href="/women"
              style={
                styles.mobileTopLink
              }
            >
              ແມ່ຍິງ
            </a>

            <a
              href="/kammaban"
              style={
                styles.mobileTopLink
              }
            >
              ກຳມະບານ
            </a>
          </div>

          <div
            style={
              styles.mobileDivider
            }
          />

          

          
        </div>
      )}
    </>
  );
}

const C = {
  bg: "#0b1020",
  bg2: "#111827",
  border: "#263248",
  accent: "#6366f1",
  accent2: "#8b5cf6",
  text: "#e5e7eb",
  muted: "#94a3b8",
};

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 999,

    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",

    gap: 20,

    padding: "14px 20px",

    background:
      "rgba(11,16,32,.78)",

    backdropFilter:
      "blur(18px)",

    borderBottom:
      "1px solid rgba(255,255,255,.05)",

    boxSizing: "border-box",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logoIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: 22,

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    boxShadow:
      "0 10px 25px rgba(99,102,241,.35)",
  },

  logoTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: C.text,
    lineHeight: 1.2,
  },

  logoSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  topLink: {
    textDecoration: "none",
    color: C.muted,

    padding: "10px 12px",

    borderRadius: 10,

    fontSize: 14,
    fontWeight: 600,

    transition: ".2s",
  },

  navMenu: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: 8,

    padding: "10px 14px",

    borderRadius: 14,

    border:
      "1px solid rgba(255,255,255,.05)",

    background:
      "rgba(255,255,255,.03)",

    color: C.muted,

    fontSize: 14,
    fontWeight: 600,

    cursor: "pointer",

    transition: ".2s",
  },

  linkActive: {
    color: "#fff",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    boxShadow:
      "0 8px 20px rgba(99,102,241,.35)",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 10,

    paddingLeft: 14,
    borderLeft:
      "1px solid rgba(255,255,255,.06)",
  },

  avatar: {
    width: 42,
    height: 42,

    borderRadius: "50%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background:
      "linear-gradient(135deg,#0ea5e9,#6366f1)",

    color: "#fff",
    fontWeight: 800,
  },

  profileName: {
    color: C.text,
    fontWeight: 700,
    fontSize: 14,
  },

  profileRole: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },

  burger: {
    width: 46,
    height: 46,

    borderRadius: 14,

    border:
      "1px solid rgba(255,255,255,.05)",

    background:
      "rgba(255,255,255,.04)",

    color: "#fff",

    fontSize: 22,

    cursor: "pointer",
  },

  mobileMenu: {
    padding: 16,

    background:
      "rgba(11,16,32,.95)",

    backdropFilter:
      "blur(18px)",

    borderBottom:
      "1px solid rgba(255,255,255,.05)",

    display: "grid",
    gap: 10,
  },

  mobileTop: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  mobileTopLink: {
    textDecoration: "none",

    color: C.muted,

    padding: "10px 12px",

    borderRadius: 10,

    background:
      "rgba(255,255,255,.03)",

    fontSize: 14,
    fontWeight: 600,
  },

  mobileDivider: {
    height: 1,
    background:
      "rgba(255,255,255,.06)",
    margin: "4px 0",
  },

  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,

    padding: "14px 16px",

    borderRadius: 16,

    border:
      "1px solid rgba(255,255,255,.05)",

    background:
      "rgba(255,255,255,.03)",

    color: C.muted,

    fontSize: 15,
    fontWeight: 700,

    cursor: "pointer",

    textAlign: "left",
  },

  mobileLinkActive: {
    color: "#fff",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },

  mobileProfile: {
    marginTop: 8,

    display: "flex",
    alignItems: "center",
    gap: 12,

    padding: 14,

    borderRadius: 18,

    background:
      "rgba(255,255,255,.03)",

    border:
      "1px solid rgba(255,255,255,.05)",
  },
};