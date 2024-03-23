import { Grid } from '@mui/material'
import React from 'react'
import Achivements from './Achivements'
import MonthlyOverview from './MonthlyOverview'
import ProductTable from './ProductTable'
import OrdersTable from './OrdersTable'

const AdminDashboard = () => {
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Achivements />
                </Grid>
                <Grid item xs={12} md={8}>
                    <MonthlyOverview />
                </Grid>
                <Grid item xs={12} md={12}>
                   <OrdersTable/>
                </Grid>
            </Grid>
        </div>
    )
}

export default AdminDashboard