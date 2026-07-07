"use client";

export default function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = (data.get("name") as string) || "someone";
        const email = (data.get("email") as string) || "";
        const message = (data.get("message") as string) || "";
        const subject = encodeURIComponent(`New inquiry from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        );
        window.location.href = `mailto:hello@puravidaminds.com?subject=${subject}&body=${body}`;
      }}
      className="mt-6 space-y-5"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1.5 w-full rounded-xl border-2 border-carreta-red/20 bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-red dark:bg-[#1A1A2E] dark:text-carreta-eggshell dark:placeholder-carreta-eggshell/40"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1.5 w-full rounded-xl border-2 border-carreta-red/20 bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-red dark:bg-[#1A1A2E] dark:text-carreta-eggshell dark:placeholder-carreta-eggshell/40"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#1A1A2E] dark:text-carreta-eggshell"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-xl border-2 border-carreta-red/20 bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-carreta-red dark:bg-[#1A1A2E] dark:text-carreta-eggshell dark:placeholder-carreta-eggshell/40 resize-none"
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="submit"
        className="carreta-btn inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold shadow-lg shadow-carreta-red/25"
      >
        Send Message
      </button>
    </form>
  );
}
