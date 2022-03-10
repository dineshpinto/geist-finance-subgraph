import {
    Address,
    BigInt,
} from '@graphprotocol/graph-ts'

import { GeistToken as TokenContract } from "../generated/GeistToken/GeistToken"

import { 
    Token, 
    RewardToken, 
    UsageMetricsDailySnapshot, 
    UniqueUsers,
    FinancialsDailySnapshot,
} from "../generated/schema"

import { 
    TOKEN_NAME_GEIST, 
    TOKEN_DECIMALS_GEIST, 
    REWARD_TOKEN_NAME, 
    REWARD_TOKEN_DECIMALS, 
    REWARD_TOKEN_SYMBOL,
    ZERO_BD,
} from "./constants";

import { 
    convertTokenToDecimal,
    getTokenPrice
} from "./utils";

export function getTokenInfo(address: Address): Token {
    let token = Token.load(address.toHexString());

    if (token) {
        return token;
    }

    token = new Token(address.toHexString());

    // Replace GeistToken contract with default ERC20?
    let tokenContract = TokenContract.bind(address);

    token.id = address.toHexString();
    token.decimals = tokenContract.try_decimals().reverted ? 
                     TOKEN_DECIMALS_GEIST: tokenContract.try_decimals().value.toI32();
    token.name = tokenContract.try_name().reverted ? 
                 TOKEN_NAME_GEIST: tokenContract.try_name().value.toString();
    token.symbol = tokenContract.try_name().reverted ? 
                   TOKEN_NAME_GEIST: tokenContract.try_name().value.toString();
    return token;
}

export function getRewardTokenInfo(address: Address, rewardType: string): RewardToken {
    let rewardToken = RewardToken.load(address.toHexString());
       
    if (rewardToken) {
        return rewardToken;
    }

    rewardToken = new RewardToken(address.toHexString());

    let tokenContract = TokenContract.bind(address);
    rewardToken.id = address.toHexString();
    rewardToken.decimals = tokenContract.try_decimals().reverted ? 
                           REWARD_TOKEN_DECIMALS: tokenContract.try_decimals().value.toI32();
    rewardToken.name = tokenContract.try_name().reverted ? 
                       REWARD_TOKEN_NAME: tokenContract.try_name().value.toString();
    rewardToken.symbol = tokenContract.try_symbol().reverted ? 
                         REWARD_TOKEN_SYMBOL: tokenContract.try_symbol().value.toString();
    rewardToken.type = rewardType;  
    return rewardToken;
}

export function getUsageMetrics(
    block_number: BigInt, 
    timestamp: BigInt, 
    from: Address
    ): UsageMetricsDailySnapshot {
    // Number of days since Unix epoch
    // Note: This is an unsafe cast to int, this should be handled better, 
    // perhaps some additional rounding logic
    let id: i64 = timestamp.toI64() / 86400;
  
    // Check if the id (i.e. the day) exists in the store
    let usageMetrics = UsageMetricsDailySnapshot.load(id.toString());
  
    // If the id does not exist, create it and reset values
    if (!usageMetrics) {
      usageMetrics = new UsageMetricsDailySnapshot(id.toString());
      usageMetrics.id = id.toString();
      usageMetrics.activeUsers = 0;
      usageMetrics.totalUniqueUsers = 0;
      usageMetrics.dailyTransactionCount = 0;
    }
  
    // Combine the id and the user address to generate a unique user id for the day
    let userId: string = id.toString() + from.toHexString()
    let userExists = UniqueUsers.load(userId);
  
    // If the user id does not already exist in the store, add to unique users
    if (!userExists) {
      userExists = new UniqueUsers(userId);
      userExists.id = userId;

      usageMetrics.activeUsers += 1;
      usageMetrics.totalUniqueUsers += 1;
    }
  
    // The protocol is defined in the schema as type Protocol!
    // But doesnt this create a circular dependency?
    // Protocol depends on usageMetrics, and usageMetrics depends on Protocol
    usageMetrics.protocol = TOKEN_NAME_GEIST;
    usageMetrics.dailyTransactionCount += 1
    usageMetrics.blockNumber = block_number;
    usageMetrics.timestamp = timestamp;
  
    userExists.save();

    return usageMetrics;
  }

  export function getFinancialSnapshot(
      timestamp: BigInt,
      tokenAmount: BigInt,
      tokenAddress: Address,
      isValueLockedUSD: bool,
      isIncreasingValueLocked: bool,
      isSupplySideRevenueUSD: bool,
      isProtocolSideRevenueUSD: bool
  ): FinancialsDailySnapshot {

    let id: i64 = timestamp.toI64() / 86400;

    // Refresh id daily, historical snapshots can be accessed by using the id
    let financialsDailySnapshot = FinancialsDailySnapshot.load(id.toString())
  
    // Initialize all daily snapshot values
    if (!financialsDailySnapshot) {
      financialsDailySnapshot =  new FinancialsDailySnapshot(id.toString());
      financialsDailySnapshot.id = id.toString();
      financialsDailySnapshot.totalValueLockedUSD = ZERO_BD;
      financialsDailySnapshot.totalVolumeUSD = ZERO_BD;
      financialsDailySnapshot.supplySideRevenueUSD = ZERO_BD;
      financialsDailySnapshot.protocolSideRevenueUSD = ZERO_BD;
    }

    let tokenContract = TokenContract.bind(tokenAddress);
    let tokenAmountBD = convertTokenToDecimal(tokenAmount, tokenContract.try_decimals().value)
    let tokenPrice = getTokenPrice(tokenAddress);
    let tokenAmountUSD = tokenPrice.times(tokenAmountBD);

    // Add value locked for operations like depositing
    if (isValueLockedUSD && isIncreasingValueLocked) {
        financialsDailySnapshot.totalValueLockedUSD.plus(tokenAmountUSD);
    }
    // Subtract value locked for operations like withdrawing
    else if (isValueLockedUSD && !isIncreasingValueLocked) {
        financialsDailySnapshot.totalValueLockedUSD.minus(tokenAmountUSD);
    }
    // Add protocol revenue for fees
    if (isProtocolSideRevenueUSD) {
        financialsDailySnapshot.protocolSideRevenueUSD.plus(tokenAmountUSD);
    }
    // Add supply side revenue for rewards
    if (isSupplySideRevenueUSD) {
        financialsDailySnapshot.supplySideRevenueUSD.plus(tokenAmountUSD);
    }
    financialsDailySnapshot.totalVolumeUSD.plus(tokenAmountUSD);

    return financialsDailySnapshot;
  }


