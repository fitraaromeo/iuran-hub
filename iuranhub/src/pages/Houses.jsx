import React from 'react';
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserMinus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Houses({
  houses,
  residents,
  houseFilter,
  setHouseFilter,
  housesPage,
  setHousesPage,
  housesLastPage,
  setShowAddHouse,
  setSelectedHouse,
  setAssignForm,
  setShowAssignResident,
  setRemoveForm,
  setShowRemoveResident
}) {
  return (
    <div className="dashboard-content">
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Cari nomor rumah (misal: Block A-01)..."
            value={houseFilter}
            onChange={(e) => {
              setHouseFilter(e.target.value);
              setHousesPage(1);
            }}
            className="form-control search-input"
          />
        </div>
        <div className="filter-actions">
          <button onClick={() => setShowAddHouse(true)} className="btn btn-primary">
            <Plus size={16} /> Tambah Rumah
          </button>
        </div>
      </div>

      <div className="cards-grid-list">
        {houses.map((house) => (
          <div className="card-item" key={house.id}>
            <div className="card-item-header">
              <span className="card-item-number">{house.house_number}</span>
              <span className={`badge ${house.status === 'occupied' ? 'badge-success' : 'badge-warning'}`}>
                {house.status === 'occupied' ? 'Dihuni' : 'Kosong'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Penghuni Aktif:</span>
              {house.current_resident ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="sidebar-logo-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Users size={14} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{house.current_resident.full_name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Status: <span style={{ textTransform: 'capitalize' }}>{house.current_resident.status}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Tidak Ada</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              {house.status === 'vacant' ? (
                <button
                  onClick={() => {
                    setSelectedHouse(house);
                    setAssignForm({ residence_id: residents[0]?.id || '', start_date: new Date().toISOString().split('T')[0] });
                    setShowAssignResident(true);
                  }}
                  className="btn btn-primary w-full"
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                >
                  <UserCheck size={14} /> Tempatkan Warga
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedHouse(house);
                    setRemoveForm({ end_date: new Date().toISOString().split('T')[0] });
                    setShowRemoveResident(true);
                  }}
                  className="btn btn-danger w-full"
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                >
                  <UserMinus size={14} /> Keluarkan Warga
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <span className="pagination-info">Halaman {housesPage} dari {housesLastPage}</span>
        <div className="pagination-buttons">
          <button
            disabled={housesPage === 1}
            onClick={() => setHousesPage(p => p - 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={housesPage === housesLastPage}
            onClick={() => setHousesPage(p => p + 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Houses;
