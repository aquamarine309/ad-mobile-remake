import { NormalAchievements } from "./normal";
import { SecretAchievements } from "./secret";

export const Achievement = (id) => NormalAchievements.byId.get(id);
export const SecretAchievement = (id) => SecretAchievements.byId.get(id);

export { NormalAchievements, SecretAchievements };
