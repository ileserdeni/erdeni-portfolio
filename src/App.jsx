import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ScrollManager from './components/layout/ScrollManager';
import { getWork } from './content/work';
import About from './pages/About';
import AllWork from './pages/AllWork';
import Drawings from './pages/Drawings';
import Experience from './pages/Experience';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Piano from './pages/Piano';
import Projects from './pages/Projects';
import Research from './pages/Research';
import WorkDetail from './pages/WorkDetail';

function WorkRoute({ section }) {
  const { slug } = useParams();
  const entry = getWork(slug);
  if (!entry) return <NotFound />;
  // Older links used /projects/<slug> for research too.
  if (entry.section !== section) return <Navigate to={`/${entry.section}/${slug}`} replace />;
  return <WorkDetail entry={entry} />;
}

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:slug" element={<WorkRoute section="research" />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<WorkRoute section="projects" />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/drawings" element={<Drawings />} />
          <Route path="/piano" element={<Piano />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<AllWork />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
