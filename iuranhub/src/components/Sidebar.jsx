import {
  LayoutDashboard,
  Home,
  Users,
  Briefcase,
  DollarSign,
  TrendingDown,
  FileText,
  LogOut
} from 'lucide-react';
import logo from '../assets/logo.png';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src={logo}
          alt="IuranHub RT Logo"
          className="sidebar-logo"
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'contain',
            borderRadius: '6px'
          }}
        />
        <span className="sidebar-title">IuranHub RT</span>
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-group-label">Utama</div>
        <a
          className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="icon" /> <span className="menu-text">Dashboard</span>
        </a>

        <div className="sidebar-group-label">Inventaris</div>
        <a
          className={`sidebar-menu-item ${activeTab === 'houses' ? 'active' : ''}`}
          onClick={() => setActiveTab('houses')}
        >
          <Home className="icon" /> <span className="menu-text">Rumah Perumahan</span>
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'residents' ? 'active' : ''}`}
          onClick={() => setActiveTab('residents')}
        >
          <Users className="icon" /> <span className="menu-text">Database Warga</span>
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'fee-types' ? 'active' : ''}`}
          onClick={() => setActiveTab('fee-types')}
        >
          <Briefcase className="icon" /> <span className="menu-text">Jenis Iuran</span>
        </a>

        <div className="sidebar-group-label">Kas & Keuangan</div>
        <a
          className={`sidebar-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <DollarSign className="icon" /> <span className="menu-text">Tagihan Iuran</span>
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <TrendingDown className="icon" /> <span className="menu-text">Pengeluaran Kas</span>
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="icon" /> <span className="menu-text">Laporan Buku Kas</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-section" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="user-profile-meta-wrapper">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Pak RT"
              className="user-profile-photo"
            />
            <div className="user-profile-info">
              <span className="user-profile-name">Pak RT</span>
              <span className="user-profile-role">Administrator</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-sidebar)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
            className="logout-btn menu-text"
            title="Keluar dari Sistem"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
