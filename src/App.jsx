import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { message } from 'antd';
import LoginPage from './pages/LoginPage.jsx'
import MainLayout from './pages/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RulesPage from './pages/RulesPage.jsx'
import SelectionPage from './pages/SelectionPage.jsx'
import MyChoicesPage from './pages/MyChoicesPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import ReviewPage from "./pages/ReviewPage.jsx";

function App() {
  const navigate = useNavigate();
  const hasWarnedRef = useRef(false);

  // useEffect(() => {
  //   const studentId = localStorage.getItem('studentId');
  //   if (!studentId && !hasWarnedRef.current) {
  //     hasWarnedRef.current = true;
  //     message.warning('请先登录');
  //     navigate('/login', { replace: true });
  //   }
  // }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="selection" element={<SelectionPage />} />
          <Route path="my-choices" element={<MyChoicesPage />} />
          <Route path="results" element={<ResultsPage />} />
           <Route path="review" element={<ReviewPage />} />
          {/* <Route path="teachers" element={<TeachersPage />} /> */}
          {/* <Route path="users" element={<UsersPage />} /> */}
        </Route>
        <Route path="*" element={<div style={{textAlign: 'center', padding: '50px'}}>404 - 页面未找到</div>} />
      </Routes>
    </>
  )
}

export default App
