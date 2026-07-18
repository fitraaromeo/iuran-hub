import React from 'react';

function Reports({
  selectedMonthDetail,
  detailMonth,
  setDetailMonth,
  detailYear,
  setDetailYear,
  formatRupiah
}) {
  return (
    <div className="dashboard-content">
      {/* Split page into annual summary and monthly details */}
      <div className="tab-controls-container">
        <button
          className="tab-btn active"
          style={{ cursor: 'default' }}
        >
          Buku Mutasi Kas Bulanan
        </button>
      </div>

      <div className="search-filter-bar" style={{ gap: '20px' }}>
        <div className="filter-actions" style={{ flexGrow: 1, gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Pilih Bulan</label>
            <select
              value={detailMonth}
              onChange={(e) => setDetailMonth(parseInt(e.target.value))}
              className="form-control"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {[
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                  ][i]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Pilih Tahun</label>
            <select
              value={detailYear}
              onChange={(e) => setDetailYear(parseInt(e.target.value))}
              className="form-control"
            >
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        {/* Print action helper */}
        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
        >
          Cetak Laporan
        </button>
      </div>

      {selectedMonthDetail && (
        <div className="dashboard-panel" style={{ border: '2px solid var(--border-color)' }}>
          {/* Ledger Heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ margin: '0 0 6px', fontWeight: 800 }}>LAPORAN BUKU KAS RT</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>
              Periode: { [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
              ][detailMonth - 1] } {detailYear}
            </p>
          </div>

          {/* Opening Balance Summary Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            backgroundColor: 'var(--bg-main)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Awal (Carry Over)</span>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>{formatRupiah(selectedMonthDetail.opening_balance)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Pemasukan Iuran</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success)' }}>+ {formatRupiah(selectedMonthDetail.total_income)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Pengeluaran Kas</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--danger)' }}>- {formatRupiah(selectedMonthDetail.total_expense)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Akhir Bersih</span>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>{formatRupiah(selectedMonthDetail.closing_balance)}</span>
            </div>
          </div>

          {/* Ledger Listing tables */}
          <div className="charts-grid-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Detailed Incomes */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 16px', color: 'var(--success)' }}>Mutasi Debit (Pemasukan)</h3>
              <div className="data-table-container">
                <table className="data-table" style={{ fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Rumah</th>
                      <th>Warga</th>
                      <th>Jenis</th>
                      <th>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMonthDetail.incomes.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Tidak Ada Pemasukan</td>
                      </tr>
                    ) : (
                      selectedMonthDetail.incomes.map(inc => (
                        <tr key={inc.id}>
                          <td className="font-bold">{inc.house?.house_number}</td>
                          <td>{inc.residence?.full_name}</td>
                          <td>{inc.fee_type?.name}</td>
                          <td className="text-right font-bold">{formatRupiah(inc.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Expenses */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 16px', color: 'var(--danger)' }}>Mutasi Kredit (Pengeluaran)</h3>
              <div className="data-table-container">
                <table className="data-table" style={{ fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Deskripsi</th>
                      <th>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMonthDetail.expenses.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Tidak Ada Pengeluaran</td>
                      </tr>
                    ) : (
                      selectedMonthDetail.expenses.map(exp => (
                        <tr key={exp.id}>
                          <td style={{ textTransform: 'capitalize' }}>
                            <span className="badge badge-danger" style={{ fontSize: '11px', padding: '3px 6px' }}>{exp.category}</span>
                          </td>
                          <td>{exp.description}</td>
                          <td className="text-right font-bold">{formatRupiah(exp.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
