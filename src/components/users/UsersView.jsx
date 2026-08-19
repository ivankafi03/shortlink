import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search, 
  Check, 
  UserCheck, 
  Lock, 
  Unlock,
  Layers,
  Mail
} from 'lucide-react';
import { Header } from '../layout/Header';

export const UsersView = ({ 
  users = [], 
  links = [], 
  onSaveUser, 
  onDeleteUser, 
  onOpenCreateModal 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  // Hanya tampilkan Member nyata, kecualikan admin sistem
  const memberUsers = users.filter(u => 
    u.role !== 'admin' && 
    u.email?.toLowerCase() !== 'ivankafipradana@gmail.com' &&
    u.email?.toLowerCase() !== 'admin.cuan@gmail.com'
  );

  const filteredUsers = memberUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = name || (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));

    const newUser = {
      id: `user_${Date.now()}`,
      name: formattedName,
      email: email.trim().toLowerCase(),
      role: 'member',
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      createdAt: new Date().toISOString()
    };

    onSaveUser(newUser);
    setName('');
    setEmail('');
    setRole('member');
    setModalOpen(false);
  };

  const handleToggleStatus = (user) => {
    const updated = {
      ...user,
      status: user.status === 'active' ? 'suspended' : 'active'
    };
    onSaveUser(updated);
  };

  const getUserLinkCount = (userEmail) => {
    if (!userEmail) return 0;
    return links.filter(l => l.createdBy === userEmail || l.userEmail === userEmail).length;
  };

  return (
    <div>
      <Header 
        title="Data Member" 
        subtitle="Kelola akun member yang mendaftar di platform shortlink"
        onOpenCreateModal={onOpenCreateModal}
        onOpenSimulator={onOpenSimulator}
      />

      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Daftar Member ({filteredUsers.length})</h2>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} />
          <span>+ Tambah Member Manual</span>
        </button>
      </div>

      {/* User Table Container */}
      <div className="neu-panel" style={{ padding: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '380px', marginBottom: '1.25rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text"
            placeholder="Cari nama atau email member..."
            className="form-control"
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Desktop Table View */}
        <div className="desktop-table-view custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>EMAIL</th>
                <th>STATUS AKUN</th>
                <th>TOTAL TAUTAN</th>
                <th style={{ textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    Belum ada member terdaftar
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const linkCount = getUserLinkCount(user.email);
                  const isAdmin = user.role === 'admin';
                  const isActive = user.status === 'active';

                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                            alt={user.name} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} 
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                              {user.name}
                            </div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                          {user.email}
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.725rem', fontWeight: 800 }}>
                          {isActive ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                          <span>{isActive ? 'Aktif' : 'Ditangguhkan'}</span>
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>
                          {linkCount}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className={`btn btn-sm ${isActive ? 'btn-ghost' : ''}`}
                            title={isActive ? 'Tangguhkan Akun' : 'Aktifkan Akun'}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {isActive ? <Lock size={13} style={{ color: 'var(--accent-rose)' }} /> : <Unlock size={13} style={{ color: 'var(--accent-emerald)' }} />}
                            <span>{isActive ? 'Block' : 'Unblock'}</span>
                          </button>

                          <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="btn btn-danger btn-sm"
                            title="Hapus Member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="mobile-cards-view">
          {filteredUsers.map((user, idx) => (
            <div 
              key={user.id} 
              style={{ 
                padding: '0.85rem 0.25rem', 
                borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid var(--border-subtle)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{user.email}</div>
                  </div>
                </div>

                <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.675rem' }}>
                  {user.status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button onClick={() => handleToggleStatus(user)} className="btn btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}>
                    {user.status === 'active' ? 'Block' : 'Unblock'}
                  </button>
                  <button onClick={() => onDeleteUser(user.id)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content neu-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} style={{ color: 'var(--primary)' }} /> Tambah Member Baru
            </h3>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Member</label>
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="form-control" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Email *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="member@gmail.com" 
                  className="form-control" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                  <Check size={16} />
                  <span>Simpan Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
