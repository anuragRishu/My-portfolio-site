
import React, { useState } from 'react';

const AdminLogin: React.FC<{ onLogin: (p: string) => void }> = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-serif mb-6">Admin Access</h2>
        <input 
          type="password" 
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 mb-6 outline-none focus:border-indigo-500" 
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <button 
          onClick={() => onLogin(pass)}
          className="w-full py-4 bg-indigo-600 font-bold rounded-xl"
        >
          Authenticate
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
