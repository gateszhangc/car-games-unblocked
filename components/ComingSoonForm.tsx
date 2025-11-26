"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

interface ComingSoonFormProps {
  gameName: string;
}

export default function ComingSoonForm({ gameName }: ComingSoonFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const disabled = useMemo(() => status === "success", [status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setErrorMessage("That email does not look quite right.");
      return;
    }

    setStatus("success");
    setErrorMessage("");

    setTimeout(() => {
      router.push("/");
    }, 1200);
  }

  return (
    <form className="coming-form" onSubmit={handleSubmit}>
      <label htmlFor="coming-email">
        Leave your email and we will notify you as soon as the page is live:
      </label>
      <div className="coming-form__controls">
        <input
          id="coming-email"
          type="email"
          inputMode="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={disabled}
          aria-describedby="coming-form-status"
        />
        <button type="submit" disabled={disabled}>
          {status === "success" ? "Saved" : "Notify me"}
        </button>
      </div>
      <p id="coming-form-status" className="coming-form__status">
        {status === "success"
          ? "Thanks! We will email you when \"" + gameName + "\" is ready."
          : errorMessage}
      </p>
    </form>
  );
}
