import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'
import SearchPoint from './pages/SearchPoint'
import PointDetails from './pages/PointDetails'

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" />
            <Route component={SearchPoint} path="/search-point" />
            <Route component={PointDetails} path="/point-detail/:id" />
        </BrowserRouter>
    )
}

export default Routes