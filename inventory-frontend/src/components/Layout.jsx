import { useState } from "react";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:block"
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}