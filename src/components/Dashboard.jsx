import React, { useMemo } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard({ data }) {
  const { programs = [], participants = [], teams = [], scores = [] } = data;

  const programMap = useMemo(() => Object.fromEntries(programs.map((p) => [p.id, p])), [programs]);
  const participantMap = useMemo(() => Object.fromEntries(participants.map((p) => [p.id, p])), [participants]);
  const teamMap = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);

  const displayTarget = (s) => {
    if (s.teamId) return teamMap[s.teamId]?.name || s.teamId;
    return participantMap[s.participantId]?.name || s.participantId;
  };

  const teamTotals = useMemo(() => {
    const totals = {};
    scores.forEach((s) => {
      const value = parseFloat(s.score) || 0;
      if (s.participantId) {
        const teamId = participantMap[s.participantId]?.teamId;
        if (teamId) totals[teamId] = (totals[teamId] || 0) + value;
      }
      if (s.teamId) {
        totals[s.teamId] = (totals[s.teamId] || 0) + value;
      }
    });
    return totals;
  }, [scores, participantMap]);

  const teamRankings = useMemo(() => {
    return teams
      .map((t) => ({ ...t, total: teamTotals[t.id] || 0 }))
      .sort((a, b) => b.total - a.total);
  }, [teams, teamTotals]);

  // const latestScores = [...scores].reverse().slice(0, 5);

    const programResults = programs.map((p) => {
    const list = scores
      .filter((s) => s.programId === p.id)
      .map((s) => ({ name: displayTarget(s), score: parseFloat(s.score) || 0 }))
      .sort((a, b) => b.score - a.score);
    return { program: p, list };
  });

    const participantTotals = {};
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


  return (
    <div className={styles.dashboard}>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.orange}`}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </span>
          <span className={styles.count}>{programs.length}</span>
          <span className={styles.label}>Programs</span>
        </div>
        <div className={`${styles.card} ${styles.green}`}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </span>
          <span className={styles.count}>{participants.length}</span>
          <span className={styles.label}>Participants</span>
        </div>
        <div className={`${styles.card} ${styles.blue}`}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
          </span>
          <span className={styles.count}>{teams.length}</span>
          <span className={styles.label}>Teams</span>
        </div>
        <div className={`${styles.card} ${styles.gold1}`}>
          <span className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
          </span>
          <span className={styles.count}>{scores.length}</span>
          <span className={styles.label}>Score Entries</span>
        </div>
      </div>

      <div className={styles.podiumSection}>
        <h3>Team Leaderboard</h3>
        <div className={styles.podium}>
          {teamRankings.slice(0, 3).map((team, idx) => (
            <div
              key={team.id}
              className={`${styles.podiumCard} ${idx === 0 ? styles.first : idx === 1 ? styles.second : styles.third}`}
            >
              <span className={styles.rank}>
                {idx === 0 ? 'Champion' : idx === 1 ? 'Runners' : '2nd Runners'}
              </span>
              <span className={styles.cup}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                </svg>
              </span>
              <span className={styles.podiumName}>
                <span className={styles.podiumDot} style={{ backgroundColor: team.color || '#fff' }} />
                {team.name}
              </span>
              <span className={styles.podiumScore}>{team.total.toFixed(2)} pts</span>
            </div>
          ))}
          {teamRankings.length > 3 && (
            <div className={`${styles.podiumCard} ${styles.fourth}`}>
              <span className={styles.rank}>4th Place</span>
              <span className={styles.cup}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M9.5 13.5 7 22l5-3 5 3-2.5-8.5" />
                </svg>
              </span>
              <span className={styles.podiumName}>
                <span className={styles.podiumDot} style={{ backgroundColor: teamRankings[3].color || '#fff' }} />
                {teamRankings[3].name}
              </span>
              <span className={styles.podiumScore}>{teamRankings[3].total.toFixed(2)} pts</span>
            </div>
          )}
        </div>
        {teamRankings.length > 4 && (
          <ul className={styles.otherTeams}>
            {teamRankings.slice(4).map((team, idx) => (
              <li key={team.id}>
                <span className={styles.otherRank}>{idx + 5}</span>
                <span className={styles.podiumDot} style={{ backgroundColor: team.color || '#ccc' }} />
                <span className={styles.otherName}>{team.name}</span>
                <span className={styles.otherScore}>{team.total.toFixed(2)} pts</span>
              </li>
            ))}
          </ul>
        )}
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

      {/* <div className={styles.section}>
        <h3>Latest Scores</h3>
        {latestScores.length === 0 ? (
          <p className={styles.empty}>No scores recorded yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Program</th>
                <th>Participant / Team</th>
                <th>Judge</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {latestScores.map((s) => (
                <tr key={s.id}>
                  <td>{programMap[s.programId]?.name || s.programId}</td>
                  <td>{displayTarget(s)}</td>
                  <td>{s.judge}</td>
                  <td>{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </div>
  );
}
