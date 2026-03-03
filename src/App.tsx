import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import EpisodeDetail from './pages/EpisodeDetail'
import SoundLibrary from './pages/SoundLibrary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/episode/:id" element={<EpisodeDetail />} />
        <Route path="/sounds" element={<SoundLibrary />} />
      </Routes>
    </BrowserRouter>
  )
}
