import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      login(res.data.token, res.data.user);

      navigate("/dashboard");
    } catch (err) {
      alert("Login gagal");
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card p-4" style={{ width: "320px" }}>
        <h4 className="text-center mb-3">LOGIN</h4>

        <input
          className="form-control mb-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={submit}>
          Login
        </button>
      </div>
    </div>
  );
}
