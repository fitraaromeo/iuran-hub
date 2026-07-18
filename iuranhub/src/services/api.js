const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to make API calls directly to the database backend
async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `API error ${res.status}`);
  }
  
  const data = await res.json();
  return { ...data, isMock: false };
}

export const api = {
  // Houses Inventory
  getHouses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`houses?${query}`);
  },

  getHouse: async (id) => {
    return await apiCall(`houses/${id}`);
  },

  createHouse: async (data) => {
    return await apiCall('houses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  assignResident: async (houseId, residenceId, startDate) => {
    return await apiCall(`houses/${houseId}/assign-resident`, {
      method: 'POST',
      body: JSON.stringify({ residence_id: residenceId, start_date: startDate })
    });
  },

  removeResident: async (houseId, endDate) => {
    return await apiCall(`houses/${houseId}/remove-resident`, {
      method: 'POST',
      body: JSON.stringify({ end_date: endDate })
    });
  },

  // Residents Database
  getResidents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`residences?${query}`);
  },

  createResident: async (formData) => {
    // Check if it's FormData (for uploading files like KTP photos)
    let body;
    let headers = {};
    if (formData instanceof FormData) {
      body = formData;
      // Fetch will automatically insert the multipart/form-data boundary
      const res = await fetch(`${API_BASE_URL}/residences`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API error ${res.status}`);
      }
      const data = await res.json();
      return { ...data, isMock: false };
    } else {
      body = JSON.stringify(formData);
      return await apiCall('residences', {
        method: 'POST',
        body
      });
    }
  },

  // Fee Types Master Data
  getFeeTypes: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`fee-types?${query}`);
  },

  createFeeType: async (data) => {
    return await apiCall('fee-types', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Payments / Dues Invoices
  getPayments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`payments?${query}`);
  },

  createPayment: async (data) => {
    return await apiCall('payments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  payBill: async (id) => {
    return await apiCall(`payments/${id}/pay`, {
      method: 'POST'
    });
  },

  generateMonthlyBills: async (month, year) => {
    return await apiCall('payments/generate-monthly-bills', {
      method: 'POST',
      body: JSON.stringify({ month, year })
    });
  },

  payBulk: async (data) => {
    return await apiCall('payments/pay-bulk', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Expenses logs
  getExpenses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`expenses?${query}`);
  },

  createExpense: async (data) => {
    return await apiCall('expenses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Financial Reports
  getSummary: async (year = 2026) => {
    return await apiCall(`reports/summary?year=${year}`);
  },

  getMonthlyDetail: async (month, year) => {
    return await apiCall(`reports/monthly-detail?month=${month}&year=${year}`);
  }
};
