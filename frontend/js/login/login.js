async function showLogin() {
    const loginRoot = document.getElementById('loginRoot');
    const appLayout = document.getElementById('appLayout');

    if (appLayout) {
        appLayout.style.display = 'none';
    }

    if (!loginRoot) return;

    try {
        const res = await fetch('html/login.html');
        if (!res.ok) throw new Error('Cannot load login.html');
        const html = await res.text();
        loginRoot.innerHTML = html;
        bindLoginForm();
    } catch (error) {
        console.error('Cannot load login.html:', error);
        loginRoot.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--color-danger, red);">
                Error al cargar la pantalla de login.
            </div>
        `;
    }
}

function bindLoginForm() {
    const form = document.getElementById('loginForm');
    const btnSubmit = document.getElementById('btnLoginSubmit');
    const usernameInput = document.getElementById('loginName');
    const passwordInput = document.getElementById('loginPassword');

    if (!form) return;

    usernameInput?.focus();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!name || !password) {
            showLoginMessage('Por favor completa todos los campos', 'error');
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Verificando...';

        try {
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body : JSON.stringify({ name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                showLoginMessage(data.message || 'Usuario o contraseña incorrectos', 'error');
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Iniciar Sesión';
                return;
            }

            window.appState.user = data.user;
            showLoginMessage('¡Bienvenido! Iniciando sesión...', 'success');

            hideLogin();
            onUserLoggedIn(data.user);
            loadSection('inventory');

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            showLoginMessage('Error de conexión con el servidor', 'error');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Iniciar Sesión';
        }
    });
}

function hideLogin() {
    const loginRoot = document.getElementById('loginRoot');
    const appLayout = document.getElementById('appLayout');

    if (loginRoot) {
        loginRoot.innerHTML = '';
    }
    if (appLayout) {
        appLayout.style.display = 'flex';
    }
}

function showLoginMessage(text, type = 'info') {
    const feedback = document.getElementById('loginFeedback');
    if (!feedback) return;

    feedback.style.display = 'block';
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = text;
}

async function logout() {
    try {
        await fetch(`${API_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        window.appState.user = null;
        showLogin();
    }
}
