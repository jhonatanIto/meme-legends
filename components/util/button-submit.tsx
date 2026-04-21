import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

const ButtonSubmit = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full flex items-center justify-center h-12  font-semibold
         text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer"
      disabled={pending}
    >
      {pending ? <Spinner /> : "Submit message"}
    </button>
  );
};

export default ButtonSubmit;
