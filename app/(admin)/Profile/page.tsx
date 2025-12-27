/**
 * Admin Profile Page
 *
 * Halaman profil admin untuk melihat dan mengedit data personal admin.
 *
 * Features:
 * - Tampilan profil lengkap (name, email, phone)
 * - Modal edit profil dengan validation
 * - Modal ubah password dengan konfirmasi
 * - Real-time success/error feedback
 * - Loading states untuk semua operasi
 * - Session management dan redirect jika unauthorized
 *
 * State Management:
 * - profileData: Data profil admin dari API
 * - profileForm: Form state untuk edit profil
 * - passwordForm: Form state untuk ubah password
 * - loading states untuk setiap operasi
 * - messages untuk feedback success/error
 *
 * Modals:
 * - Edit Profile Modal: Update name, email, phone
 * - Change Password Modal: Update password dengan validasi
 *
 * Flow:
 * 1. Fetch data profil dari /api/admin/profile
 * 2. Tampilkan data dalam cards
 * 3. Edit profil -> submit ke API -> update UI
 * 4. Ubah password -> validasi -> submit -> feedback
 */

'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner, Chip, Divider } from '@heroui/react';
import { PencilIcon, KeyIcon, UserIcon, EnvelopeIcon, AtSymbolIcon } from '@heroicons/react/24/outline';

interface ProfileData {
  phone?: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Modal controls
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onOpenChange: onPasswordOpenChange } = useDisclosure();

  // Success/Error messages
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    pastPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/profile');
        const data = await response.json();

        if (data.success) {
          setProfileData(data.data);
          setProfileForm({
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setEditMessage(null);

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (data.success) {
        setEditMessage({ type: 'success', text: data.message || 'Profile updated successfully' });
        setProfileData(data.data);
        setTimeout(() => {
          onEditOpenChange();
          setEditMessage(null);
        }, 1500);
      } else {
        setEditMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setEditMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match' });
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/profile/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({ type: 'success', text: 'Password reset successfully. Redirecting to login...' });
        setPasswordForm({
          pastPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to reset password' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred while resetting password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile Guru">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile Guru">
      <div className="space-y-6">
        {/* Profile Info Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-semibold">Informasi Profile</p>
              <p className="text-sm text-gray-500">Kelola informasi pribadi Anda</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-6">
            {profileData ? (
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                      <p className="text-lg font-medium">{profileData.name}</p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Email */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <Chip color="success" variant="flat" size="sm">
                    Verified
                  </Chip>
                </div>

                <Divider />

                {/* Phone */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <AtSymbolIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">No. Telepon</p>
                      <p className="text-lg font-medium">{profileData.phone || 'Belum diisi'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    color="primary"
                    startContent={<PencilIcon className="w-4 h-4" />}
                    onPress={() => {
                      setEditMessage(null);
                      onEditOpen();
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    color="secondary"
                    variant="bordered"
                    startContent={<KeyIcon className="w-4 h-4" />}
                    onPress={() => {
                      setPasswordMessage(null);
                      onPasswordOpen();
                    }}
                  >
                    Ubah Password
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Gagal memuat data profile</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
                <form onSubmit={handleProfileSubmit}>
                  <ModalBody>
                    {editMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          editMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {editMessage.text}
                      </div>
                    )}

                    <Input
                      autoFocus
                      label="Nama Lengkap"
                      placeholder="Masukkan nama lengkap"
                      variant="bordered"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      isRequired
                      minLength={3}
                      maxLength={30}
                    />

                    <Input
                      label="Email"
                      placeholder="Masukkan email"
                      type="email"
                      variant="bordered"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      isRequired
                    />

                    <Input
                      label="No. Telepon"
                      placeholder="Masukkan nomor telepon"
                      type="tel"
                      variant="bordered"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      minLength={10}
                      maxLength={15}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Batal
                    </Button>
                    <Button color="primary" type="submit" isLoading={updateLoading}>
                      Simpan Perubahan
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Reset Password Modal */}
        <Modal isOpen={isPasswordOpen} onOpenChange={onPasswordOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Ubah Password</ModalHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <ModalBody>
                    {passwordMessage && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          passwordMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {passwordMessage.text}
                      </div>
                    )}

                    <Input
                      autoFocus
                      label="Password Lama"
                      placeholder="Masukkan password lama"
                      type="password"
                      variant="bordered"
                      value={passwordForm.pastPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, pastPassword: e.target.value })}
                      isRequired
                      minLength={6}
                      maxLength={100}
                    />

                    <Input
                      label="Password Baru"
                      placeholder="Masukkan password baru"
                      type="password"
                      variant="bordered"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      isRequired
                      minLength={6}
                      maxLength={100}
                    />

                    <Input
                      label="Konfirmasi Password Baru"
                      placeholder="Konfirmasi password baru"
                      type="password"
                      variant="bordered"
                      value={passwordForm.confirmNewPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                      isRequired
                      minLength={6}
                      maxLength={100}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Batal
                    </Button>
                    <Button color="primary" type="submit" isLoading={passwordLoading}>
                      Ubah Password
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
