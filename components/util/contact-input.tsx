import React from "react";

interface Props {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  type: string;
}

const Input = ({ placeholder, value, setValue, name, type }: Props) => {
  return (
    <div className="relative w-full mt-5">
      <input
        required
        name={name}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder=" "
        type={type}
        className="w-full peer rounded-2xl py-4 px-5 border border-zinc-400 
             hover:border-zinc-800 focus:border-zinc-800 focus:outline-none"
      />
      <label
        className="absolute left-5 top-1 text-[11px] text-zinc-500 transition-all duration-200
      peer-placeholder-shown:top-1/2
      peer-placeholder-shown:-translate-y-1/2
      peer-placeholder-shown:text-base 

      pointer-events-none
      "
      >
        {placeholder}
      </label>
    </div>
  );
};

export default Input;
