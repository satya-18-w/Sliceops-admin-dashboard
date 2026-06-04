import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { getSelf } from '../http/api';
import { Flex, Spin } from 'antd';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { AxiosError } from 'axios';


const getself = async () => {
    const { data } = await getSelf();
    return data
}
const Root = () => {
    const { setUser } = useAuthStore();
    const { data: selfData, isLoading, } = useQuery({
        queryKey: ["self"],
        queryFn: getself,
        retry: (failureCount: number, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                return false;
            }
            return failureCount < 3;
        }

    })
    useEffect(() => {
        if (selfData) {
            console.log("SelfData", selfData)
            setUser(selfData)
        }

    }, [selfData, setUser])

    if (isLoading) {
        return (
            <div>
                <Flex>
                    <p>Loading.....</p>

                </Flex>
            </div>
        )
    }
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default Root