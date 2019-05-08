import React, { Component } from "react";
import "./App.css";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Switch, Redirect } from "react-router-dom";

import GuestRoute from "./components/authroute/GuestRouter";
import ProtectedRoute from "./components/authroute/ProtectedRoute";

import LoginPage from "./components/auth/LoginPage";
import Layout from "./components/layout/Layout";
import Profile from "./components/manage-info/Profile";
import ManageEmployees from "./components/manage-employee/ManageEmployees";
import ManageUsers from "./components/manage-user/ManageUsers";
import ManageRestaurants from "./components/manage-restaurant/ManageRestaurants";
import InfoRate from "./components/rate/InfoRate.jsx";
import FoodChangeList from "./components/changelist/FoodChangeList.jsx";
import ChooseRestaurantComponent from "./components/comment/ChooseRestaurantComponent.jsx";
import ChooseEmployeeComponent from "./components/comment/ChooseEmployeeComponent.jsx";
import AccountComponent from "./components/ledger/AccountComponent";
import ExpenseComponent from "./components/ledger/ExpensesComponent.jsx";
import ReportLedgerComponent from "./components/report/ledger/ReportLedgerComponent.jsx";

class App extends Component {
  render() {
    const { isAuthenticated } = this.props;
    const pathName = this.props.location.pathname;
    if (!isAuthenticated && pathName !== "/login")
      return <Redirect to="/login" />;
    return (
      <div>
        {!isAuthenticated ? (
          <GuestRoute
            exact
            // location={location}
            path="/login"
            component={LoginPage}
          />
        ) : (
          <Layout>
            <Switch>
              <ProtectedRoute
                exact
                // location={location}
                path="/profile"
                component={Profile}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/employee"
                component={ManageEmployees}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/user"
                component={ManageUsers}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/restaurant"
                component={ManageRestaurants}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/rate"
                component={InfoRate}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/foodchangelist"
                component={FoodChangeList}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/comment/restaurant"
                component={ChooseRestaurantComponent}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/comment/employee"
                component={ChooseEmployeeComponent}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/ledger/account"
                component={AccountComponent}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/ledger/expense"
                component={ExpenseComponent}
              />
              <ProtectedRoute
                exact
                // location={location}
                path="/report/ledger"
                component={ReportLedgerComponent}
              />
            </Switch>
          </Layout>
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
