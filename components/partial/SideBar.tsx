'use client';

import React from 'react';
import { Image, Button, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, UserGroupIcon, DocumentTextIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Siswa',
    href: '/student',
    icon: UserGroupIcon,
  },
  {
    name: 'Bank Soal',
    href: '/quiz',
    icon: DocumentTextIcon,
  },
  {
    name: 'Profil',
    href: '/Profile',
    icon: Cog6ToothIcon,
  },
];

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Mathzy Logo" width={40} height={40} className="object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#0075e6]">Mathzy</h1>
            <p className="text-xs text-gray-500">Learning Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.name}
              variant={isActive ? 'flat' : 'light'}
              className={`w-full justify-start h-12 px-4 ${isActive ? 'bg-[#0075e6]/10 text-[#0075e6] border-r-3 border-[#0075e6]' : 'text-gray-600 hover:bg-gray-50'}`}
              startContent={<Icon className="w-5 h-5" />}
              onPress={() => router.push(item.href)}
            >
              <span className="font-medium">{item.name}</span>
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <Dropdown placement="top-start">
          <DropdownTrigger>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <User
                name={session?.user?.name || 'Admin'}
                description={session?.user?.email || 'admin@mathzy.com'}
                avatarProps={{
                  size: 'sm',
                  src: '',
                  fallback: (session?.user?.name?.[0] || 'A').toUpperCase(),
                  className: 'bg-[#0075e6] text-white',
                }}
                classNames={{
                  name: 'text-sm font-medium text-gray-900',
                  description: 'text-xs text-gray-500',
                }}
              />
              <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User actions">
            <DropdownItem key="profile" startContent={<Cog6ToothIcon className="w-4 h-4" />} onPress={() => router.push('/Profile')}>
              Pengaturan Profil
            </DropdownItem>
            <DropdownItem key="logout" color="danger" startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />} onPress={handleSignOut}>
              Keluar
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
