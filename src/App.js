import React, { Component } from "react";
import "./App.css";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Switch } from "react-router-dom";

import GuestRoute from "./components/authroute/GuestRouter";
import ProtectedRoute from "./components/authroute/ProtectedRoute";

import LoginPage from "./components/auth/LoginPage";
import Layout from "./components/layout/Layout";
import Profile from "./components/manage-info/Profile";
import ManageEmployees from "./components/manage-employee/ManageEmployees";
import ManageUsers from "./components/manage-user/ManageUsers";
import ManageRestaurants from "./components/manage-restaurant/ManageRestaurants";

class App extends Component {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <div>
        {!isAuthenticated ? (
          <Layout>
            <Switch>
              <GuestRoute
                exact
                // location={location}
                path="/login"
                component={LoginPage}
              />
              <GuestRoute
                exact
                // location={location}
                path="/profile"
                component={Profile}
              />
              <GuestRoute
                exact
                // location={location}
                path="/employee"
                component={ManageEmployees}
              />
              <GuestRoute
                exact
                // location={location}
                path="/user"
                component={ManageUsers}
              />
              <GuestRoute
                exact
                // location={location}
                path="/restaurant"
                component={ManageRestaurants}
              />
            </Switch>
          </Layout>
        ) : (
          ""
        )}
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.employee.token
  };
}

export default connect(
  mapStateToProps,
  null
)(App);
