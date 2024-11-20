import { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { parseError } from "./utils";

const useToast = () => {
  const success = ({ message }: { message: string }) => {
    toast.success(message);
  };

  const error = ({ error }: { error: string }) => {
    toast.error(error);
  };

  const apiError = (error: unknown) => {
    const err = error as AxiosError;
    const errorMessage = parseError(err.response?.status);
    toast.error(errorMessage);
  };

  const promise = async (asyncFunction: () => Promise<void>) => {
    try {
      await asyncFunction();
      toast.success("Success");
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage = parseError(err.response?.status);
      toast.error(errorMessage);
    }
  };

  return { success, error, promise, apiError };
};

export default useToast;
