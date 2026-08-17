import React, { useState, useEffect } from 'react';
import styles from './AdminAccess.module.css';
import Modal from './Modal';

const ADMIN_PASSWORD = 'AiferOnam@123';
const STORAGE_KEY = 'onamIsAdmin';

export default function AdminAccess({ onUnlock, onLock }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Sync state with localStorage on load
  useEffect(() => {
    const storedStatus = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsAdmin(storedStatus);
  }, []);

  const openModal = () => {
    setPassword('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAdmin(true);
      setIsOpen(false);
      if (onUnlock) onUnlock();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
    setIsLogoutModalOpen(false);
    if (onLock) onLock();
  };

  return (
    <>
      {isAdmin ? (
        /* Logout Button (Unlocked State) */
        <button
          className={`${styles.fab} ${styles.logoutFab}`}
          onClick={() => setIsLogoutModalOpen(true)}
          aria-label="Admin logout"
          title="Logout Admin"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      ) : (
        /* Unlock Button (Locked State) */
        <button
          className={styles.fab}
          onClick={openModal}
          aria-label="Admin access"
          title="Admin Login"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5z" />
            <circle cx="12" cy="15" r="1.5" />
          </svg>
        </button>
      )}

      {/* Password Modal */}
      <Modal isOpen={isOpen} title="Admin Access" onClose={closeModal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Enter Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="Password"
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancel} onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className={styles.submit}>
              Unlock
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} title="Confirm Logout" onClose={() => setIsLogoutModalOpen(false)}>
        <div className={styles.logoutContent}>
          <p>Are you sure you want to log out of Admin mode?</p>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancel} onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className={styles.submit} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { STORAGE_KEY };