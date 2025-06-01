import React, { useEffect, useState } from "react";

// Import `useMutation` and `api` from Convex.
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { parseYearMonth } from "../utils";

// For demo purposes. In a real app, you'd have real user data.

const Chat = ({
  data,
  handleSearch,
}: {
  data: any;
  handleSearch: (query: string) => void;
}) => {
  const sendMessage = useMutation(api.chat.sendMessage);

  // handleSearch

  const [newMessageText, setNewMessageText] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const parsedMessage = parseYearMonth(newMessageText);

          await handleSearch(parsedMessage?.dateQuery as string);
          await sendMessage({
            view: parsedMessage?.view as string,
            dateQuery: parsedMessage?.dateQuery as string,
            results: JSON.stringify(data),
          });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
