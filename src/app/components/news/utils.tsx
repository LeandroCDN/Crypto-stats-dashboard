export const formatDateTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const getFirstFourSentences = (text: string) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 4).join(" ");
};
