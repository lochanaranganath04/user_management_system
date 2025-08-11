window.onload = () => {
  fetch('/home')
    .then(res => res.json())
    .then(data => {
      const users = data.users;  // <-- updated

      const thead = document.querySelector("#user-table thead");
      if (thead) {
        thead.querySelectorAll("th").forEach(th => {
          th.style.fontWeight = "bold";
          th.style.fontSize = "1.1em";
        });
      }

      const tbody = document.getElementById("user-table-body");
      users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="border: 1px solid black; padding: 8px; width: 10%;">${user.user_id || 'ID'}</td>
          <td style="border: 1px solid black; padding: 8px; width: 20%;">${user.username || 'Unknown'}</td>
          <td style="border: 1px solid black; padding: 8px; width: 25%;">${user.email || 'Unknown'}</td>
          <td style="border: 1px solid black; padding: 8px; width: 15%;">${user.role !== undefined && user.role !== null && user.role !== '' ? user.role : 'N/A'}</td>
          <td style="border: 1px solid black; padding: 8px; color:${user.is_online ? 'green' : 'red'}; width: 10%;">${user.is_online ? 'Online' : 'Offline'}</td>
          <td style="border: 1px solid black; padding: 8px; width: 20%;">${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
        `;
        const table = document.getElementById("user-table-body").closest("table");
        if (table) table.style.width = "100%";
        tbody.appendChild(row);
      });
    });
};
