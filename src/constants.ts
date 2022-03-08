import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = Address.fromString("0x0000000000000000000000000000000000000000")

export const TOKEN_ADDRESS = Address.fromString("0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d");
export const TOKEN_DECIMALS: i32 = 18; 
export const TOKEN_NAME: string = "Geist.Finance Protocol Token"; 
export const TOKEN_SYMBOL: string = "GEIST"; 

export const REWARD_TOKEN_ADDRESS = Address.fromString("0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d");
export const REWARD_TOKEN_DECIMALS: i32 = 18; 
export const REWARD_TOKEN_NAME: string = "Geist.Finance Protocol Token"; 
export const REWARD_TOKEN_SYMBOL: string = "GEIST"; 

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)

export let ZERO_BD = BigDecimal.fromString("0")
export let ONE_BD = BigDecimal.fromString("1")
