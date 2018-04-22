import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dots from './Dots';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Dots />, document.getElementById('root'));
registerServiceWorker();
