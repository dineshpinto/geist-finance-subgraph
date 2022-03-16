import { 
    BigInt, 
    BigDecimal, 
    Address,
    ethereum,
} from "@graphprotocol/graph-ts";

import { 
    ZERO_BI, 
    ONE_BI,
} from "./constants"

import { 
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
    TOKEN_ADDRESS_fUSDT,
    GEIST_FTM_LP_ADDRESS
} from "../common/addresses"

import { AaveOracle } from "../../generated/MultiFeeDistribution/AaveOracle"

import { SpookySwapGEISTFTM } from "../../generated/MultiFeeDistribution/SpookySwapGEISTFTM"


export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, decimals: BigInt): BigDecimal {
    /* Convert a BigInt tokenAmount to BigDecimal */
    if (decimals == ZERO_BI) {
      return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(decimals))
}

export function getTokenPrice(tokenAddress: Address) : BigInt {
    /* 
        The price oracle only supports a limited number of tokens
        So map the gTokens to the underlying asset for price
        eg. gUSDC -> USDC, gDAI -> DAI etc.
    */

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
        /* 
            For the GEIST token, the price is derived from the
            ratio of FTM-GEIST reserves on Spookyswap multiplied by
            the price of WFTM from the oracle
        */
        let geistFtmLP = SpookySwapGEISTFTM.bind(GEIST_FTM_LP_ADDRESS);

        let reserveFTM = geistFtmLP.getReserves().value0;
        let reserveGEIST = geistFtmLP.getReserves().value1;

        let priceGEISTinFTM = reserveFTM.div(reserveGEIST);

        let priceFTMinUSD = priceOracle.getAssetPrice(TOKEN_ADDRESS_WFTM);        
        return priceGEISTinFTM.times(priceFTMinUSD)
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

export function getTimeInMillis(time: BigInt): BigInt {
return time.times(BigInt.fromI32(1000));
}

export function getTimestampInMillis(block: ethereum.Block): BigInt {
return block.timestamp.times(BigInt.fromI32(1000));
}

export function bigIntToPercentage(n: BigInt): BigDecimal {
return n.toBigDecimal().div(BigDecimal.fromString("100"))
}
  