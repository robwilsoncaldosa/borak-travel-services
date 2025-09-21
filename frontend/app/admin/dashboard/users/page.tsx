
import { Suspense } from 'react';
import { getUsersServer } from '../lib/server-api';
import UsersClient from './components/users-client';

// Loading component
function UsersLoading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Server component for users content
async function UsersContent() {
  const users = await getUsersServer();
  return <UsersClient initialUsers={users} />;
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  );
}

// Update User type to match backend
export type User = {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  nationality: string;
  password?: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
};
