import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";

import { Approval } from "../../generated/GeistToken/GeistToken"

import { 
  MultiFeeDistribution,
  RewardPaid
} from "../../generated/GeistToken/MultiFeeDistribution"

import { 
  DepositETHCall, 
  BorrowETHCall, 
  RepayETHCall, 
  WithdrawETHCall 
} from "../../generated/WETHGateway/WETHGateway"

import { 
  Token as TokenEntity,
  RewardToken as RewardTokenEntity,
  UsageMetricsDailySnapshot as UsageMetricsDailySnapshotEntity,
  FinancialsDailySnapshot as FinancialsDailySnapshotEntity,
  LendingProtocol as LendingProtocolEntity,
  Market as MarketEntity,
  Deposit as DepositEntity,
  Withdraw as WithdrawEntity,
  Borrow as BorrowEntity,
  Repay as RepayEntity
} from "../../generated/schema"

import { 
  PROTOCOL_ID,
  NETWORK_FANTOM,
  PROTOCOL_TYPE_LENDING
} from "../common/constants";

import {
  TOKEN_ADDRESS_GEIST,
  REWARD_TOKEN_CONTRACT,
  TOKEN_ADDRESS_gETH,
} from "../common/addresses"

import { 
  initializeToken, 
  initializeRewardToken,
  getUsageMetrics,
  getFinancialSnapshot
} from './helpers';

export function handleApproval(event: Approval): void {
  // Add main token into Token store
  initializeToken(TOKEN_ADDRESS_GEIST);

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
    initializeRewardToken(result.value, "DEPOSIT");
  }
}

// Definitions
// totalValueLockedUSD = staking + deposits
// totalVolumeUSD = deposit + staking + repay + withdraw
// supplySideRevenueUSD = rewards paid to depositors
// protocolSideRevenueUSD = fees

function createProtocol(): void {
  let protocol = LendingProtocolEntity.load(PROTOCOL_ID)
  if (!protocol) {
    protocol = new LendingProtocolEntity(PROTOCOL_ID)
    protocol.name = "Geist Finance"
    protocol.slug = "geist-finance"
    protocol.network = NETWORK_FANTOM
    protocol.type = PROTOCOL_TYPE_LENDING
    protocol.save()
  }
}


export function handleDepositETH(call: DepositETHCall): void {
  // Extract user metrics from depositing ETH, ignores non-unique addresses
  createProtocol();

  // Generate data for the Deposit and Market Entities
  const hash = call.transaction.hash.toHexString();
  // This is the transaction index, not the log index
  const logIndex = call.transaction.index;

  let deposit = new DepositEntity(hash + "-" + logIndex.toHexString());
  deposit.hash = hash;
  deposit.logIndex = logIndex.toI32();
  deposit.protocol = PROTOCOL_ID;
  deposit.from = call.from.toHexString();
  deposit.amount = new BigDecimal(call.transaction.value);
  deposit.timestamp = call.block.timestamp;
  deposit.blockNumber = call.block.number;

  const marketAddress = call.inputs.lendingPool.toHexString();

  deposit.to = marketAddress;
  deposit.market = marketAddress;

  let market = MarketEntity.load(marketAddress) as MarketEntity;
  const token = initializeToken(Address.fromString(market.inputTokens[0]));

  deposit.asset = token.id;
  market.deposits.push(deposit.id)

  deposit.save()
  market.save()

  // Generate data for the UsageMetricsDailySnapshot Entity
  let usageMetrics: UsageMetricsDailySnapshotEntity = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Depositing ETH adds to TVL and volume
  let financialsDailySnapshot: FinancialsDailySnapshotEntity = getFinancialSnapshot(
    call.block.timestamp,
    call.transaction.value,
    TOKEN_ADDRESS_gETH,
    true,
    true,
    false,
    false
  );

  financialsDailySnapshot.protocol = PROTOCOL_ID;
  financialsDailySnapshot.timestamp = call.block.timestamp;
  financialsDailySnapshot.blockNumber = call.block.number;
  financialsDailySnapshot.save()
}

export function handleBorrowETH(call: BorrowETHCall): void {
  createProtocol();

  // Generate data for the Borrow and Market Entities
  const hash = call.transaction.hash.toHexString();
  const logIndex = call.transaction.index;

  let borrow = new BorrowEntity(hash + "-" + logIndex.toHexString());
  borrow.hash = hash;
  borrow.logIndex = logIndex.toI32();
  borrow.protocol = PROTOCOL_ID;
  borrow.from = call.from.toHexString();
  borrow.to = call.to.toHexString();
  borrow.amount = new BigDecimal(call.inputs.amount);
  borrow.timestamp = call.block.timestamp;
  borrow.blockNumber = call.block.number;

  const marketAddress = call.inputs.lendingPool.toHexString();
  borrow.market = marketAddress;

  let market = MarketEntity.load(marketAddress) as MarketEntity;
  const token = initializeToken(Address.fromString(market.inputTokens[0]));

  borrow.asset = token.id;
  market.deposits.push(borrow.id)

  borrow.save()
  market.save()

  // Extract user metrics from borrowing ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshotEntity = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Borrowing ETH does not to TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshotEntity = getFinancialSnapshot(
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
  createProtocol();

  // Generate data for the Borrow and Market Entities
  const hash = call.transaction.hash.toHexString();
  const logIndex = call.transaction.index;

  let repay = new RepayEntity(hash + "-" + logIndex.toHexString());
  repay.hash = hash;
  repay.logIndex = logIndex.toI32();
  repay.protocol = PROTOCOL_ID;
  repay.from = call.from.toHexString();
  repay.amount = new BigDecimal(call.inputs.amount);
  repay.timestamp = call.block.timestamp;
  repay.blockNumber = call.block.number;

  const marketAddress = call.inputs.lendingPool.toHexString();
  repay.market = marketAddress;
  repay.to = marketAddress;

  let market = MarketEntity.load(marketAddress) as MarketEntity;
  const token = initializeToken(Address.fromString(market.inputTokens[0]));

  repay.asset = token.id;
  market.deposits.push(repay.id)

  repay.save()
  market.save()

  // Extract user metrics from replaying ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshotEntity = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Repaying ETH does not to TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshotEntity = getFinancialSnapshot(
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
  createProtocol();

  // Generate data for the Borrow and Market Entities
  const hash = call.transaction.hash.toHexString();
  const logIndex = call.transaction.index;

  let withdraw = new WithdrawEntity(hash + "-" + logIndex.toHexString());
  withdraw.hash = hash;
  withdraw.logIndex = logIndex.toI32();
  withdraw.protocol = PROTOCOL_ID;
  withdraw.from = call.from.toHexString();
  withdraw.to = call.to.toHexString();
  withdraw.amount = new BigDecimal(call.inputs.amount);
  withdraw.timestamp = call.block.timestamp;
  withdraw.blockNumber = call.block.number;

  const marketAddress = call.inputs.lendingPool.toHexString();
  withdraw.market = marketAddress;

  let market = MarketEntity.load(marketAddress) as MarketEntity;
  const token = initializeToken(Address.fromString(market.inputTokens[0]));

  withdraw.asset = token.id;
  market.deposits.push(withdraw.id)

  withdraw.save()
  market.save()

  // Extract user metrics from withdrawing ETH, ignores non-unique addresses
  let usageMetrics: UsageMetricsDailySnapshotEntity = 
        getUsageMetrics(call.block.number, call.block.timestamp, call.from);
  usageMetrics.save()

  // Borrowing ETH reduces TVL, but adds to volume
  let financialsDailySnapshot: FinancialsDailySnapshotEntity = getFinancialSnapshot(
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
  createProtocol();

  // Rewards do not to TVL, but adds to volume and supply side revenue
  let financialsDailySnapshot: FinancialsDailySnapshotEntity = getFinancialSnapshot(
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
