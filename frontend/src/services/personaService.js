const API = 'http://localhost:4000/api/personas';

export async function getPersonas() {
  const res = await fetch(API);
  return await res.json();
}

export async function getPersona(dni) {
  const res = await fetch(`${API}/${dni}`);
  return await res.json();
}

export async function createPersona(data) {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function updatePersona(dni, data) {
  await fetch(`${API}/${dni}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deletePersona(dni) {
  await fetch(`${API}/${dni}`, { method: 'DELETE' });
}