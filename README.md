# Remote Widgets

Remote Widgets allows you to dynamically render react components from a URL during runtime.

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







