import ReactDOM from 'react-dom/client';
import { App } from './app/app';

const rootElement1233 = document.getElementById('root');

if (!rootElement1233) {
    throw new Error('Element with id app not found in the DOM');
}

const rootNode = ReactDOM.createRoot(rootElement1233);
rootNode.render(<App />);
