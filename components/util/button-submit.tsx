import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

interface Props {
  message: string;
}

const ButtonSubmit = ({ message }: Props) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full flex items-center justify-center h-12  font-semibold
         text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer"
      disabled={pending}
    >
      {pending ? <Spinner /> : message}
    </button>
  );
};

export default ButtonSubmit;
