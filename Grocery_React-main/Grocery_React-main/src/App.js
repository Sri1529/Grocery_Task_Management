
import './App.css';

import { Route,Routes } from 'react-router-dom';
import Dash from './welcome';
import Login from './Login';
import GroupComponent from './Groups';

function App() {
  return (
    <div className="App">
      <Routes>
       <Route path='/' element={<Login></Login>} />
        <Route path='/StudentTable' element={<Dash></Dash>} />
        <Route path='/Groups/:groupName' element={<GroupComponent />} />
       

       </Routes>
    </div>
  );
}

export default App;
