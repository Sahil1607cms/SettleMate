import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './index.css';
import GroupForm from './components/GroupForm'
import Transactions from './components/Transactions';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<GroupForm/>}/>
        <Route path='/transactions' element={<Transactions/>}/>
        <Route />
      </Routes>
    </Router>
  )
}

export default App