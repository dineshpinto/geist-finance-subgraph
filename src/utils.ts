import { 
    BigInt, 
    BigDecimal, 
    Address
} from "@graphprotocol/graph-ts";

import { 
    ZERO_BI, 
    ONE_BI,
    TOKEN_ADDRESS_GEIST,
    TOKEN_ADDRESS_gFTM,
    TOKEN_ADDRESS_gCRV,
    TOKEN_ADDRESS_gDAI,
    TOKEN_ADDRESS_gETH,
    TOKEN_ADDRESS_gMIM,
    TOKEN_ADDRESS_gLINK,
    TOKEN_ADDRESS_gUSDC,
    TOKEN_ADDRESS_gWBTC,
    TOKEN_ADDRESS_gfUSDT
} from "./constants"

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
export function getTokenPrice(tokenAddress: Address) : BigDecimal {
    if (tokenAddress == TOKEN_ADDRESS_gfUSDT) {
        return BigDecimal.fromString("1.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gUSDC) {
        return BigDecimal.fromString("1.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gDAI) {
        return BigDecimal.fromString("1.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gMIM) {
        return BigDecimal.fromString("1.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_GEIST) {
        return BigDecimal.fromString("0.14")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gWBTC) {
        return BigDecimal.fromString("40000.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gLINK) {
        return BigDecimal.fromString("15.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gCRV) {
        return BigDecimal.fromString("2.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gETH) {
        return BigDecimal.fromString("3000.0")
    }
    else if (tokenAddress == TOKEN_ADDRESS_gFTM) {
        return BigDecimal.fromString("1.5")
    }
    else {
        return BigDecimal.fromString("0.0")
    }
}