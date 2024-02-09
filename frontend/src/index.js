import './main.css';
import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Provider } from 'react-redux';
import StartPage from './pages/start';
import store from './store'
import InfoPage from './pages/info';
import GradesPage from './pages/grades';
import GenderPage from './pages/gender';
import QuestionPage from './pages/question';
import FinishedPage from './pages/finished';
import RouteController from './components/RouteController';
import LookingForPage from './pages/lookingFor';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RouteController>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/gender" element={<GenderPage />} />
            <Route path="/gender" element={<GenderPage />} />
            <Route path="/looking-for" element={<LookingForPage />} />
            <Route path="/question/:q" element={<QuestionPage />} />
            <Route path="/finished" element={<FinishedPage />} />
          </Routes>
        </RouteController>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
