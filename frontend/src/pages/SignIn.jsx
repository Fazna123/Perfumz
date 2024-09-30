import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import swal from 'sweetalert'
import api from '../axios/api'

export default function SignIn() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ email: '', password: '' })

    useEffect(() => {
        const token = localStorage.getItem('PerfumzToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_PUBLIC_BASE_API}/api/user/login`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('PerfumzToken') || ''}`,
                },
                withCredentials: true, // Include if your API requires credentials
            });

            const data = response.data
            if (data.success === true) {
                localStorage.setItem("PerfumzToken", data.token)
                navigate('/dashboard')
            } else {
                swal('Login Failed')
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                swal('Error!', error?.response?.data.message,)
            } else {
                swal('Error', 'Something went wrong')
                console.log(error)
            }
        }


    }

    return (

        <div className="min-h-screen h-screen bg-[url('https://img.freepik.com/premium-photo/mystical-elixir-bottle-perfume-blue-smoke-white-clear-surface-png-transparent-background_94628-75661.jpg')] bg-cover bg-center bg-no-repeat bg-fixed flex justify-center items-center">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg fixed mt-[-50px]">
                <h1 className="text-3xl text-center font-semibold my-10 text-customTeal">Sign In</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-10">
                    <input
                        type="email"
                        placeholder="Enter email..."
                        id="email"
                        className="bg-teal-100 p-3 rounded-lg text-customTeal"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Enter password..."
                        id="password"
                        className="bg-teal-100 p-3 rounded-lg text-customTeal"
                        onChange={handleChange}
                        required
                    />
                    <button className="bg-customTeal text-white font-bold uppercase rounded-lg p-3 hover:opacity-80 disabled:opacity-70">
                        Login
                    </button>
                </form>
            </div>
        </div>

    )
}
