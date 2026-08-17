import React, { useState, useMemo } from 'react';
import styles from './Scoring.module.css';
import Modal from './Modal';
import { addScore, updateScore, deleteScore } from '../services/sheetApi';

const EMPTY = { programId: '', targetId: '', judge: '', score: '', remarks: '' };

export default function Scoring({ programs, participants, teams, scores, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const programMap = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);
  const participantMap = useMemo(() => Object.fromEntries(participants.map((p) => [p.id, p])), [participants]);
  const teamMap = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);

  const selectedProgram = programMap[form.programId];
  const targetType = selectedProgram ? selectedProgram.type : 'Individual';

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      programId: item.programId,
      targetId: item.teamId || item.participantId || '',
      judge: item.judge,
      score: item.score,
      remarks: item.remarks
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'programId') {
      setForm((prev) => ({ ...prev, programId: value, targetId: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        programId: form.programId,
        judge: form.judge,
        score: Number(form.score),
        remarks: form.remarks
      };
      if (targetType === 'Team') {
        payload.teamId = form.targetId;
        payload.participantId = '';
      } else {
        payload.participantId = form.targetId;
        payload.teamId = '';
      }
      if (editing) {
        payload.id = editing.id;
        await updateScore(payload);
      } else {
        await addScore(payload);
      }
      close();
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this score?')) return;
    setSaving(true);
    try {
      await deleteScore(id);
      onChange();
    } finally {
      setSaving(false);
    }
  };

  const displayTarget = (item) => {
    if (item.teamId) return teamMap[item.teamId]?.name || item.teamId;
    return participantMap[item.participantId]?.name || item.participantId;
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.addBtn} onClick={openAdd} disabled={saving}>+ Add Score</button>
      </div>
      {scores.length === 0 ? (
        <p className={styles.empty}>No scores recorded yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Program</th>
                <th>Participant / Team</th>
                <th>Judge</th>
                <th>Score</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((item) => (
                <tr key={item.id}>
                  <td>{programMap[item.programId]?.name || item.programId}</td>
                  <td>{displayTarget(item)}</td>
                  <td>{item.judge}</td>
                  <td>{item.score}</td>
                  <td>{item.remarks}</td>
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
      <Modal isOpen={isOpen} title={editing ? 'Edit Score' : 'Add Score'} onClose={close}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Program *</label>
          <select name="programId" value={form.programId} onChange={handleChange} required>
            <option value="">Select program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label>{targetType === 'Team' ? 'Team' : 'Participant'} *</label>
          {targetType === 'Team' ? (
            <select name="targetId" value={form.targetId} onChange={handleChange} required>
              <option value="">Select team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          ) : (
            <select name="targetId" value={form.targetId} onChange={handleChange} required>
              <option value="">Select participant</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          <label>Judge</label>
          <input name="judge" value={form.judge} onChange={handleChange} placeholder="Judge name" />

          <label>Score *</label>
          <input name="score" type="number" step="0.01" value={form.score} onChange={handleChange} required />

          <label>Remarks</label>
          <input name="remarks" value={form.remarks} onChange={handleChange} />

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
