"use client";

import { useState } from "react";
import Input from "./util/contact-input";

const OrderPlaced = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div>
      {" "}
      <p className="mt-5">
        Please enter your order number and the email you used to place your
        order:
      </p>
      <Input
        name="orderNumber"
        placeholder={"Your order number"}
        value={orderNumber}
        setValue={setOrderNumber}
      />
      <p className="border-b  border-gray-700 hover:border-blue-600 w-fit mt-2 text-[14px] hover:text-blue-600">
        I cant't find my order number
      </p>
      <Input
        name="email"
        placeholder={"Email used when placing the order"}
        value={email}
        setValue={setEmail}
      />
      <button className="w-full py-3 font-semibold text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer">
        Continue
      </button>
    </div>
  );
};

export default OrderPlaced;
