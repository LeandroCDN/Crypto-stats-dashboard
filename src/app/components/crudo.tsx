"use client";
import { useEffect, useState } from "react";
import { fetchCryptoNews } from "@/app/utils/api";

interface NewsItem {
  id: string;
  published_on: number;
  title: string;
  url: string;
  body: string;
  tags: string;
  isRead: boolean;
  isImportant: boolean;
}

export default function CrudoSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showImportantOnly, setShowImportantOnly] = useState(false);

  const handleGetNews = async () => {
    const newsData = await fetchCryptoNews();
    const formattedNews = newsData.map((item: any) => ({
      id: item.id,
      published_on: item.published_on,
      title: item.title,
      url: item.url,
      body: item.body,
      tags: item.tags,
      isRead: false,
      isImportant: false,
    }));
    setNews(formattedNews);

    const tagsSet = new Set<string>();
    formattedNews.forEach((item: { tags: string }) => {
      item.tags.split("|").forEach((tag) => tagsSet.add(tag));
    });
    const tags = Array.from(tagsSet);
    setAllTags(tags);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNews(
      news.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  };

  const handleMarkAsImportant = (id: string) => {
    setNews(
      news.map((item) =>
        item.id === id ? { ...item, isImportant: !item.isImportant } : item
      )
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredNews = news
    .filter((item) => (showImportantOnly ? item.isImportant : true))
    .filter(
      (item) =>
        selectedTags.length === 0 ||
        selectedTags.some((tag) => item.tags.split("|").includes(tag))
    );

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-white">Crypto News</h2>
      <button
        onClick={handleGetNews}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mb-6 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Get News
      </button>

      <div className="mb-6 w-full ">
        <h3 className="text-xl font-semibold text-white mb-3">
          Filter Options:
        </h3>
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="importantOnly"
            checked={showImportantOnly}
            onChange={() => setShowImportantOnly(!showImportantOnly)}
            className="mr-2"
          />
          <label htmlFor="importantOnly" className="text-whit">
            Show Important Only
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full transition duration-300 ease-in-out ${
                selectedTags.includes(tag)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full p-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
              expandedNews === item.id ? "col-span-full" : ""
            } ${item.isRead ? "opacity-75" : ""} ${
              item.isImportant ? "border-2 border-yellow-400" : ""
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-black">
                  {item.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(item.published_on)}
                </span>
              </div>
              <p className="text-gray-600 mb-3">
                {expandedNews === item.id
                  ? item.body
                  : `${item.body.substring(0, 100)}...`}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.split("|").map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className={`mr-2 px-3 py-1 rounded-full text-sm ${
                      item.isRead
                        ? "bg-gray-300 text-gray-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {item.isRead ? "Mark as Unread" : "Mark as Read"}
                  </button>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="mr-2 px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.isImportant}
                    onChange={() => handleMarkAsImportant(item.id)}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-600">Important</label>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-3 flex justify-between items-center">
              <button
                onClick={() =>
                  setExpandedNews(expandedNews === item.id ? null : item.id)
                }
                className="text-blue-500 hover:underline text-sm"
              >
                {expandedNews === item.id ? "Collapse" : "Expand"}
              </button>
              {expandedNews === item.id && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Read full article
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
