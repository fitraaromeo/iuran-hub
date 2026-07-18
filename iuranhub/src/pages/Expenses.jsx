import React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

function Expenses({
  expenses,
  expensesPage,
  setExpensesPage,
  expensesLastPage,
  setShowAddExpense,
  formatRupiah,
  formatDate
}) {
  return (
    <div className="dashboard-content">
      <div className="search-filter-bar" style={{ justifyContent: 'flex-end' }}>
        <button onClick={() => setShowAddExpense(true)} className="btn btn-primary">
          <Plus size={16} /> Catat Pengeluaran Baru
        </button>
      </div>

      <div className="dashboard-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Deskripsi Pengeluaran</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{formatDate(e.date)}</td>
                  <td>
                    <span className="badge badge-danger" style={{ textTransform: 'capitalize' }}>
                      {e.category}
                    </span>
                  </td>
                  <td>{e.description}</td>
                  <td className="font-bold">{formatRupiah(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <span className="pagination-info">Halaman {expensesPage} dari {expensesLastPage}</span>
        <div className="pagination-buttons">
          <button
            disabled={expensesPage === 1}
            onClick={() => setExpensesPage(p => p - 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={expensesPage === expensesLastPage}
            onClick={() => setExpensesPage(p => p + 1)}
            className="btn btn-secondary btn-icon-only"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
