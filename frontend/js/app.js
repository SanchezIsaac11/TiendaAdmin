const sections = {
  inventory: {
    title: 'Inventario',
    html: 'html/inventory.html',
    js: 'js/inventory/inventory.js',
    init: 'initInventory'
  },
  sales: {
    title: 'Historial de Ventas',
    html: 'html/sales.html',
    js: 'js/sales/sales.js',
    init: 'initSales'
  }
};

let currentSection = null;
const loadedScripts = new Set();

const sectionContent = document.getElementById('sectionContent');
const sectionTitle = document.getElementById('sectionTitle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const btnMenu = document.getElementById('btnMenu');
const navItems = document.querySelectorAll('.nav-item');
const btnLogout = document.getElementById('btnLogout');

function onUserLoggedIn(user) {
  const userName = document.getElementById('sidebarUserName');
  const userRole = document.getElementById('sidebarUserRole');
  const salesNav = document.querySelector('.nav-item[data-section="sales"]');

  if (userName) userName.textContent = user?.name || 'Usuario';
  if (userRole) userRole.textContent = user?.role === 'admin' ? 'Administrador' : 'Cajero';
  if (salesNav) salesNav.style.display = user?.role === 'admin' ? '' : 'none';
}

async function loadSection(sectionKey) {
  const section = sections[sectionKey];
  if (!section) {
    sectionContent.innerHTML = '<div class="loading-section">Sección no encontrada.</div>';
    return;
  }

  if (currentSection === sectionKey) {
    closeSidebar();
    return;
  }

  sectionTitle.textContent = section.title;

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionKey);
  });

  sectionContent.innerHTML = '<div class="loading-section">Cargando...</div>';

  try {
    const res = await fetch(section.html);
    if (!res.ok) throw new Error(`Cannot load ${section.html}`);
    const html = await res.text();
    sectionContent.innerHTML = html;

    await loadSectionScript(section.js, section.init);

    currentSection = sectionKey;
  } catch (err) {
    console.error(`Error loading section "${sectionKey}":`, err);
    sectionContent.innerHTML = `
      <div class="loading-section" style="color: var(--color-danger, #dc2626);">
        Error al cargar la sección. Intenta de nuevo.
      </div>
    `;
  }

  closeSidebar();
}

function loadSectionScript(src, initFunctionName) {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(src)) {
      if (initFunctionName && typeof window[initFunctionName] === 'function') {
        window[initFunctionName]();
      }
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedScripts.add(src);
      if (initFunctionName && typeof window[initFunctionName] === 'function') {
        window[initFunctionName]();
      }
      resolve();
    };
    script.onerror = () => reject(new Error(`Error cargando script: ${src}`));
    document.body.appendChild(script);
  });
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
}

function toggleSidebar() {
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

btnMenu?.addEventListener('click', toggleSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

btnLogout?.addEventListener('click', () => {
  if (typeof logout === 'function') {
    logout();
  }
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const sectionKey = item.dataset.section;
    if (sectionKey) {
      loadSection(sectionKey);
    }
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  const hasSession = await checkSession();

  if (hasSession && window.appState.user) {
    onUserLoggedIn(window.appState.user);
    const appLayout = document.getElementById('appLayout');
    if (appLayout) appLayout.style.display = 'flex';
    loadSection('inventory');
  } else {
    showLogin();
  }
});
