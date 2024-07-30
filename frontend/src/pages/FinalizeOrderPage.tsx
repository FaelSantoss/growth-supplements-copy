import HeaderLogin from "../components/HeaderLogin";
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import InputMask from 'react-input-mask';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

const FinalizeOrderPage: React.FC = () => {
  const { userLogged } = useAuth();
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [cep, setCep] = useState('Digite o CEP');
  const [isValid, setIsValid] = useState<boolean | 1>(1);
  const [cepData, setCepData] = useState<CepData | null>(null);
  const [numero, setNumero] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCep(value);
    validateCep(value);
  };

  const validateCep = (value: string) => {
    setIsValid(value.length === 9);
  };

  const handleFocus = () => {
    if (cep === 'Digite o CEP') {
      setCep('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(e.target.value);
  };

  useEffect(() => {
    const fetchCepData = async (cep: string) => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();
        setCepData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do CEP:', error);
      }
    };
    if (isValid) {
      fetchCepData(cep);
    } else {
      setCepData(null);
    }
  }, [cep, isValid]);

  useEffect(() => {
    const fetchAdress = async () => {
      try {
        const response = await fetch(`http://localhost:3001/address/${userLogged?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }})
        const data = await response.json();
        setAddress(data);
      } catch (error) {
        console.error('Erro ao buscar Address:', error);
      }
    };
      fetchAdress()
  }, [userLogged]);

  const openModal = () => setActiveModal(true);
  const closeModal = () => setActiveModal(false);

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    closeModal()

    fetch(`http://localhost:3001/address/${userLogged?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        road: cepData?.logradouro,
        number: numero,
        neighborhood: cepData?.bairro,
        city: cepData?.localidade,
        state: cepData?.uf,
        cep: cepData?.cep,
        complement: complement
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Register failed');
        }
      })
      .catch(error => console.error('Error during register:', error));
  };

  return (
    <>
      <HeaderLogin/>
      <div className="flex justify-center">
        <div className="mx-3.5 my-7 rounded-md border-2 border-blue_primary w-96 h-4/5">
          <h1 className="text-center bg-gray_30 text-red_700 font-semibold p-3">1. Identificação</h1>
          <div className="m-4">
            <h2 className="text-red_700 font-semibold">Dados pessoais</h2>
            <h3 className="text-xs">Nome Completo</h3>
            <h2>{userLogged?.name}</h2>
            <h3 className="mt-3 text-xs">E-mail</h3>
            <h2>{userLogged?.email}</h2>
            <hr className="mt-4 mb-10" />
            <h2 className="text-red_700 font-semibold mb-2"> Endereço para entrega </h2>
            {address.map((addr) => (
              <div key={addr.id} className={`mb-4 p-2 ${selectedAddress === addr.id ? 'bg-gray_30' : 'bg-white'}`}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={(e) => setSelectedAddress(addr.id)}
                    className="mr-2"
                  />
                  {addr.road}, {addr.number}, {addr.neighborhood}, {addr.city}, {addr.state}, {addr.cep}
                </label>
              </div>
            ))}
            {activeModal ? (
              <>
                <div className="flex justify-around">
                  <h2 className="text-red_700 font-semibold text-sm">Cadastrar novo endereço de entrega</h2>
                  <button onClick={closeModal}>
                    <a className="text-blue_primary text-sm underline">Cancelar</a>
                  </button>
                </div>
                <div>
                  <InputMask
                    mask="99999-999"
                    value={cep}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`border p-1  mt-4 ${isValid ? '' : 'border-yellow_600'}`}
                  />
                  {!isValid && <p className="text-yellow_600">CEP inválido</p>}
                  {cepData?.cep && (
                    <>        
                      <div className="bg-gray_30 p-4 my-4">
                        <p>{cepData.logradouro}, {cepData.bairro}, {cepData.localidade}, Cep {cepData.cep}</p>
                      </div>
                      <input 
                        type="text"  
                        placeholder="Numero" 
                        className="border p-1 mt-4 border-yellow_600 w-1/5"
                        value={numero} 
                        onChange={(e) => setNumero(e.target.value)} 
                      />
                      <input 
                        type="text"  
                        placeholder="Complemento" 
                        className="border p-1 mx-4 mt-4 w-1/2" 
                        value={complement} 
                        onChange={(e) => setComplement(e.target.value)} 
                      />
                      <button 
                        onClick={handleSubmit} 
                        className="bg-green_500 text-white font-semibold py-4 mt-4 w-full rounded-md">
                        Cadastrar Endereço
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>              
              <button className="w-full mb-4" onClick={openModal}>
                <h1 className="text-center text-sm text-blue_primary underline">Cadastrar um novo endereço de entrega</h1>
              </button>
              <h3 className="text-xs">Informamos que a sua encomenda poderá ficar aguardando retirada em uma agência mais próxima caso o seu 
                  endereço tenha restrição de entrega ou seja de difícil acesso.
              </h3>
              <button 
                className="bg-green_500 text-white font-semibold py-4 mt-4 w-full rounded-md">
                Ir para o pagamento
              </button>
              </>
            )}
          </div>
        </div>
        <div className="p-10 mx-3.5 my-7 rounded-md border-2 border-blue_primary w-96 h-4/5"></div>
        <div className="p-10 mx-3.5 my-7 rounded-md border-2 border-blue_primary w-96 h-4/5"></div>
      </div>
    </>
  );
};

export default FinalizeOrderPage;

