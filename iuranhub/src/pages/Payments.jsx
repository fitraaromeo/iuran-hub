import React from 'react';
import {
  Activity,
  CreditCard,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Payments({
  payments,
  houses,
  feeTypes,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentHouseFilter,
  setPaymentHouseFilter,
  paymentsPage,
  setPaymentsPage,
  paymentsLastPage,
  setShowGenerateBills,
  setShowPayBulk,
  setShowAddPayment,
  setPaymentForm,
  paymentForm,
  handlePayInvoice,
  formatRupiah,
  formatDateTime
}) {
  return (
    <div className="dashboard-content">
      <div className="search-filter-bar">
        <div className="filter-actions" style={{ gap: '16px', flexGrow: 1 }}>
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPaymentsPage(1);
            }}
            className="form-control"
            style={{ maxWidth: '200px' }}
          >
            <option value="">Semua Status</option>
            <option value="unpaid">Belum Bayar (Unpaid)</option>
            <option value="paid">Lunas (Paid)</option>
          </select>

          <select
            value={paymentHouseFilter}
            onChange={(e) => {
              setPaymentHouseFilter(e.target.value);
              setPaymentsPage(1);
            }}
            className="form-control"
            style={{ maxWidth: '250px' }}
          >
            <option value="">Semua Rumah</option>
            {houses.map(h => (
              <option key={h.id} value={h.id}>{h.house_number}</option>
            ))}
          </select>
        </div>

        <div className="filter-actions">
          <button onClick={() => setShowGenerateBills(true)} className="btn btn-secondary">
            <Activity size={16} /> Tagih Bulanan
          </button>
          <button onClick={() => setShowPayBulk(true)} className="btn btn-secondary">
            <CreditCard size={16} /> Bayar Bulk (1 Th)
          </button>
          <button onClick={() => {
            setPaymentForm({
              ...paymentForm,
              house_id: houses[0]?.id || '',
              fee_type_id: feeTypes[0]?.id || ''
            });
            setShowAddPayment(true);
          }} className="btn btn-primary">
            <Plus size={16} /> Tambah Manual
          </button>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Blok Rumah</th>
                <th>Penghuni</th>
                <th>Periode</th>
                <th>Jenis Iuran</th>
                <th>Nominal</th>
                <th>Status</th>
                <th>Tanggal Pembayaran</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="font-bold">{p.house?.house_number}</td>
                  <td>{p.residence?.full_name}</td>
                  <td>
                    <span className="badge badge-accent">
                      {p.month} - {p.year}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{p.fee_type?.name}</span>
                  </td>
                  <td className="font-bold">{formatRupiah(p.amount)}</td>
                  <td>
                    <span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                      {p.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td>{formatDateTime(p.payment_date)}</td>
                  <td className="text-right">
                    {p.status === 'unpaid' && (
                      <button
                        onClick={() => handlePayInvoice(p.id)}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Bayar
                      </button>
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
        <span className="pagination-info">Halaman {paymentsPage} dari {paymentsLastPage}</span>
        <div className="pagination-buttons">
          <button
            disabled={paymentsPage === 1}
            onClick={() => setPaymentsPage(p => p - 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={paymentsPage === paymentsLastPage}
            onClick={() => setPaymentsPage(p => p + 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payments;
