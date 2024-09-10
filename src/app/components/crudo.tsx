"use client";
import { useEffect, useState } from "react";
import { fetchCryptoNews, fetchFinancialNews } from "@/app/utils/api";
import { jsPDF } from "jspdf";

interface NewsItem {
  id: string;
  published_on: number;
  title: string;
  url: string;
  body: string;
  tags: string;
  isRead: boolean;
  isImportant: boolean;
  source_info: {
    name: string;
  };
}

export default function CrudoSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );

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
      source_info: item.source_info,
    }));

    const allNews = [...formattedNews];
    setNews(allNews);

    const tagsSet = new Set<string>();
    formattedNews.forEach((item: { tags: string }) => {
      item.tags.split("|").forEach((tag) => tagsSet.add(tag));
    });
    const tags = Array.from(tagsSet);
    setAllTags(tags);
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
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

  const getFirstFourSentences = (text: string) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 4).join(" ");
  };

  const handleDownloadImportant = () => {
    const doc = new jsPDF();
    const importantNews = news.filter((item) => item.isImportant);

    let yPosition = 10;
    const pageHeight = doc.internal.pageSize.height;

    importantNews.forEach((item, index) => {
      const title = item.title;
      const body = getFirstFourSentences(item.body);
      const publishedDate = `Published: ${formatDateTime(item.published_on)}`;
      const source = `Source: ${item.source_info.name}`;
      const link = `Full article: ${item.url}`;

      // Calculate the height of the content
      const titleLines = doc.splitTextToSize(title, 180);
      const bodyLines = doc.splitTextToSize(body, 180);
      const contentHeight =
        10 + titleLines.length * 7 + bodyLines.length * 5 + 30; // Approximate height

      // Check if there's enough space on the current page
      if (yPosition + contentHeight > pageHeight - 10) {
        doc.addPage();
        yPosition = 10;
      }

      // Add content
      doc.setFontSize(16);
      doc.text(titleLines, 10, yPosition);
      yPosition += titleLines.length * 7 + 5;

      doc.setFontSize(12);
      doc.text(bodyLines, 10, yPosition);
      yPosition += bodyLines.length * 5 + 5;

      doc.setFontSize(10);
      doc.text(publishedDate, 10, yPosition);
      yPosition += 5;
      doc.text(source, 10, yPosition);
      yPosition += 5;
      doc.textWithLink("Read full article", 10, yPosition, { url: item.url });

      yPosition += 15; // Add some extra space between articles
    });

    doc.save("important_crypto_news.pdf");
  };

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinks((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedLinks((prev) => ({ ...prev, [id]: false }));
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-white">Crypto News</h2>
      <button
        onClick={handleGetNews}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mb-6 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Get News
      </button>

      <div className="flex flex-row">
        <div className="flex flex-col gap-6 w-5/6 p-4">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 w-4/5 mx-auto ${
                item.isRead ? "opacity-75" : ""
              } ${item.isImportant ? "border-2 border-yellow-400" : ""}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-black">
                    {item.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(item.published_on)}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {getFirstFourSentences(item.body)}
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
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Read full article
                </a>
                <button
                  onClick={() => handleCopyLink(item.id, item.url)}
                  className={`text-sm hover:underline transition-colors duration-300 ${
                    copiedLinks[item.id] ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col w-1/6">
          <button
            onClick={handleDownloadImportant}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full mb-6 transition duration-300 ease-in-out transform hover:scale-105  sticky top-[20px]"
          >
            Download Important News
          </button>
          <div className="mb-6 w-full sticky top-[200px]">
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
              <label htmlFor="importantOnly" className="text-white">
                Show Important Only
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
