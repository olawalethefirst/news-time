import { errorMessages } from "@/constants";
import {
  GetNewsCategoryParameters,
  GetNewsCategoryResponse,
  GetNewsParameters,
  GetNewsResponse,
} from "@/types";

export const getNYTimesNews = async ({
  searchQuery,
  fromDate,
  toDate,
  page,
  categories = [],
  authors = [],
  limit = 10,
}: GetNewsParameters): Promise<GetNewsResponse> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_NY_TIMES_API_BASE_URL}/articlesearch.json`
  );
  const imageBaseUrl = process.env.NEXT_PUBLIC_NY_TIMES_IMAGE_BASE_URL ?? "";
  let fq = "";
  url.searchParams.append(
    "api-key",
    process.env.NEXT_PUBLIC_NY_TIMES_API_KEY ?? ""
  );
  if (searchQuery) url.searchParams.append("q", searchQuery);
  if (fromDate)
    url.searchParams.append("begin_date", fromDate.replaceAll("-", "")); // (e.g. 20121231)
  if (toDate) url.searchParams.append("end_date", toDate.replaceAll("-", "")); // (e.g. 20121231)
  // page is a zero based index, hence the subtraction
  if (page) url.searchParams.append("page", (page - 1).toString());
  // categories and authors are filtered through the same fq param
  // they use a key:("value", "values"..) key1:("value", ...) pattern
  if (categories.length > 0)
    fq +=
      "section_name:" + categories.reduce((acc, cur) => `${acc}, "${cur}"`, "");
  if (authors.length > 0)
    fq += "byline:" + authors.reduce((acc, cur) => `${acc}, "${cur}"`, " ");
  url.searchParams.append("fq", fq);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch news from NYTimes");
    }

    const {
      response: dataResponse,
    }: {
      status?: "OK";
      response: {
        docs: {
          web_url: string;
          lead_paragraph: string;
          multimedia: {
            type: "image" | "video";
            url: string;
          }[];
          headline: {
            main: string;
          };
          pub_date: string;
          section_name: "New York";
          byline: {
            original: string;
          };
          _id: string;
        }[];
        meta: {
          hits: number;
          offset: number;
          time: number;
        };
      };
    } = await response.json();

    return {
      news: dataResponse.docs.map(
        ({
          web_url,
          lead_paragraph,
          multimedia,
          headline,
          pub_date,
          section_name,
          byline,
          _id,
        }) => ({
          id: _id,
          title: headline.main,
          description: lead_paragraph,
          date: pub_date,
          category: section_name,
          author: byline.original,
          url: web_url,
          image: multimedia.find((media) => media.type === "image")
            ? imageBaseUrl +
              "/" +
              multimedia.find((media) => media.type === "image")?.url
            : undefined,
        })
      ),
      pagination: {
        // API limits to a maximum of 100 pages and is zero based: 0 ≤ value ≤ 100
        total: Math.min(100, Math.ceil(dataResponse.meta.hits / limit) - 1),
        page: dataResponse.meta.offset + 1,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching NYTimes news:", error);

    throw Error(errorMessages.news);
  }
};

export const getNYTimesCategories = ({
  searchQuery,
}: GetNewsCategoryParameters): Promise<GetNewsCategoryResponse> => {
  const categories = [
    "Arts",
    "Automobiles",
    "Autos",
    "Blogs",
    "Books",
    "Booming",
    "Business",
    "Business Day",
    "Corrections",
    "Crosswords & Games",
    "Crosswords/Games",
    "Dining & Wine",
    "Dining and Wine",
    "Editors' Notes",
    "Education",
    "Fashion & Style",
    "Food",
    "Front Page",
    "Giving",
    "Global Home",
    "Great Homes & Destinations",
    "Great Homes and Destinations",
    "Health",
    "Home & Garden",
    "Home and Garden",
    "International Home",
    "Job Market",
    "Learning",
    "Magazine",
    "Movies",
    "Multimedia",
    "Multimedia/Photos",
    "N.Y. / Region",
    "N.Y./Region",
    "NYRegion",
    "NYT Now",
    "National",
    "New York",
    "New York and Region",
    "Obituaries",
    "Olympics",
    "Open",
    "Opinion",
    "Paid Death Notices",
    "Public Editor",
    "Real Estate",
    "Science",
    "Sports",
    "Style",
    "Sunday Magazine",
    "Sunday Review",
    "T Magazine",
    "T:Style",
    "Technology",
    "The Public Editor",
    "The Upshot",
    "Theater",
    "Times Topics",
    "TimesMachine",
    "Today's Headlines",
    "Topics",
    "Travel",
    "U.S.",
    "Universal",
    "UrbanEye",
    "Washington",
    "Week in Review",
    "World",
    "Your Money",
  ];
  const filteredCategory = searchQuery
    ? categories.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return Promise.resolve({
    categories: filteredCategory,
    pagination: {
      page: 1,
      total: 1,
    },
  });
};
