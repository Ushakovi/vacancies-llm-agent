import ReactDOM from 'react-dom/client';
import { App } from './app/app';

const rootElement123 = document.getElementById('root');

if (!rootElement123) {
    throw new Error('Element with id app not found in the DOM');
}

const rootNode = ReactDOM.createRoot(rootElement123);
rootNode.render(<App />);
