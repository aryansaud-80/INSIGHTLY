import { randomInt } from "../utils/randomInt.js";

export function generateMockPostMetrics() {
  const likes = randomInt(50, 1500);
  const comments = randomInt(5, 120);
  const shares = randomInt(1, 200);
  const saves = randomInt(0, 80);
  const impression = randomInt(likes * 10, likes * 60);

  const engagementRate = Number(
    (((likes + comments + shares + saves) / impression) * 100).toFixed(2)
  );

  return {
    likes,
    comments,
    shares,
    impression,
    saves,
    engagementRate,
  };
}
