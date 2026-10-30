// Configuración de Supabase
const DB_CONFIG = {
  url: 'https://qluxojdodesadfthugml.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsdXhvamRvZGVzYWRmdGh1Z21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxODM5NTUsImV4cCI6MjEwNzc1OTk1NX0.t5etK56r6Z2qsHPtjni7wnN1AmUSDEfQXG_4Roum2u0'
};

const form = document.getElementById('productForm');
const btnSubmit = document.getElementById('btnSubmit');
const btnRefresh = document.getElementById('btnRefresh');
const tableBody = document.getElementById('productsTableBody');
const countElement = document.getElementById('productsCount');
const feedback = document.getElementById('feedbackMessage');

let supabaseClient = null;
let connectionMode = 'local';

async function initConnection() {
  if (window.location.protocol.startsWith('http')) {
    try {
      const resp = await fetch('/api/productos');
      if (resp.ok) {
        connectionMode = 'backend_node';
        return;
      }
    } catch (e) {}
  }

  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(DB_CONFIG.url, DB_CONFIG.anonKey);
      connectionMode = 'supabase';
      return;
    }
  } catch (err) {}

  connectionMode = 'local';
}

function showMessage(text, type = 'info') {
  feedback.style.display = 'block';
  feedback.className = `feedback-message feedback-${type}`;
  feedback.textContent = text;

  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

async function loadProducts() {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="loading-cell">Cargando...</td>
    </tr>
  `;

  let products = [];

  if (connectionMode === 'backend_node') {
    try {
      const res = await fetch('/api/productos');
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      products = getLocalProducts();
    }
  } else if (connectionMode === 'supabase' && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        products = data;
        localStorage.setItem('script2_productos', JSON.stringify(products));
      } else {
        products = getLocalProducts();
      }
    } catch (err) {
      products = getLocalProducts();
    }
  } else {
    products = getLocalProducts();
  }

  renderTable(products);
}

async function saveProduct(event) {
  event.preventDefault();

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Guardando...';

  const newProduct = {
    barcode: document.getElementById('barcode').value.trim(),
    name: document.getElementById('name').value.trim(),
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value) || 0,
    cost: parseFloat(document.getElementById('cost').value) || 0,
    stock: parseInt(document.getElementById('stock').value, 10) || 0
  };

  let isSaved = false;

  if (connectionMode === 'backend_node') {
    try {
      const resp = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (resp.ok) {
        isSaved = true;
      }
    } catch (e) {}
  }

  if (!isSaved && connectionMode === 'supabase' && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .insert([newProduct])
        .select();

      if (!error) {
        isSaved = true;
      }
    } catch (err) {}
  }

  if (!isSaved) {
    saveLocal(newProduct);
    isSaved = true;
  }

  if (isSaved) {
    showMessage('Producto guardado', 'success');
    form.reset();
    document.getElementById('barcode').focus();
    await loadProducts();
  } else {
    showMessage('Error al guardar producto', 'error');
  }

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Guardar Producto';
}

function getLocalProducts() {
  const saved = localStorage.getItem('script2_productos');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return [
    { barcode: '7501820511234', name: 'Leche Lala Entera 1L', category: 'Lácteos y Cremería', price: 29.50, cost: 22.50, stock: 34 },
    { barcode: '750185538472', name: 'Coca-Cola Original 600ml', category: 'Bebidas y Refrescos', price: 19.00, cost: 14.00, stock: 42 },
    { barcode: '750103912089', name: 'Aceite Nutrioli 850ml', category: 'Abarrotes y Granos', price: 45.00, cost: 36.00, stock: 15 }
  ];
}

function saveLocal(product) {
  const list = getLocalProducts();
  const existeIndex = list.findIndex(p => p.barcode === product.barcode);
  if (existeIndex >= 0) {
    list[existeIndex] = product;
  } else {
    list.unshift(product);
  }
  localStorage.setItem('script2_productos', JSON.stringify(list));
}

function renderTable(product) {
  if (!product || product.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">No hay productos.</td>
      </tr>
    `;
    countElement.textContent = 'Total: 0';
    return;
  }

  tableBody.innerHTML = product.map(prod => `
    <tr>
      <td><code>${escapeHtml(prod.barcode || '-')}</code></td>
      <td>${escapeHtml(prod.name || '-')}</td>
      <td>${escapeHtml(prod.category || 'General')}</td>
      <td class="price-tag">$${Number(prod.price || 0).toFixed(2)}</td>
      <td><span class="stock-tag">${Number(prod.stock || 0)}</span></td>
    </tr>
  `).join('');

  countElement.textContent = `Total: ${product.length}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener('submit', loadProducts);
btnRefresh.addEventListener('click', loadProducts);

window.addEventListener('DOMContentLoaded', async () => {
  await initConnection();
  await loadProducts();
});
