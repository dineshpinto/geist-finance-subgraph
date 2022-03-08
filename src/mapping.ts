import { 
  BigInt, 
  Address, 
} from '@graphprotocol/graph-ts'

import { Approval } from "../generated/GeistToken/GeistToken"

import { 
  DepositETHCall, 
  BorrowETHCall, 
  RepayETHCall, 
  WithdrawETHCall 
} from "../generated/WETHGateway/WETHGateway"

import { 
  TOKEN_ADDRESS,
  TOKEN_NAME,
  REWARD_TOKEN_ADDRESS 
} from "./constants";

import { 
  getTokenInfo, 
  getRewardTokenInfo,
  Users
} from './helpers';

import { 
  Token, 
  RewardToken, 
  UsageMetricsDailySnapshot
} from "../generated/schema"


export function handleApproval(event: Approval): void {
  // Currently set both the Token and Reward Token directly from constants
  let token: Token = getTokenInfo(TOKEN_ADDRESS);
  let rewardToken: RewardToken = getRewardTokenInfo(REWARD_TOKEN_ADDRESS, "DEPOSIT");
}

export function handleInteraction(block_number: BigInt, timestamp: BigInt, from: Address): void {
  // Number of days since Unix epoch
  // Note: This is an unsafe cast to int, this should be handled better, 
  // perhaps some additional rounding logic
  let id: i64 = timestamp.toI64() / 86400;

  // Check if the id (i.e. the day) exists in the store
  let usageMetrics = UsageMetricsDailySnapshot.load(id.toString());

  // If the id does not exist, create it and reset values
  if (!usageMetrics) {
    usageMetrics = new UsageMetricsDailySnapshot(id.toString());
    usageMetrics.activeUsers = 0;
    usageMetrics.totalUniqueUsers = 0;
    usageMetrics.dailyTransactionCount = 0;
  }

  // Combine the id and the user address to generate a unique user id for the day
  let userId: string = id.toString() + from.toString()
  let userExists = Users.load(userId);

  // If the user id does not already exist in the store, add to unique users
  if (!userExists) {
    userExists = new Users(userId);
    usageMetrics.activeUsers += 1;
    usageMetrics.totalUniqueUsers += 1;
  }

  // The protocol is defined in the schema as type Protocol!
  // But doesnt this create a circular dependency?
  // Protocol depends on usageMetrics, and usageMetrics depends on Protocol
  usageMetrics.protocol = TOKEN_NAME;
  usageMetrics.dailyTransactionCount += 1
  usageMetrics.blockNumber = block_number;
  usageMetrics.timestamp = timestamp;

  userExists.save();
  usageMetrics.save();
}

export function handleDepositETH(call: DepositETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleBorrowETH(call: BorrowETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleRepayETH(call: RepayETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}

export function handleWithdrawETH(call: WithdrawETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp, call.from);
}
