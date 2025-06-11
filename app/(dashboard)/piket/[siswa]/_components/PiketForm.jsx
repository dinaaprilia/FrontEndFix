'use client';

import { useEffect, useState } from 'react';

export default function AttendanceForm() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [kelas, setKelas] = useState('-');
  const [hari, setHari] = useState('-');
  const [mulai, setMulai] = useState('-');
  const [selesai, setSelesai] = useState('-');
  const [lastEdit, setLastEdit] = useState('-');

  const tanggalHariIni = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const getAccentColor = (status) => {
    switch (status.toLowerCase()) {
      case 'berkontribusi': return '#5CB338';
      case 'tidak berkontribusi': return '#FB4141';
      default: return '#000000';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // ✅ Ambil data user login
        const resUser = await fetch('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resultUser = await resUser.json();
        setUser(resultUser.user);
        setKelas(resultUser.user.kelas || '-');

        // ✅ Ambil data piket untuk kelas & tanggal hari ini
        const resPiket = await fetch(
          `http://localhost:8000/api/absensi-piket?kelas=${resultUser.user.kelas}&tanggal=${tanggalHariIni}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        const result = await resPiket.json();

        if (result.data) {
          setStudents(result.data);
          setHari(result.hari);
          setMulai(result.mulai);
          setSelesai(result.selesai);
          setLastEdit(new Date().toLocaleString('id-ID'));
        }
      } catch (error) {
        console.error('❌ Gagal ambil data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-5 border rounded-2xl shadow-md bg-white">
      {/* Informasi Kelas */}
      <div className="mb-4 ml-5 gap-4">
        <div className="flex"><strong className="w-28">Kelas</strong> <span>: {kelas}</span></div>
        <div className="flex"><strong className="w-28">Hari</strong> <span>: {hari}</span></div>
        <div className="flex"><strong className="w-28">Mulai</strong> <span>: {mulai}</span></div>
        <div className="flex"><strong className="w-28">Selesai</strong> <span>: {selesai}</span></div>
      </div>

      {/* Tabel Absensi */}
      <table className="w-full border-t border-gray-300 mt-6 text-center">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2">No</th>
            <th className="py-2">Nama</th>
            <th className="py-2">Berkontribusi</th>
            <th className="py-2">Tidak Berkontribusi</th>
            <th className="py-2">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-4 text-gray-500">Tidak ada data piket</td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.nisn || index} className="border-b border-gray-300">
                <td className="py-4">{index + 1}</td>
                <td className="py-4">{student.nama}</td>

                {['berkontribusi', 'tidak berkontribusi'].map((status) => (
                  <td key={status} className="py-4">
                    <input
                      type="radio"
                      name={`status-${student.nisn}`}
                      checked={student.status?.toLowerCase() === status}
                      disabled
                      style={{
                        accentColor:
                          student.status?.toLowerCase() === status
                            ? getAccentColor(status)
                            : '#ccc',
                        cursor: 'not-allowed',
                      }}
                    />
                  </td>
                ))}
                <td className="py-4">{student.waktu_absen || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Waktu Edit */}
      <div className="mt-6 text-sm text-gray-600 ml-2">
        <p><strong>Terakhir Diedit:</strong> {lastEdit}</p>
      </div>
    </div>
  );
}
