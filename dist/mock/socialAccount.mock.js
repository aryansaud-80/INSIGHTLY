import { randomInt } from "../utils/randomInt.js";
const usernames = {
    X: ["aryan_dev", "company_xyz", "tech_guru", "dev_daily"],
    INSTAGRAM: ["aryan.codes", "code.life", "tech.photos", "dev.vibes"],
    FACEBOOK: ["NepalTechCommunity", "CodeGroupNP", "DevFriendsNP"],
};
export function generateMockSocialAccount(platform) {
    const namePool = usernames[platform];
    if (!namePool)
        return null;
    const username = namePool[randomInt(0, namePool.length - 1)];
    const platformUserId = platform + "_" + randomInt(10000, 99999);
    return {
        username,
        platformUserId,
        followerCount: randomInt(500, 50000),
    };
}
//# sourceMappingURL=socialAccount.mock.js.map