import { Layout, Card, Space, Form, Input, Checkbox, Button, Flex } from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons"
import { Logo } from "../../icons/logo"
const Login = () => {
    return (
        // <div>
        //     <h1>LoginPage</h1>
        //     <input type="text" placeholder='Username' />
        //     <input type="password" placeholder='Password' />
        //     <label htmlFor="remember me">Remember me</label>
        //     <input type="checkbox" id='remember me' />
        //     <a href="#" >Forgot Password</a>
        //     <button>Log in</button>

        // </div>

        <>


            <Layout
                style={
                    {
                        height: '100vh',
                        display: 'grid',
                        placeItems: "center",
                    }
                }>

                <Space direction="vertical" align="center" size={"large"}>
                    <Layout.Content style={{
                        display: "Flex",
                        justifyContent: "center",
                        alignItems: "center",


                    }}>
                        <Logo />

                    </Layout.Content>
                    <Card
                        style={{
                            width: 300,
                            height: 500,

                        }}


                        bordered={
                            false
                        }
                        title={
                            <Space style={{
                                width: '100%',
                                fontSize: 16,
                                justifyContent: 'center',

                            }}>
                                <LockFilled />
                                "Log in"
                            </Space>

                        }>

                        <Form initialValues={{
                            remember: true,

                        }}>
                            <Form.Item name="username" rules={[
                                {
                                    required: true,
                                    message: "Please Enter Your Name"
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email"
                                }

                            ]}>
                                <Input prefix={<UserOutlined />} placeholder="Username"></Input>
                            </Form.Item>

                            <Form.Item name="password" rules={[
                                {
                                    required: true,
                                    message: "Enter Your Pasword"
                                },
                                {
                                    min: 6,
                                    message: "Pasword at least 6 charecter"

                                }
                            ]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" type="password" />

                            </Form.Item>
                            <Flex justify="space-between">
                                <Form.Item name="remember" valuePropName="checked">
                                    <Checkbox>Remember me</Checkbox>

                                </Form.Item>
                                <a href="#" id="login-form-forgot">Forgot Password</a>
                            </Flex>
                            <Form.Item  >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        width: "100%"
                                    }}>Log in</Button>

                            </Form.Item>

                        </Form>



                    </Card>

                </Space>
            </Layout>
        </>
    )
}

export default Login;