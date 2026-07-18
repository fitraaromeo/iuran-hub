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
  const [confirmPayInvoiceId, setConfirmPayInvoiceId] = useState(null);
  const [activePaymentTimer, setActivePaymentTimer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Active items for modals
  const [selectedHouse, setSelectedHouse] = useState(null);

  // Form Field States
  const [houseForm, setHouseForm] = useState({ house_number: '' });
  const [showEditHouse, setShowEditHouse] = useState(false);
  const [editHouseForm, setEditHouseForm] = useState({ house_number: '' });
  const [showHouseDetail, setShowHouseDetail] = useState(false);
  const [houseDetailData, setHouseDetailData] = useState(null);
  const [loadingHouseDetail, setLoadingHouseDetail] = useState(false);
  const [residentForm, setResidentForm] = useState({
    full_name: '',
    status: 'permanent',
    phone_number: '',
    is_married: 0,
    identity_card_photo: null
  });
  const [showEditResident, setShowEditResident] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [editResidentForm, setEditResidentForm] = useState({
    full_name: '',
    status: 'permanent',
    phone_number: '',
    is_married: 0,
    identity_card_photo: null
  });
  const [feeTypeForm, setFeeTypeForm] = useState({ name: '', amount: '' });
  const [showEditFeeType, setShowEditFeeType] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [editFeeTypeForm, setEditFeeTypeForm] = useState({ name: '', amount: '' });
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  });
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editExpenseForm, setEditExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'other',
    date: ''
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

  const handleUpdateHouse = async (e) => {
    e.preventDefault();
    try {
      await api.updateHouse(selectedHouse.id, editHouseForm);
      triggerToast('Data rumah berhasil diperbarui!');
      setShowEditHouse(false);
      loadData();
    } catch (err) {
      triggerToast(err.message, 'danger');
    }
  };

  const handleViewHouseDetail = async (houseId) => {
    setShowHouseDetail(true);
    setLoadingHouseDetail(true);
    try {
      const res = await api.getHouse(houseId);
      setHouseDetailData(res.data);
    } catch (err) {
      triggerToast(err.message, 'danger');
      setShowHouseDetail(false);
    } finally {
      setLoadingHouseDetail(false);
    }
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('full_name', residentForm.full_name);
      data.append('status', residentForm.status);
      data.append('phone_number', residentForm.phone_number);
      data.append('is_married', residentForm.is_married ? 1 : 0);
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

  const handleUpdateResident = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('full_name', editResidentForm.full_name);
      data.append('status', editResidentForm.status);
      data.append('phone_number', editResidentForm.phone_number);
      data.append('is_married', editResidentForm.is_married ? 1 : 0);
      if (editResidentForm.identity_card_photo) {
        data.append('identity_card_photo', editResidentForm.identity_card_photo);
      }

      await api.updateResident(selectedResident.id, data);
      triggerToast('Data warga berhasil diperbarui!');
      setShowEditResident(false);
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

  const handleUpdateFeeType = async (e) => {
    e.preventDefault();
    try {
      await api.updateFeeType(selectedFeeType.id, editFeeTypeForm);
      triggerToast('Jenis iuran berhasil diperbarui!');
      setShowEditFeeType(false);
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

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      await api.updateExpense(selectedExpense.id, editExpenseForm);
      triggerToast('Catatan pengeluaran berhasil diperbarui!');
      setShowEditExpense(false);
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

  const handlePayInvoice = (invoiceId) => {
    setConfirmPayInvoiceId(invoiceId);
  };

  const executePayInvoice = (invoiceId) => {
    setConfirmPayInvoiceId(null);
    const seconds = 5;

    // Clean up any existing active timer first
    if (activePaymentTimer) {
      clearInterval(activePaymentTimer.intervalId);
    }

    let secondsLeft = seconds;
    const intervalId = setInterval(async () => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(intervalId);
        setActivePaymentTimer(null);
        try {
          await api.payBill(invoiceId);
          triggerToast('Tagihan berhasil dilunasi!');
          loadData();
        } catch (err) {
          triggerToast(err.message, 'danger');
        }
      } else {
        setActivePaymentTimer(prev => prev ? { ...prev, secondsLeft } : null);
      }
    }, 1000);

    setActivePaymentTimer({
      id: invoiceId,
      secondsLeft,
      intervalId
    });

    triggerToast(`Pelunasan tagihan akan diproses dalam 5 detik.`, 'info');
  };

  const handleDeleteExecute = async () => {
    if (!deleteConfirm) return;
    try {
      const { type, id } = deleteConfirm;
      if (type === 'house') {
        await api.deleteHouse(id);
        triggerToast('Rumah berhasil dihapus!');
      } else if (type === 'resident') {
        await api.deleteResident(id);
        triggerToast('Data warga berhasil dihapus!');
      } else if (type === 'fee-type') {
        await api.deleteFeeType(id);
        triggerToast('Jenis iuran berhasil dihapus!');
      } else if (type === 'payment') {
        await api.deletePayment(id);
        triggerToast('Tagihan iuran berhasil dihapus!');
      } else if (type === 'expense') {
        await api.deleteExpense(id);
        triggerToast('Catatan pengeluaran berhasil dihapus!');
      }
      setDeleteConfirm(null);
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
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
        <Header
          activeTab={activeTab}
          isLive={isLive}
          theme={theme}
          setTheme={setTheme}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

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
            onEditHouse={(house) => {
              setSelectedHouse(house);
              setEditHouseForm({ house_number: house.house_number });
              setShowEditHouse(true);
            }}
            onViewHouseDetail={handleViewHouseDetail}
            onDeleteHouse={(id, name) => setDeleteConfirm({ type: 'house', id, label: `Rumah Blok ${name}` })}
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
            onEditResident={(res) => {
              setSelectedResident(res);
              setEditResidentForm({
                full_name: res.full_name,
                status: res.status,
                phone_number: res.phone_number,
                is_married: res.is_married ? 1 : 0,
                identity_card_photo: null
              });
              setShowEditResident(true);
            }}
            onDeleteResident={(id, name) => setDeleteConfirm({ type: 'resident', id, label: `Warga ${name}` })}
          />
        )}

        {/* 4. FEE TYPES VIEW */}
        {activeTab === 'fee-types' && (
          <FeeTypes
            feeTypes={feeTypes}
            setShowAddFeeType={setShowAddFeeType}
            formatRupiah={formatRupiah}
            onEditFeeType={(type) => {
              setSelectedFeeType(type);
              setEditFeeTypeForm({ name: type.name, amount: type.amount });
              setShowEditFeeType(true);
            }}
            onDeleteFeeType={(id, name) => setDeleteConfirm({ type: 'fee-type', id, label: `Kategori Iuran ${name}` })}
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
            onDeletePayment={(id, name) => setDeleteConfirm({ type: 'payment', id, label: `Tagihan Iuran ${name}` })}
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
            onEditExpense={(exp) => {
              setSelectedExpense(exp);
              setEditExpenseForm({
                amount: exp.amount,
                description: exp.description,
                category: exp.category,
                date: exp.date.split('T')[0]
              });
              setShowEditExpense(true);
            }}
            onDeleteExpense={(id, name) => setDeleteConfirm({ type: 'expense', id, label: `Pengeluaran ${name}` })}
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
      {/* 10. Edit Resident Modal */}
      {showEditResident && selectedResident && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateResident} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Data Warga: {selectedResident.full_name}</h3>
              <button type="button" onClick={() => setShowEditResident(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                value={editResidentForm.full_name}
                onChange={(e) => setEditResidentForm({ ...editResidentForm, full_name: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status Hubungan Rumah</label>
              <select
                value={editResidentForm.status}
                onChange={(e) => setEditResidentForm({ ...editResidentForm, status: e.target.value })}
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
                value={editResidentForm.phone_number}
                onChange={(e) => setEditResidentForm({ ...editResidentForm, phone_number: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status Pernikahan</label>
              <select
                value={editResidentForm.is_married}
                onChange={(e) => setEditResidentForm({ ...editResidentForm, is_married: parseInt(e.target.value) })}
                className="form-control"
              >
                <option value="0">Belum Menikah</option>
                <option value="1">Menikah</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Perbarui Foto KTP (Optional - Biarkan kosong jika tidak diganti)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditResidentForm({ ...editResidentForm, identity_card_photo: e.target.files[0] })}
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowEditResident(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}
      {/* 11. Edit House Modal */}
      {showEditHouse && selectedHouse && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateHouse} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Nomor/Blok Rumah</h3>
              <button type="button" onClick={() => setShowEditHouse(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nomor / Blok Rumah</label>
              <input
                type="text"
                value={editHouseForm.house_number}
                onChange={(e) => setEditHouseForm({ ...editHouseForm, house_number: e.target.value })}
                required
                placeholder="Contoh: A-01, B-12"
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowEditHouse(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* 12. Detail & Riwayat Rumah Modal */}
      {showHouseDetail && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">Detail & Riwayat Rumah</h3>
              <button type="button" onClick={() => setShowHouseDetail(false)} className="modal-close-btn">&times;</button>
            </div>
            
            {loadingHouseDetail ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid var(--border-color)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 12px'
                }}></div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Memuat data riwayat rumah...</p>
              </div>
            ) : houseDetailData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Keterangan Rumah */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--panel-bg-darker, #212529)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800 }}>Rumah Blok {houseDetailData.house_number}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Status Hunian: <span className={`badge ${houseDetailData.status === 'occupied' ? 'badge-success' : 'badge-warning'}`}>{houseDetailData.status === 'occupied' ? 'Dihuni' : 'Kosong'}</span>
                    </p>
                  </div>
                  {houseDetailData.current_occupant?.residence && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Penghuni Aktif:</span>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>{houseDetailData.current_occupant.residence.full_name}</p>
                    </div>
                  )}
                </div>

                {/* 2. Catatan Historical Penghuni */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Catatan Riwayat Penghuni
                  </h4>
                  <div className="data-table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <table className="data-table" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th>Nama Warga</th>
                          <th>Status Hubungan</th>
                          <th>Tanggal Mulai</th>
                          <th>Tanggal Selesai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {houseDetailData.histories && houseDetailData.histories.length > 0 ? (
                          houseDetailData.histories.map((hist) => (
                            <tr key={hist.id}>
                              <td className="font-bold">{hist.residence?.full_name || 'N/A'}</td>
                              <td>
                                <span className={`badge ${hist.residence?.status === 'permanent' ? 'badge-primary' : 'badge-accent'}`}>
                                  {hist.residence?.status === 'permanent' ? 'Tetap' : 'Kontrak'}
                                </span>
                              </td>
                              <td>{formatDate(hist.start_date)}</td>
                              <td>
                                {hist.end_date ? (
                                  formatDate(hist.end_date)
                                ) : (
                                  <span className="badge badge-success">Aktif (Sekarang)</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada riwayat hunian terdaftar.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Riwayat Tagihan & Pembayaran */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Riwayat Tagihan & Pembayaran
                  </h4>
                  <div className="data-table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <table className="data-table" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th>Bulan/Tahun</th>
                          <th>Nama Warga Pembayar</th>
                          <th>Jenis Iuran</th>
                          <th>Jumlah</th>
                          <th className="text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {houseDetailData.payments && houseDetailData.payments.length > 0 ? (
                          houseDetailData.payments.map((pmt) => (
                            <tr key={pmt.id}>
                              <td className="font-bold">Bulan {pmt.month} / {pmt.year}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 600 }}>{pmt.residence?.full_name || 'N/A'}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    HP: {pmt.residence?.phone_number || '-'} ({pmt.residence?.status === 'permanent' ? 'Tetap' : 'Kontrak'})
                                  </span>
                                </div>
                              </td>
                              <td>{pmt.fee_type?.name || 'N/A'}</td>
                              <td>{formatRupiah(pmt.amount)}</td>
                              <td className="text-right">
                                <span className={`badge ${pmt.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                                  {pmt.status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>Belum ada riwayat tagihan iuran terdaftar.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowHouseDetail(false)} className="btn btn-secondary">Tutup</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                Gagal memuat detail rumah.
              </div>
            )}
          </div>
        </div>
      )}
      {/* 13. Edit Fee Type Modal */}
      {showEditFeeType && selectedFeeType && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateFeeType} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Jenis Iuran</h3>
              <button type="button" onClick={() => setShowEditFeeType(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Nama Iuran</label>
              <input
                type="text"
                value={editFeeTypeForm.name}
                onChange={(e) => setEditFeeTypeForm({ ...editFeeTypeForm, name: e.target.value })}
                required
                placeholder="Contoh: Kebersihan, Satpam"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nominal Bulanan (Rp)</label>
              <input
                type="number"
                value={editFeeTypeForm.amount}
                onChange={(e) => setEditFeeTypeForm({ ...editFeeTypeForm, amount: e.target.value })}
                required
                placeholder="Contoh: 100000"
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowEditFeeType(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}
      {/* 14. Payment Confirmation Modal */}
      {confirmPayInvoiceId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Konfirmasi Pelunasan</h3>
              <button type="button" onClick={() => setConfirmPayInvoiceId(null)} className="modal-close-btn">&times;</button>
            </div>
            <div style={{ margin: '12px 0', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              Apakah Anda yakin ingin memproses pelunasan untuk tagihan iuran ini?
              <br />
              <strong style={{ color: 'var(--primary)' }}>Catatan:</strong> Setelah mengonfirmasi, pembayaran akan ditunda selama 5 detik untuk memberi Anda kesempatan membatalkan transaksi jika terjadi kesalahan.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setConfirmPayInvoiceId(null)} className="btn btn-secondary">Batal</button>
              <button type="button" onClick={() => executePayInvoice(confirmPayInvoiceId)} className="btn btn-primary">Ya, Proses Pembayaran</button>
            </div>
          </div>
        </div>
      )}

      {/* 15. Undo Payment Banner */}
      {activePaymentTimer && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          backgroundColor: 'var(--bg-card, #1c1c1e)',
          border: '2px solid var(--primary)',
          borderRadius: '16px',
          padding: '16px 24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>Melunasi Tagihan...</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Akan otomatis diproses dalam {activePaymentTimer.secondsLeft} detik</span>
          </div>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid var(--border-color)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite'
          }}></div>
          <button
            onClick={() => {
              clearInterval(activePaymentTimer.intervalId);
              setActivePaymentTimer(null);
              triggerToast('Pembayaran berhasil dibatalkan!', 'warning');
            }}
            className="btn btn-danger"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Batalkan Pembayaran
          </button>
        </div>
      )}
      {/* 16. Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#ef4444' }}>Konfirmasi Hapus Data</h3>
              <button type="button" onClick={() => setDeleteConfirm(null)} className="modal-close-btn">&times;</button>
            </div>
            <div style={{ margin: '12px 0', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
              Apakah Anda yakin ingin menghapus <strong style={{ color: 'var(--text-main)' }}>{deleteConfirm.label}</strong>?
              <br /><br />
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Peringatan:</span> Tindakan ini akan menghapus data tersebut secara permanen dari sistem dan tidak dapat dibatalkan.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">Batal</button>
              <button type="button" onClick={handleDeleteExecute} className="btn btn-danger">Ya, Hapus Permanen</button>
            </div>
          </div>
        </div>
      )}
      {/* 17. Edit Expense Modal */}
      {showEditExpense && selectedExpense && (
        <div className="modal-overlay">
          <form onSubmit={handleUpdateExpense} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Catatan Pengeluaran</h3>
              <button type="button" onClick={() => setShowEditExpense(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Deskripsi Pengeluaran</label>
              <input
                type="text"
                value={editExpenseForm.description}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, description: e.target.value })}
                required
                placeholder="Contoh: Perbaikan Pagar Pos Satpam"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                value={editExpenseForm.category}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, category: e.target.value })}
                className="form-control"
              >
                <option value="maintenance">Perawatan/Perbaikan</option>
                <option value="salary">Gaji Karyawan</option>
                <option value="electricity">Listrik & Air</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nominal (Rp)</label>
              <input
                type="number"
                value={editExpenseForm.amount}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, amount: e.target.value })}
                required
                placeholder="Contoh: 150000"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Pengeluaran</label>
              <input
                type="date"
                value={editExpenseForm.date}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, date: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowEditExpense(false)} className="btn btn-secondary">Batal</button>
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
