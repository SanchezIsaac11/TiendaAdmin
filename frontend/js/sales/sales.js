const SALES_API = API_URL + '/sales';
const USERS_API = API_URL + '/users';

let salesList = [];
let usersById = {};

function escapeSalesHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function formatSaleDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function getDateOnly(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function showSalesMessage(text, type) {
  const box = document.getElementById('salesFeedback');
  if (!box) return;
  box.style.display = 'block';
  box.className = 'feedback-message feedback-' + type;
  box.textContent = text;
  setTimeout(function () { box.style.display = 'none'; }, 3500);
}

async function loadSalesHistory() {
  const tbody = document.getElementById('salesTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Cargando...</td></tr>';

  try {
    const salesRes = await fetch(SALES_API, { credentials: 'include' });
    if (!salesRes.ok) {
      const err = await salesRes.json().catch(function () { return {}; });
      throw new Error(err.message || 'No se pudo cargar el historial de ventas');
    }
    salesList = await salesRes.json();

    usersById = {};
    try {
      const usersRes = await fetch(USERS_API, { credentials: 'include' });
      if (usersRes.ok) {
        const users = await usersRes.json();
        for (let i = 0; i < users.length; i++) {
          usersById[users[i].id] = users[i].name;
        }
      }
    } catch (e) {}

    renderSalesHistory();
  } catch (err) {
    showSalesMessage(err.message || 'Error al cargar ventas', 'error');
    tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">Error al cargar ventas.</td></tr>';
  }
}

function renderSalesHistory() {
  const tbody = document.getElementById('salesTableBody');
  const search = document.getElementById('salesSearchInput').value.trim().toLowerCase();
  const dateFilter = document.getElementById('salesDateInput').value;

  let html = '';
  let totalAmount = 0;
  let count = 0;

  for (let i = salesList.length - 1; i >= 0; i--) {
    const sale = salesList[i];
    const folio = sale.folio || '';
    const cashier = usersById[sale.cashier_id] || ('ID ' + sale.cashier_id);

    if (dateFilter && getDateOnly(sale.date) !== dateFilter) continue;
    if (search && folio.toLowerCase().indexOf(search) === -1 && cashier.toLowerCase().indexOf(search) === -1) continue;

    const total = Number(sale.total || 0);
    totalAmount += total;
    count++;

    html += '<tr>'
      + '<td>#' + sale.id + '</td>'
      + '<td class="sales-folio">' + escapeSalesHtml(folio) + '</td>'
      + '<td>' + escapeSalesHtml(formatSaleDate(sale.date)) + '</td>'
      + '<td>' + escapeSalesHtml(cashier) + '</td>'
      + '<td class="price-tag">$' + total.toFixed(2) + '</td>'
      + '<td class="actions-cell"><button type="button" class="btn btn-sm btn-delete" onclick="deleteSale(' + sale.id + ')" title="Eliminar">🗑️</button></td>'
      + '</tr>';
  }

  document.getElementById('kpiSalesTotal').textContent = '$' + totalAmount.toFixed(2);
  document.getElementById('kpiSalesCount').textContent = count;
  document.getElementById('kpiSalesAvg').textContent = '$' + (count > 0 ? (totalAmount / count).toFixed(2) : '0.00');

  tbody.innerHTML = html || '<tr><td colspan="6" class="empty-cell">No hay ventas registradas.</td></tr>';
}

async function deleteSale(id) {
  if (!window.confirm('¿Deseas eliminar esta venta?')) return;

  try {
    const res = await fetch(SALES_API + '/' + id, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error('Error al eliminar la venta');
    showSalesMessage('Venta eliminada correctamente', 'success');
    await loadSalesHistory();
  } catch (err) {
    showSalesMessage(err.message, 'error');
  }
}

async function initSales() {
  const searchInput = document.getElementById('salesSearchInput');
  const dateInput = document.getElementById('salesDateInput');
  const btnClear = document.getElementById('btnClearSalesDate');

  searchInput.addEventListener('input', renderSalesHistory);
  dateInput.addEventListener('change', function () {
    btnClear.style.display = dateInput.value ? 'inline-block' : 'none';
    renderSalesHistory();
  });
  btnClear.addEventListener('click', function () {
    dateInput.value = '';
    btnClear.style.display = 'none';
    renderSalesHistory();
  });
  document.getElementById('btnRefreshSales').addEventListener('click', loadSalesHistory);

  await loadSalesHistory();
}
