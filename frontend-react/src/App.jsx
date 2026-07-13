import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import RoadmapDetails from "./pages/RoadmapDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap/:id" element={<RoadmapDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;