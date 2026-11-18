// Created once outside the function so it is not rebuilt for every post.
const postDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

// Returns the publication date and time of a post, for example "18 de nov de 2026, 3:04 a. m.".
// Posts that were just published may not have the server date yet.
export const formatPostDate = (date: Date | null) => {
  if (!date) return "Ahora";

  return postDateFormatter.format(date);
};
