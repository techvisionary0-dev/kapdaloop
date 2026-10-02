import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/context';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { GiveClothes } from './pages/GiveClothes';
import { Track } from './pages/Track';
import { Admin } from './pages/Admin';
import { Partner } from './pages/Partner';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/give" element={<GiveClothes />} />
            <Route path="/track" element={<Track />} />
            <Route path="/track/:code" element={<Track />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/partner" element={<Partner />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
