'use client';

import React from 'react';
import { Navbar as HeroNavbar, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Badge, Chip } from '@heroui/react';
import { BellIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar({ title, description = '' }: { title: string; description?: string }) {
  return (
    <HeroNavbar
      maxWidth="full"
      className="bg-white border-b border-gray-200 h-16"
      classNames={{
        wrapper: 'px-6',
      }}
    >
      {/* Left Content - Title and Breadcrumb */}
      <NavbarContent justify="start" className="flex-grow">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">{description}</div>
        </div>
      </NavbarContent>

      {/* Right Content - Notifications and User */}
      <NavbarContent justify="end" className="flex-shrink-0">
        {/* Current Time/Date */}
        <NavbarItem>
          <Chip variant="flat" className="bg-gray-100 text-gray-600 text-xs font-medium">
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Chip>
        </NavbarItem>

        {/* Notifications */}
        <NavbarItem>
          {/* <Button isIconOnly variant="light" className="text-gray-600 hover:bg-gray-100">
            <Badge content="3" size="sm" color="danger" placement="top-right">
              <BellIcon className="w-5 h-5" />
            </Badge>
          </Button> */}
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
