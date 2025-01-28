import React from 'react';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, ...props }) => {
  return (
    <div className="event-card" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f8f9fa' }} {...props}>
      <h3 style={{ margin: '0 0 0.5rem' }}>{title}</h3>
      <div style={{ color: '#666', marginBottom: '0.5rem' }}>
        <span role="img" aria-label="calendar">📅</span> {date}
      </div>
      <div style={{ color: '#666' }}>
        <span role="img" aria-label="location">📍</span> {location}
      </div>
    </div>
  );
};

export default EventCard; 