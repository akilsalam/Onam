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
              <div className={styles.brand}>
                <div className={styles.logo} aria-hidden="true">
                  <span className={styles.petalRing} />
                  <span className={styles.center} />
                </div>
                <h1>Aifer Onam</h1>
                {/* <button className={styles.close} onClick={onClose} aria-label="Close menu">×</button> */}
              </div>
      <button onClick={onRefresh} className={styles.refresh} disabled={loading}>
        {loading ? 'Syncing...' : 'Refresh'}
      </button>
    </header>
  );
}
