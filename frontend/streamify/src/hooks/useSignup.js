import { useMutation,useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
const useSignup = () => {
const queryClient=useQueryClient();
const { isPending, error, mutate } = useMutation({
  mutationFn:signup,
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUsers"] }); // ✅ refetch user
      navigate("/"); // ✅ redirect to homepage after successful signup
    }
  
});
return {error,isPending,signupMutation:mutate};
}

export default useSignup
