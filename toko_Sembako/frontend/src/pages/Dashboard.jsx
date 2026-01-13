import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { loading } = useAuth();

  const [summary, setSummary] = useState({
    total_produk: 0,
    total_customer: 0,
    total_transaksi: 0,
  });

  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    setHeroImage(`https://picsum.photos/1600/500?random=${Date.now()}`);
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Gagal load dashboard:", err);
    }
  };

  if (loading) {
    return <div className="p-5">Loading dashboard...</div>;
  }

  return (
    <div className="d-flex dashboard-wrapper">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <main className="dashboard-main p-4">

          {/* ===== SUMMARY ===== */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h6>Total Produk</h6>
                  <h2>{summary.total_produk}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h6>Total Customer</h6>
                  <h2>{summary.total_customer}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h6>Jumlah Transaksi</h6>
                  <h2>{summary.total_transaksi}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* ===== HERO ===== */}
          <section
            className="hero-section"
            style={{
              backgroundImage: heroImage ? `url(${heroImage})` : "none",
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content text-center text-white">
              <h1 className="fw-bold display-5">Selamat Datang!</h1>
              <p className="fs-5">
                Sistem Informasi Toko Sembako
              </p>
            </div>
          </section>

        </main>

        <footer className="dashboard-footer">
          © 2025 Sistem Informasi Toko Sembako
        </footer>
      </div>
    </div>
  );
}