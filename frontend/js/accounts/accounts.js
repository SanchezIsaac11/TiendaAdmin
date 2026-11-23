const USERS_API = `${API_URL}/users`;

let allUsers = [];
let selectedUserId = null;

let accountForm, btnAccountSubmit, btnCancelAccountEdit, btnDeleteSelectedAccount;
let accountFeedback, accountNameInput, accountPasswordInput, accountRoleSelect;
let accountFormTitle, accountSearchInput, accountRoleFilter;
let accountsCardsContainer, accountsMainContent;

function bindAccountElements() {
  accountForm = document.getElementById('accountForm');
  btnAccountSubmit = document.getElementById('btnAccountSubmit');
  btnCancelAccountEdit = document.getElementById('btnCancelAccountEdit');
  btnDeleteSelectedAccount = document.getElementById('btnDeleteSelectedAccount');
  accountFeedback = document.getElementById('accountFeedbackMessage');
  accountNameInput = document.getElementById('accountName');
  accountPasswordInput = document.getElementById('accountPassword');
  accountRoleSelect = document.getElementById('accountRole');
  accountFormTitle = document.getElementById('accountFormTitle');
  accountSearchInput = document.getElementById('accountSearchInput');
  accountRoleFilter = document.getElementById('accountRoleFilter');
  accountsCardsContainer = document.getElementById('accountsCardsContainer');
  accountsMainContent = document.getElementById('accountsMainContent');
}

function showAccountMessage(text, type = 'info') {
  if (!accountFeedback) return;
  accountFeedback.style.display = 'block';
  accountFeedback.className = `feedback-message feedback-${type}`;
  accountFeedback.textContent = text;

  setTimeout(() => {
    if (accountFeedback) accountFeedback.style.display = 'none';
  }, 3500);
}

async function loadUsers() {
  if (!accountsCardsContainer) return;

  try {
    const res = await fetch(USERS_API, { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Cannot load users from server');
    }

    allUsers = await res.json();
    applyFiltersAndRender();
  } catch (err) {
    console.error('Cannot load users:', err);
    showAccountMessage(err.message || 'No se pudieron cargar las cuentas', 'error');
    accountsCardsContainer.innerHTML = `
      <div class="empty-state">
        Error al cargar cuentas del servidor.
      </div>
    `;
  }
}

function applyFiltersAndRender() {
  const searchTerm = (accountSearchInput?.value || '').trim().toLowerCase();
  const roleFilter = (accountRoleFilter?.value || '').trim().toLowerCase();

  const filtered = allUsers.filter(user => {
    const matchesName = (user.name || '').toLowerCase().includes(searchTerm);
    const matchesRole = !roleFilter || (user.role || '').toLowerCase() === roleFilter;
    return matchesName && matchesRole;
  });

  renderUserCards(filtered);
}

function renderUserCards(users) {
  if (!accountsCardsContainer) return;

  if (!users || users.length === 0) {
    accountsCardsContainer.innerHTML = `
      <div class="empty-state">
        No se encontraron cuentas que coincidan con la búsqueda.
      </div>
    `;
    return;
  }

  const currentUserId = window.appState?.user?.id;

  accountsCardsContainer.innerHTML = users.map(user => {
    const isSelf = currentUserId && Number(currentUserId) === Number(user.id);
    const roleLabel = user.role === 'admin' ? 'Administrador' : 'Cajero';

    return `
      <div class="user-card" data-id="${user.id}" onclick="handleCardClick(${user.id})" >
        <div class="user-card-header">
          <div class="user-card-info">
            <span class="user-card-name">${escapeAccountHtml(user.name)}</span>
          </div>
          ${!isSelf ? `
            <button type="button" class="btn-card-delete" 
            onclick="handleQuickDelete(event, ${user.id}, '${escapeAccountHtml(user.name)}')" >
              <svg class="icon-delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round" >
                  <path d="M3 6h18"/>
                  <path d="M8 6V4h8v2"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v5M14 11v5"/>
              </svg>
            </button>
          ` : '<span class="current-user-tag">Sesión actual</span>'}
        </div>

        <div class="user-card-meta">
          <span class="role-badge">${roleLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeAccountHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function handleCardClick(id) {
  if (selectedUserId === id) {
    deselectUser();
  } else {
    selectUser(id);
  }
}

function selectUser(id) {
  const user = allUsers.find(u => u.id === id);
  if (!user) return;

  selectedUserId = id;

  accountNameInput.value = user.name || '';
  accountRoleSelect.value = user.role || 'cashier';
  accountPasswordInput.value = '';

  accountFormTitle.textContent = `${user.name}`;
  btnAccountSubmit.textContent = 'Guardar Cambios';

  btnCancelAccountEdit.style.display = 'inline-block';

  const currentUserId = window.appState?.user?.id;
  const isSelf = currentUserId && Number(currentUserId) === Number(user.id);
  if (btnDeleteSelectedAccount) {
    btnDeleteSelectedAccount.style.display = isSelf ? 'none' : 'inline-block';
  }

  applyFiltersAndRender();

  accountNameInput.focus();
}

function deselectUser() {
  selectedUserId = null;

  accountFormTitle.textContent = 'Nueva Cuenta';
  btnAccountSubmit.textContent = 'Crear Cuenta';

  if (btnCancelAccountEdit) btnCancelAccountEdit.style.display = 'none';
  if (btnDeleteSelectedAccount) btnDeleteSelectedAccount.style.display = 'none';
  if (accountForm) accountForm.reset();

  applyFiltersAndRender();
}

async function saveUser(event) {
  event.preventDefault();

  const name = accountNameInput.value.trim();
  const password = accountPasswordInput.value.trim();
  const role = accountRoleSelect.value;

  if (!name) {
    showAccountMessage('El nombre de usuario es obligatorio', 'error');
    accountNameInput.focus();
    return;
  }

  if (name.length < 4) {
    showAccountMessage('El nombre debe tener al menos 4 caracteres', 'error');
    accountNameInput.focus();
    return;
  }

  if (!selectedUserId && !password) {
    showAccountMessage('La contraseña es obligatoria para crear una cuenta', 'error');
    accountPasswordInput.focus();
    return;
  }

  btnAccountSubmit.disabled = true;
  btnAccountSubmit.textContent = selectedUserId ? 'Guardando...' : 'Creando...';

  const payload = { name, role };
  if (password) {
    payload.password = password;
  }

  try {
    let res;
    if (selectedUserId) {
      res = await fetch(`${USERS_API}/${selectedUserId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(USERS_API, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.message || data.errors?.map(e => e.msg).join(', ') || 'Error al procesar la solicitud';
      throw new Error(errorMsg);
    }

    showAccountMessage(
      selectedUserId ? 'Cuenta actualizada correctamente' : 'Cuenta creada correctamente',
      'success'
    );

    const wasEditing = selectedUserId;
    deselectUser();
    await loadUsers();

    if (wasEditing && window.appState?.user?.id === wasEditing) {
      window.appState.user.name = name;
      window.appState.user.role = role;
      if (typeof onUserLoggedIn === 'function') {
        onUserLoggedIn(window.appState.user);
      }
    }

  } catch (err) {
    console.error('Error guardando cuenta:', err);
    showAccountMessage(err.message, 'error');
  } finally {
    btnAccountSubmit.disabled = false;
    btnAccountSubmit.textContent = selectedUserId ? 'Guardar Cambios' : 'Crear Cuenta';
  }
}

function handleQuickDelete(event, id, userName) {
  event.stopPropagation();
  deleteUser(id, userName);
}

async function deleteUser(id, userName) {
  const currentUserId = window.appState?.user?.id;
  if (currentUserId && Number(currentUserId) === Number(id)) {
    showAccountMessage('No puedes eliminar tu propia cuenta en sesión activa', 'error');
    return;
  }

  const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar la cuenta de "${userName}"?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`${USERS_API}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error al eliminar la cuenta');
    }

    showAccountMessage('Cuenta eliminada correctamente', 'success');

    if (selectedUserId === id) {
      deselectUser();
    }

    await loadUsers();
  } catch (err) {
    console.error('Error eliminando cuenta:', err);
    showAccountMessage(err.message, 'error');
  }
}


function bindAccountEventListeners() {
  accountForm?.addEventListener('submit', saveUser);

  btnCancelAccountEdit?.addEventListener('click', deselectUser);

  btnDeleteSelectedAccount?.addEventListener('click', () => {
    if (!selectedUserId) return;
    const user = allUsers.find(u => u.id === selectedUserId);
    if (user) {
      deleteUser(user.id, user.name);
    }
  });

  accountSearchInput?.addEventListener('input', applyFiltersAndRender);
  accountRoleFilter?.addEventListener('change', applyFiltersAndRender);
}

async function initAccounts() {
  bindAccountElements();

  if (window.appState?.user?.role !== 'admin') {
    if (accountsMainContent) accountsMainContent.style.display = 'none';
    return;
  }

  if (accountsMainContent) accountsMainContent.style.display = 'grid';

  bindAccountEventListeners();
  await loadUsers();
}
