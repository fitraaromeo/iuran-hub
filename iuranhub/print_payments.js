async function test() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/payments');
    const json = await res.json();
    console.log('API PAYMENTS RESPONSES:');
    json.data.data.slice(0, 5).forEach(p => {
      console.log(`Rumah: ${p.house?.house_number}, Status: ${p.status}, payment_date: ${p.payment_date}, created_at: ${p.created_at}`);
    });
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
