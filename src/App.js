import React from 'react';
import Home from './components/Home.js'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import './index.css'
import { PrimeReactProvider } from 'primereact/api';

function App() {
    const value =  {
        appendTo: 'self'
    }
    return (
        <React.StrictMode>
            <PrimeReactProvider value={value}>
                <Home/>
            </PrimeReactProvider>
        </React.StrictMode>
        
  )
}
export default App
