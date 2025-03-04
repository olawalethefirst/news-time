import { errorMessages } from "@/constants";
import {
  GetNewsAuthorParameters,
  GetNewsAuthorResponse,
  GetNewsCategoryParameters,
  GetNewsCategoryResponse,
  GetNewsParameters,
  GetNewsResponse,
} from "../../types";

// Todo: move API endpoints and API keys to env variables
export const getGuardianNews = async ({
  searchQuery,
  fromDate,
  toDate,
  categories = [],
  authors = [],
  page,
  limit = 10,
}: GetNewsParameters): Promise<GetNewsResponse> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_GUARDIAN_API_BASE_URL}/search`
  );

  url.searchParams.append(
    "api-key",
    process.env.NEXT_PUBLIC_GUARDIAN_API_KEY ?? ""
  );
  if (searchQuery) url.searchParams.append("q", searchQuery);
  if (fromDate) url.searchParams.append("from-date", fromDate);
  if (toDate) url.searchParams.append("to-date", toDate);
  if (categories.length > 0)
    url.searchParams.append("section", categories.join("OR"));
  if (authors.length > 0) url.searchParams.append("tag", authors.join("OR"));
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("page-size", limit.toString());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const {
      response: dataResponse,
    }: {
      response: {
        status?: "ok";
        total: number;
        startIndex: number;
        pageSize: number;
        currentPage: number;
        pages: number;
        results: {
          id: string;
          sectionName: string;
          webPublicationDate: string;
          webTitle: string;
          webUrl: string;
        }[];
      };
    } = await response.json();

    const data = {
      news: dataResponse.results.map(
        ({ id, sectionName, webPublicationDate, webTitle, webUrl }) => ({
          id,
          title: webTitle,
          category: sectionName,
          date: webPublicationDate,
          url: webUrl,
        })
      ),
      pagination: {
        page: dataResponse.currentPage,
        limit: dataResponse.pageSize,
        total: dataResponse.pages,
        items: dataResponse.total,
      },
    };

    return data;
  } catch (error) {
    console.error("Error fetching Guardian news:", error);

    throw Error(errorMessages.news);
  }
};

export const getGuardianCategories = async ({
  searchQuery,
}: GetNewsCategoryParameters): Promise<GetNewsCategoryResponse> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_GUARDIAN_API_BASE_URL}/sections`
  );

  url.searchParams.append(
    "api-key",
    process.env.NEXT_PUBLIC_GUARDIAN_API_KEY ?? ""
  );
  if (searchQuery) url.searchParams.append("q", searchQuery);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const {
      response: dataResponse,
    }: {
      response: {
        status?: "ok";
        total: number;
        results: {
          id: string;
          webTitle: string;
          webUrl: string;
          apiUrl: string;
        }[];
      };
    } = await response.json();
    const data = {
      categories: dataResponse.results.map((category) => category.webTitle),
      pagination: {
        total: 1,
        page: 1,
      },
    };

    return data;
  } catch (error) {
    console.error("Error fetching Guardian categories:", error);

    throw Error(errorMessages.categories);
  }
};

export const getGuardianAuthors = async ({
  searchQuery,
  page,
  limit,
}: GetNewsAuthorParameters): Promise<GetNewsAuthorResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_GUARDIAN_API_BASE_URL}/tags`);

  url.searchParams.append(
    "api-key",
    process.env.NEXT_PUBLIC_GUARDIAN_API_KEY ?? ""
  );
  url.searchParams.append("type", "contributor");
  if (searchQuery) url.searchParams.append("q", searchQuery);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("page-size", limit.toString());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch authors");
    }
    const {
      response: dataResponse,
    }: {
      response: {
        status?: "ok";
        total: number;
        startIndex: number;
        pageSize: number;
        currentPage: number;
        pages: number;
        results: {
          id: string;
          webTitle: string;
        }[];
      };
    } = await response.json();

    const data = {
      authors: dataResponse.results.map((author) => author.webTitle),
      pagination: {
        page: dataResponse.currentPage,
        total: dataResponse.pages,
      },
    };

    return data;
  } catch (error) {
    console.error("Error fetching Guardian Authors:", error);

    throw Error(errorMessages.authors);
  }
};
