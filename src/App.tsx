import { Route, Routes } from "react-router";
import Layout from "./page/Layout";
import AppTemplateStore from "./page/AppTemplate";
import AppTemplateDetail from "./page/AppTemplateDetail";
import PublicServiceTmeplate from "./page/PublicServiceTemplate";
import PublicServiceTemplateDetail from "./page/PublicServiceTemplateDetail";
import AppInstancePage from "./page/AppInstance";
import SettingPage from "./page/Setting";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AppTemplateStore />} />
        <Route path="/instance/app" element={<AppInstancePage />} />
        <Route path="/instance/publicservice" element={<AppTemplateStore />} />
        <Route path="/store/app" element={<AppTemplateStore />} />
        <Route path="/store/app/detail" element={<AppTemplateDetail />} />
        <Route path="/store/publicservice" element={<PublicServiceTmeplate />} />
        <Route path="/store/publicservice/detail" element={<PublicServiceTemplateDetail />} />
        <Route path="/setting" element={<SettingPage />} />
      </Route>
    </Routes>
  );
}
