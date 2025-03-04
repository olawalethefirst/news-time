import { errorMessages } from "@/constants";
import { GetNewsParameters, GetNewsResponse } from "../../types";

export const getNewsAPINews = async ({
  searchQuery,
  fromDate,
  toDate,
  page = 1,
  limit = 10,
}: GetNewsParameters): Promise<GetNewsResponse> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_NEWS_API_BASE_URL}/everything`
  );

  url.searchParams.append("apiKey", process.env.NEXT_PUBLIC_NEWS_API_KEY ?? "");
  url.searchParams.append("qInTitle", "content");
  if (searchQuery) url.searchParams.append("q", searchQuery);
  if (fromDate) url.searchParams.append("from", fromDate);
  if (toDate) url.searchParams.append("to", toDate);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("pageSize", limit.toString());

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const {
      articles,
      totalResults,
    }: {
      status?: "ok" | "error";
      totalResults: number;
      articles: {
        author: null | string;
        title: string;
        description: string;
        url: string;
        urlToImage?: string;
        publishedAt: string;
        content: string;
      }[];
    } = await response.json();

    const data = {
      news: articles.map(
        ({ title, description, url, urlToImage, publishedAt, author }) => ({
          id: title,
          image: urlToImage || undefined,
          title,
          description,
          date: publishedAt,
          url,
          author: author || undefined,
        })
      ),
      pagination: {
        page,
        total: Math.ceil(totalResults / limit),
        limit,
      },
    };

    return data;
  } catch (error) {
    console.error("Error fetching news:", error);

    throw Error(errorMessages.news);
  }
};
