import React, { useMemo } from 'react';
import styles from './Leaderboard.module.css';

export default function Leaderboard({ data }) {
  const { programs, participants, teams, scores } = data;

  const programMap = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);
  const participantMap = useMemo(() => Object.fromEntries(participants.map((p) => [p.id, p])), [participants]);
  const teamMap = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);

  const displayTarget = (item) => {
    if (item.teamId) return teamMap[item.teamId]?.name || item.teamId;
    return participantMap[item.participantId]?.name || item.participantId;
  };

  const participantTotals = {};
  const teamTotals = {};
  scores.forEach((s) => {
    const value = parseFloat(s.score) || 0;
    if (s.participantId) {
      participantTotals[s.participantId] = (participantTotals[s.participantId] || 0) + value;
      const teamId = participantMap[s.participantId]?.teamId;
      if (teamId) {
        teamTotals[teamId] = (teamTotals[teamId] || 0) + value;
      }
    }
    if (s.teamId) {
      teamTotals[s.teamId] = (teamTotals[s.teamId] || 0) + value;
    }
  });

  const topParticipants = Object.entries(participantTotals)
    .map(([id, total]) => ({
      id,
      name: participantMap[id]?.name || id,
      team: participantMap[id]?.teamId ? teamMap[participantMap[id].teamId]?.name || '-' : '-',
      total
    }))
    .sort((a, b) => b.total - a.total);

  const topTeams = Object.entries(teamTotals)
    .map(([id, total]) => ({ id, name: teamMap[id]?.name || id, total }))
    .sort((a, b) => b.total - a.total);

  const programResults = programs.map((p) => {
    const list = scores
      .filter((s) => s.programId === p.id)
      .map((s) => ({ name: displayTarget(s), score: parseFloat(s.score) || 0 }))
      .sort((a, b) => b.score - a.score);
    return { program: p, list };
  });

  return (
    <div className={styles.leaderboard}>
      <div className={styles.grid}>
        <div className={styles.panel}>
          <h3>Top Participants</h3>
          {topParticipants.length === 0 ? (
            <p className={styles.empty}>No individual scores yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {topParticipants.map((item, idx) => (
                  <tr key={item.id} className={idx === 0 ? styles.gold : ''}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.team}</td>
                    <td>{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.panel}>
          <h3>Top Teams</h3>
          {topTeams.length === 0 ? (
            <p className={styles.empty}>No team scores yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {topTeams.map((item, idx) => (
                  <tr key={item.id} className={idx === 0 ? styles.gold : ''}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={styles.programSection}>
        <h3>Program-wise Results</h3>
        {programResults.length === 0 ? (
          <p className={styles.empty}>No programs added yet.</p>
        ) : (
          <div className={styles.programGrid}>
            {programResults.map(({ program, list }) => (
              <div key={program.id} className={styles.programCard}>
                <h4>{program.name} <span className={styles.badge}>{program.type}</span></h4>
                {list.length === 0 ? (
                  <p className={styles.emptySmall}>No scores yet.</p>
                ) : (
                  <ol className={styles.list}>
                    {list.map((entry, idx) => (
                      <li key={idx}>
                        <span>{entry.name}</span>
                        <strong>{entry.score.toFixed(2)}</strong>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
