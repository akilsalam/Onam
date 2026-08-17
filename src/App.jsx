import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Programs from './components/Programs';
import Participants from './components/Participants';
import Teams from './components/Teams';
import Scoring from './components/Scoring';
import Leaderboard from './components/Leaderboard';
import AdminAccess, { STORAGE_KEY } from './components/AdminAccess';
import { fetchAllData } from './services/sheetApi';

const TABS = ['dashboard', 'programs', 'participants', 'teams', 'scoring', 'leaderboard'];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ programs: [], participants: [], teams: [], scores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await fetchAllData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const renderContent = () => {
    if (loading && data.programs.length === 0) {
      return <div className={styles.loading}>Loading Onam data...</div>;
    }
    if (error) {
      return (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button onClick={refresh} className={styles.refreshBtn}>Retry</button>
        </div>
      );
    }
    if (!isAdmin) {
      return <Dashboard data={data} />;
    }
    switch (activeTab) {
      case 'programs':
        return <Programs programs={data.programs} onChange={refresh} />;
      case 'participants':
        return <Participants participants={data.participants} teams={data.teams} onChange={refresh} />;
      case 'teams':
        return <Teams teams={data.teams} onChange={refresh} />;
      case 'scoring':
        return (
          <Scoring
            programs={data.programs}
            participants={data.participants}
            teams={data.teams}
            scores={data.scores}
            onChange={refresh}
          />
        );
      case 'leaderboard':
        return <Leaderboard data={data} />;
      case 'dashboard':
      default:
        return <Dashboard data={data} />;
    }
  };

  const handleSelect = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className={styles.app}>
      {isAdmin && (
        <Sidebar active={activeTab} onSelect={handleSelect} menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
      <div className={`${styles.main} ${!isAdmin ? styles.fullWidth : ''}`}>
        <Header
          active={isAdmin ? activeTab : 'dashboard'}
          loading={loading}
          onRefresh={refresh}
          onMenuToggle={() => setMenuOpen((o) => !o)}
          showMenu={isAdmin}
        />
        <div className={styles.content}>{renderContent()}</div>
      </div>

      {/* AdminAccess remains mounted so it can render the Logout button when logged in */}
      <AdminAccess 
        isAdmin={isAdmin} 
        onUnlock={() => setIsAdmin(true)} 
        onLock={() => setIsAdmin(false)} 
      />
    </div>
  );
}

export default App;