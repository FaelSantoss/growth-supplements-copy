const HeaderLogin: React.FC = () => {
  return (
  <>
    <header className="bg-blue_primary flex items-center justify-around p-3">
      <div>
        <p className="text-white">Garantimos que você</p>
        <p className="text-white">fez a <strong>melhor escolha.</strong></p>
      </div>
      <a href="/" className="mx-32"><img src="/logo.png" alt="logo" /></a>
      <div>
      <div>
        <p className="text-white text-xs">
          <strong>1° LUGAR EBIT DIAMANTE AZUL 2024</strong>
        </p>
        <p className="text-white text-xs">Prêmio de melhor e-commerce do Brasil</p>
      </div>
      </div>
    </header>
  </>
  );
}

export default HeaderLogin;