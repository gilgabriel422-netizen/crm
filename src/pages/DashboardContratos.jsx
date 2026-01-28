import React, { useState } from 'react';
import './DashboardGold.css';

export default function DashboardContratos() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [contratos, setContratos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [showContrato, setShowContrato] = useState(false);
  const [showReserva, setShowReserva] = useState(false);

  if (!authed) {
    return (
      <div className="dashboard-gold-bg min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-black">Dashboard Contratos</h2>
        <input
          type="password"
          placeholder="Contraseña"
          className="p-2 border rounded mb-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-yellow-400 to-yellow-700 text-black px-4 py-2 rounded font-bold"
          onClick={() => setAuthed(password === 'innovetion')}
        >
          Entrar
        </button>
        {password && password !== 'innovetion' && <p className="text-red-600 mt-2">Contraseña incorrecta</p>}
      </div>
    );
  }

  return (
    <div className="dashboard-gold-bg min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6 text-black">Panel de Contratos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contratos */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-2 text-black">Contratos</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-700 text-black px-3 py-1 rounded mb-2" onClick={() => setShowContrato(true)}>Nuevo Contrato</button>
          <ul>
            {contratos.map((c, i) => <li key={i} className="border-b py-1">{c.nombre} {c.apellido} - ${c.valorVenta}</li>)}
          </ul>
        </div>
        {/* Reservas */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-2 text-black">Reservas</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-700 text-black px-3 py-1 rounded mb-2" onClick={() => setShowReserva(true)}>Nueva Reserva</button>
          <ul>
            {reservas.map((r, i) => <li key={i} className="border-b py-1">{r.ciudad} - {r.hotel} ({r.fechaIngreso} a {r.fechaSalida})</li>)}
          </ul>
        </div>
      </div>
      {/* Modales para contratos y reservas */}
      {/* Se implementarán en el siguiente paso */}
    </div>
  );
}
