import React from 'react';
import { Plus } from 'lucide-react';

function FeeTypes({ feeTypes, setShowAddFeeType, formatRupiah, onEditFeeType, onDeleteFeeType }) {
  return (
    <div className="dashboard-content">
      <div className="search-filter-bar" style={{ justifyContent: 'flex-end' }}>
        <button onClick={() => setShowAddFeeType(true)} className="btn btn-primary">
          <Plus size={16} /> Tambah Jenis Iuran
        </button>
      </div>

      <div className="cards-grid-list">
        {feeTypes.map((type) => (
          <div className="card-item" key={type.id}>
            <div className="card-item-header">
              <span className="card-item-number" style={{ fontSize: '16px' }}>{type.name}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => onEditFeeType(type)}
                  className="btn btn-secondary"
                  style={{ padding: '2px 6px', fontSize: '11px', borderRadius: '4px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteFeeType(type.id, type.name)}
                  className="btn btn-danger"
                  style={{ padding: '2px 6px', fontSize: '11px', borderRadius: '4px', backgroundColor: '#ef4444', borderColor: '#ef4444', color: 'white' }}
                >
                  Hapus
                </button>
                <span className="badge badge-primary">Aktif</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Nominal Iuran Bulanan:</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                {formatRupiah(type.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeeTypes;
