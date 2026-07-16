import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/services'
import { FiUsers, FiHome, FiDollarSign, FiSlash, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const queryClient = useQueryClient()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats(),
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers({ page: 0, size: 50 }),
  })

  const banMutation = useMutation({
    mutationFn: (id) => adminService.banUser(id),
    onSuccess: () => {
      toast.success('User has been banned')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Action failed')
  })

  const unbanMutation = useMutation({
    mutationFn: (id) => adminService.unbanUser(id),
    onSuccess: () => {
      toast.success('User has been unbanned')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Action failed')
  })

  return (
    <div className="section py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Admin Panel</h1>
        <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">Platform management and analytics overview</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-brand-pink text-xl"><FiUsers /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">{stats?.totalUsers || 0}</h3>
            <p className="text-xs text-brand-gray">Registered Users</p>
          </div>
        </div>
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 text-xl"><FiHome /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">{stats?.totalProperties || 0}</h3>
            <p className="text-xs text-brand-gray">Total Properties</p>
          </div>
        </div>
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 text-xl"><FiCheck /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">{stats?.totalBookings || 0}</h3>
            <p className="text-xs text-brand-gray">Total Bookings</p>
          </div>
        </div>
        <div className="card p-6 border border-brand-border dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 text-xl"><FiDollarSign /></div>
          <div>
            <h3 className="text-2xl font-bold font-display">${stats?.totalRevenue || 0}</h3>
            <p className="text-xs text-brand-gray">Platform Revenue</p>
          </div>
        </div>
      </div>

      {/* Users management table */}
      <div className="card p-8 border border-brand-border dark:border-dark-border overflow-hidden">
        <h2 className="text-xl font-bold font-display mb-6">User Management</h2>
        {usersLoading ? (
          <p>Loading users list...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-brand-border dark:border-dark-border text-brand-gray font-semibold">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border dark:divide-dark-border">
                {usersData?.content?.map(user => (
                  <tr key={user.id} className="hover:bg-brand-light dark:hover:bg-dark-surface/50">
                    <td className="py-3.5 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="py-3.5 text-brand-gray dark:text-dark-muted">{user.email}</td>
                    <td className="py-3.5"><span className="badge bg-brand-light dark:bg-dark-surface font-mono text-[10px]">{user.role}</span></td>
                    <td className="py-3.5">
                      {user.isBanned ? (
                        <span className="badge-danger text-[10px] py-0.5 px-2">Banned</span>
                      ) : (
                        <span className="badge-success text-[10px] py-0.5 px-2">Active</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      {user.isBanned ? (
                        <button
                          onClick={() => unbanMutation.mutate(user.id)}
                          className="text-green-500 hover:text-green-700 text-xs font-semibold"
                        >
                          Unban User
                        </button>
                      ) : (
                        <button
                          onClick={() => banMutation.mutate(user.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Ban User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
