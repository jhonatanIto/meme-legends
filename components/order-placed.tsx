"use client";

import { useState } from "react";
import Input from "./util/contact-input";
import { X } from "lucide-react";
import Link from "next/link";
import { orderInfo } from "@/lib/order-info";

const OrderPlaced = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);

  const handleSubmit = async () => {
    if (!orderNumber || !email) {
      alert("fill all the fields");
    }
    const result = await orderInfo(Number(orderNumber), email);

    console.log(result);
  };

  return (
    <div>
      {" "}
      <p className="mt-5">
        Please enter your order number and the email to check order status
      </p>
      <Input
        name="orderNumber"
        placeholder="Your order number"
        type="number"
        value={orderNumber}
        setValue={setOrderNumber}
      />
      <p
        className="border-b  border-gray-700 hover:border-blue-600 w-fit mt-2 text-[14px] hover:text-blue-600 cursor-pointer"
        onClick={() => setModal(true)}
      >
        I cant't find my order number
      </p>
      <Input
        name="email"
        placeholder={"Email used when placing the order"}
        type="text"
        value={email}
        setValue={setEmail}
      />
      <button
        className="w-full py-3 font-semibold text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer"
        onClick={handleSubmit}
      >
        Confirm
      </button>
      <Modal modal={modal} setModal={setModal} />
    </div>
  );
};

const Modal = ({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      style={{ display: modal ? "flex" : "none" }}
      onClick={() => setModal(false)}
      className={`fixed inset-0  justify-center items-center bg-black/50 z-50 
         transition-all duration-200 ease-in-out`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-1 w-150"
      >
        <div className="flex justify-end ">
          <X onClick={() => setModal(false)} className="cursor-pointer" />
        </div>
        <div className="px-7 pb-7">
          <h1 className="font-semibold text-2xl">
            CAN'T FIND YOUR ORDER NUMBER?
          </h1>
          <p className="mt-6">
            Check your Inbox, Spam or Promotions folders. Look for an email with
            the subject:{" "}
            <span className="font-semibold">
              "Your order #... is confirmed"
            </span>
          </p>
          <p className="mt-2">
            Your order number is the 8-digit code (e.g., #B2A99TF9) found in
            that subject line or at the top of the message.
          </p>
          <div className="mt-5">
            <Link href={"/contact/something-else"}>
              <button className="w-full py-3 font-semibold text-gray-800 bg-zinc-100 rounded-4xl mt-5 cursor-pointer">
                I still can't find it, let me talk to support
              </button>
            </Link>

            <button
              className="w-full py-3 font-semibold text-white bg-[#3572df] rounded-4xl mt-5 cursor-pointer"
              onClick={() => setModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
