import { prisma } from '@/lib/db';
import AdminContentList from './AdminContentList';

export default async function AdminPage() {
  return <AdminContentList />;
}