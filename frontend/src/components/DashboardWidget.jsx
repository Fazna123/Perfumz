import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, AreaChart, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
import api from '../axios/api';

export default function DashboardWidget() {
    const [salesData, setSalesData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalAmountPerSaleData, setTotalAmountPerSaleData] = useState([])

    useEffect(() => {
        fetchSalesData();
        fetchProductsData();
        fetchTotalSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await api.get('/sales/get-sales');
            if (response.data.success) {
                setSalesData(response.data.salesData);
            }
        } catch (error) {
            console.error('Failed to fetch sales data', error);
        }
    };

    const fetchProductsData = async () => {
        try {
            const response = await api.get('/products/fetch');
            if (response.data.success) {
                setProductsData(response.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products data', error);
        }
    };

    const fetchTotalSalesData = async () => {
        try {
            const response = await api.get('/sales/total-sales');
            const { totalAmountPerSale, totalRevenue } = response.data;
            console.log(response.data)

            setTotalAmountPerSaleData(totalAmountPerSale)
            setTotalRevenue(totalRevenue);
        } catch (error) {
            console.error('Error fetching sales data', error);
        }
    };

    // data for Bar Chart (Sales per Month)
    const groupSalesByMonth = () => {
        const salesByMonth = { January: 0, February: 0, March: 0, April: 0, May: 0 }; // Add more months as needed

        totalAmountPerSaleData.forEach(sale => {
            const month = new Date(sale.purchasedDate).toLocaleString('default', { month: 'long' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = 0;
            }
            salesByMonth[month] += sale.totalCost;
        });

        return salesByMonth;
    };

    const salesByMonth = groupSalesByMonth();
    const barChartData = Object.keys(salesByMonth).map(month => ({
        month,
        totalCost: salesByMonth[month],
    }));

    // data for Pie Chart (Products by Category)
    const groupProductsByCategory = () => {
        const productsByCategory = {};
        productsData.forEach(product => {
            if (!productsByCategory[product.category]) {
                productsByCategory[product.category] = 0;
            }
            productsByCategory[product.category] += 1;
        });
        return productsByCategory;
    };

    const productsByCategory = groupProductsByCategory();
    const pieChartData = Object.keys(productsByCategory).map(category => ({
        name: category,
        value: productsByCategory[category],
    }));

    // Colors for Pie chart slices
    const COLORS = [
        '#FFB3BA',
        '#FFDFBA',
        '#FFFFBA',
        '#BAFFC9',
        '#BAE1FF',
    ];

    return (
        <div className='bg-cyan-100 w-[80%] mx-auto mt-10'>
            <div className="p-10">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-[10%]">

                    <div className="bg-red-100 p-6 rounded-lg shadow-lg">
                        <h6 className="text-xl font-semibold mb-2">Total Products</h6>
                        <p className="text-4xl font-bold">{productsData.length}</p>
                    </div>


                    <div className="bg-green-100 p-6 rounded-lg shadow-lg">
                        <h6 className="text-xl font-semibold mb-2">Total Sales</h6>
                        <p className="text-4xl font-bold">{salesData.length}</p>
                    </div>


                    <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
                        <h6 className="text-xl font-semibold mb-2">Total Revenue</h6>
                        <p className="text-4xl font-bold">${totalRevenue}</p>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h6 className="text-xl font-semibold mb-4">Sales per Month</h6>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart
                                data={barChartData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="totalCost" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>

                        {/* <BarChart width={500} height={300} data={barChartData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalCost" fill="#36A2EB" />
                        </BarChart> */}
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h6 className="text-xl font-semibold mb-4 text-teal-800">Products by Category</h6>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
