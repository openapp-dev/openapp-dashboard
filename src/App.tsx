import { Route, Routes } from "react-router";
import Layout from "./page/Layout";
import AppTemplateStore from "./page/AppTemplate";
import AppTemplateDetail from "./page/AppTemplateDetail";
import PublicServiceTmeplate from "./page/PublicServiceTemplate";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div>Index</div>} />
        <Route path="/store/app" element={<AppTemplateStore />} />
        <Route path="/store/app/detail" element={<AppTemplateDetail />} />
        <Route path="/store/publicservice" element={<PublicServiceTmeplate />} />
      </Route>
    </Routes>
  );
}
