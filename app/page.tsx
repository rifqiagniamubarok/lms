'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
      <Button as={Link} href="/login" color="primary" className="">
        Login
      </Button>
    </div>
  );
}
