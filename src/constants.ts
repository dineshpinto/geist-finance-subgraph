import { 
    BigInt, 
    BigDecimal, 
    Address
} from "@graphprotocol/graph-ts";


export const ADDRESS_ZERO = Address.fromString("0x0000000000000000000000000000000000000000")

// Default address used for token
export const TOKEN_ADDRESS_GEIST = Address.fromString("0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d");
export const TOKEN_DECIMALS_GEIST: i32 = 18; 
export const TOKEN_NAME_GEIST: string = "Geist.Finance Protocol Token"; 
export const TOKEN_SYMBOL_GEIST: string = "GEIST"; 

// Default address used for reward token
export const REWARD_TOKEN_ADDRESS = Address.fromString("0xd8321AA83Fb0a4ECd6348D4577431310A6E0814d");
export const REWARD_TOKEN_DECIMALS: i32 = 18; 
export const REWARD_TOKEN_NAME: string = "Geist.Finance Protocol Token"; 
export const REWARD_TOKEN_SYMBOL: string = "GEIST";

// Token contract can be used to get addresses of all reward tokens
export const REWARD_TOKEN_CONTRACT = Address.fromString("0x49c93a95dbcc9A6A4D8f77E59c038ce5020e82f8");

// Additional reward token addresses (not used but kept anyway)
export const TOKEN_ADDRESS_gDAI = Address.fromString("0x07E6332dD090D287d3489245038daF987955DCFB");
export const TOKEN_ADDRESS_gETH = Address.fromString("0x25c130B2624CF12A4Ea30143eF50c5D68cEFA22f");
export const TOKEN_ADDRESS_gFTM = Address.fromString("0x39B3bd37208CBaDE74D0fcBDBb12D606295b430a");
export const TOKEN_ADDRESS_gWBTC = Address.fromString("0x38aCa5484B8603373Acc6961Ecd57a6a594510A3");
export const TOKEN_ADDRESS_gfUSDT = Address.fromString("0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5");
export const TOKEN_ADDRESS_gUSDC = Address.fromString("0xe578C856933D8e1082740bf7661e379Aa2A30b26");
export const TOKEN_ADDRESS_gCRV = Address.fromString("0x690754A168B022331cAA2467207c61919b3F8A98");
export const TOKEN_ADDRESS_gMIM = Address.fromString("0xc664Fc7b8487a3E10824Cda768c1d239F2403bBe");
export const TOKEN_ADDRESS_gLINK = Address.fromString("0xBeCF29265B0cc8D33fA24446599955C7bcF7F73B");

// BigInt 0 and 1
export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)

// BigDecimal 0 and 1
export let ZERO_BD = BigDecimal.fromString("0")
export let ONE_BD = BigDecimal.fromString("1")
