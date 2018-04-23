import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DotsEditor from './DotsEditor';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<DotsEditor />, document.getElementById('root'));
registerServiceWorker();
