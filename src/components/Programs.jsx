import React, { useState } from 'react';
import styles from './Programs.module.css';
import Modal from './Modal';
import { addProgram, updateProgram, deleteProgram } from '../services/sheetApi';

const EMPTY = { name: '', category: '', type: 'Individual', maxParticipants: '', description: '' };

export default function Programs({ programs, onChange }) {
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
        await updateProgram(form);
      } else {
        await addProgram(form);
      }
      close();
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    setSaving(true);
    try {
      await deleteProgram(id);
      onChange();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.addBtn} onClick={openAdd} disabled={saving}>+ Add Program</button>
      </div>
      {programs.length === 0 ? (
        <p className={styles.empty}>No programs added yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Max</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.type}</td>
                  <td>{item.maxParticipants}</td>
                  <td>{item.description}</td>
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
      <Modal isOpen={isOpen} title={editing ? 'Edit Program' : 'Add Program'} onClose={close}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Arts, Sports" />

          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>

          <label>Max Participants</label>
          <input name="maxParticipants" type="number" value={form.maxParticipants} onChange={handleChange} />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" />

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
