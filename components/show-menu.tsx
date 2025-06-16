"use client";
const ShowMenu = () => {
  const htmlContent = window.localStorage.getItem("html-content");

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent! }}
    />
  );
};

export default ShowMenu;
