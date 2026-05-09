const colors = {
  'Submitted':           { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  'Under Review':        { bg: 'rgba(234,179,8,0.15)',   color: '#eab308' },
  'Shortlisted':         { bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6' },
  'Interview Scheduled': { bg: 'rgba(168,85,247,0.15)',  color: '#a855f7' },
  'Rejected':            { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  'Selected':            { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
};

const StatusBadge = ({ status }) => {
  const c = colors[status] || colors['Submitted'];
  return (
    <span style={{
      background: c.bg, color: c.color,
      padding: '0.25rem 0.75rem', borderRadius: '20px',
      fontSize: '0.75rem', fontWeight: 700,
      letterSpacing: '0.04em',
    }}>
      {status}
    </span>
  );
};
export default StatusBadge;