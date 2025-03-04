import NewsItem from "@/components/NewsItem/NewsItem";
import { NewsItemType } from "../../types";

interface NewsListProps {
  isLoading: boolean;
  items: NewsItemType[];
}
const NewsList: React.FunctionComponent<NewsListProps> = ({
  items,
  isLoading,
}) => {
  return (
    <>
      {isLoading ? (
        <div className="py-12 text-blue-700 text-align- w-full flex justify-center">
          {"LOADING..."}
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="py-12 text-red-800 text-align- w-full flex justify-center">
              {"EMPTY"}
            </div>
          ) : (
            <div className="grid xgrid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => (
                <NewsItem key={item.id} {...item} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default NewsList;
