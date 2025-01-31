import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const clientId = process.env.REACT_APP_NAVER_MAPS_CLIENT_ID;

const script = document.createElement('script');
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
script.async = true;

script.onload = () => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
};

document.head.appendChild(script);
