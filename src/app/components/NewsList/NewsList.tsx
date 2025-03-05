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
        <div className="py-12 text-gray-400 text-align- w-full flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width="100"
            height="100"
            style={{
              shapeRendering: "auto",
              display: "block",
            }}
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g>
              <circle
                strokeDasharray="164.93361431346415 56.97787143782138"
                r="35"
                strokeWidth="10"
                stroke="#d1d5dc"
                fill="none"
                cy="50"
                cx="50"
              >
                <animateTransform
                  keyTimes="0;1"
                  values="0 50 50;360 50 50"
                  dur="1s"
                  repeatCount="indefinite"
                  type="rotate"
                  attributeName="transform"
                ></animateTransform>
              </circle>
              <g></g>
            </g>
          </svg>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="py-12 text-blue-700 text-align- w-full flex justify-center">
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
