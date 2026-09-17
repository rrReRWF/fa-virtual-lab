import { Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Equipment from './pages/Equipment'
import Research from './pages/Research'
import EconTools from './pages/EconTools'
import SAMInvestment from './pages/SAMInvestmentAnalysis'
import Publications from './pages/Publications'
import VendorFinancials from './pages/VendorFinancials'
import FactorLookup from './pages/FactorLookup'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/research" element={<Research />} />
          <Route path="/econ-tools" element={<EconTools />} />
          <Route path="/sam-investment" element={<SAMInvestment />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/vendor-financials" element={<VendorFinancials />} />
          <Route path="/factor-lookup" element={<FactorLookup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
