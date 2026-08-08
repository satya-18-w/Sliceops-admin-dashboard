import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { getSelf } from '../http/api';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { AppLogo } from '@/components/layout/AppLogo';


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
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50">
                <AppLogo />
                <div className="size-6 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-500" />
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