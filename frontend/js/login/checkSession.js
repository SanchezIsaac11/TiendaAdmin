async function checkSession() {
    try {
        const res = await fetch(`${API_URL}/users/me`, { credentials: 'include' });

        if (!res.ok) {
            window.appState.user = null;
            return false;
        }

        const data = await res.json();
        window.appState.user = data;
        return true;
    } catch (error) {
        console.error("Error checking session:", error);
        window.appState.user = null;
        return false;
    }
}
