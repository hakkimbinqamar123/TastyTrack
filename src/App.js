import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import Signup from './screens/Signup.js';
import { CartProvider } from './components/ContextReducer.js';
import MyOrder from './screens/MyOrder.js';
import Cart from './screens/Cart.js';
import Profile from './screens/Profile.js';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/createuser' element={<Signup />} />
          <Route path='/myorder' element={<MyOrder />} />
          <Route path='/add-to-cart' element={<Cart />} />
          <Route path='/customerprofile' element={<Profile/>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>

  );
}

export default App;


