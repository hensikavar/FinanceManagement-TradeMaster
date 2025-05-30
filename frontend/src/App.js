import './App.css';
import logo from './logo.svg';
import {BrowserRouter , Routes , Route} from "react-router-dom";
import { ToastContainer , toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Navebar from './components/Navebar';
import Dashboard from './components/Dashboard';
import Charts from './components/Charts';
import AfterSigninLayout from './components/AfterSigninLayout';
import Parties from './components/Parties';
import Items from './components/Items';
import Paymentin from './components/Paymentin';
import Sales from './components/Sales';
import Purchase from './components/Purchase';
import Paymentout from './components/Paymentout';
import SalePdf from './components/salepdf';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/salepdf' element={<SalePdf />}/>
          <Route path='/layout' element={<AfterSigninLayout/>}>
            <Route index element={<Dashboard/>}></Route>
            <Route path='/layout/parties' element={<Parties/>}/>
            <Route path='/layout/items' element={<Items/>}/>
            <Route path='/layout/paymentin' element={<Paymentin/>}/>
            <Route path='/layout/sales' element={<Sales/>}/>
            <Route path='/layout/paymentout' element={<Paymentout/>}/>
            <Route path='/layout/purchase' element={<Purchase/>}/>
          </Route>
        </Routes>
        <ToastContainer theme='dark'/>
      </div>
    </BrowserRouter>
  );
}

export default App;
