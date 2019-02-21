import React from 'react';
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({isAuthenticated, component: Component, ...rest}) => (
    <Route
        exact
        {...rest}
        render={props =>
            isAuthenticated ? <Component {...props} /> : <Redirect to="/login" /> }
    />
)

ProtectedRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.employee.token
    }
}

export default connect(mapStateToProps)(ProtectedRoute)
