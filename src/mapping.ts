import { BigDecimal, BigInt, Address, ethereum } from '@graphprotocol/graph-ts'

import { Approval } from "../generated/GeistToken/GeistToken"
import { DepositETHCall, BorrowETHCall, RepayETHCall, WithdrawETHCall } from "../generated/WETHGateway/WETHGateway"

import { TOKEN_ADDRESS, REWARD_TOKEN_ADDRESS } from "./constants";
import { getTokenInfo, getRewardTokenInfo } from './helpers';
import { Token, RewardToken, UsageMetricsDailySnapshot} from "../generated/schema"


export function handleApproval(event: Approval): void {
  let token: Token = getTokenInfo(TOKEN_ADDRESS);
  let rewardToken: RewardToken = getRewardTokenInfo(REWARD_TOKEN_ADDRESS, "DEPOSIT");
}

export function handleInteraction(block_number: BigInt, timestamp: BigInt): void {
  let id: i64 = timestamp.toI64() / 60 / 60 / 24;

  let usage_metrics = UsageMetricsDailySnapshot.load(id.toString());

  if (!usage_metrics) {
    usage_metrics = new UsageMetricsDailySnapshot(id.toString());
    usage_metrics.activeUsers = 0;
    usage_metrics.totalUniqueUsers = 0;
    usage_metrics.dailyTransactionCount = 0;
  }

  usage_metrics.protocol = "geist-finance";
  usage_metrics.activeUsers += 1;
  usage_metrics.totalUniqueUsers += 1;
  usage_metrics.dailyTransactionCount += 1
  usage_metrics.blockNumber = block_number;
  usage_metrics.timestamp = timestamp;
  usage_metrics.save()
}

export function handleDepositETH(call: DepositETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp);
}

export function handleBorrowETH(call: BorrowETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp);
}

export function handleRepayETH(call: RepayETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp);
}

export function handleWithdrawETH(call: RepayETHCall): void {
  handleInteraction(call.block.number, call.block.timestamp);
}
