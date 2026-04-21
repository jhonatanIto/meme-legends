"use client";
import { useState } from "react";
import Input from "./util/contact-input";
import { Upload } from "lucide-react";
import { receiveIssueMessage } from "@/lib/email";
import ButtonSubmit from "./util/button-submit";

const SomethingElse = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form className="mt-6" action={receiveIssueMessage}>
      <Input
        name="email"
        placeholder="Your email address"
        value={email}
        setValue={setEmail}
      />
      <Input
        name="name"
        placeholder="Your name"
        value={name}
        setValue={setName}
      />

      <textarea
        required
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add message"
        className="w-full h-40  peer rounded-2xl py-4 px-5 border border-zinc-400 mt-5
             hover:border-zinc-800 focus:border-zinc-800 focus:outline-none resize-none"
      />
      <div className="mt-2 flex items-center cursor-pointer w-fit">
        <Upload size={16} />
        <span className="ml-3">Upload attachment (optional)</span>
      </div>
      <ButtonSubmit />
    </form>
  );
};

export default SomethingElse;
