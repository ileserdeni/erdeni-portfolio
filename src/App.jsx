import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToHash from './components/layout/ScrollToHash';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <ScrollToHash />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
