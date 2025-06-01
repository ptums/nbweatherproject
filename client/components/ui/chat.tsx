import React, { useEffect, useState } from "react";

// Import `useMutation` and `api` from Convex.
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { parseYearMonth } from "../utils";

// For demo purposes. In a real app, you'd have real user data.

const Chat = ({
  data,
  handleSearch,
  setMode,
}: {
  data: any;
  handleSearch: (query: string) => void;
  setMode: (mode: string) => void;
}) => {
  const sendMessage = useMutation(api.chat.sendMessage);

  // handleSearch

  const [newMessageText, setNewMessageText] = useState("");
  return (
    <div className="flex">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log({
            newMessageText,
          });
          const parsedMessage = parseYearMonth(newMessageText);

          if (parsedMessage?.dateQuery) {
            handleSearch(parsedMessage?.dateQuery as string);
            await sendMessage({
              view: parsedMessage?.view as string,
              dateQuery: parsedMessage?.dateQuery as string,
              results: JSON.stringify(data),
            });
          }
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="#table or #graph (optional) year month"
          autoFocus
          className="p-2 border rounded-lg mr-2"
          style={{
            minWidth: 350,
          }}
        />
        <button type="submit" disabled={!newMessageText}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="12" fill="#D3D3D3" />
            <line
              x1="12"
              y1="6"
              x2="12"
              y2="18"
              stroke="white"
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="12"
              x2="18"
              y2="12"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;
