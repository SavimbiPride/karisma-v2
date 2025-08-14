import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/halaman_utama";
import Login from "./pages/login";
import Register from "./pages/register";
import HomePage from "./pages/halaman_utama_login";
import DaftarKelas from "./pages/daftar_kelas";
import DetailKelasBeli from "./pages/detail_kelas_beli";
import AdminDashboard from "./pages/dashboard_admin";
import ListAdmin from "./pages/list_admin";
// import TambahAdmin from './pages/tambah_admin';
import EditAdmin from "./pages/EditAdmin";
import ListUser from "./pages/list_user";
import ListKelas from "./pages/list_kelas";
import TambahKelas from "./pages/tambah_kelas";
import EditKelas from "./pages/edit_kelas";
import DetailKelas from "./pages/detail_kelas";
import EditProfile from "./pages/EditProfile";
import ListMentor from "./pages/list_mentor";
import TambahMentor from "./pages/tambah_mentor";
import EditMentor from "./pages/EditMentor";
import DashboardMentor from "./pages/dashboard_mentor";
import ProfileMentor from "./pages/profile_mentor";
import PembelianKelas from "./pages/pembelianKelas";
import KelasSaya from "./pages/kelas_saya";
import HalamanKelas from "./pages/halaman_kelas";
import TugasUser from "./pages/tugasUser";
import EditTugas from "./pages/edit_tugas";
import SesiTugas from "./pages/sesiTugas";
import ListUserTugas from "./pages/listUserTugas";
import PersesiTugas from "./pages/tugasnya";
import ListTools from "./pages/list_tools";
import TambahTools from "./pages/tambah_tools";
import EditTools from "./pages/edit_tools";
import TambahSesi from "./pages/tambah_sesi";
import ListSesi from "./pages/list_sesi";
import EditSesi from "./pages/editSesi";
import EditUser from "./pages/EditUser";
import Tentang from "./pages/tentang";
import Komentar from "./pages/komentar";
// Components
import Navbar from "./components/navbar";

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/dashboard",
    "/list_user",
    "/EditProfile",
    // '/tambah_admin',
    "/list_kelas",
    "/list_admin",
    "/list_mentor",
    "/list_tools",
    "/tambah_kelas",
    "/tambah_mentor",
    "/EditMentor",
    "/daftar_kelas",
    "/dashboard_mentor",
    "/profile_mentor",
    "/kelas_saya",
    "/tambah_tools",
  ];

  const hideNavbarDynamicPaths = [
    "/EditAdmin/:id",
    "/EditMentor/:id",
    "/EditUser/:id",
    "/edit_tools/:id",
    "/edit_kelas/:id",
    "/detail_kelas/:id",
    "/detail_kelas_beli/:id",
    "/pembelianKelas/:id",
    "/kelas_saya/:id",
    "/halaman_kelas/:id",
    "/list_sesi/:id",
    "/tambah_sesi/:id",
    "/edit_sesi/:id/:sesiId",
    "/tugasUser/:id_user/:id_sesi",
    "/edit_tugas/:id_user/:id_sesi",
    "/sesiTugas/:id_kelas",
    "/sesiTugas/:sesiId/listUserTugas",
    "/tugasnya/:id_sesi/:id_user",
    "/komentar/:idKelas",
  ];

  const hideStatic = hideNavbarPaths.includes(location.pathname);
  const hideDynamic = hideNavbarDynamicPaths.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  const hideNavbar = hideStatic || hideDynamic;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* user */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/daftar_kelas" element={<DaftarKelas />} />
        <Route path="/detail_kelas_beli/:id" element={<DetailKelasBeli />} />
        <Route path="/pembelianKelas/:id" element={<PembelianKelas />} />
        <Route path="/kelas_saya" element={<KelasSaya />} />
        <Route path="/halaman_kelas/:id" element={<HalamanKelas />} />
        <Route path="/tugasUser/:id_user/:id_sesi" element={<TugasUser />} />
        <Route path="/edit_tugas/:id_user/:id_sesi" element={<EditTugas />} />
        <Route path="/tentang" element={<Tentang />} />

        {/* admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/list_admin" element={<ListAdmin />} />
        <Route path="/EditAdmin/:id" element={<EditAdmin />} />
        <Route path="/list_user" element={<ListUser />} />
        <Route path="/EditUser/:id" element={<EditUser />} />
        <Route path="/list_mentor" element={<ListMentor />} />
        <Route path="/tambah_mentor" element={<TambahMentor />} />
        <Route path="/EditMentor/:id" element={<EditMentor />} />
        <Route path="/list_kelas" element={<ListKelas />} />
        <Route path="/komentar/:idKelas" element={<Komentar />} />
        <Route path="/tambah_kelas" element={<TambahKelas />} />
        <Route path="/list_sesi/:id" element={<ListSesi />} />
        <Route path="/tambah_sesi/:id" element={<TambahSesi />} />
        <Route path="/edit_sesi/:id/:sesiId" element={<EditSesi />} />
        <Route path="/edit_kelas/:id" element={<EditKelas />} />
        <Route path="/detail_kelas/:id" element={<DetailKelas />} />
        <Route path="/list_tools" element={<ListTools />} />
        <Route path="/tambah_tools" element={<TambahTools />} />
        <Route path="/edit_tools/:id" element={<EditTools />} />

        {/* mentor */}
        <Route path="/dashboard_mentor" element={<DashboardMentor />} />
        <Route path="/profile_mentor" element={<ProfileMentor />} />
        <Route path="/sesiTugas/:id_kelas" element={<SesiTugas />} />
        <Route
          path="/sesiTugas/:sesiId/listUserTugas"
          element={<ListUserTugas />}
        />
        <Route path="/tugasnya/:id_sesi/:id_user" element={<PersesiTugas />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;