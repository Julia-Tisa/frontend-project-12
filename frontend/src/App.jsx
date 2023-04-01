import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Page404 } from './Components/Page404.jsx';
import { PageForm } from './Components/PageForm.jsx';
import { PageMain } from './Components/PageMain.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Page404 />} />
        <Route path='/' element={<PageMain />} />
        <Route path="/login" element={<PageForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
