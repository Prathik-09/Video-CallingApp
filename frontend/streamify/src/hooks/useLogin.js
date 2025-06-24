import { useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
const useLogin = () => {
const queryClient=useQueryClient();
 const {mutate,isPending,error}=useMutation({
    mutationFn:login,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUsers"]}),
  });
  return {error,isPending,loginMutation:mutate};
}

export default useLogin
