import { APPS_SCRIPT_URL } from '../config';

export async function apiCall(action, payload = {}) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload })
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function fetchAllData() {
  return apiCall('getAll');
}

export async function addProgram(payload) {
  return apiCall('addProgram', payload);
}

export async function updateProgram(payload) {
  return apiCall('updateProgram', payload);
}

export async function deleteProgram(id) {
  return apiCall('deleteProgram', { id });
}

export async function addParticipant(payload) {
  return apiCall('addParticipant', payload);
}

export async function updateParticipant(payload) {
  return apiCall('updateParticipant', payload);
}

export async function deleteParticipant(id) {
  return apiCall('deleteParticipant', { id });
}

export async function addTeam(payload) {
  return apiCall('addTeam', payload);
}

export async function updateTeam(payload) {
  return apiCall('updateTeam', payload);
}

export async function deleteTeam(id) {
  return apiCall('deleteTeam', { id });
}

export async function addScore(payload) {
  return apiCall('addScore', payload);
}

export async function updateScore(payload) {
  return apiCall('updateScore', payload);
}

export async function deleteScore(id) {
  return apiCall('deleteScore', { id });
}

export async function fetchLeaderboard() {
  return apiCall('getLeaderboard');
}
