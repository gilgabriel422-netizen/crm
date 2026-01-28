import React, { useState } from 'react';
import './DashboardGold.css';

export default function DashboardAtencionCliente() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [requerimientos, setRequerimientos] = useState([]);
  const [postventa, setPostventa] = useState([]);
  const [showRequerimiento, setShowRequerimiento] = useState(false);
  const [showEnviarPostventa, setShowEnviarPostventa] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  if (!authed) {
    return (
      <div className="dashboard-gold-bg min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-black">Dashboard Atención al Cliente</h2>
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
      <h1 className="text-4xl font-bold mb-6 text-black">Panel de Atención al Cliente</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requerimientos */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-2 text-black">Requerimientos</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-700 text-black px-3 py-1 rounded mb-2" onClick={() => setShowRequerimiento(true)}>Nuevo Requerimiento</button>
          <ul>
            {requerimientos.map((r, i) => <li key={i} className="border-b py-1">{r.cliente} - {r.detalle}</li>)}
          </ul>
        </div>
        {/* Enviar a Postventa */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-2 text-black">Enviar a Postventa</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-700 text-black px-3 py-1 rounded mb-2" onClick={() => setShowEnviarPostventa(true)}>Enviar a Postventa</button>
          <ul>
            {postventa.map((p, i) => <li key={i} className="border-b py-1">{p.cliente} - {p.motivo}</li>)}
          </ul>
        </div>
      </div>
      {/* Modales para requerimientos y postventa */}
      {/* Se implementarán en el siguiente paso */}
    </div>
  );
}
