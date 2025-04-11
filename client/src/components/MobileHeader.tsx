interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="md:hidden bg-white border-b border-neutral-200 fixed top-0 inset-x-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-bold text-neutral-900 flex items-center">
          <svg className="w-8 h-8 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2.5L2 6v7.5L10 18l8-4.5V6L10 2.5zm0 12.5L4 12v-4l6 3.5L16 8v4l-6 3z"></path>
          </svg>
          AutoTube
        </h1>
        <button
          type="button"
          onClick={onMenuClick}
          className="text-neutral-700"
          aria-label="Toggle sidebar menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
