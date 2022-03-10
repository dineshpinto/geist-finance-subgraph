import { BigInt } from "@graphprotocol/graph-ts";

import { Approval } from "../generated/GeistToken/GeistToken"

import { 
  MultiFeeDistribution,
  RewardPaid
} from "../generated/GeistToken/MultiFeeDistribution"

import { 
  DepositETHCall, 
  BorrowETHCall, 
  RepayETHCall, 
  WithdrawETHCall 
} from "../generated/WETHGateway/WETHGateway"

import { 
  Token,
  RewardToken,
  UsageMetricsDailySnapshot,
  FinancialsDailySnapshot
} from "../generated/schema"

import { 
  TOKEN_ADDRESS_GEIST,
  REWARD_TOKEN_CONTRACT,
  TOKEN_ADDRESS_gETH
} from "./constants";

import { 
  getTokenInfo, 
  getRewardTokenInfo,
  getUsageMetrics,
  getFinancialSnapshot
} from './helpers';

export function handleApproval(event: Approval): void {
  // Add main token into Token store
  let token : Token = getTokenInfo(TOKEN_ADDRESS_GEIST);
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

// Definitions
// totalValueLockedUSD = staking + deposits
// totalVolumeUSD = deposit + staking + repay + withdraw
// supplySideRevenueUSD = rewards paid to depositors
// protocolSideRevenueUSD = fees

export function handleDepositETH(call: DepositETHCall): void {
  // Extract user metrics from depositing ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshot = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Depositing ETH adds to TVL and volume
  let financialsDailySnapshot: FinancialsDailySnapshot = getFinancialSnapshot(
    call.block.timestamp,
    call.transaction.value,
    TOKEN_ADDRESS_gETH,
    true,
    true,
    false,
    false
  );

  financialsDailySnapshot.timestamp = call.block.timestamp;
  financialsDailySnapshot.blockNumber = call.block.number;
  financialsDailySnapshot.save()
}

export function handleBorrowETH(call: BorrowETHCall): void {
  // Extract user metrics from borrowing ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshot = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Borrowing ETH does not to TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshot = getFinancialSnapshot(
    call.block.timestamp,
    call.inputs.amount,
    TOKEN_ADDRESS_gETH,
    false,
    false,
    false,
    false
  );

  financialsDailySnapshot.blockNumber = call.block.number;
  financialsDailySnapshot.save()
}

export function handleRepayETH(call: RepayETHCall): void {
  // Extract user metrics from replaying ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshot = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Repaying ETH does not to TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshot = getFinancialSnapshot(
    call.block.timestamp,
    call.inputs.amount,
    TOKEN_ADDRESS_gETH,
    false,
    false,
    false,
    false
  );

  financialsDailySnapshot.blockNumber = call.block.number;
  financialsDailySnapshot.save()
}

export function handleWithdrawETH(call: WithdrawETHCall): void {
  // Extract user metrics from withdrawing ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshot = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Borrowing ETH reduces TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshot = getFinancialSnapshot(
    call.block.timestamp,
    call.inputs.amount,
    TOKEN_ADDRESS_gETH,
    true,
    false,
    false,
    false
  );

  financialsDailySnapshot.blockNumber = call.block.number;
  financialsDailySnapshot.save()
}

export function handleRewardPaid(event: RewardPaid): void {
  // Rewards do not to TVL, but adds to volume and supply side revenue
  let financialsDailySnapshot: FinancialsDailySnapshot = getFinancialSnapshot(
    event.block.timestamp,
    event.params.reward,
    event.params.rewardsToken,
    false,
    false,
    true,
    false
  );

  financialsDailySnapshot.blockNumber = event.block.number;
  financialsDailySnapshot.save();
}

