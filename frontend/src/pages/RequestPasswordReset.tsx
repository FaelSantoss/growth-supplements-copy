import React, { useState } from 'react';
import HeaderLogin from '../components/HeaderLogin';

const RequestPasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showContainer, setShowContainer] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/users/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setShowContainer(true)
      }
      
    } catch (error) {
      console.error('Error requesting password reset:', error);
    }
  };

  return (
    <>
    <HeaderLogin />
    <div className="flex justify-center m-24">
    {!showContainer ? (
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-6 rounded-lg border-solid border-4 border-blue_primary shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Solicitar redefinição de senha</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar
            </button>
          </div>
        </form>
    ) : (
      <div 
      className="p-6 rounded-lg border-solid border-4 border-blue_primary shadow-lg  max-w-md">
          <p>Foi enviado um email de redefinição de senha para</p>
          <p className='text-center'><strong className='text-blue_primary'>{email}</strong>.</p>
      </div>
    )
  }
  </div>
    </>
  );
};

export default RequestPasswordResetPage;
