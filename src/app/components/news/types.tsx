export interface NewsItem {
  id: string;
  published_on: number;
  title: string;
  url: string;
  body: string;
  tags: string;
  isRead: boolean;
  isImportant: boolean;
  // source_info: {
  //   name: string;
  // };
  // name: string;
  quality: number;
}
