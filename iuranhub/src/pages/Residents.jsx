import React from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Residents({
  residents,
  residentFilter,
  setResidentFilter,
  residentsPage,
  setResidentsPage,
  residentsLastPage,
  setShowAddResident
}) {
  const [selectedKtpPhoto, setSelectedKtpPhoto] = React.useState(null);
  return (
    <div className="dashboard-content">
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Cari nama warga..."
            value={residentFilter}
            onChange={(e) => {
              setResidentFilter(e.target.value);
              setResidentsPage(1);
            }}
            className="form-control search-input"
          />
        </div>
        <div className="filter-actions">
          <button onClick={() => setShowAddResident(true)} className="btn btn-primary">
            <Plus size={16} /> Daftarkan Warga
          </button>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Status Tinggal</th>
                <th>Nomor Telepon</th>
                <th>Status Menikah</th>
                <th>Foto KTP</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((res) => (
                <tr key={res.id}>
                  <td className="font-bold">{res.full_name}</td>
                  <td>
                    <span className={`badge ${res.status === 'permanent' ? 'badge-primary' : 'badge-accent'}`}>
                      {res.status === 'permanent' ? 'Tetap' : 'Kontrak'}
                    </span>
                  </td>
                  <td>{res.phone_number}</td>
                  <td>{res.is_married === 1 ? 'Menikah' : 'Belum Menikah'}</td>
                  <td>
                    {res.identity_card_photo ? (
                      <button
                        onClick={() => {
                          const url = res.identity_card_photo.startsWith('ktp_photos/')
                            ? `http://127.0.0.1:8000/storage/${res.identity_card_photo}`
                            : `https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80`;
                          setSelectedKtpPhoto({ name: res.full_name, url });
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Lihat KTP
                      </button>
                    ) : (
                      <span className="badge badge-warning">Tidak Ada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <span className="pagination-info">Halaman {residentsPage} dari {residentsLastPage}</span>
        <div className="pagination-buttons">
          <button
            disabled={residentsPage === 1}
            onClick={() => setResidentsPage(p => p - 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={residentsPage === residentsLastPage}
            onClick={() => setResidentsPage(p => p + 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KTP Photo Preview Modal */}
      {selectedKtpPhoto && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div className="modal-header">
              <h3 className="modal-title">Foto KTP: {selectedKtpPhoto.name}</h3>
              <button type="button" onClick={() => setSelectedKtpPhoto(null)} className="modal-close-btn">&times;</button>
            </div>
            <div style={{ marginTop: '16px' }}>
              <img
                src={selectedKtpPhoto.url}
                alt="Foto KTP"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-color)',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setSelectedKtpPhoto(null)} className="btn btn-secondary">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Residents;
