import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles/index.scss'
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

//for client rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);

//ssr
// ReactDOM.hydrateRoot(
//   document.getElementById('root'),
//   <QueryClientProvider client={queryClient}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
     
//   </QueryClientProvider>
// )


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
