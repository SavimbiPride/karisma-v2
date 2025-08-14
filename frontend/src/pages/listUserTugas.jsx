import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaBackspace} from "react-icons/fa";

export default function ListUserSesi() {
  const { sesiId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
  console.log("sesiId:", sesiId); 
    if (sesiId) {
        axios.get(`http://localhost:5000/api/userbysesi/${sesiId}`)
        .then((res) => {
            setUsers(res.data);
        })
        .catch((err) => {
            console.error("Gagal fetch user:", err);
        });
    }
    }, [sesiId]);

  return (
    <div className="p-4 min-h-screen bg-[#000045] text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tugas User</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded cursor-pointer flex items-center"
        >
          <FaBackspace className="mr-2" /> Kembali
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white text-black">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border text-center">{user.username}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() =>
                      navigate(`/tugasnya/${sesiId}/${user.id}`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Detail Tugas
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  user belum mengumpulkan tugas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
