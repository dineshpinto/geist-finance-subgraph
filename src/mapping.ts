import { Approval } from "../generated/GeistToken/GeistToken"
import { TOKEN_ADDRESS, REWARD_TOKEN_ADDRESS } from "./constants";
import { getTokenInfo, getRewardTokenInfo } from './helpers';
import { Token, RewardToken } from "../generated/schema"


export function handleApproval(event: Approval): void {
  let token: Token = getTokenInfo(TOKEN_ADDRESS);
  let rewardToken: RewardToken = getRewardTokenInfo(REWARD_TOKEN_ADDRESS, "DEPOSIT");
}
