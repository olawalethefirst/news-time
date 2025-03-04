import {
  getGuardianAuthors,
  getGuardianCategories,
  getGuardianNews,
  getNewsAPINews,
  getNYTimesCategories,
  getNYTimesNews,
} from "./services/news";

export const errorMessages = {
  news: "Error loading news, please try again!",
  categories: "Failed to fetch categories",
  authors: "Error loading authors, please try again!",
};

export const newsSources = [
  {
    key: "ny-times",
    label: "NY Times",
    features: {
      fetchNews: getNYTimesNews,
      fetchCategories: getNYTimesCategories,
    },
  },
  {
    key: "guardian",
    label: "Guardian",
    features: {
      fetchNews: getGuardianNews,
      fetchCategories: getGuardianCategories,
      fetchAuthors: getGuardianAuthors,
    },
  },
  {
    key: "news-api",
    label: "News API",
    features: {
      fetchNews: getNewsAPINews,
    },
  },
];

export const localStorageKeys = {
  USER_PREFERENCES: "USER_PREFERENCES",
};
