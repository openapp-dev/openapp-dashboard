import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { Button, Divider, Drawer, Menu } from "react-daisyui";
import {
  MdApps,
  MdAutoAwesomeMosaic,
  MdAutoAwesomeMotion,
  MdCloud,
  MdMenu,
  MdSettings,
} from "react-icons/md";
import { BsGithub } from "react-icons/bs";
import { version } from "../api";
import { RequireAuth } from "../component/AuthProvider";

function OpenAppMenu() {
  return (
    <Menu className="mt-8">
      <Menu.Title className="text-xl">Home</Menu.Title>
      <Menu.Item className="mt-2">
        <Link to="/instance/app">
          <MdApps className="w-6 h-6" />
          APP
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/instance/publicservice">
          <MdCloud className="w-6 h-6" />
          Public Service
        </Link>
      </Menu.Item>

      <Divider />
      <Menu.Title className="text-xl">Store</Menu.Title>
      <Menu.Item className="mt-2">
        <Link to="/store/app">
          <MdAutoAwesomeMosaic className="w-6 h-6" />
          APP Store
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/store/publicservice">
          <MdAutoAwesomeMotion className="w-6 h-6" />
          Public Service Store
        </Link>
      </Menu.Item>
      <Divider />
      <Menu.Title className="text-xl">Setting</Menu.Title>
      <Menu.Item className="mt-2">
        <Link to="/setting">
          <MdSettings className="w-6 h-6" />
          OpenAPP Setting
        </Link>
      </Menu.Item>
    </Menu>
  );
}

export default function Layout() {
  const [visible, setVisible] = useState(false);
  const [openVersion, setOpenVersion] = useState("v0.1.0");

  useEffect(() => {
    async function fetchData() {
      const { success, message, data } = await version.getOpenAPPVersion();
      if (!success) {
        console.error(message);
        return;
      }
      setOpenVersion(data?.gitVersion ?? "v0.1.0");
    }
    fetchData();
  }, []);

  function toggleVisible() {
    setVisible(!visible);
  }

  return (
    <RequireAuth>
      <Drawer
        open={visible}
        onClickOverlay={toggleVisible}
        side={
          <div className="bg-base-200 text-base-content h-screen w-1/5 min-w-56">
            <OpenAppMenu />
          </div>
        }
      >
        <div className="flex flex-row h-screen">
          <div className="w-1/5 min-w-56 xl:flex hidden border-r border-gray-300 bg-sky-200 flex-col justify-between">
            <OpenAppMenu />
            <div className="flex flex-row items-center space-x-2 mb-4">
              <Button
                size="sm"
                className="ml-2"
                color="ghost"
                onClick={() => {
                  window.open("https://github.com/openapp-dev/openapp");
                }}
              >
                <BsGithub className="w-5 h-5" />
              </Button>
              <span className="text-xs ">Version: {openVersion}</span>
            </div>
          </div>
          <div className="w-full overflow-y-scroll overflow-x-hidden xl:px-4 px-2 flex flex-col">
            <div className="flex flex-row mt-2">
              <Button
                size="sm"
                color="ghost"
                shape="square"
                onClick={toggleVisible}
                className="xl:hidden"
              >
                <MdMenu className="w-6 h-6" />
              </Button>
            </div>
            <Outlet />
          </div>
        </div>
      </Drawer>
    </RequireAuth>
  );
}
