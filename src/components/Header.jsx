import React from 'react';
import styles from './Header.module.css';

export default function Header({ active, loading, onRefresh, onMenuToggle, showMenu = true }) {
  const title = active.charAt(0).toUpperCase() + active.slice(1);
  return (
    <header className={styles.header}>
      {showMenu && (
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      )}
      <h2>{title}</h2>
      <button onClick={onRefresh} className={styles.refresh} disabled={loading}>
        {loading ? 'Syncing...' : 'Refresh'}
      </button>
    </header>
  );
}
