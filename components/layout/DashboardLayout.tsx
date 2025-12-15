import React from 'react';
import Navbar from '../partial/Navbar';

export default function DashboardLayout({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={title} description={description} />
      <div className="p-6">{children}</div>
    </div>
  );
}
