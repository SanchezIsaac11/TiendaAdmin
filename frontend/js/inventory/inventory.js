const API_BASE = '/api/products';

let editingProductId = null;

let form, btnSubmit, btnRefresh, tableBody, countElement, feedback;
let priceCostAlert, priceInput, costInput, stockInput, categorySelect;
let btnCancelEdit, formTitle;

function bindElements() {
  form = document.getElementById('productForm');
  btnSubmit = document.getElementById('btnSubmit');
  btnRefresh = document.getElementById('btnRefresh');
  tableBody = document.getElementById('productsTableBody');
  countElement = document.getElementById('productsCount');
  feedback = document.getElementById('feedbackMessage');
  priceCostAlert = document.getElementById('priceCostAlert');
  priceInput = document.getElementById('price');
  costInput = document.getElementById('cost');
  stockInput = document.getElementById('stock');
  categorySelect = document.getElementById('category');
  btnCancelEdit = document.getElementById('btnCancelEdit');
  formTitle = document.getElementById('formTitle');
}

function showMessage(text, type = 'info') {
  feedback.style.display = 'block';
  feedback.className = `feedback-message feedback-${type}`;
  feedback.textContent = text;

  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Error al obtener categorías');

    const categories = await res.json();

    categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error cargando categorías:', err);
    showMessage('No se pudieron cargar las categorías', 'error');
  }
}

async function loadProducts() {
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" class="loading-cell">Cargando...</td>
    </tr>
  `;

  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Error al obtener productos');

    const products = await res.json();
    renderTable(products);
  } catch (err) {
    console.error('Error cargando productos:', err);
    showMessage('No se pudieron cargar los productos', 'error');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">Error al cargar productos.</td>
      </tr>
    `;
    countElement.textContent = 'Total: 0';
  }
}

async function saveProduct(event) {
  event.preventDefault();

  const barcode = document.getElementById('barcode').value.trim();
  const name = document.getElementById('name').value.trim();
  const id_category = parseInt(categorySelect.value, 10);
  const priceVal = priceInput.value.trim();
  const costVal = costInput.value.trim();
  const stockVal = stockInput.value.trim();

  if (!name) {
    showMessage('El nombre del producto es obligatorio', 'error');
    return;
  }

  if (!id_category || isNaN(id_category)) {
    showMessage('Por favor selecciona una categoría', 'error');
    return;
  }

  const price = parseFloat(priceVal);
  const cost = parseFloat(costVal);
  const stock = parseFloat(stockVal);

  if (stockVal === '' || isNaN(stock) || stock <= 0) {
    showMessage('El stock no puede ser de cero ni un número negativo', 'error');
    stockInput.focus();
    return;
  }

  if (costVal === '' || isNaN(cost) || cost <= 0) {
    showMessage('El costo no puede ser de cero ni un número negativo', 'error');
    costInput.focus();
    return;
  }

  if (priceVal === '' || isNaN(price) || price <= 0) {
    showMessage('El precio no puede ser de cero ni un número negativo', 'error');
    priceInput.focus();
    return;
  }

  if (price < cost) {
    priceCostAlert.textContent = 'El costo es mayor al precio.';
    priceCostAlert.style.display = 'block';
    btnSubmit.disabled = true;
    showMessage('El costo es mayor al precio.', 'error');
    return;
  }

  if (price === cost) {
    priceCostAlert.textContent = 'El precio es igual al costo.';
    priceCostAlert.style.display = 'block';
    const confirmar = window.confirm('El costo y el precio son el mismo, ¿Desea guardar de todos modos?');
    if (!confirmar) {
      return;
    }
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = editingProductId ? 'Actualizando...' : 'Guardando...';

  const productData = {
    name,
    price,
    cost,
    stock,
    id_category,
    barcode: barcode || null
  };

  try {
    let res;

    if (editingProductId) {
      res = await fetch(`${API_BASE}/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    } else {
      res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg = errorData.message || errorData.errors?.map(e => e.msg).join(', ') || 'Error desconocido';
      throw new Error(errorMsg);
    }

    showMessage(
      editingProductId ? 'Producto actualizado correctamente' : 'Producto guardado correctamente',
      'success'
    );

    cancelEdit();
    form.reset();
    priceCostAlert.style.display = 'none';
    priceCostAlert.textContent = '';
    document.getElementById('barcode').focus();
    await loadProducts();

  } catch (err) {
    console.error('Error guardando producto:', err);
    showMessage(`Error: ${err.message}`, 'error');
  }

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Guardar Producto';
}

async function deleteProduct(id, productName) {
  const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${productName}"?`);
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar');
    }

    showMessage('Producto eliminado correctamente', 'success');
    await loadProducts();
  } catch (err) {
    console.error('Error eliminando producto:', err);
    showMessage(`Error al eliminar: ${err.message}`, 'error');
  }
}

async function editProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('No se pudo obtener el producto');

    const product = await res.json();

    document.getElementById('barcode').value = product.barcode || '';
    document.getElementById('name').value = product.name || '';
    categorySelect.value = product.id_category || '';
    priceInput.value = product.price || '';
    costInput.value = product.cost || '';
    stockInput.value = product.stock || '';

    editingProductId = id;
    formTitle.textContent = 'Editar Producto';
    btnSubmit.textContent = 'Actualizar Producto';
    if (btnCancelEdit) btnCancelEdit.style.display = 'inline-block';

    form.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Error cargando producto para editar:', err);
    showMessage('Error al cargar el producto para editar', 'error');
  }
}

function cancelEdit() {
  editingProductId = null;
  formTitle.textContent = 'Nuevo Producto';
  btnSubmit.textContent = 'Guardar Producto';
  if (btnCancelEdit) btnCancelEdit.style.display = 'none';
}

function renderTable(products) {
  if (!products || products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">No hay productos.</td>
      </tr>
    `;
    countElement.textContent = 'Total: 0';
    return;
  }

  tableBody.innerHTML = products.map(prod => `
    <tr>
      <td><code>${escapeHtml(prod.barcode || '-')}</code></td>
      <td>${escapeHtml(prod.name || '-')}</td>
      <td>${escapeHtml(prod.category_name || prod.id_category?.toString() || 'General')}</td>
      <td class="price-tag">$${Number(prod.price || 0).toFixed(2)}</td>
      <td><span class="stock-tag">${Number(prod.stock || 0)}</span></td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-edit" onclick="editProduct(${prod.id})" title="Editar">
          ✏️
        </button>
        <button class="btn btn-sm btn-delete" onclick="deleteProduct(${prod.id}, '${escapeHtml(prod.name || '')}')" title="Eliminar">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');

  countElement.textContent = `Total: ${products.length}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


function validatePriceCost() {
  const price = parseFloat(priceInput.value);
  const cost = parseFloat(costInput.value);

  if (isNaN(price) || isNaN(cost)) {
    priceCostAlert.style.display = 'none';
    priceCostAlert.textContent = '';
    btnSubmit.disabled = false;
    return;
  }

  if (price < cost) {
    priceCostAlert.textContent = 'El costo es mayor al precio.';
    priceCostAlert.style.display = 'block';
    btnSubmit.disabled = true;
  } else if (price === cost) {
    priceCostAlert.textContent = 'El precio es igual al costo.';
    priceCostAlert.style.display = 'block';
    btnSubmit.disabled = false;
  } else {
    priceCostAlert.style.display = 'none';
    priceCostAlert.textContent = '';
    btnSubmit.disabled = false;
  }
}

function bindEventListeners() {
  form.addEventListener('submit', saveProduct);
  btnRefresh.addEventListener('click', loadProducts);

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      cancelEdit();
      form.reset();
      priceCostAlert.style.display = 'none';
      priceCostAlert.textContent = '';
    });
  }

  if (priceInput && costInput) {
    priceInput.addEventListener('input', validatePriceCost);
    costInput.addEventListener('input', validatePriceCost);
    priceInput.addEventListener('change', validatePriceCost);
    costInput.addEventListener('change', validatePriceCost);
  }

  [priceInput, costInput, stockInput].forEach(input => {
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === 'Minus') {
          e.preventDefault();
        }
      });
    }
  });

  form.addEventListener('reset', () => {
    priceCostAlert.style.display = 'none';
    priceCostAlert.textContent = '';
    btnSubmit.disabled = false;
    cancelEdit();
  });
}

async function initInventory() {
  bindElements();
  bindEventListeners();
  await loadCategories();
  await loadProducts();
}
