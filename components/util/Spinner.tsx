interface Props {
  color: string;
}
const Spinner = ({ color }: Props) => {
  return (
    <div
      className={`${color === "white" ? "border-white" : "border-black"} w-5 h-5 border-2  border-t-transparent rounded-full animate-spin`}
    />
  );
};

export default Spinner;
