"use client";
import { useEffect, useState } from "react";
import { fetchCryptoNews, fetchFinancialNews } from "@/app/utils/api";
import { jsPDF } from "jspdf";
import { NewsItem } from "./types";
import NewsComponent from "./NewsComponent";
import SearchBar from "./SearchBar";
import DateRangePicker from "./DateRangePicker";
import { formatDateTime, getFirstFourSentences } from "./utils";
import QualityFilter from "./QualityFilter";

const ITEMS_PER_PAGE = 50;

export default function NewSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [availableQualities, setAvailableQualities] = useState<number[]>([]);
  const [selectedQualities, setSelectedQualities] = useState<number[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem("savedNews");
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    }
  }, []);

  const handleGetNews = async () => {
    let startTimestamp: number;
    let endTimestamp: number;

    if (startDate && endDate) {
      startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      endTimestamp = Math.floor(new Date(endDate).getTime() / 1000) + 86399; // End of the selected day
    } else {
      endTimestamp = Math.floor(Date.now() / 1000);
      startTimestamp = endTimestamp - 24 * 60 * 60; // Last 24 hours
    }

    const newsData = await fetchCryptoNews(startTimestamp, endTimestamp);
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
      quality: item.quality,
    }));

    const allNews = [...formattedNews];
    setNews(allNews);
    localStorage.setItem("savedNews", JSON.stringify(allNews));

    const tagsSet = new Set<string>();
    formattedNews.forEach((item: { tags: string }) => {
      item.tags.split("|").forEach((tag) => tagsSet.add(tag));
    });
    const qualitiesSet = new Set<number>(allNews.map((item) => item.quality));
    setAvailableQualities(Array.from(qualitiesSet).sort((a, b) => a - b));
    const tags = Array.from(tagsSet);
    setAllTags(tags);
    setCurrentPage(1);
  };

  const handleQualityChange = (quality: number) => {
    setSelectedQualities((prev) =>
      prev.includes(quality)
        ? prev.filter((q) => q !== quality)
        : [...prev, quality]
    );
  };

  const handleDeleteNews = (id: string) => {
    const updatedNews = news.filter((item) => item.id !== id);
    setNews(updatedNews);
    localStorage.setItem("savedNews", JSON.stringify(updatedNews));
  };

  const handleMarkAsRead = (id: string) => {
    const updatedNews = news.map((item) =>
      item.id === id ? { ...item, isRead: !item.isRead } : item
    );
    setNews(updatedNews);
    localStorage.setItem("savedNews", JSON.stringify(updatedNews));
  };

  const handleMarkAsImportant = (id: string) => {
    const updatedNews = news.map((item) =>
      item.id === id ? { ...item, isImportant: !item.isImportant } : item
    );
    setNews(updatedNews);
    localStorage.setItem("savedNews", JSON.stringify(updatedNews));
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
    )
    .filter(
      (item) =>
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) =>
        selectedQualities.length === 0 ||
        selectedQualities.includes(item.quality)
    );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
      <div className="flex items-center space-x-4 mb-6">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <button
          onClick={handleGetNews}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get News
        </button>
      </div>

      <div className="flex flex-row w-full">
        <div className="flex flex-col gap-6 w-9/12 p-5">
          {paginatedNews.map((item) => (
            <NewsComponent
              key={item.id}
              item={item}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNews}
              onMarkAsImportant={handleMarkAsImportant}
              onCopyLink={handleCopyLink}
              copiedLinks={copiedLinks}
            />
          ))}

          {/* Pagination controls */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-black rounded disabled:bg-gray-300 "
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-200 rounded text-black">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-black rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex flex-col w-3/12">
          <div className="sticky top-0">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <QualityFilter
            qualities={availableQualities}
            selectedQualities={selectedQualities}
            onQualityChange={handleQualityChange}
          />
          <button
            onClick={handleDownloadImportant}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full mb-6 transition duration-300 ease-in-out transform hover:scale-105 sticky top-[55px]"
          >
            Download Important News
          </button>
          <div className="mb-6 w-full sticky top-[100px]">
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
            {/* ... (rest of the filter options) */}
          </div>
        </div>
      </div>
    </div>
  );
}
