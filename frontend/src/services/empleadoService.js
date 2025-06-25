const API = 'http://localhost:3000/api/empleados';

export async function getEmpleados() {
  const res = await fetch(API);
  return await res.json();
}

export async function getEmpleado(id) {
  const res = await fetch(`${API}/${id}`);
  return await res.json();
}

export async function createEmpleado(data) {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function updateEmpleado(id, data) {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deleteEmpleado(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
}