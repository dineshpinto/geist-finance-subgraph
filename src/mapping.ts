import { BigInt } from "@graphprotocol/graph-ts"
import {
  GeistToken,
  Approval,
  Transfer
} from "../generated/GeistToken/GeistToken"
import { Token } from "../generated/schema"

export function handleApproval(event: Approval): void {
  let token = Token.load(event.params.owner.toString());

  if (!token) {
    token = new Token(event.params.owner.toString());
  }

  let tokenContract = GeistToken.bind(event.params.owner);

  token.id = event.params.owner.toString();
  token.decimals = tokenContract.decimals().toU32();
  token.name = tokenContract.name();
  token.symbol = tokenContract.symbol();
}
