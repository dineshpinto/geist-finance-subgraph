import { BigInt } from "@graphprotocol/graph-ts";

import { Approval } from "../generated/GeistToken/GeistToken"

import { MultiFeeDistribution } from "../generated/GeistToken/MultiFeeDistribution"

import { 
  DepositETHCall, 
  BorrowETHCall, 
  RepayETHCall, 
  WithdrawETHCall 
} from "../generated/WETHGateway/WETHGateway"

import { 
  TOKEN_ADDRESS,
  REWARD_TOKEN_CONTRACT,
} from "./constants";

import { 
  getTokenInfo, 
  getRewardTokenInfo,
  handleInteraction,
} from './helpers';

import { 
  Token, 
  UsageMetricsDailySnapshot
} from "../generated/schema"


export function handleApproval(event: Approval): void {
  // Currently set both the Token and Reward Token directly from constants
  let token: Token = getTokenInfo(TOKEN_ADDRESS);

  // Use the Reward Token contract to pull all the reward token addresses
  let rewardTokenContract = MultiFeeDistribution.bind(REWARD_TOKEN_CONTRACT);
  for (let i = 0; i < 10; i++) {
    // Query the reward token from number 
    let result = rewardTokenContract.try_rewardTokens(BigInt.fromI32(i));

    if (result.reverted) {
      break;
    }
    // Add rewardToken into store
    getRewardTokenInfo(result.value, "DEPOSIT");
  }
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

