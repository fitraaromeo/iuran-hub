import React from 'react';
import { Moon, Sun } from 'lucide-react';

function Header({ activeTab, isLive, theme, setTheme }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Kas RT';
      case 'houses': return 'Inventaris Blok Rumah';
      case 'residents': return 'Daftar Warga & Penghuni';
      case 'fee-types': return 'Master Jenis Iuran';
      case 'payments': return 'Pencatatan Tagihan & Pembayaran';
      case 'expenses': return 'Pengeluaran Kas RT';
      case 'reports': return 'Laporan Buku Kas Tahunan/Bulanan';
      default: return 'IuranHub RT';
    }
  };

  return (
    <header className="top-header">
      <div className="top-header-left">
        <h1 className="top-header-title">{getTitle()}</h1>
      </div>

      <div className="top-header-right">
        {/* Live connection status badge */}
        <span className={`badge ${isLive ? 'badge-success' : 'badge-warning'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isLive ? '#10b981' : '#f59e0b',
            display: 'inline-block'
          }}></span>
          {isLive ? 'Database Terhubung (Live)' : 'Mode Demo (Offline)'}
        </span>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="theme-toggle-btn"
          title="Ganti Mode Gelap/Terang"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
