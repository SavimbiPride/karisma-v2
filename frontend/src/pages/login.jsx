import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NotifikasiCustom from "../components/NotifikasiCustom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const userData = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        foto: res.data.foto,
        token: res.data.token,
      };

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setNotif({
        show: true,
        message: "Login berhasil!",
        onConfirm: () => {
          setNotif({ show: false, message: "", onConfirm: null });

          if (res.data.role === "admin") {
            navigate("/dashboard");
          } else if (res.data.role === "mentor") {
            navigate("/dashboard_mentor");
          } else {
            navigate("/home");
          }
        },
      });
    } catch (err) {
      setNotif({
        show: true,
        message: "Email atau password salah!",
        onConfirm: () => setNotif({ ...notif, show: false }),
      });
    }
  };

  return (
    <>
      {notif.show && (
        <NotifikasiCustom
          message={notif.message}
          singleButton={true}
          buttonLabel="OK"
          onConfirm={notif.onConfirm}
        />
      )}

      <div className="flex h-screen w-screen font-sans relative">
        <div className="absolute top-6 left-6 z-10">
          <img
            onClick={() => navigate("/")}
            src="/Logo Karisma Academy.png"
            alt="Logo"
            className="h-12 w-auto cursor-pointer"
          />
        </div>

        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center h-screen">
          <h1 className="text-5xl font-bold text-[#0A0A57] mb-8 text-center">
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2"
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm">
                Email
              </label>
            </div>

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="text-black peer w-full border-2 border-[#0A0A57] rounded-xl px-4 pt-6 pb-2 pr-10"
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm">
                Password
              </label>

              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A0A57] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>

            <div className="text-left mt-1">
              <a
                href="https://wa.me/6282143846141?text=halo%20mas%20saya%20blablablabla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Lupa password?
              </a>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#0A0A57] text-white font-semibold px-6 py-2 rounded-lg cursor-pointer"
              >
                <strong>Log In</strong>
              </button>
            </div>
          </form>

          <div className="mt-4 text-lg text-center">
            <span className="font-bold text-[#0A0A57]">Belum punya akun? </span>
            <Link to="/register" className="text-[#0A0A57] underline">
              Buat akun sekarang
            </Link>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-[#0A0A57] text-white items-center justify-center flex-col px-6">
          <img
            src="/Logo Karisma 2.png"
            alt="Karisma Logo"
            className="w-[550px] h-auto object-contain mb-4"
          />
        </div>
      </div>
    </>
  );
}