import logger from "./logger";
import * as AuthUtils from "./auth-utils";
type AtleastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  { [K in Keys]: Required<Pick<T, K>> }[Keys];

export { logger, AuthUtils, AtleastOne };
