import React from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  Briefcase,
  DollarSign,
  TrendingDown,
  FileText
} from 'lucide-react';
import logo from '../assets/logo.png';

function Sidebar({ activeTab, setActiveTab }) {
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
          <LayoutDashboard className="icon" /> Dashboard
        </a>

        <div className="sidebar-group-label">Inventaris</div>
        <a
          className={`sidebar-menu-item ${activeTab === 'houses' ? 'active' : ''}`}
          onClick={() => setActiveTab('houses')}
        >
          <Home className="icon" /> Rumah Perumahan
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'residents' ? 'active' : ''}`}
          onClick={() => setActiveTab('residents')}
        >
          <Users className="icon" /> Database Warga
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'fee-types' ? 'active' : ''}`}
          onClick={() => setActiveTab('fee-types')}
        >
          <Briefcase className="icon" /> Jenis Iuran
        </a>

        <div className="sidebar-group-label">Kas & Keuangan</div>
        <a
          className={`sidebar-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <DollarSign className="icon" /> Tagihan Iuran
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          <TrendingDown className="icon" /> Pengeluaran Kas
        </a>
        <a
          className={`sidebar-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText className="icon" /> Laporan Buku Kas
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-section">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Pak RT"
            className="user-profile-photo"
          />
          <div className="user-profile-info">
            <span className="user-profile-name">Pak RT Mulyadi</span>
            <span className="user-profile-role">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
