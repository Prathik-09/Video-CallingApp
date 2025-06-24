import {useQueryClient,useMutation } from "@tanstack/react-query";
import { logout } from "../lib/api";
const useLogout = () => {
    const queryClient=useQueryClient();

    const{mutate}=useMutation({
        mutationFn:logout,
        onSuccess:queryClient.invalidateQueries({queryKey:["authUsers"]})
    })
    return {logoutMutation:mutate}
}

export default useLogout
