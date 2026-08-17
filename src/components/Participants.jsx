import React, { useState } from 'react';
import styles from './Participants.module.css';
import Modal from './Modal';
import { addParticipant, updateParticipant, deleteParticipant } from '../services/sheetApi';

const EMPTY = { name: '', teamId: '', contact: '', gender: 'Male', age: '' };

export default function Participants({ participants, teams, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateParticipant(form);
      } else {
        await addParticipant(form);
      }
      close();
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this participant?')) return;
    setSaving(true);
    try {
      await deleteParticipant(id);
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const teamName = (id) => teams.find((t) => t.id === id)?.name || '-';

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.addBtn} onClick={openAdd} disabled={saving}>+ Add Participant</button>
      </div>
      {participants.length === 0 ? (
        <p className={styles.empty}>No participants added yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Contact</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{teamName(item.teamId)}</td>
                  <td>{item.contact}</td>
                  <td>{item.gender}</td>
                  <td>{item.age}</td>
                  <td className={styles.actions}>
                    <button className={styles.edit} onClick={() => openEdit(item)} disabled={saving}>Edit</button>
                    <button className={styles.delete} onClick={() => handleDelete(item.id)} disabled={saving}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={isOpen} title={editing ? 'Edit Participant' : 'Add Participant'} onClose={close}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Team</label>
          <select name="teamId" value={form.teamId} onChange={handleChange}>
            <option value="">No Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <label>Contact</label>
          <input name="contact" value={form.contact} onChange={handleChange} placeholder="Phone / email" />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Age</label>
          <input name="age" type="number" value={form.age} onChange={handleChange} />

          <div className={styles.formActions}>
            <button type="button" className={styles.cancel} onClick={close} disabled={saving}>Cancel</button>
            <button type="submit" className={styles.save} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
