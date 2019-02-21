import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './login.scss'
import { Form, Icon, Input, Button, Checkbox, Divider, Alert } from 'antd';
import API from '../../helpers/api.js'
import { connect } from 'react-redux'
import { login } from '../../actions/user.js'

class LoginPage extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        error: false,
        loading: false,
        descriptionError: '',
      }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                const credentials = {
                    emp_username: values.emp_username,
                    emp_password: values.emp_password
                }
                this.props.login(credentials)
                .then((res) => {
                    if(res.data.status) {
                        this.setState({ loading: false })
                    } else {
                        this.setState({ loading: false, error: true, descriptionError: res.data.message })
                    }
                })
            }
        });
    }

    onClose = () => {
        this.setState({
            error: false
        })
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading, error, descriptionError, onClose } = this.state;
        return (
            <header className="hero">
                <div className="center-content">
                    <div style={{ padding: '40px 20px 20px 20px', width: '100%' }}>
                        <h3>Login Form</h3>
                        <Divider />
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            {
                                error && 
                                <Form.Item>
                                    <Alert
                                        message="Warning"
                                        description={descriptionError}
                                        type="error"
                                        closable
                                        onClose={this.onClose}
                                    />
                                </Form.Item>
                            }
                            <Form.Item>
                            {getFieldDecorator('emp_username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input name="emp_username" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username"/>
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('emp_password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input name="emp_password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"/>
                            )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Checkbox>Remember me</Checkbox>
                                )}
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}}>
                                {
                                    !loading ?
                                        <Button type="primary" htmlType="submit" className="login-form-button" size="large" block>
                                            Log in
                                        </Button>
                                    :
                                        <Button type="primary" shape="circle" align="middle" loading/>
                                }
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </header>
        );
    }
}

const WrappedLoginForm = Form.create({name: 'form_login'})(LoginPage)

WrappedLoginForm.propTypes = {
    login: PropTypes.func.isRequired
}

export default connect(null , { login })(WrappedLoginForm);