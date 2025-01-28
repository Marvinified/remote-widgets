import React, { useState } from 'react';

interface WindowWithWidgets {
  [key: string]: React.ComponentType<Record<string, unknown>>;
}

// declare global {
//   interface Window {
//     React: typeof React;
//   }
// }

interface RemoteRenderProps {
  url: string;
  props?: Record<string, unknown>;
}

export const RemoteRender: React.FC<RemoteRenderProps> = ({ url, props = {} }) => {
  const [DynamicWidget, setDynamicWidget] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWidget = async (widgetUrl: string) => {
    try {
      const response = await fetch(widgetUrl);
      if (!response.ok) throw new Error('Failed to load widget');
      
      const widgetCode = await response.text();
      
      // Ensure React is available globally
      window.React = React;
      
      // Create a new script element and append it to the document
      const script = document.createElement('script');
      script.textContent = widgetCode;
      document.body.appendChild(script);

      // The widget will be available on the window object with its name
      const widgetName = widgetUrl.split('/').pop()?.replace('.js', '') || '';
      const windowWithWidgets = window as unknown as WindowWithWidgets;
      const widgetModule = windowWithWidgets[widgetName];

      if (!widgetModule) {
        throw new Error('Widget failed to load properly');
      }

      setDynamicWidget(() => widgetModule);
      setError(null);

      // Clean up
      document.body.removeChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load widget');
      setDynamicWidget(null);
    }
  };

  React.useEffect(() => {
    loadWidget(url);
  }, [url]);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return DynamicWidget ? <DynamicWidget {...props} /> : null;
};
