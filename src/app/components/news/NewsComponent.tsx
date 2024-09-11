import React from "react";
import { NewsItem } from "./types";
import { formatDateTime, getFirstFourSentences } from "./utils";

interface NewsComponentProps {
  item: NewsItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsImportant: (id: string) => void;
  onCopyLink: (id: string, url: string) => void;
  copiedLinks: { [key: string]: boolean };
}

const NewsComponent: React.FC<NewsComponentProps> = ({
  item,
  onMarkAsRead,
  onDelete,
  onMarkAsImportant,
  onCopyLink,
  copiedLinks,
}) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 w-4/5 mx-auto ${
        item.isRead ? "opacity-75" : ""
      } ${item.isImportant ? "border-2 border-yellow-400" : ""}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-black">{item.title}</h3>
          <span className="text-sm text-gray-500">
            {formatDateTime(item.published_on)}
          </span>
        </div>
        <p className="text-gray-600 mb-3">{getFirstFourSentences(item.body)}</p>
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
              onClick={() => onMarkAsRead(item.id)}
              className={`mr-2 px-3 py-1 rounded-full text-sm ${
                item.isRead
                  ? "bg-gray-300 text-gray-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {item.isRead ? "Mark as Unread" : "Mark as Read"}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="mr-2 px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={item.isImportant}
              onChange={() => onMarkAsImportant(item.id)}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">Important</label>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-3 flex justify-between items-center">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Read full article
        </a>
        <button
          onClick={() => onCopyLink(item.id, item.url)}
          className={`text-sm hover:underline transition-colors duration-300 ${
            copiedLinks[item.id] ? "text-red-500" : "text-blue-500"
          }`}
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default NewsComponent;
