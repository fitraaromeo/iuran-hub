import React from 'react';
import {
  DollarSign,
  Home,
  Users,
  CreditCard,
  Activity,
  Plus,
  Info
} from 'lucide-react';

function Dashboard({
  summaryData,
  houses,
  residents,
  payments,
  expenses,
  feeTypes,
  reportYear,
  setReportYear,
  setShowGenerateBills,
  setShowAddExpense,
  setShowPayBulk,
  setShowAddPayment,
  setPaymentForm,
  paymentForm,
  formatRupiah,
  setActiveTab,
  formatDate
}) {
  return (
    <div className="dashboard-content">
      {/* KPI Metrics */}
      <div className="kpi-cards-container">
        <div className="kpi-card">
          <div className="kpi-card-details">
            <span className="kpi-card-title">Sisa Saldo Kas RT</span>
            <span className="kpi-card-value">
              {summaryData ? formatRupiah(summaryData.final_balance) : '...'}
            </span>
            <span className="kpi-card-trend up">
              <Activity size={12} /> Akumulatif
            </span>
          </div>
          <div className="kpi-card-icon-wrapper">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-details">
            <span className="kpi-card-title">Hunian Rumah</span>
            <span className="kpi-card-value">
              {summaryData && typeof summaryData.occupied_houses !== 'undefined'
                ? `${summaryData.occupied_houses} / ${summaryData.total_houses}`
                : '...'}
            </span>
            <span className="kpi-card-trend">Terisi</span>
          </div>
          <div className="kpi-card-icon-wrapper accent">
            <Home size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-details">
            <span className="kpi-card-title">Total Warga</span>
            <span className="kpi-card-value">
              {summaryData && typeof summaryData.total_residents !== 'undefined'
                ? `${summaryData.total_residents} Jiwa`
                : '...'}
            </span>
            <span className="kpi-card-trend">Terdaftar</span>
          </div>
          <div className="kpi-card-icon-wrapper">
            <Users size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-details">
            <span className="kpi-card-title">Tagihan Unpaid</span>
            <span className="kpi-card-value">
              {summaryData && typeof summaryData.unpaid_payments_count !== 'undefined'
                ? `${summaryData.unpaid_payments_count} Invoice`
                : '...'}
            </span>
            <span className="kpi-card-trend down">Tertunda</span>
          </div>
          <div className="kpi-card-icon-wrapper accent">
            <CreditCard size={24} />
          </div>
        </div>
      </div>

      {/* Visual Charts & Tasks */}
      <div className="charts-grid-container">
        {/* Cash Flow SVG Chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Grafik Ringkasan Kas Bulanan ({reportYear})</h3>
            <div className="filter-actions">
              <select
                value={reportYear}
                onChange={(e) => setReportYear(parseInt(e.target.value))}
                className="form-control"
                style={{ padding: '6px 12px', width: '100px' }}
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color income"></span> Pemasukan Iuran
            </div>
            <div className="legend-item">
              <span className="legend-color expense"></span> Pengeluaran Kas
            </div>
          </div>

          <div className="chart-container">
            {summaryData && summaryData.monthly_breakdown && (
              <svg className="chart-svg" viewBox="0 0 600 280">
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map(idx => {
                  const y = 50 + idx * 45;
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1={y}
                      x2="550"
                      y2={y}
                      className="chart-grid-line"
                    />
                  );
                })}

                {/* X-axis labels */}
                {summaryData.monthly_breakdown.map((m, idx) => {
                  const x = 50 + (idx * 500 / 11);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y="250"
                      textAnchor="middle"
                      className="chart-axis-text"
                    >
                      {m.month_name.substring(0, 3)}
                    </text>
                  );
                })}

                {/* Bars/Lines rendering */}
                {/* Pemasukan bars */}
                {summaryData.monthly_breakdown.map((m, idx) => {
                  const x = 45 + (idx * 500 / 11);
                  const maxVal = Math.max(...summaryData.monthly_breakdown.map(d => d.total_income || 1), 3000000);
                  const barHeight = (m.total_income / maxVal) * 160;
                  return (
                    <rect
                      key={`inc-${idx}`}
                      x={x}
                      y={220 - barHeight}
                      width="8"
                      height={barHeight}
                      className="chart-bar-income"
                    />
                  );
                })}

                {/* Pengeluaran bars */}
                {summaryData.monthly_breakdown.map((m, idx) => {
                  const x = 55 + (idx * 500 / 11);
                  const maxVal = Math.max(...summaryData.monthly_breakdown.map(d => d.total_expense || 1), 3000000);
                  const barHeight = (m.total_expense / maxVal) * 160;
                  return (
                    <rect
                      key={`exp-${idx}`}
                      x={x}
                      y={220 - barHeight}
                      width="8"
                      height={barHeight}
                      className="chart-bar-expense"
                    />
                  );
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Aksi Cepat Pak RT</h3>
          </div>

          <div className="quick-actions-container">
            <button onClick={() => setShowGenerateBills(true)} className="quick-action-item">
              <Activity size={20} /> Tagih Bulanan
            </button>
            <button onClick={() => setShowAddExpense(true)} className="quick-action-item">
              <Plus size={20} /> Catat Pengeluaran
            </button>
            <button onClick={() => setShowPayBulk(true)} className="quick-action-item">
              <CreditCard size={20} /> Bayar Bulk (1 Th)
            </button>
            <button onClick={() => {
              setPaymentForm({
                ...paymentForm,
                house_id: houses[0]?.id || '',
                fee_type_id: feeTypes[0]?.id || ''
              });
              setShowAddPayment(true);
            }} className="quick-action-item">
              <Plus size={20} /> Catat Pembayaran
            </button>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 12px' }}>Panduan Keuangan</h4>
            <div className="badge badge-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Info size={14} /> Tagihan otomatis hanya mencakup rumah berpenghuni. Rumah kosong dibebaskan dari tagihan.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ledger Logs */}
      <div className="charts-grid-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Latest Dues Paid */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Pemasukan Terakhir (Lunas)</h3>
            <a onClick={() => setActiveTab('payments')} className="panel-action">Lihat Semua</a>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rumah</th>
                  <th>Warga</th>
                  <th>Iuran</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {payments.filter(p => p.status === 'paid').slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="font-bold">{p.house?.house_number}</td>
                    <td>{p.residence?.full_name}</td>
                    <td>
                      <span className="badge badge-success">{p.fee_type?.name || 'Iuran'}</span>
                    </td>
                    <td className="text-right font-bold">{formatRupiah(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Expenses Paid */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Pengeluaran Terakhir</h3>
            <a onClick={() => setActiveTab('expenses')} className="panel-action">Lihat Semua</a>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Deskripsi</th>
                  <th>Kategori</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td>{formatDate(e.date)}</td>
                    <td>{e.description}</td>
                    <td>
                      <span className="badge badge-danger">{e.category}</span>
                    </td>
                    <td className="text-right font-bold">{formatRupiah(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
