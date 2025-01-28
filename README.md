# Remote Widgets

Remote Widgets allows you to dynamically render react components from a URL during runtime.

```jsx
<RemoteRender
    url="http://localhost:3000/email/Email.js"
    props={{
        subject: 'Important Meeting',
        sender: 'john@example.com',
        preview: "Let's discuss the project updates...",
    }}
/>
```

**Remote Widget** consist of two packages to enable rendering remote components:

-   `@remote-widget/build`: A build tool to compile your own widget components for distribution
-   `@remote-widget/render`: A runtime package to render the compiled widgets

## Quick Start 

1. **Installation**
    ```bash
    yarn add @remote-widget/render
    ```

2. **Render a remote widget**

    To see remote widget in action, you can render any of the widgets in [cli/sample/built](https://github.com/Marvinified/remote-widgets/blob/main/cli/sample/built).

    ```jsx
    ...
    import { RemoteRender } from '@remote-widgets/render'
    ...
    <RemoteRender
        url="https://raw.githubusercontent.com/Marvinified/remote-widgets/refs/heads/main/cli/sample/built/EmailPreview.js"
        props={{
            subject: 'Important Meeting',
            sender: 'john@example.com',
            preview: "Let's discuss the project updates...",
        }}
    />
    ...
    ```

    You can find the corresponding jsx code in [cli/sample/built](https://github.com/Marvinified/remote-widgets/blob/main/cli/sample/widgets)



## Building your own Widgets

1. Create your standalone react component 

    ```jsx filename="src/widgets/EmailPreview.tsx"
    // src/EmailPreview.tsx

    import React from 'react';

    interface EmailPreviewProps {
    subject: string;
    sender: string;
    preview: string;
    }

    const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, sender, preview }) => {
    return (
        <div className="email-preview" style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>{subject}</h3>
        <div style={{ color: '#666' }}>{sender}</div>
        <p style={{ margin: '0.5rem 0' }}>{preview}</p>
        </div>
    );
    };

    export default EmailPreview; 
    ```

2. Build your compoent as a remote widget

    ```bash
    npx @remote-widgets/build src/EmailPreview.tsx
    ```

    Component is built into ./dist/widgets/Email/EmailPreview

3. Serve your components

    Locally you can serve your remote component using `serve` or any local live server you wish.

    ```bash
    npx serve ./dist/widgets --cors
    ```

    > Note: you componentsa will not load if there are cors issues from the hosting server.


    In production, you can host the files on vercel or similar service as static files.

4. Render your Component

    ```jsx
    <RemoteRender
        url="http://localhost:3000/email/EmailPreview.js"
        props={{
            subject: 'Important Meeting',
            sender: 'john@example.com',
            preview: "Let's discuss the project updates...",
        }}
    />
    ```

### Build Options

- **Multi Component Build:** You can use a glob pattern instead of a file name - `npx @remote-widgets/build src/**/widgets/*.tsx`

- **Watch:** Watch for file changes and rebuild component usine `--watch` flag, useful for development - `npx @remote-widgets/build src/**/widget/*.tsx --watch`











