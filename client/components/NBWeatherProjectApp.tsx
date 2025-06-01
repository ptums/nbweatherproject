import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useId, useState, useEffect } from "react";
import {
  SITE_DEFAULTS,
  WEAHTER_DATA_ENDPOINT,
  WEAHTER_QUERY_ENDPOINT,
} from "./utils/constants";
import {
  CompareWeatherData,
  DeleteWeatherQueryResponse,
  WeatherData,
  WeatherQueries,
} from "./utils/types";
import { buildApiUrl, buildComparionList, sortByDate } from "./utils";
import Chat from "./ui/chat";
import { CompareView, WeatherTable } from "./ui/displays";

export function NBWeatherProjectApp() {
  const generatedUniqueId = useId();
  const [uniqueId, setUniqueId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("table");
  const [compareList, setCompareList] = useState<CompareWeatherData[]>([]);

  // set user id in local storage and sets the default query as today's month
  useEffect(() => {
    const storedUniqueId = localStorage.getItem("unique_id");
    if (storedUniqueId) {
      setUniqueId(storedUniqueId);
    } else {
      localStorage.setItem("unique_id", generatedUniqueId);
      setUniqueId(generatedUniqueId);
    }

    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = now.getFullYear().toString();
    setQuery(`${currentMonth}-${currentYear}`);
  }, [generatedUniqueId]);

  // this queries the users history for the sidebar
  const {
    data: userQueries,
    isLoading: isLoadingQueries,
    error: queriesError,
    refetch,
  } = useQuery<WeatherQueries[], Error>({
    queryKey: ["userQueries", uniqueId],
    queryFn: async () => {
      if (!uniqueId) throw new Error("User ID not found");
      const path = `${WEAHTER_QUERY_ENDPOINT}/u/${uniqueId}`;
      const url = buildApiUrl(path);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch user queries");
      }
      return response.json();
    },
    enabled: !!uniqueId,
  });

  // this gets the weather data from the backend for display
  const fetchWeatherMutation = useMutation<
    WeatherData[],
    Error,
    { query: string; uniqueId: string }
  >({
    mutationFn: async ({ query, uniqueId }) => {
      const path = `${WEAHTER_DATA_ENDPOINT}/fetch-weather`;
      const url = buildApiUrl(path);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, uniqueId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      refetch();

      return response.json();
    },
  });

  // delete user weather query history
  const deleteWeatherMutation = useMutation<
    DeleteWeatherQueryResponse,
    Error,
    { id: string; uniqueId: string }
  >({
    mutationFn: async ({ id, uniqueId }) => {
      const path = `${WEAHTER_QUERY_ENDPOINT}/q/${id}/u/${uniqueId}`;
      const url = buildApiUrl(path);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // grab the latest list of queries by the user -- it should empty out the sidebar
      refetch();

      return response.json();
    },
    onError: (error) => {
      console.error("Error removing user from query:", error);
    },
    onSuccess: (data) => {
      console.log("User removed from query successfully", data);
    },
  });

  // transforms the weather data for comparison mode
  const handleComparisionList = (query: string, data: WeatherData[]) => {
    const newItem = buildComparionList(sortByDate(data), query);
    setCompareList((prevList) => [...prevList, newItem]);
  };

  // search button handler
  const handleSearch = (query: string, uniqueId: string) => {
    setQuery(query);

    fetchWeatherMutation.mutate(
      {
        query,
        uniqueId,
      },
      {
        onSuccess: (data) => {
          if (mode.includes("graph")) handleComparisionList(query, data);
          console.log({
            data,
          });
        },
      }
    );
  };

  // delete button handler
  const handleDeleteAll = async (
    userQueries: WeatherQueries[],
    uniqueId: string
  ) => {
    for (const query of userQueries) {
      await deleteWeatherMutation.mutateAsync({
        id: query.id.toString(),
        uniqueId: uniqueId,
      });
    }
  };

  return (
    <div className="p-4 h-screen overflow-hidden">
      <h1 className="text-xl font-semibold mb-2">{SITE_DEFAULTS.title}</h1>
      <div className="flex flex-row justify-between">
        <Chat
          data={fetchWeatherMutation.data}
          handleSearch={(searchQuery) => {
            if (uniqueId) {
              handleSearch(searchQuery, uniqueId);
            }
          }}
        />
        <button
          onClick={() => setMode(mode === "table" ? "graph" : "table")}
          className="underline"
        >
          {mode === "table" ? "Comparison " : "Table "}
          view
        </button>
      </div>
      <div className="flex flex-row justify-between mt-4 h-screen">
        <div className="w-1/6">
          {isLoadingQueries && (
            <div className="text-blue-500 mb-4">Loading user queries...</div>
          )}
          {queriesError && (
            <div className="text-red-500 mb-4">
              Error loading queries: {queriesError.message}
            </div>
          )}
          <div className="flex flex-col h-screen">
            <div className="flex-grow overflow-y-auto pb-16">
              {userQueries && (
                <div className="mb-4">
                  <h2 className="text-sm font-semibold mb-2">History</h2>
                  <ul className="text-sm">
                    {userQueries.map((q) => (
                      <li className="mb-2" key={q.id}>
                        <button
                          className="underline"
                          onClick={() => {
                            const user = q.users.find(
                              (user) => user.uniqueId === uniqueId
                            );
                            handleSearch(q.query, user?.uniqueId as string);
                          }}
                        >
                          {q.query}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {userQueries && userQueries.length > 0 && (
              <div className="w-1/6 fixed bottom-0 left-0 right-0 p-4">
                <button
                  onClick={() => {
                    handleDeleteAll(userQueries, uniqueId as string);
                  }}
                  className="w-11/12 text-left underline text-sm"
                >
                  Delete history
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded w-full">
          {mode.includes("table") && (
            <>
              {fetchWeatherMutation.isPending && (
                <div className="text-blue-500 mb-4">
                  Loading weather data...
                </div>
              )}
              {fetchWeatherMutation.isError && (
                <div className="text-red-500 mb-4">
                  Error: {fetchWeatherMutation.error.message}
                </div>
              )}
              {fetchWeatherMutation.isSuccess && (
                <>
                  <h2 className="text-lg font-semibold mb-2">{query}</h2>
                  <WeatherTable weatherData={fetchWeatherMutation.data} />
                </>
              )}
              {fetchWeatherMutation.status.includes("idle") && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-xl font-semibold">
                    Search for weather records
                  </p>
                </div>
              )}
            </>
          )}
          {mode.includes("graph") && (
            <>
              <h2 className="text-lg font-semibold">Compare months</h2>
              {fetchWeatherMutation.status.includes("idle") ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-xl font-semibold">
                    Compare weather records from history list
                  </p>
                </div>
              ) : (
                <>
                  <button
                    className="underline mb-2"
                    onClick={() => {
                      fetchWeatherMutation.reset();
                      setCompareList([]);
                    }}
                  >
                    Clear
                  </button>
                  <CompareView compareList={compareList} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
