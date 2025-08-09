import React, { useEffect } from "react";

const Promotions = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional cleanup if needed
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <div className="py-10 bg-orange-400">
        <h2 className="font-bold text-2xl text-center">Watch and Buy</h2>
        <div className="flex justify-around scrollbar-hide-card gap-x-5  flex-wra p-10 overflow-x-auto">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/reel/DGrw1cAS5Kw/?utm_source=ig_embed&amp;utm_campaign=loading"
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: 3,
              boxShadow:
                "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "1px",
              maxWidth: "540px",
              minWidth: "326px",
              padding: 0,
              width: "calc(100% - 2px)",
            }}
          >
            <a
              href="https://www.instagram.com/reel/DGrw1cAS5Kw/?utm_source=ig_embed&amp;utm_campaign=loading"
              target="_blank"
              rel="noreferrer"
            >
              View this post on Instagram
            </a>
          </blockquote>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/reel/DH3k_j0ScHE/?utm_source=ig_embed&amp;utm_campaign=loading"
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: "3px",
              boxShadow:
                "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "1px",
              maxWidth: "540px",
              minWidth: "326px",
              padding: 0,
              width: "calc(100% - 2px)",
            }}
          >
            <a
              href="https://www.instagram.com/reel/DH3k_j0ScHE/?utm_source=ig_embed&amp;utm_campaign=loading"
              target="_blank"
              rel="noreferrer"
            >
              View this post on Instagram
            </a>
          </blockquote>
        </div>
      </div>
    </>
  );
};

export default Promotions;
