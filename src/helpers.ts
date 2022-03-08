import {
    Address, 
    Entity, 
    Value,
    ValueKind,
    store
} from '@graphprotocol/graph-ts'

import { GeistToken as TokenContract } from "../generated/GeistToken/GeistToken"

import { 
    TOKEN_NAME, 
    TOKEN_DECIMALS, 
    REWARD_TOKEN_NAME, 
    REWARD_TOKEN_DECIMALS, 
    REWARD_TOKEN_SYMBOL, 
} from "./constants";

import { Token, RewardToken } from "../generated/schema"


export function getTokenInfo(address: Address): Token {
    let token = Token.load(address.toHexString());

    if (token) {
        return token;
    }

    token = new Token(address.toHexString());

    // Replace GeistToken contract with default ERC20?
    let tokenContract = TokenContract.bind(address);

    token.id = address.toHexString();
    token.decimals = tokenContract.try_decimals().reverted ? TOKEN_DECIMALS: tokenContract.try_decimals().value.toI32();
    token.name = tokenContract.try_name().reverted ? TOKEN_NAME: tokenContract.try_name().value.toString();
    token.symbol = tokenContract.try_name().reverted ? TOKEN_NAME: tokenContract.try_name().value.toString();

    token.save()
  
    return token;
}

export function getRewardTokenInfo(address: Address, type: string): RewardToken {
    let rewardToken = RewardToken.load(address.toHexString());
       
    if (rewardToken) {
        return rewardToken;
    }

    rewardToken = new RewardToken(address.toHexString());

    let tokenContract = TokenContract.bind(address);
    rewardToken.id = address.toHexString();
    rewardToken.decimals = tokenContract.try_decimals().reverted ? REWARD_TOKEN_DECIMALS: tokenContract.try_decimals().value.toI32();
    rewardToken.name = tokenContract.try_name().reverted ? REWARD_TOKEN_NAME: tokenContract.try_name().value.toString();
    rewardToken.symbol = tokenContract.try_symbol().reverted ? REWARD_TOKEN_SYMBOL: tokenContract.try_symbol().value.toString();
    rewardToken.type = type;
    
    rewardToken.save()
  
    return rewardToken;
}

export class Users extends Entity {
    constructor(userId: string) {
        super();
        this.set("userId", Value.fromString(userId))
    }

    save(): void {
        let userId = this.get("userId");
        assert(
            userId != null,
          "Cannot save Users entity without an ID"
        );
        if (userId) {
          assert(
            userId.kind == ValueKind.STRING,
            "Cannot save Users entity with non-string ID. " +
              'Considering using .toHex() to convert the "id" to a string.'
          );
          store.set("Users", userId.toString(), this);
        }
      }

    static load(userId: string): Users | null {
        return changetype<Users | null>(
            store.get("Users", userId)
        );
    }
}
