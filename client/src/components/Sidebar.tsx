import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  onItemClick?: () => void;
}

export default function Sidebar({ onItemClick }: SidebarProps) {
  const [location] = useLocation();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
  });

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      name: "Topic Discovery",
      path: "/topics",
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
    },
    {
      name: "My Videos",
      path: "/videos",
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-neutral-200 h-full">
      <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-200">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center">
          <svg className="w-8 h-8 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2.5L2 6v7.5L10 18l8-4.5V6L10 2.5zm0 12.5L4 12v-4l6 3.5L16 8v4l-6 3z"></path>
          </svg>
          AutoTube
        </h1>
      </div>
      <div className="flex flex-col flex-grow px-4 pt-5 pb-4 overflow-y-auto scrollbar-hide">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onItemClick}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? "bg-secondary text-white"
                      : "text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto">
          <div className="bg-neutral-200 rounded-lg p-3 mt-6">
            <h3 className="text-sm font-medium text-neutral-900">Free Plan</h3>
            <div className="mt-1 flex items-center">
              <div className="w-full bg-neutral-300 rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
              <span className="text-xs ml-2 text-neutral-700">45%</span>
            </div>
            <p className="text-xs text-neutral-700 mt-2">3/5 videos used this month</p>
            <Link
              href="/settings"
              onClick={onItemClick}
              className="mt-2 text-xs font-medium text-secondary flex items-center"
            >
              Upgrade Plan
              <svg
                className="ml-1 w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
          <div className="flex items-center mt-4 px-2">
            <img
              className="h-8 w-8 rounded-full"
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
              alt="User avatar"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">{user?.username || "User"}</p>
              <p className="text-xs text-neutral-700">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
