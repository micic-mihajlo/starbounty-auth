//! Soroban contract for StarBounty escrow vault
//! Each bounty deployment creates a fresh instance via `deploy-contract` with a random salt.
//! The bounty owner calls `init` to fund and set beneficiary.
//! Either the owner or anyone after `can_withdraw_after` timestamp can call `release` to
//! transfer the locked amount to the beneficiary.

#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, Symbol};

// Storage key for the escrow state tuple: (owner, beneficiary, token, amount, unlockTime)
const STATE_KEY: Symbol = symbol_short!("state");

/// Escrow contract: holds funds until released by owner or after timelock
#[contract]
pub struct Escrow;

#[contractimpl]
impl Escrow {
  /// Initialize and fund the escrow vault
  pub fn init(
    env: Env,
    owner: Address,
    beneficiary: Address,
    token: Address,
    amount: i128,
    can_withdraw_after: u64,
  ) {
    owner.require_auth();
    assert!(amount > 0, "amount must be positive");

    // Transfer amount from owner into this contract
    token::Client::new(&env, &token).transfer(
      &owner,
      &env.current_contract_address(),
      &amount,
    );

    // Store the state as a 5-tuple
    let state = (
      owner.clone(),
      beneficiary.clone(),
      token.clone(),
      amount,
      can_withdraw_after,
    );
    env.storage().instance().set(&STATE_KEY, &state);
  }

  /// Release funds: only owner anytime or any caller after timelock
  pub fn release(env: Env, invoker: Address) {
    invoker.require_auth();

    // Retrieve the stored tuple
    let (owner_stored, beneficiary, token, amount, can_withdraw_after): (
      Address, Address, Address, i128, u64
    ) = env.storage().instance().get(&STATE_KEY).expect("not initialized");

    let now: u64 = env.ledger().timestamp();

    // Only owner or after timelock
    if invoker != owner_stored {
      assert!(now >= can_withdraw_after, "timelock not expired");
    }

    // Transfer locked amount to beneficiary
    token::Client::new(&env, &token).transfer(
      &env.current_contract_address(),
      &beneficiary,
      &amount,
    );

    // Remove state to prevent reuse
    env.storage().instance().remove(&STATE_KEY);
  }
} 