import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Error from './pages/Error'
import Dashboard from './pages/Dashboard';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

function App(){
  return(

    <Router>
      <Routes>
        <Route path ="/signin" element = {<Signin/>} />
        <Route path ="/signup" element = {<Signup/>} />
        <Route path ="/dashboard" element = {<Dashboard/>} />
        <Route path ="*" element = {<Error/>} />
      </Routes>
    </Router>

  )
}

export default App;