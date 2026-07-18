import React from 'react';
import { Plus } from 'lucide-react';

function FeeTypes({ feeTypes, setShowAddFeeType, formatRupiah }) {
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
              <span className="badge badge-primary">Aktif</span>
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
