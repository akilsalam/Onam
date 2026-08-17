import React from 'react';
import styles from './Sidebar.module.css';

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'programs', label: 'Programs' },
  { id: 'participants', label: 'Participants' },
  { id: 'teams', label: 'Teams' },
  { id: 'scoring', label: 'Scoring' },
  { id: 'leaderboard', label: 'Leaderboard' }
];

export default function Sidebar({ active, onSelect, menuOpen, onClose }) {
  return (
    <>
      {menuOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">
            <span className={styles.petalRing} />
            <span className={styles.center} />
          </div>
          <h1>Aifer Onam</h1>
          <button className={styles.close} onClick={onClose} aria-label="Close menu">×</button>
        </div>
        <nav className={styles.nav}>
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${active === item.id ? styles.active : ''}`}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
