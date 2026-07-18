import { useState, useEffect } from 'react';
import { api } from './services/api';
import { Info } from 'lucide-react';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Page Views
import Dashboard from './pages/Dashboard';
import Houses from './pages/Houses';
import Residents from './pages/Residents';
import FeeTypes from './pages/FeeTypes';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';

function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Database Data States
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [selectedMonthDetail, setSelectedMonthDetail] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  // Pagination states
  const [housesPage, setHousesPage] = useState(1);
  const [housesLastPage, setHousesLastPage] = useState(1);
  const [residentsPage, setResidentsPage] = useState(1);
  const [residentsLastPage, setResidentsLastPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsLastPage, setPaymentsLastPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);
  const [expensesLastPage, setExpensesLastPage] = useState(1);

  // Filter States
  const [houseFilter, setHouseFilter] = useState('');
  const [residentFilter, setResidentFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [paymentHouseFilter, setPaymentHouseFilter] = useState('');
  const [reportYear, setReportYear] = useState(2026);
  const [detailMonth, setDetailMonth] = useState(3);
  const [detailYear, setDetailYear] = useState(2026);

  // Modals Toggle States
  const [showAddHouse, setShowAddHouse] = useState(false);
  const [showAddResident, setShowAddResident] = useState(false);
  const [showAddFeeType, setShowAddFeeType] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAssignResident, setShowAssignResident] = useState(false);
  const [showRemoveResident, setShowRemoveResident] = useState(false);
  const [showPayBulk, setShowPayBulk] = useState(false);
  const [showGenerateBills, setShowGenerateBills] = useState(false);

  // Active items for modals
  const [selectedHouse, setSelectedHouse] = useState(null);

  // Form Field States
  const [houseForm, setHouseForm] = useState({ house_number: '' });
  const [residentForm, setResidentForm] = useState({
    full_name: '',
    status: 'permanent',
    phone_number: '',
    is_married: 0,
    identity_card_photo: null
  });
  const [feeTypeForm, setFeeTypeForm] = useState({ name: '', amount: '' });
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  });
  const [paymentForm, setPaymentForm] = useState({
    house_id: '',
    residence_id: '',
    fee_type_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'unpaid'
  });
  const [assignForm, setAssignForm] = useState({
    residence_id: '',
    start_date: new Date().toISOString().split('T')[0]
  });
  const [removeForm, setRemoveForm] = useState({
    end_date: new Date().toISOString().split('T')[0]
  });
  const [bulkForm, setBulkForm] = useState({
    house_id: '',
    residence_id: '',
    fee_type_id: '',
    start_month: 1,
    start_year: 2026,
    number_of_months: 12
  });
  const [billingForm, setBillingForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  // Apply Theme Mode on Mount & Change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load Initial Core Databases
  const loadData = async () => {
    let connected = false;

    // 1. Houses
    try {
      const hRes = await api.getHouses({ page: housesPage, house_number: houseFilter });
      if (hRes) {
        setHouses(hRes.data?.data || []);
        setHousesLastPage(hRes.data?.last_page || 1);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
    }

    // 2. Residents
    try {
      const rRes = await api.getResidents({ page: residentsPage, full_name: residentFilter });
      if (rRes) {
        setResidents(rRes.data?.data || []);
        setResidentsLastPage(rRes.data?.last_page || 1);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching residents:', err);
    }

    // 3. Fee Types
    try {
      const fRes = await api.getFeeTypes();
      if (fRes) {
        const feeTypesArray = fRes.data?.data || fRes.data || [];
        setFeeTypes(feeTypesArray);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching fee types:', err);
    }

    // 4. Payments
    try {
      const pRes = await api.getPayments({
        page: paymentsPage,
        status: paymentStatusFilter,
        house_id: paymentHouseFilter
      });
      if (pRes) {
        setPayments(pRes.data?.data || []);
        setPaymentsLastPage(pRes.data?.last_page || 1);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }

    // 5. Expenses
    try {
      const eRes = await api.getExpenses({ page: expensesPage });
      if (eRes) {
        setExpenses(eRes.data?.data || []);
        setExpensesLastPage(eRes.data?.last_page || 1);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }

    // 6. Report Summary
    try {
      const sRes = await api.getSummary(reportYear);
      if (sRes) {
        setSummaryData(sRes.data);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching report summary:', err);
    }

    // 7. Monthly Detail
    try {
      const dRes = await api.getMonthlyDetail(detailMonth, detailYear);
      if (dRes) {
        setSelectedMonthDetail(dRes.data);
        connected = true;
      }
    } catch (err) {
      console.error('Error fetching monthly detail:', err);
    }

    // 8. Recent Payments for Dashboard (always page 1, status paid)
    try {
      const rpRes = await api.getPayments({ page: 1, status: 'paid' });
      if (rpRes) {
        setRecentPayments(rpRes.data?.data || []);
      }
    } catch (err) {
      console.error('Error fetching recent payments:', err);
    }

    // 9. Recent Expenses for Dashboard (always page 1)
    try {
      const reRes = await api.getExpenses({ page: 1 });
      if (reRes) {
        setRecentExpenses(reRes.data?.data || []);
      }
    } catch (err) {
      console.error('Error fetching recent expenses:', err);
    }

    setIsLive(connected);
  };

  useEffect(() => {
    loadData();
  }, [
    housesPage, houseFilter,
    residentsPage, residentFilter,
    paymentsPage, paymentStatusFilter, paymentHouseFilter,
    expensesPage,
    reportYear,
    detailMonth, detailYear
  ]);

  // Toast / Status Message Handler
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FORM SUBMISSION HANDLERS
  const handleCreateHouse = async (e) => {
    e.preventDefault();
    try {
      await api.createHouse(houseForm);
      triggerToast('Rumah berhasil ditambahkan!');
      setShowAddHouse(false);
      setHouseForm({ house_number: '' });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('full_name', residentForm.full_name);
      data.append('status', residentForm.status);
      data.append('phone_number', residentForm.phone_number);
      data.append('is_married', residentForm.is_married);
      if (residentForm.identity_card_photo) {
        data.append('identity_card_photo', residentForm.identity_card_photo);
      }

      await api.createResident(data);
      triggerToast('Warga berhasil terdaftar!');
      setShowAddResident(false);
      setResidentForm({ full_name: '', status: 'permanent', phone_number: '', is_married: 0, identity_card_photo: null });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleCreateFeeType = async (e) => {
    e.preventDefault();
    try {
      await api.createFeeType(feeTypeForm);
      triggerToast('Jenis iuran baru berhasil ditambahkan!');
      setShowAddFeeType(false);
      setFeeTypeForm({ name: '', amount: '' });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense(expenseForm);
      triggerToast('Pengeluaran kas berhasil dicatat!');
      setShowAddExpense(false);
      setExpenseForm({ amount: '', description: '', category: 'other', date: new Date().toISOString().split('T')[0] });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      await api.createPayment(paymentForm);
      triggerToast('Tagihan iuran berhasil dibuat!');
      setShowAddPayment(false);
      setPaymentForm({ house_id: '', residence_id: '', fee_type_id: '', amount: '', month: 7, year: 2026, status: 'unpaid' });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleAssignResidentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.assignResident(selectedHouse.id, assignForm.residence_id, assignForm.start_date);
      triggerToast(`Penghuni berhasil dipetakan ke ${selectedHouse.house_number}!`);
      setShowAssignResident(false);
      setAssignForm({ residence_id: '', start_date: new Date().toISOString().split('T')[0] });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleRemoveResidentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.removeResident(selectedHouse.id, removeForm.end_date);
      triggerToast(`Penghuni berhasil dikeluarkan dari ${selectedHouse.house_number}!`);
      setShowRemoveResident(false);
      setRemoveForm({ end_date: new Date().toISOString().split('T')[0] });
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handlePayBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.payBulk(bulkForm);
      triggerToast('Pembayaran sekaligus (bulk) berhasil diverifikasi!');
      setShowPayBulk(false);
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleGenerateBillsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.generateMonthlyBills(parseInt(billingForm.month), parseInt(billingForm.year));
      triggerToast(`Berhasil membuat ${res.bills_created} tagihan baru.`);
      setShowGenerateBills(false);
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      await api.payBill(invoiceId);
      triggerToast('Tagihan berhasil dilunasi!');
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  // Format Helper
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const formatted = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
      return `${formatted} WIB`;
    } catch (e) {
      return dateStr;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert Popup */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: '12px',
          backgroundColor: toast.type === 'danger' ? '#fee2e2' : '#ecfdf5',
          color: toast.type === 'danger' ? '#ef4444' : '#10b981',
          border: `1.5px solid ${toast.type === 'danger' ? '#fca5a5' : '#6ee7b7'}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          fontWeight: 600,
          animation: 'slideUp 0.2s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* MAIN CONTENT WRAPPER */}
      <main className="main-wrapper">
        <Header activeTab={activeTab} isLive={isLive} theme={theme} setTheme={setTheme} />

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <Dashboard
            summaryData={summaryData}
            houses={houses}
            residents={residents}
            payments={recentPayments}
            expenses={recentExpenses}
            feeTypes={feeTypes}
            reportYear={reportYear}
            setReportYear={setReportYear}
            setShowGenerateBills={setShowGenerateBills}
            setShowAddExpense={setShowAddExpense}
            setShowPayBulk={setShowPayBulk}
            setShowAddPayment={setShowAddPayment}
            setPaymentForm={setPaymentForm}
            paymentForm={paymentForm}
            formatRupiah={formatRupiah}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
          />
        )}

        {/* 2. HOUSES VIEW */}
        {activeTab === 'houses' && (
          <Houses
            houses={houses}
            residents={residents}
            houseFilter={houseFilter}
            setHouseFilter={setHouseFilter}
            housesPage={housesPage}
            setHousesPage={setHousesPage}
            housesLastPage={housesLastPage}
            setShowAddHouse={setShowAddHouse}
            setSelectedHouse={setSelectedHouse}
            setAssignForm={setAssignForm}
            setShowAssignResident={setShowAssignResident}
            setRemoveForm={setRemoveForm}
            setShowRemoveResident={setShowRemoveResident}
          />
        )}

        {/* 3. RESIDENTS VIEW */}
        {activeTab === 'residents' && (
          <Residents
            residents={residents}
            residentFilter={residentFilter}
            setResidentFilter={setResidentFilter}
            residentsPage={residentsPage}
            setResidentsPage={setResidentsPage}
            residentsLastPage={residentsLastPage}
            setShowAddResident={setShowAddResident}
          />
        )}

        {/* 4. FEE TYPES VIEW */}
        {activeTab === 'fee-types' && (
          <FeeTypes
            feeTypes={feeTypes}
            setShowAddFeeType={setShowAddFeeType}
            formatRupiah={formatRupiah}
          />
        )}

        {/* 5. PAYMENTS VIEW */}
        {activeTab === 'payments' && (
          <Payments
            payments={payments}
            houses={houses}
            feeTypes={feeTypes}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            paymentHouseFilter={paymentHouseFilter}
            setPaymentHouseFilter={setPaymentHouseFilter}
            paymentsPage={paymentsPage}
            setPaymentsPage={setPaymentsPage}
            paymentsLastPage={paymentsLastPage}
            setShowGenerateBills={setShowGenerateBills}
            setShowPayBulk={setShowPayBulk}
            setShowAddPayment={setShowAddPayment}
            setPaymentForm={setPaymentForm}
            paymentForm={paymentForm}
            handlePayInvoice={handlePayInvoice}
            formatRupiah={formatRupiah}
            formatDateTime={formatDateTime}
          />
        )}

        {/* 6. EXPENSES VIEW */}
        {activeTab === 'expenses' && (
          <Expenses
            expenses={expenses}
            expensesPage={expensesPage}
            setExpensesPage={setExpensesPage}
            expensesLastPage={expensesLastPage}
            setShowAddExpense={setShowAddExpense}
            formatRupiah={formatRupiah}
            formatDate={formatDate}
          />
        )}

        {/* 7. REPORTS VIEW */}
        {activeTab === 'reports' && (
          <Reports
            selectedMonthDetail={selectedMonthDetail}
            detailMonth={detailMonth}
            setDetailMonth={setDetailMonth}
            detailYear={detailYear}
            setDetailYear={setDetailYear}
            formatRupiah={formatRupiah}
          />
        )}
      </main>

      {/* MODAL DIALOGS */}
      
      {/* 1. Add House Modal */}
      {showAddHouse && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateHouse} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Tambah Rumah Baru</h3>
              <button type="button" onClick={() => setShowAddHouse(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Rumah (Blok)</label>
              <input
                type="text"
                placeholder="Misal: Block A-21"
                value={houseForm.house_number}
                onChange={(e) => setHouseForm({ house_number: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAddHouse(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Add Resident Modal */}
      {showAddResident && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateResident} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Daftarkan Warga Baru</h3>
              <button type="button" onClick={() => setShowAddResident(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                value={residentForm.full_name}
                onChange={(e) => setResidentForm({ ...residentForm, full_name: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status Hubungan Rumah</label>
              <select
                value={residentForm.status}
                onChange={(e) => setResidentForm({ ...residentForm, status: e.target.value })}
                className="form-control"
              >
                <option value="permanent">Tetap (Permanent)</option>
                <option value="contract">Kontrak (Temporary)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nomor Telepon</label>
              <input
                type="text"
                value={residentForm.phone_number}
                onChange={(e) => setResidentForm({ ...residentForm, phone_number: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status Pernikahan</label>
              <select
                value={residentForm.is_married}
                onChange={(e) => setResidentForm({ ...residentForm, is_married: parseInt(e.target.value) })}
                className="form-control"
              >
                <option value="0">Belum Menikah</option>
                <option value="1">Menikah</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unggah Foto KTP (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setResidentForm({ ...residentForm, identity_card_photo: e.target.files[0] })}
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAddResident(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Daftarkan</button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Assign Resident Modal */}
      {showAssignResident && selectedHouse && (
        <div className="modal-overlay">
          <form onSubmit={handleAssignResidentSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Tempatkan Warga ke {selectedHouse.house_number}</h3>
              <button type="button" onClick={() => setShowAssignResident(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Pilih Warga</label>
              <select
                value={assignForm.residence_id}
                onChange={(e) => setAssignForm({ ...assignForm, residence_id: e.target.value })}
                required
                className="form-control"
              >
                <option value="">Pilih...</option>
                {residents.map(r => (
                  <option key={r.id} value={r.id}>{r.full_name} ({r.status === 'permanent' ? 'Tetap' : 'Kontrak'})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Mulai Menetap</label>
              <input
                type="date"
                value={assignForm.start_date}
                onChange={(e) => setAssignForm({ ...assignForm, start_date: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAssignResident(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Tempatkan</button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Remove Resident Modal */}
      {showRemoveResident && selectedHouse && (
        <div className="modal-overlay">
          <form onSubmit={handleRemoveResidentSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Keluarkan Warga dari {selectedHouse.house_number}</h3>
              <button type="button" onClick={() => setShowRemoveResident(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="badge badge-danger w-full" style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Info size={14} /> Anda akan mengakhiri masa hunian {selectedHouse.current_resident?.full_name} di rumah ini.
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Akhir Menetap</label>
              <input
                type="date"
                value={removeForm.end_date}
                onChange={(e) => setRemoveForm({ end_date: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowRemoveResident(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-danger">Keluarkan</button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Add Fee Type Modal */}
      {showAddFeeType && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateFeeType} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Tambah Jenis Iuran Bulanan</h3>
              <button type="button" onClick={() => setShowAddFeeType(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nama Iuran</label>
              <input
                type="text"
                placeholder="Misal: Iuran Sampah"
                value={feeTypeForm.name}
                onChange={(e) => setFeeTypeForm({ ...feeTypeForm, name: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tarif Nominal (Rp)</label>
              <input
                type="number"
                placeholder="Misal: 15000"
                value={feeTypeForm.amount}
                onChange={(e) => setFeeTypeForm({ ...feeTypeForm, amount: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAddFeeType(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Add Expense Modal */}
      {showAddExpense && (
        <div className="modal-overlay">
          <form onSubmit={handleCreateExpense} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Catat Pengeluaran Kas Baru</h3>
              <button type="button" onClick={() => setShowAddExpense(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nominal Pengeluaran (Rp)</label>
              <input
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="form-control"
              >
                <option value="salary">Gaji Karyawan/Satpam</option>
                <option value="electricity">Listrik/Token</option>
                <option value="maintenance">Perawatan Sarpras</option>
                <option value="other">Keperluan Lain-lain</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi Pengeluaran</label>
              <input
                type="text"
                placeholder="Misal: Beli token pos keamanan barat"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Transaksi</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAddExpense(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Catat Pengeluaran</button>
            </div>
          </form>
        </div>
      )}

      {/* 7. Pay Bulk Modal */}
      {showPayBulk && (
        <div className="modal-overlay">
          <form onSubmit={handlePayBulkSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Bayar Iuran Bulk (Sekaligus)</h3>
              <button type="button" onClick={() => setShowPayBulk(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Pilih Rumah</label>
              <select
                value={bulkForm.house_id}
                onChange={(e) => {
                  const houseId = e.target.value;
                  const house = houses.find(h => h.id === houseId);
                  setBulkForm({
                    ...bulkForm,
                    house_id: houseId,
                    residence_id: house?.current_resident?.id || ''
                  });
                }}
                required
                className="form-control"
              >
                <option value="">Pilih...</option>
                {houses.filter(h => h.status === 'occupied').map(h => (
                  <option key={h.id} value={h.id}>{h.house_number} ({h.current_resident?.full_name})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Jenis Iuran</label>
              <select
                value={bulkForm.fee_type_id}
                onChange={(e) => setBulkForm({ ...bulkForm, fee_type_id: e.target.value })}
                required
                className="form-control"
              >
                <option value="">Pilih...</option>
                {feeTypes.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({formatRupiah(f.amount)})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Bulan Mulai</label>
                <select
                  value={bulkForm.start_month}
                  onChange={(e) => setBulkForm({ ...bulkForm, start_month: parseInt(e.target.value) })}
                  className="form-control"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tahun Mulai</label>
                <select
                  value={bulkForm.start_year}
                  onChange={(e) => setBulkForm({ ...bulkForm, start_year: parseInt(e.target.value) })}
                  className="form-control"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Bulan</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={bulkForm.number_of_months}
                  onChange={(e) => setBulkForm({ ...bulkForm, number_of_months: parseInt(e.target.value) })}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowPayBulk(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Proses Pembayaran</button>
            </div>
          </form>
        </div>
      )}

      {/* 8. Generate Bills Modal */}
      {showGenerateBills && (
        <div className="modal-overlay">
          <form onSubmit={handleGenerateBillsSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Tagih Iuran Bulanan Otomatis</h3>
              <button type="button" onClick={() => setShowGenerateBills(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="badge badge-primary w-full" style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Info size={14} /> Tagihan otomatis akan dibuat untuk seluruh rumah yang dihuni untuk bulan berjalan.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Target Bulan</label>
                <select
                  value={billingForm.month}
                  onChange={(e) => setBillingForm({ ...billingForm, month: parseInt(e.target.value) })}
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
              <div className="form-group">
                <label className="form-label">Target Tahun</label>
                <select
                  value={billingForm.year}
                  onChange={(e) => setBillingForm({ ...billingForm, year: parseInt(e.target.value) })}
                  className="form-control"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowGenerateBills(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Generate Tagihan</button>
            </div>
          </form>
        </div>
      )}

      {/* 9. Manual Add Payment Modal */}
      {showAddPayment && (
        <div className="modal-overlay">
          <form onSubmit={handleCreatePayment} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Buat Catatan Pembayaran Manual</h3>
              <button type="button" onClick={() => setShowAddPayment(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Pilih Blok Rumah</label>
              <select
                value={paymentForm.house_id}
                onChange={(e) => {
                  const houseId = e.target.value;
                  const house = houses.find(h => h.id === houseId);
                  setPaymentForm({
                    ...paymentForm,
                    house_id: houseId,
                    residence_id: house?.current_resident?.id || ''
                  });
                }}
                required
                className="form-control"
              >
                <option value="">Pilih...</option>
                {houses.filter(h => h.status === 'occupied').map(h => (
                  <option key={h.id} value={h.id}>{h.house_number} ({h.current_resident?.full_name})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Jenis Iuran</label>
              <select
                value={paymentForm.fee_type_id}
                onChange={(e) => {
                  const feeId = e.target.value;
                  const fee = feeTypes.find(f => f.id === feeId);
                  setPaymentForm({
                    ...paymentForm,
                    fee_type_id: feeId,
                    amount: fee ? fee.amount : ''
                  });
                }}
                required
                className="form-control"
              >
                <option value="">Pilih...</option>
                {feeTypes.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({formatRupiah(f.amount)})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nominal (Kustom / Kosongkan untuk tarif bawaan)</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="form-control"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Bulan</label>
                <select
                  value={paymentForm.month}
                  onChange={(e) => setPaymentForm({ ...paymentForm, month: parseInt(e.target.value) })}
                  className="form-control"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tahun</label>
                <select
                  value={paymentForm.year}
                  onChange={(e) => setPaymentForm({ ...paymentForm, year: parseInt(e.target.value) })}
                  className="form-control"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status Pembayaran</label>
              <select
                value={paymentForm.status}
                onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}
                className="form-control"
              >
                <option value="unpaid">Belum Lunas (Unpaid)</option>
                <option value="paid">Lunas (Paid - Dicatat hari ini)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowAddPayment(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan Catatan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
