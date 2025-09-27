import ReactDOM from 'react-dom/client';
import { App } from './app/app';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Element with id app not found in the DOM');
}

const rootNode = ReactDOM.createRoot(rootElement);
rootNode.render(<App />);
