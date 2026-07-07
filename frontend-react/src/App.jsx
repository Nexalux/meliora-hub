import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RoadmapDetails from "./pages/RoadmapDetails";
import Path from "./pages/Path";
import SkillGraph from "./pages/SkillGraph";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          
          <Route path="/graph/:slug" element={<SkillGraph />} />
          <Route path="/path/:slug" element={<Path />} />
          <Route path="/" element={<Home />} />
          <Route path="/roadmap/:id" element={<RoadmapDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;