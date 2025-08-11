document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const role = document.getElementById('registerRole').value;

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });
    const data = await res.json();
    alert(data.success ? 'Registered successfully!' : `Registration failed: ${data.message}`);
  } catch (err) {
    alert('Network error during registration');
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = data.redirect;
    } else {
      alert(`Login failed: ${data.message}`);
    }
  } catch (err) {
    alert('Network error during login');
  }
});
const { username, email, password, role } = req.body;

await db.execute(
  "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
  [username, email, hashedPassword, role]
);


