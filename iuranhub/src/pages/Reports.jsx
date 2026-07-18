import React from 'react';
import logo from '../assets/logo.png';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function Reports({
  selectedMonthDetail,
  detailMonth,
  setDetailMonth,
  detailYear,
  setDetailYear,
  formatRupiah
}) {
  const monthName = MONTHS[detailMonth - 1];
  const today = new Date();
  const printDate = today.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="dashboard-content">

      {/* ════════════════════════════════════════════
          TAMPILAN WEB (hidden when printing)
          ════════════════════════════════════════════ */}
      <div className="no-print">
        <div className="tab-controls-container">
          <button className="tab-btn active" style={{ cursor: 'default' }}>
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
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
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
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>
          <button onClick={() => window.print()} className="btn btn-secondary">
            Cetak Laporan
          </button>
        </div>

        {selectedMonthDetail && (
          <div className="dashboard-panel" style={{ border: '2px solid var(--border-color)' }}>
            {/* Ledger Heading */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ margin: '0 0 6px', fontWeight: 800 }}>LAPORAN BUKU KAS RT</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'uppercase' }}>
                Periode: {monthName} {detailYear}
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

            {/* Ledger Tables side-by-side */}
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

      {/* ════════════════════════════════════════════
          TAMPILAN CETAK PDF (hidden on screen, shown when printing)
          Kop: Logo + nama RT saja (tanpa alamat & nama perumahan)
          Tidak ada blok tanda tangan
          ════════════════════════════════════════════ */}
      {selectedMonthDetail && (
        <div id="print-area" className="print-area">

          {/* ── Kop Surat Sederhana ── */}
          <div className="print-letterhead">
            <img src={logo} alt="Logo RT" className="print-logo" />
            <div className="print-org-info">
              <div className="print-org-name">RUKUN TETANGGA (RT)</div>
            </div>
          </div>
          <div className="print-letterhead-divider" />

          {/* ── Judul Dokumen ── */}
          <div className="print-doc-title-block">
            <div className="print-doc-title">LAPORAN BUKU KAS RT</div>
            <div className="print-doc-subtitle">BUKU MUTASI KAS BULANAN</div>
            <div className="print-doc-period">Periode: {monthName} {detailYear}</div>
          </div>

          {/* ── I. Ringkasan Keuangan ── */}
          <div className="print-section-label">I. RINGKASAN KEUANGAN</div>
          <table className="print-summary-table">
            <tbody>
              <tr>
                <td className="print-summary-key">Saldo Awal (Carry Over)</td>
                <td className="print-summary-sep">:</td>
                <td className="print-summary-val">{formatRupiah(selectedMonthDetail.opening_balance)}</td>
              </tr>
              <tr>
                <td className="print-summary-key">Total Pemasukan Iuran</td>
                <td className="print-summary-sep">:</td>
                <td className="print-summary-val print-income">+ {formatRupiah(selectedMonthDetail.total_income)}</td>
              </tr>
              <tr>
                <td className="print-summary-key">Total Pengeluaran Kas</td>
                <td className="print-summary-sep">:</td>
                <td className="print-summary-val print-expense">- {formatRupiah(selectedMonthDetail.total_expense)}</td>
              </tr>
              <tr className="print-summary-total-row">
                <td className="print-summary-key">Saldo Akhir Bersih</td>
                <td className="print-summary-sep">:</td>
                <td className="print-summary-val print-total">{formatRupiah(selectedMonthDetail.closing_balance)}</td>
              </tr>
            </tbody>
          </table>

          {/* ── II. Mutasi Debit ── */}
          <div className="print-section-label">II. MUTASI DEBIT (PEMASUKAN IURAN)</div>
          <table className="print-ledger-table">
            <thead>
              <tr>
                <th className="print-th-no">No.</th>
                <th>No. Rumah</th>
                <th>Nama Warga</th>
                <th>Jenis Iuran</th>
                <th>Bulan / Tahun</th>
                <th className="print-th-amount">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {selectedMonthDetail.incomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="print-empty-row">— Tidak ada pemasukan pada periode ini —</td>
                </tr>
              ) : (
                selectedMonthDetail.incomes.map((inc, idx) => (
                  <tr key={inc.id} className={idx % 2 === 0 ? 'print-row-even' : ''}>
                    <td className="print-td-center">{idx + 1}</td>
                    <td className="print-td-center print-bold">{inc.house?.house_number ?? '-'}</td>
                    <td>{inc.residence?.full_name ?? '-'}</td>
                    <td>{inc.fee_type?.name ?? '-'}</td>
                    <td className="print-td-center">{monthName} {detailYear}</td>
                    <td className="print-td-right print-bold">{formatRupiah(inc.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {selectedMonthDetail.incomes.length > 0 && (
              <tfoot>
                <tr className="print-subtotal-row">
                  <td colSpan="5" className="print-td-right">Jumlah Pemasukan</td>
                  <td className="print-td-right print-bold">{formatRupiah(selectedMonthDetail.total_income)}</td>
                </tr>
              </tfoot>
            )}
          </table>

          {/* ── III. Mutasi Kredit ── */}
          <div className="print-section-label">III. MUTASI KREDIT (PENGELUARAN KAS)</div>
          <table className="print-ledger-table">
            <thead>
              <tr>
                <th className="print-th-no">No.</th>
                <th>Kategori</th>
                <th>Keterangan / Deskripsi</th>
                <th>Tanggal</th>
                <th className="print-th-amount">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {selectedMonthDetail.expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="print-empty-row">— Tidak ada pengeluaran pada periode ini —</td>
                </tr>
              ) : (
                selectedMonthDetail.expenses.map((exp, idx) => (
                  <tr key={exp.id} className={idx % 2 === 0 ? 'print-row-even' : ''}>
                    <td className="print-td-center">{idx + 1}</td>
                    <td style={{ textTransform: 'capitalize' }}>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td className="print-td-center">
                      {exp.expense_date
                        ? new Date(exp.expense_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="print-td-right print-bold">{formatRupiah(exp.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {selectedMonthDetail.expenses.length > 0 && (
              <tfoot>
                <tr className="print-subtotal-row">
                  <td colSpan="4" className="print-td-right">Jumlah Pengeluaran</td>
                  <td className="print-td-right print-bold">{formatRupiah(selectedMonthDetail.total_expense)}</td>
                </tr>
              </tfoot>
            )}
          </table>

          {/* ── IV. Rekap Saldo Akhir ── */}
          <div className="print-section-label">IV. REKAP SALDO AKHIR</div>
          <table className="print-reconcile-table">
            <tbody>
              <tr>
                <td>Saldo Awal Bulan</td>
                <td className="print-td-right">{formatRupiah(selectedMonthDetail.opening_balance)}</td>
              </tr>
              <tr>
                <td>Ditambah: Total Pemasukan</td>
                <td className="print-td-right print-income">+ {formatRupiah(selectedMonthDetail.total_income)}</td>
              </tr>
              <tr>
                <td>Dikurangi: Total Pengeluaran</td>
                <td className="print-td-right print-expense">- {formatRupiah(selectedMonthDetail.total_expense)}</td>
              </tr>
              <tr className="print-reconcile-final">
                <td><strong>Saldo Akhir Bulan {monthName} {detailYear}</strong></td>
                <td className="print-td-right"><strong>{formatRupiah(selectedMonthDetail.closing_balance)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* ── Footer Cetak ── */}
          <div className="print-footer">
            <div>Dokumen ini dicetak secara otomatis oleh sistem IuranHub RT</div>
            <div>Dicetak pada: {printDate}</div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Reports;
