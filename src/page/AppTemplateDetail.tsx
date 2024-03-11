import { Button, Divider, Input } from "react-daisyui";
import { Link } from "react-router-dom";

export default function AppTemplateDetail() {
  return (
    <div className="flex flex-col">
      <div className="flex space-x-1">
        <span className="text-gray-500">
          <Link to="/store/app">APP Store</Link>
        </span>
        <span>/</span>
        <span className="font-bold">Detail</span>
      </div>
      <Divider />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex md:space-x-4 md:flex-row flex-col space-y-2">
          <div className="flex-none w-24 h-24 rounded-md p-2 border border-gray-300">
            <img
              src="https://temp.im/200x200"
              alt="app-template"
              className="w-full h-full"
            />
          </div>
          <div className="flex-1 flex-col space-y-4">
            <div className="text-2xl font-bold">模板名称</div>
            <div className="text-sm">模板描述</div>
          </div>
          <div className="flex-none">
            <Button className="w-full" color="primary">
              Install App
            </Button>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">基础配置</div>
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">AFFINE_ADMIN_EMAIL</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="AFFINE_ADMIN_EMAIL"
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">AFFINE_ADMIN_EMAIL</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="AFFINE_ADMIN_EMAIL"
              />
            </div>
            <div className="flex items-center flex-col sm:flex-row sm:space-x-4 space-y-2">
              <label className="sm:min-w-64">AFFINE_ADMIN_EMAIL</label>
              <Input
                className="sm:w-96 w-full"
                placeholder="AFFINE_ADMIN_EMAIL"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300">
          <div className="bg-base-300 px-4 py-2">README.md</div>
        </div>
      </div>
    </div>
  );
}
