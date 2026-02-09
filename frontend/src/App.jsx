import Login from './pages/Login'
import Register from './pages/Register'
import Error from './pages/Error'
import Dashboard from './pages/Dashboard';
import {Routes,Route} from 'react-router-dom';

function App(){
  return(
      <Routes>
        <Route path ="/login" element = {<Login/>} />
        <Route path ="/register" element = {<Register/>} />
        <Route path ="/dashboard" element = {<Dashboard/>} />
        <Route path ="*" element = {<Error/>} />
      </Routes>
  );
}

export default App;