import { Layout, Card, Space, Form, Input, Checkbox, Button, Flex, Alert } from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons"
import { Logo } from "../../icons/logo"
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Credential } from "../../types";
import { getSelf, login, logout } from "../../http/api";
import { data } from "react-router-dom";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";
import { useLogoutUser } from "../../hooks/useLogoutUser";

const loginUser = async(userData: Credential) => {
    // Server Call Logic
    const { data }  = await login(userData);
    return data;

}

const getself = async () => {
    const {data} = await getSelf();
    return data
}

const Login = () => {
 
    const { isAllowed} = usePermission();
    const { setUser } = useAuthStore();
  


    const { data: selfData, refetch } = useQuery({
        queryKey: ["self"],
        queryFn: getself,
        enabled: false,
    })
    const { logoutMutate } = useLogoutUser(); 

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['Login'],
        mutationFn: loginUser,
        onSuccess: async () =>{
            // call /self endpoint
            const { data: fetchedSelfData } = await refetch();
            console.log("UserData", fetchedSelfData);
            

            // Logout or redirect to client Ui
            if (!isAllowed(fetchedSelfData)){
                logoutMutate();
             
                return;

            }



            // Store in the State
            setUser(fetchedSelfData)

            console.log("Logged in successfully")
            // Navigate to Dashboard
            
        },


    })
    return (

        <>


            <Layout
                style={
                    {
                        height: '100vh',
                        display: 'grid',
                        placeItems: "center",
                    }
                }>

                <Space orientation="vertical" align="center" size={"large"}>
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


                        variant={
                            "borderless"
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

                        }}
                        onFinish={(values) => {
                            mutate({email: values.username,password: values.password, role: "tenant-admin"});
                        }}>

                            {
                                isError && (
                                    <Alert 
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                    
                                    type="error" title={error?.message} showIcon />
                                )
                            }
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
                                <Input prefix={<UserOutlined />} placeholder="UserEmail"></Input>
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
                                    }}
                                    loading={isPending}>Log in</Button>

                            </Form.Item>

                        </Form>



                    </Card>

                </Space>
            </Layout>
        </>
    )
}

export default Login;