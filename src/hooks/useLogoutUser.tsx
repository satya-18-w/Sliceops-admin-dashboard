import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import { useAuthStore } from "../store";


export const useLogoutUser = () => {
    const { logout: logoutFromStore } = useAuthStore();

    const { mutate: logoutMutate} = useMutation({
        mutationKey: ["logout"],
        mutationFn: logout,
        onSuccess: () =>{
            logoutFromStore();

        }
    });
    return { logoutMutate};
};  