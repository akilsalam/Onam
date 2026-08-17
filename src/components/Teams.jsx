import React, { useState } from 'react';
import styles from './Teams.module.css';
import Modal from './Modal';
import { addTeam, updateTeam, deleteTeam } from '../services/sheetApi';

const EMPTY = { name: '', color: '', captain: '' };

export default function Teams({ teams, onChange }) {
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
        await updateTeam(form);
      } else {
        await addTeam(form);
      }
      close();
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setSaving(true);
    try {
      await deleteTeam(id);
      onChange();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.addBtn} onClick={openAdd} disabled={saving}>+ Add Team</button>
      </div>
      {teams.length === 0 ? (
        <p className={styles.empty}>No teams added yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Captain</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <span className={styles.colorDot} style={{ backgroundColor: item.color || '#ccc' }} />
                    {item.color}
                  </td>
                  <td>{item.captain}</td>
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
      <Modal isOpen={isOpen} title={editing ? 'Edit Team' : 'Add Team'} onClose={close}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Team Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Team Color</label>
          <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Red, #ff0000" />

          <label>Captain</label>
          <input name="captain" value={form.captain} onChange={handleChange} />

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
