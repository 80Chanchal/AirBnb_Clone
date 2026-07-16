import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/services'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await userService.updateProfile({ firstName, lastName, bio, phone })
      updateUser(res)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const loadingToast = toast.loading('Uploading avatar...')
    try {
      const res = await userService.uploadAvatar(formData)
      updateUser(res)
      toast.dismiss(loadingToast)
      toast.success('Avatar uploaded successfully!')
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Avatar upload failed')
    }
  }

  return (
    <div className="section py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Profile Details</h1>
        <p className="text-sm text-brand-gray dark:text-dark-muted mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column avatar */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="card p-6 w-full text-center space-y-4 border border-brand-border dark:border-dark-border">
            <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center overflow-hidden mx-auto text-white font-bold text-3xl">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.firstName?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-brand-gray capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <label className="btn-secondary text-xs py-2 px-4 cursor-pointer block text-center">
              <span>Change Photo</span>
              <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        {/* Right column forms */}
        <div className="md:col-span-2">
          <div className="card p-8 border border-brand-border dark:border-dark-border">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="input-label">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary py-3 px-6">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
