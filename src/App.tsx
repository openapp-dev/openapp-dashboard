import { Route, Routes } from "react-router";
import Layout from "./page/Layout";
import AppTemplateStore from "./page/AppTemplate";
import AppTemplateDetail from "./page/AppTemplateDetail";
import PublicServiceTmeplate from "./page/PublicServiceTemplate";
import PublicServiceTemplateDetail from "./page/PublicServiceTemplateDetail";
import AppInstancePage from "./page/AppInstance";
import SettingPage from "./page/Setting";
import PublicServiceInstancePage from "./page/PublicServiceInstance";
import AppInstanceDetail from "./page/AppInstanceDetail";
import Login from "./page/Login";
import { AuthProvider } from "./component/AuthProvider";
import PublicServiceInstanceDetail from "./page/PublicServiceInstanceDetail";
import AppInstanceEdit from "./page/AppInstanceEdit";

export default function App() {
  return (
    <AuthProvider>
        <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<AppInstancePage />} />
            <Route path="/instance/app" element={<AppInstancePage />} />
            <Route path="/instance/app/detail" element={<AppInstanceDetail />} />
            <Route path="/instance/app/edit" element={<AppInstanceEdit />} />
            <Route path="/instance/publicservice" element={<PublicServiceInstancePage />} />
            <Route path="/instance/publicservice/detail" element={<PublicServiceInstanceDetail />} />
            <Route path="/store/app" element={<AppTemplateStore />} />
            <Route path="/store/app/detail" element={<AppTemplateDetail />} />
            <Route path="/store/publicservice" element={<PublicServiceTmeplate />} />
            <Route path="/store/publicservice/detail" element={<PublicServiceTemplateDetail />} />
            <Route path="/setting" element={<SettingPage />} />
        </Route>
        <Route path="/login" element={<Login/>} />
        </Routes>
    </AuthProvider>
  );
}
