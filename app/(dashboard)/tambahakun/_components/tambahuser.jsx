'use client';

import React, { useState, useEffect } from "react";
import { FaUserPlus, FaDownload, FaTrash } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TambahAkunForm from "./InputManual";
import { IoMdCloseCircle } from "react-icons/io";
import ProfileDetail from "./DetailProfil";

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddAccountPopup, setShowAddAccountPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [students, setStudents] = useState([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/siswa')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data siswa');
        return res.json();
      })
      .then((data) => {
        setStudents(data.data || []);
      })
      .catch((err) => {
        console.error("Gagal fetch:", err);
      });
  }, []);

  const filteredUsers = students.filter((student) =>
    student.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType !== "xls" && fileType !== "xlsx") {
        alert("❌ Hanya file Excel (.xls, .xlsx) yang diperbolehkan!");
        return;
      }
      setFile(selectedFile);
      setShowPopup(true);
    }
  };

  const handleConfirmUpload = () => {
    alert("✅ File berhasil disiapkan untuk upload: " + file.name);
    setShowPopup(false);
  };

  const handleCloseAddAccountPopup = () => {
    setShowAddAccountPopup(false);
  };

  const handleOpenProfile = (user) => {
    setSelectedUser(user);
  };

  const handleCloseProfilePopup = () => {
    setSelectedUser(null);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleConfirmYes = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== userToDelete.id));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error("Gagal hapus:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }

    setShowConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-4 sm:mt-10 mt-8 bg-white rounded-xl shadow-md w-full">
      {/* ✅ Alert Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-green-700 px-6 py-3 rounded-lg shadow-lg border border-green-500">
            ✅ Akun berhasil dihapus
          </div>
        </div>
      )}

      {/* ❌ Alert Gagal */}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-red-700 px-6 py-3 rounded-lg shadow-lg border border-red-500">
            ❌ Gagal menghapus akun
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-auto"
        />
        <div className="flex gap-2">
          <input
            type="file"
            id="fileUpload"
            accept=".xls,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            variant="contained"
            color="primary"
            className="flex items-center gap-2 sm:rounded-xl rounded-full"
            onClick={() => setShowAddAccountPopup(true)}
          >
            <FaUserPlus size={16} />
          </Button>
          <Button
            variant="contained"
            color="success"
            className="flex items-center gap-2 sm:rounded-xl rounded-full"
          >
            <FaDownload size={16} />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">NISN</th>
              <th className="border border-gray-300 p-2">Nama</th>
              <th className="border border-gray-300 p-2">Kelas</th>
              <th className="border border-gray-300 p-2">Tanggal Lahir</th>
              <th className="border border-gray-300 p-2">Jenis Kelamin</th>
              <th className="border border-gray-300 p-2">Agama</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Password</th>
              <th className="border border-gray-300 p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((student, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{student.nisn}</td>
                <td className="border border-gray-300 p-2">
                  <a
                    href="#"
                    className="text-blue-500 underline hover:text-blue-700"
                    onClick={() => handleOpenProfile(student)}
                  >
                    {student.nama || "-"}
                  </a>
                </td>
                <td className="border border-gray-300 p-2">{student.kelas || "-"}</td>
                <td className="border border-gray-300 p-2">
                  {student.tanggal_lahir
                    ? new Date(student.tanggal_lahir).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2">{student.jenis_kelamin || "-"}</td>
                <td className="border border-gray-300 p-2">{student.agama || "-"}</td>
                <td className="border border-gray-300 p-2">{student.nomor_hp || "-"}</td>
                <td className="border border-gray-300 p-2">{student.email || "-"}</td>
                <td className="border border-gray-300 p-2">********</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteClick(student)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <ProfileDetail user={selectedUser} onClose={handleCloseProfilePopup} />
      )}

      {showAddAccountPopup && (
        <div className="fixed mt-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white h-auto p-6 rounded-2xl shadow-lg max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={handleCloseAddAccountPopup}
            >
              <IoMdCloseCircle className="h-8 w-8 text-red-800" />
            </button>
            <TambahAkunForm onClose={handleCloseAddAccountPopup} />
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-2 rounded-2xl shadow-lg max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <p className="text-center text-gray-700">
              Pastikan informasi sudah sesuai <br /> lanjutkan proses 'Submit'?
            </p>
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                style={{ backgroundColor: "#3f51b5", color: "white" }}
                onClick={handleConfirmUpload}
              >
                YA
              </Button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 text-center">
            <p className="mb-4 font-semibold text-gray-800">
              Anda yakin ingin menghapus akun ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmYes}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
