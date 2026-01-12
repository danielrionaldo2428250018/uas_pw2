import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

export default function Dashboard() {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    setHeroImage(`https://picsum.photos/1600/500?random=${Date.now()}`);
  }, []);

  return (
    <div className="d-flex dashboard-wrapper">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        {/* ===== MAIN ===== */}
        <main className="dashboard-main">
          <section
            className="hero-section"
            style={{
              backgroundImage: heroImage
                ? `url(${heroImage})`
                : "none",
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content text-center text-white">
              <h1 className="fw-bold display-5">Selamat Datang!</h1>
              <p className="fs-5">
                Ini adalah contoh tampilan dashboard Sistem Informasi Toko Sembako
              </p>
            </div>
          </section>

          <section className="about-section text-center">
            <h4 className="fw-bold mb-3">Tentang Website Ini</h4>
            <p className="text-muted">
              Website ini dibuat menggunakan React dan Node.js untuk membantu
              pengelolaan toko sembako secara terintegrasi.
            </p>
          </section>
        </main>

        {/* ===== FOOTER ===== */}
        <footer className="dashboard-footer">
          © 2025 Sistem Informasi Toko Sembako
        </footer>
      </div>
    </div>
  );
}
