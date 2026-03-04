import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavHeader from './components/NavHeader'
import Dashboard from './pages/Dashboard'
import EpisodeDetail from './pages/EpisodeDetail'
import SoundLibrary from './pages/SoundLibrary'
import TableOfContents from './pages/TableOfContents'
import DirectorDashboard from './pages/DirectorDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/episode/:id" element={<EpisodeDetail />} />
        <Route path="/sounds" element={<SoundLibrary />} />
        <Route path="/characters" element={<Navigate to="/director" replace />} />
        <Route path="/contents" element={<TableOfContents />} />
        <Route path="/director" element={<DirectorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
