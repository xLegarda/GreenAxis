import { getCurrentAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()
  
  if (!admin) {
    redirect('/portal-interno')
  }
  
  return <AdminLayout admin={admin}>{children}</AdminLayout>
}
