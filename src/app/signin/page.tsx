import SignOffView from "../_component/SignOffView";

export default function Page() {
  const defaultHomepageUrl =
    process.env.FLAG_DB_DEV === "N"
      ? "https://www.readinggate.com"
      : "https://dev.readinggate.com";
  return <SignOffView defaultHomepageUrl={defaultHomepageUrl} />;
}
