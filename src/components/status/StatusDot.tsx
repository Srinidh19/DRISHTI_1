import React from 'react';

export const StatusDot: React.FC<{
  status?: 'online' | 'offline' | 'warning' | 'critical' | 'active';
  size?: 'sm' | 'md';
  pulse?: boolean;
}> = ({ status = 'online', size = 'sm', pulse = false }) => {
  let colorClass = 'bg-success';
  if (status === 'offline' || status === 'critical') colorClass = 'bg-critical';
  if (status === 'warning') colorClass = 'bg-warning';
  if (status === 'active') colorClass = 'bg-info';

  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <span className="relative inline-flex items-center justify-center">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colorClass}`}
        />
      )}
      <span className={`relative inline-block rounded-full ${sizeClass} ${colorClass}`} />
    </span>
  );
};
