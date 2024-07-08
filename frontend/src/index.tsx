import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ProductsList from './components/ProductsList'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
    <ProductsList />
  </React.StrictMode>,
)
