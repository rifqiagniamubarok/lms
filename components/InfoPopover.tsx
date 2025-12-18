import React from 'react';

export function InfoPopover({ description }: { description: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-block align-middle">
      <button
        type="button"
        aria-label="Info"
        className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-1"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-700 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-blue-700">Tentang Grafik</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div>{description}</div>
        </div>
      )}
    </span>
  );
}
