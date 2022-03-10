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
  RewardToken,
  UsageMetricsDailySnapshot
} from "../generated/schema"


export function handleApproval(event: Approval): void {
  // Add main token into Token store
  let token : Token = getTokenInfo(TOKEN_ADDRESS);
  token.save()

  // Use the Reward Token contract to pull all the reward token addresses
  let rewardTokenContract = MultiFeeDistribution.bind(REWARD_TOKEN_CONTRACT);

  // The loop ends at 256 because we are presuming there will not be more tokens than that
  // Note that the full loop will never execute in practise as it breaks when it hits a revert
  for (let i = 0; i < 256; i++) {
    // Query the reward token from number 
    let result = rewardTokenContract.try_rewardTokens(BigInt.fromI32(i));

    if (result.reverted) {
      // Break loop when hitting an invalid value of `i`
      break;
    }
    // Add rewardToken into RewardToken store
    let rewardToken: RewardToken = getRewardTokenInfo(result.value, "DEPOSIT");
    rewardToken.save();
  }
}

export function handleDepositETH(call: DepositETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
        handleInteraction(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()
}

export function handleBorrowETH(call: BorrowETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
        handleInteraction(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()
}

export function handleRepayETH(call: RepayETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
        handleInteraction(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()
}

export function handleWithdrawETH(call: WithdrawETHCall): void {
  let usageMetrics: UsageMetricsDailySnapshot = 
        handleInteraction(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()
}