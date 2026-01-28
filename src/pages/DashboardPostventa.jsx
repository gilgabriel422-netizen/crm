import React, { useState } from 'react';
import './DashboardGold.css';

export default function DashboardPostventa() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [clientes, setClientes] = useState([]);

  if (!authed) {
    return (
      <div className="dashboard-gold-bg min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-black">Dashboard Postventa</h2>
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
      <h1 className="text-4xl font-bold mb-6 text-black">Panel de Postventa</h1>
      <div className="bg-white bg-opacity-80 rounded-lg shadow p-4">
        <h2 className="text-2xl font-bold mb-2 text-black">Clientes enviados a Postventa</h2>
        <ul>
          {clientes.map((c, i) => (
            <li key={i} className="border-b py-1">
              {c.cliente} - Motivo: {c.motivo} - Contacto: {c.contacto} - Contrato: {c.contrato}
            </li>
          ))}
        </ul>
      </div>
      {/* Lógica para recibir clientes desde Atención al Cliente se implementará en el siguiente paso */}
    </div>
  );
}
