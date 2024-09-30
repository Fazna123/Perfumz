
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import swal from 'sweetalert'

function Header() {
    const navigate = useNavigate()


    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const [token, setToken] = useState("")

    const isActive = (path) => location.pathname === path

    useEffect(() => {
        const token = localStorage.getItem("PerfumzToken")
        setToken(token)
    }, [location])

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleSignout = async (e) => {
        try {
            localStorage.removeItem("PerfumzToken")
            navigate('/sign-in')
        } catch (error) {
            console.log(error)
            swal('Failed to Logout')
        }
    }

    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    return (
        <div className='bg-customTeal sticky top-0 z-50'>
            <div className='flex justify-between items-center mx-auto py-4 px-10'>
                {/* <Link to={'/'}>
                    <h3 className='text-red-900 rounded-lg font-extrabold text-3xl'>PerfumZ</h3>
                </Link> */}
                {token ? (
                    <Link to={'/'}>
                        <h3 className='text-white rounded-lg font-extrabold text-3xl cursor-pointer'>PerfumZ</h3>
                    </Link>
                ) : (
                    <Link to={'/sign-in'}>
                        <h3 className='text-white rounded-lg font-extrabold text-3xl cursor-pointer'>PerfumZ</h3>
                    </Link>
                )}

                <button
                    className={`block lg:hidden p-3 text-white`}
                    onClick={toggleMenu}
                >
                    <span className="text-2xl">☰</span>
                </button>


                <div className='hidden lg:flex lg:items-center lg:space-x-7 '>
                    <ul className='flex flex-row gap-7'>

                        {token ? (
                            <>
                                <Link to={'/'}>
                                    <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/') ? 'bg-white text-teal-800' : ''}`}>Dashboard</li>
                                </Link>
                                <Link to={'/products'}>
                                    <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/products') ? 'bg-white text-teal-800' : ''}`}>Products</li>
                                </Link>
                                <Link to={'/stock'}>
                                    <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/stock') ? 'bg-white text-teal-800' : ''}`}>Inventory</li>
                                </Link>
                                <Link to={'/clients'}>
                                    <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/clients') ? 'bg-white text-teal-800' : ''}`}>Clients</li>
                                </Link>
                                <Link to={'/sales'}>
                                    <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/sales') ? 'bg-white text-teal-800' : ''}`}>Sales</li>
                                </Link>
                                <button onClick={handleSignout} className=" text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ">SignOut</button>
                            </>
                        ) : (
                            <>
                                <Link to={'/sign-in'}>
                                    <li className="text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white">SignIn</li>
                                </Link>
                                {/* <Link to={'/sign-up'}>
                                    <li className="text-red-900 font-bold p-3 rounded-lg hover:text-white hover:bg-red-700">SignUp</li>
                                </Link> */}
                            </>
                        )}


                    </ul>
                </div>



            </div>
            <div className={`lg:hidden absolute top-16 right-0 bg-customTeal w-full ${isMenuOpen ? 'block' : 'hidden'}`}>
                <ul className='flex flex-col gap-4'>

                    {token ? (
                        <>
                            <Link to={'/dashboard'}>
                                <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/') ? 'bg-white text-teal-800' : ''}`}>Dashboard</li>
                            </Link>
                            <Link to={'/products'}>
                                <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/products') ? 'bg-white text-teal-800' : ''}`}>Products</li>
                            </Link>
                            <Link to={'/stock'}>
                                <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/stock') ? 'bg-white text-teal-800' : ''}`}>Inventory</li>
                            </Link>
                            <Link to={'/clients'}>
                                <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/clients') ? 'bg-white text-teal-800' : ''}`}>Clients</li>
                            </Link>
                            <Link to={'/sales'}>
                                <li className={`text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ${isActive('/sales') ? 'bg-white text-teal-800l' : ''}`}>Sales</li>
                            </Link>
                            <button onClick={handleSignout} className=" text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white ">SignOut</button>
                        </>

                    ) : (
                        <>
                            <Link to={'/sign-in'}>
                                <li className="text-white font-bold p-3 rounded-lg hover:text-customTeal hover:bg-white">SignIn</li>
                            </Link>
                            {/* <Link to={'/sign-up'}>
                                <li className="text-red-900 font-bold p-3 rounded-lg hover:text-white hover:bg-red-700">SignUp</li>
                            </Link> */}
                        </>
                    )}

                </ul>
            </div>
        </div>
    )
}

export default Header