async function checkSession() {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            credentials: 'include'
        });

        if (!res.ok) {
            user = null;
            return;
        }

        const data = await res.json();

        user = {
            id: data.id,
            name: data.name,
            role: data.role
        };

    } catch (error) {
        console.error("Error checking session:", error);
        user = null;
    }
}