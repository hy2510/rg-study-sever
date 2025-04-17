/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isRewritesStudyBookReading =
      process.env.STUDY_BOOK_REAINDG_ENABLE_RE_WRITES === "Y";
    const isRewritesNewDodo =
      process.env.STUDY_NEW_DODO_ENABLE_RE_WRITES === "Y";
    const isRewritesDodoDubbingRoom =
      process.env.STUDY_DODO_DUBBING_ROOM_ENABLE_RE_WRITES === "Y";

    if (process.env.NODE_ENV === "development" && isRewritesStudyBookReading) {
      return {
        beforeFiles: [
          isRewritesStudyBookReading && {
            source: `/${process.env.STUDY_BOOK_READING_PATH}:path*`,
            destination: `${process.env.STUDY_BOOK_REAINDG_SERVICE_URL}${process.env.STUDY_BOOK_READING_PATH}:path*`,
          },
          isRewritesNewDodo && {
            source: `/${process.env.STUDY_NEW_DODO_PATH}:path*`,
            destination: `${process.env.STUDY_BOOK_REAINDG_SERVICE_URL}${process.env.STUDY_NEW_DODO_PATH}:path*`,
          },
          isRewritesDodoDubbingRoom && {
            source: `/${process.env.STUDY_DODO_DUBBING_ROOM_PATH}:path*`,
            destination: `${process.env.STUDY_BOOK_REAINDG_SERVICE_URL}${process.env.STUDY_DODO_DUBBING_ROOM_PATH}:path*`,
          },
        ],
      };
    }

    return [];
  },
};

export default nextConfig;
