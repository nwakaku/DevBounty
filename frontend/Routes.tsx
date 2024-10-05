import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
// import { AssistantPage } from "./pages/assistant/page";
// import { ModulesPage } from "./pages/templates/page";
import Layout from "./layout";
import Home from "./pages/home/page";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
           <Route path="/home" element={<Home />} />
          {/*<Route path="/modules" element={<ModulesPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
