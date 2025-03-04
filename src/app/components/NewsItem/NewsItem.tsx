import React from "react";
import Image from "next/image";
import { NewsItemType } from "../../types";

const NewsItem: React.FunctionComponent<NewsItemType> = ({
  image = "https://next-blog-starter.vercel.app/_next/image?url=%2Fassets%2Fblog%2Fhello-world%2Fcover.jpg&w=1920&q=75",
  title,
  description,
  date,
  url,
}) => {
  return (
    <div className="rounded-lg space-y-3">
      <div className="relative w-full object-cover rounded h-[200px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{date}</p>
      {description && <p className="text-gray-700">{description}</p>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Read more
      </a>
    </div>
  );
};

export default NewsItem;
