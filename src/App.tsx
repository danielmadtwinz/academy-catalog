import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavHeader from './components/NavHeader'
import Dashboard from './pages/Dashboard'
import EpisodeDetail from './pages/EpisodeDetail'
import SoundLibrary from './pages/SoundLibrary'
import Characters from './pages/Characters'
import TableOfContents from './pages/TableOfContents'

export default function App() {
  return (
    <BrowserRouter>
      <NavHeader />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/episode/:id" element={<EpisodeDetail />} />
        <Route path="/sounds" element={<SoundLibrary />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/contents" element={<TableOfContents />} />
      </Routes>
    </BrowserRouter>
  )
}
