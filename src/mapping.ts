import { Approval } from "../generated/GeistToken/GeistToken"

import { 
  DepositETHCall, 
  BorrowETHCall, 
  RepayETHCall, 
  WithdrawETHCall 
} from "../generated/WETHGateway/WETHGateway"

import { 
  TOKEN_ADDRESS,
  REWARD_TOKEN_ADDRESS 
} from "./constants";

import { 
  getTokenInfo, 
  getRewardTokenInfo,
  handleInteraction,
} from './helpers';

import { 
  Token, 
  RewardToken, 
  UsageMetricsDailySnapshot
} from "../generated/schema"


export function handleApproval(event: Approval): void {
  // Currently set both the Token and Reward Token directly from constants
  let token: Token = getTokenInfo(TOKEN_ADDRESS);

  // Set rewardType of token to DEPOSIT
  let rewardToken: RewardToken = getRewardTokenInfo(REWARD_TOKEN_ADDRESS, "DEPOSIT");
}

export function handleDepositETH(call: DepositETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleBorrowETH(call: BorrowETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleRepayETH(call: RepayETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleWithdrawETH(call: WithdrawETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}
