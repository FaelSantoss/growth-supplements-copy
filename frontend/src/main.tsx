import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ProductsList from './components/ProductsList.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ProductsList />
  </React.StrictMode>,
)
