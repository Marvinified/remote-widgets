import React from 'react';

interface EmailPreviewProps {
  subject: string;
  sender: string;
  preview: string;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, sender, preview, ...props }) => {
  return (
    <div className="email-preview" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }} {...props}>
      <h3 style={{ margin: '0 0 0.5rem' }}>{subject}</h3>
      <div style={{ color: '#666' }}>{sender}</div>
      <p style={{ margin: '0.5rem 0' }}>{preview}</p>
    </div>
  );
};

export default EmailPreview; 