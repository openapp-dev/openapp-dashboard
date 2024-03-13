import { useState } from "react";
import { Button, Divider, Drawer, Menu, Navbar } from "react-daisyui";
import {
  MdApps,
  MdAutoAwesomeMosaic,
  MdAutoAwesomeMotion,
  MdCloud,
  MdMenu,
  MdSettings,
} from "react-icons/md";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

function OpenAppMenu() {
  return (
    <Menu>
      <Menu.Title>Home</Menu.Title>
      <Menu.Item>
        <Link to="/instance/app">
          <MdAutoAwesomeMotion className="w-6 h-6" />
          APP
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a>
          <MdCloud className="w-6 h-6" />
          Public Service
        </a>
      </Menu.Item>

      <Divider />
      <Menu.Title>Store</Menu.Title>
      <Menu.Item>
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
      <Menu.Title>Setting</Menu.Title>
      <Menu.Item>
        <a>
          <MdSettings className="w-6 h-6" />
          Admin Setting
        </a>
      </Menu.Item>
    </Menu>
  );
}

export default function Layout() {
  const [visible, setVisible] = useState(false);
  function toggleVisible() {
    setVisible(!visible);
  }

  return (
    <Drawer
      open={visible}
      onClickOverlay={toggleVisible}
      side={
        <div className="bg-base-200 text-base-content h-screen w-1/5 min-w-56">
          <OpenAppMenu />
        </div>
      }
    >
      <div className="flex flex-col h-screen">
        <Navbar>
          <div className="flex-none xl:hidden block">
            <Button shape="square" color="ghost" onClick={toggleVisible}>
              <MdMenu className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex-1">
            <Button tag="a" color="ghost" className="normal-case text-xl">
              OpenAPP
            </Button>
          </div>
          <div className="flex-none"></div>
        </Navbar>
        <div className="flex flex-grow">
          <div className="w-1/5 min-w-56 xl:block hidden border-r border-gray-300">
            <OpenAppMenu />
          </div>
          <div className="w-full rounded-t-xl overflow-y-scroll overflow-x-hidden px-4">
            <Outlet />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
