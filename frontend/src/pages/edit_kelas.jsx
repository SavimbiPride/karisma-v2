import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBackspace } from "react-icons/fa";
import NotifikasiCustom from "../components/NotifikasiCustom";
import Select from "react-select";

export default function EditKelas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    harga: "",
    image: "",
    id_users: "",
  });

  const [mentorList, setMentorList] = useState([]);
  const [tentangMentor, setTentangMentor] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewFotoPengajar, setPreviewFotoPengajar] = useState(null);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifGagal, setNotifGagal] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [listTools, setListTools] = useState([]);
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState("");

  const formatHarga = (angka) =>
    new Intl.NumberFormat("id-ID").format(Number(angka));
  const parseHarga = (stringHarga) => stringHarga.replace(/\D/g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kelasRes, mentorRes, toolsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/edit-kelas/${id}`),
          axios.get("http://localhost:5000/api/list-mentor"),
          axios.get("http://localhost:5000/api/list-tools"),
        ]);

        const kelas = kelasRes.data;
        const mentorData = mentorRes.data;
        const toolData = toolsRes.data;

        setMentorList(mentorData);
        setListTools(toolData);

        setForm({
          judul: kelas.judul,
          deskripsi: kelas.deskripsi,
          harga: formatHarga(kelas.harga),
          image: kelas.image,
          id_users: kelas.id_users,
          nama_pengajar: kelas.nama_pengajar,
        });

        setSelectedMentorId(kelas.id_users || "");
        setForm((form) => ({ ...form, id_users: kelas.id_users || "" }));

        setPreviewImage(`http://localhost:5000/uploads/${kelas.image}`);
        setSelectedToolIds((kelas.tools || []).map((t) => t.id.toString()));

        const selectedMentor = mentorData.find(
          (m) => m.username === kelas.nama_pengajar
        );
        if (selectedMentor) {
          setTentangMentor(selectedMentor.tentang);
          setPreviewFotoPengajar(
            `http://localhost:5000/uploads/${selectedMentor.foto}`
          );
        } else {
          setPreviewFotoPengajar(kelas.foto_pengajar_url);
        }

        if (kelas) {
          setSelectedMentorId(kelas.id_users || "");
        }
      } catch (err) {
        console.error("gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      if (name === "image") setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      if (name === "harga") {
        const raw = value.replace(/\D/g, "");
        setForm({ ...form, [name]: formatHarga(raw) });
      } else {
        setForm({ ...form, [name]: value });
      }
    }
  };

  const handleMentorChange = (e) => {
    const selectedUsername = e.target.value;
    const selectedMentor = mentorList.find(
      (m) => m.username === selectedUsername
    );
    setForm({
      ...form,
      nama_pengajar: selectedUsername,
      foto_pengajar: selectedMentor ? selectedMentor.foto : "",
    });
    setPreviewFotoPengajar(
      selectedMentor
        ? `http://localhost:5000/uploads/${selectedMentor.foto}`
        : null
    );
    setTentangMentor(selectedMentor ? selectedMentor.tentang : "");
  };

  const toolOptions = listTools.map((tool) => ({
    value: tool.id.toString(),
    label: tool.judul,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("judul", form.judul);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", parseHarga(form.harga));
    formData.append("id_users", selectedMentorId || form.id_users);

    if (form.image instanceof File) {
      formData.append("gambar_kelas", form.image);
    } else {
      formData.append("old_image", form.image);
    }

    formData.append("selectedToolIds", JSON.stringify(selectedToolIds));

    try {
      await axios.put(`http://localhost:5000/api/kelas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotifSuccess(true);
    } catch (err) {
      console.error("Gagal update:", err);
      setNotifMessage("Gagal memperbarui kelas");
      setNotifGagal(true);
    }
  };

  const handleOkSuccess = () => {
    setNotifSuccess(false);
    navigate("/list_kelas");
  };

  const handleOkGagal = () => setNotifGagal(false);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-[#0a0a57] p-8 overflow-auto text-black">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Kelas</h2>

          {notifSuccess && (
            <NotifikasiCustom
              message="Kelas berhasil diperbarui!"
              onConfirm={handleOkSuccess}
              singleButton
            />
          )}

          {notifGagal && (
            <NotifikasiCustom
              message={notifMessage}
              onConfirm={handleOkGagal}
              singleButton
            />
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div>
              <label>Judul Kelas</label>
              <input
                name="judul"
                value={form.judul}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label>Deskripsi</label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label>Harga</label>
              <input
                name="harga"
                value={form.harga}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label>Nama Pengajar</label>
              <Select
                options={mentorList.map((mentor) => ({
                  value: mentor.username,
                  label: mentor.username,
                  foto: mentor.foto,
                  tentang: mentor.tentang,
                }))}
                value={
                  form.nama_pengajar
                    ? {
                        value: form.nama_pengajar,
                        label: form.nama_pengajar,
                        foto: form.foto_pengajar,
                        tentang: tentangMentor,
                      }
                    : null
                }
                onChange={(selected) => {
                  if (selected) {
                    const selectedMentor = mentorList.find(
                      (m) => m.username === selected.value
                    );
                    setForm({
                      ...form,
                      nama_pengajar: selected.value,
                      foto_pengajar: selected.foto,
                      id_users: selectedMentor ? selectedMentor.id : "",
                    });
                    setSelectedMentorId(
                      selectedMentor ? selectedMentor.id : ""
                    );
                    setPreviewFotoPengajar(
                      `http://localhost:5000/uploads/${selected.foto}`
                    );
                    setTentangMentor(selected.tentang);
                  } else {
                    setForm({
                      ...form,
                      nama_pengajar: "",
                      foto_pengajar: "",
                      id_users: "",
                    });
                    setSelectedMentorId("");
                    setPreviewFotoPengajar(null);
                    setTentangMentor("");
                  }
                }}
                placeholder="Pilih Mentor"
                isClearable
                className="text-black border rounded"
              />

              {form?.nama_pengajar && (
                <div className="mt-4 flex items-start gap-4 bg-gray-50 p-4 rounded border shadow-sm">
                  <img
                    src={
                      previewFotoPengajar || "https://via.placeholder.com/80"
                    }
                    alt={form.nama_pengajar}
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-[#0A0A57]">
                      {form.nama_pengajar}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                      {tentangMentor?.trim() !== ""
                        ? tentangMentor
                        : "Mentor ini belum menambahkan tentang dia :3"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <label>Gambar Kelas</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="cursor-pointer border p-2 w-full rounded"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview Gambar Kelas"
                className="w-100 h-55 object-cover rounded border mt-2"
              />
            )}

            <div>
              <label className="block text-black font-medium mb-1">
                Pilih Tools
              </label>
              <Select
                isMulti
                name="tools"
                options={toolOptions}
                value={toolOptions.filter((option) =>
                  selectedToolIds.includes(option.value)
                )}
                onChange={(selected) => {
                  const selectedValues = selected.map((opt) => opt.value);
                  setSelectedToolIds(selectedValues);
                }}
                className="basic-multi-select border rounded"
                classNamePrefix="select"
              />
            </div>

            {selectedToolIds.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {listTools
                  .filter((tool) =>
                    selectedToolIds.includes(tool.id.toString())
                  )
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-start gap-3 p-3 border rounded shadow-sm bg-gray-50"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${tool.image}`}
                        alt={tool.judul}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-[#0a0a57] font-semibold">
                          {tool.judul}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {tool.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => navigate("/list_kelas")}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
              >
                <FaBackspace className="mr-2" /> Kembali
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}