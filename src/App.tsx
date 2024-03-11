import { Route, Routes } from "react-router";
import Layout from "./page/Layout";
import AppTemplate from "./page/AppTemplate";
import AppTemplateDetail from "./page/AppTemplateDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Index</div>} />
        <Route path="/store/app" element={<AppTemplate />} />
        <Route path="/store/app/detail" element={<AppTemplateDetail />} />
        <Route
          path="/store/public-service"
          element={<div>Public Service</div>}
        />
      </Route>
    </Routes>
  );
}
