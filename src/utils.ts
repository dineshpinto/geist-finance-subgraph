import { 
    BigInt, 
    BigDecimal, 
    Address
} from "@graphprotocol/graph-ts";

import { 
    ZERO_BI, 
    ONE_BI,
    PRICE_ORACLE,
    TOKEN_ADDRESS_GEIST,
    TOKEN_ADDRESS_gFTM,
    TOKEN_ADDRESS_gCRV,
    TOKEN_ADDRESS_gDAI,
    TOKEN_ADDRESS_gETH,
    TOKEN_ADDRESS_gMIM,
    TOKEN_ADDRESS_gLINK,
    TOKEN_ADDRESS_gUSDC,
    TOKEN_ADDRESS_gWBTC,
    TOKEN_ADDRESS_gfUSDT,
    TOKEN_ADDRESS_DAI,
    TOKEN_ADDRESS_WFTM,
    TOKEN_ADDRESS_CRV,
    TOKEN_ADDRESS_ETH,
    TOKEN_ADDRESS_MIM,
    TOKEN_ADDRESS_LINK,
    TOKEN_ADDRESS_USDC,
    TOKEN_ADDRESS_BTC,
    TOKEN_ADDRESS_fUSDT
} from "./constants"

import { AaveOracle } from "../generated/MultiFeeDistribution/AaveOracle"

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
  }

export function convertTokenToDecimal(tokenAmount: BigInt, decimals: BigInt): BigDecimal {
    if (decimals == ZERO_BI) {
      return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(decimals))
  }

// Hard code the prices in for testing
// Replace with Price Oracle
export function getTokenPrice(tokenAddress: Address) : BigInt {
    let priceOracle = AaveOracle.bind(PRICE_ORACLE);

    if (tokenAddress == TOKEN_ADDRESS_gfUSDT) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_fUSDT);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gUSDC) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_USDC);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gDAI) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_DAI);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gMIM) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_MIM);
    }
    else if (tokenAddress == TOKEN_ADDRESS_GEIST) {
        // TODO: Fix this with value from an oracle
        return BigInt.fromString("0.1");
    }
    else if (tokenAddress == TOKEN_ADDRESS_gWBTC) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_BTC);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gLINK) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_LINK);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gCRV) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_CRV);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gETH) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_ETH);
    }
    else if (tokenAddress == TOKEN_ADDRESS_gFTM) {
        return priceOracle.getAssetPrice(TOKEN_ADDRESS_WFTM);
    }
    else {
        return BigInt.fromI32(0);
    }
}