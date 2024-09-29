import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Products from './pages/Products'
import Inventory from './pages/Inventory'


function App() {


  return <BrowserRouter>
    <Header />
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/products' element={<Products />} />
        <Route path='/stock' element={<Inventory />} />
      </Route>
      <Route path='/sign-in' element={<SignIn />} />
      {/* <Route path='/sign-up' element={<SignUp />} /> */}
    </Routes>
  </BrowserRouter>

}

export default App
