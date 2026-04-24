"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Input from "./util/contact-input";
import { Upload } from "lucide-react";
import { receiveIssueMessage } from "@/lib/email";
import ButtonSubmit from "./util/button-submit";
import toast from "react-hot-toast";

const SomethingElse = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(receiveIssueMessage, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(
        "Your message has been sent successfully. Our team will get back to you soon.",
        { duration: 5000 },
      );
      formRef.current?.reset();
      setFileName(null);
      setEmail("");
      setName("");
      setMessage("");
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <form ref={formRef} className="mt-6" action={formAction}>
      <Input
        type="text"
        name="email"
        placeholder="Your email address"
        value={email}
        setValue={setEmail}
      />
      <Input
        type="text"
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
      <div className="mt-2 flex items-center cursor-pointer w-fit select-none">
        <input
          type="file"
          id="file"
          name="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file"
          className="flex items-center cursor-pointer w-fit select-none"
        >
          <Upload size={16} />
          <span className="ml-3">
            {fileName
              ? `Selected: ${fileName}`
              : `Upload attachment (optional)`}
          </span>
        </label>
      </div>
      <ButtonSubmit message={"Submit message"} />
    </form>
  );
};

export default SomethingElse;
