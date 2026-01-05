import { randomInt } from "../utils/randomInt.js";

const postContents = [
  "Just shipped a new feature 🚀 #buildinpublic",
  "Backend > Frontend? Discuss 😄",
  "We’re hiring interns! Apply now 🚀",
  "Day 45 of coding. Consistency matters 💻",
  "Top tech events happening this month 🇳🇵",
];

const postTypes: { [key: string]: string } = {
  X: "TWEET",
  INSTAGRAM: "POST",
  FACEBOOK: "POST",
};

export function generateMockPost(platform: string) {
  const contentText = postContents[randomInt(0, postContents.length - 1)] as string;
  const platformPostId = platform + "_post_" + randomInt(1000, 9999);
  const postType = postTypes[platform] || "POST";

  const publishedAt = new Date(
    Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000
  );

  return {
    contentText,
    platformPostId,
    postType,
    publishedAt,
  };
}
