import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPhone, FiMail, FiClock, FiUser } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import LogoBackground from "./logoBackground";
import fullLogoImage from "../../public/Logo Karisma Academy.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("User");
  const [foto, setFoto] = useState("default-avatar.png");

  const loadProfileData = () => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (token && userData) {
      setIsLogin(true);
      setUsername(userData.username || "User");
      setFoto(userData.foto || "default-avatar.png");
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    loadProfileData();

    const handleProfileUpdated = () => {
      loadProfileData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/EditProfile");
  };

  return (
    <header className="w-full shadow-md sticky top-0 z-50 bg-[#1E1E6F]">
      <div className="bg-[#000045] text-white text-sm relative">
        <div className="mx-auto px-4 sm:px-6 lg:flex justify-between items-center py-2">
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 pl-53">
            <div className="flex items-center space-x-2">
              <FiPhone size={14} />
              <span>+62-123-4567-8910</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiMail size={14} />
              <span>Karisma@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiClock size={14} />
              <span>08:00 - 17:00</span>
            </div>
          </div>

          <div className="flex space-x-6 items-center">
            <div className="hidden sm:flex items-center space-x-3">
              <span>Follow Us:</span>
              <a
                href="https://www.facebook.com/karismaacademymalang"
                className="hover:text-yellow-400"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/karismaacademy/?hl=en"
                className="hover:text-yellow-400"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.youtube.com/@karismaacademy1016"
                className="hover:text-yellow-400"
              >
                <FaYoutube />
              </a>
              <a
                href="https://x.com/karismaacademy"
                className="hover:text-yellow-400"
              >
                <FaTwitter />
              </a>
            </div>

            {!isLogin ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-400 text-[#0A0A57] font-semibold px-4 py-1.5 rounded-md flex items-center space-x-2 hover:bg-yellow-500 text-xs sm:text-sm cursor-pointer"
              >
                <FiUser />
                <span>Login</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-blue-950 rounded-2xl p-1.5 pl-2 pr-3 text-white cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000/uploads/${foto}?t=${Date.now()}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="font-medium">{username}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-blue-950 border rounded-xl shadow-lg z-50">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white rounded-xl cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-600 rounded-xl cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="bg-[#1E1E6F] relative">
        <div className="absolute left-0 top-4 -translate-y-1/2 h-20 w-96 z-10 pb-5 pointer-events-none">
          <LogoBackground />
        </div>

        <div className="absolute left-0 top-5 -translate-y-1/2 h-13 w-full flex items-center pl-8 z-20 pointer-events-none">
          <img
            src={fullLogoImage}
            className="h-full object-contain"
            alt="Karisma Academy Logo"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-4.5">
          <div className="flex items-center space-x-10">
            <div className="w-20" aria-hidden="true"></div>
            <div className="hidden lg:flex items-center text-md space-x-10 tracking-wide text-white">
              <Link
                to={isLogin ? "/home" : "/"}
                className="hover:text-blue-300 font-medium"
              >
                Home
              </Link>
              <Link to="/tentang" className="hover:text-blue-300 font-medium">
                Tentang
              </Link>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=yahahaha@email.com&su=Judul&body=kenapa matahari tenggelam, karena gak bisa berenang"
                className="bg-[#FFC300] text-white font-normal px-4 py-1 rounded-md text-sm hover:bg-yellow-500 flex items-center space-x-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Contact Us</span>
                <MdNavigateNext size={16} />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}