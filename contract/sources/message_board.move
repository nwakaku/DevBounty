module message_board_addr::reward_distribution {
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use std::signer;
    use aptos_framework::event;
    use aptos_framework::aptos_coin::AptosCoin;

    // Represents a locked reward with its unlock time
    struct RewardLock has store {
        reward_coins: Coin<AptosCoin>,
        unlock_time_secs: u64,
    }

    // Stores all reward locks for AptosCoin
    struct RewardLocks has key {
        locks: Table<String, RewardLock>,
        project_ids: vector<String>,
    }

    // Event emitted when a locked reward is claimed
    #[event]
    struct RewardClaim has drop, store {
        organization: address,
        developer: address,
        project_id: String,
        amount: u64,
        claimed_time_secs: u64,
    }

    // Error codes
    const EREWARD_NOT_FOUND: u64 = 1;
    const EREWARD_LOCKUP_NOT_EXPIRED: u64 = 2;
    const EREWARD_ALREADY_EXISTS: u64 = 3;
    const EORGANIZATION_NOT_INITIALIZED: u64 = 4;

    // Returns all project IDs and their corresponding locked reward amounts
    #[view]
    public fun get_all_project_ids(organization: address): (vector<String>, vector<u64>) acquires RewardLocks {
        if (!exists<RewardLocks>(organization)) {
            return (vector::empty<String>(), vector::empty<u64>())
        };
        
        let locks = borrow_global<RewardLocks>(organization);
        let project_ids = vector::empty<String>();
        let amounts = vector::empty<u64>();
        let i = 0;
        let len = vector::length(&locks.project_ids);
        
        while (i < len) {
            let project_id = vector::borrow(&locks.project_ids, i);
            let lock = table::borrow(&locks.locks, *project_id);
            let amount = coin::value(&lock.reward_coins);
            vector::push_back(&mut project_ids, *project_id);
            vector::push_back(&mut amounts, amount);
            i = i + 1;
        };
        
        (project_ids, amounts)
    }    

    // Adds locked rewards for a specific project
    public entry fun add_locked_rewards(
        organization: &signer,
        project_id: String,
        amount: u64,
        unlock_time_secs: u64
    ) acquires RewardLocks {
        let org_address = signer::address_of(organization);
        
        if (!exists<RewardLocks>(org_address)) {
            move_to(organization, RewardLocks {
                locks: table::new(),
                project_ids: vector::empty<String>(),
            });
        };

        let locks = borrow_global_mut<RewardLocks>(org_address);
        assert!(!table::contains(&locks.locks, project_id), error::already_exists(EREWARD_ALREADY_EXISTS));
        
        let reward_coins = coin::withdraw<AptosCoin>(organization, amount);
        table::add(&mut locks.locks, project_id, RewardLock { reward_coins, unlock_time_secs });
        vector::push_back(&mut locks.project_ids, project_id);
    }

    // Claims locked rewards for a specific project
    public entry fun claim_reward(
        developer: &signer,
        organization: address,
        project_id: String
    ) acquires RewardLocks {
        let locks = borrow_global_mut<RewardLocks>(organization);
        assert!(table::contains(&locks.locks, project_id), error::not_found(EREWARD_NOT_FOUND));

        let RewardLock { reward_coins, unlock_time_secs } = table::remove(&mut locks.locks, project_id);
        
        let (found, index) = vector::index_of(&locks.project_ids, &project_id);
        if (found) {
            vector::remove(&mut locks.project_ids, index);
        };
        
        let now_secs = timestamp::now_seconds();
        assert!(now_secs >= unlock_time_secs, error::invalid_state(EREWARD_LOCKUP_NOT_EXPIRED));

        let amount = coin::value(&reward_coins);
        let developer_address = signer::address_of(developer);
        coin::deposit(developer_address, reward_coins);

        event::emit(RewardClaim {
            organization,
            developer: developer_address,
            project_id,
            amount,
            claimed_time_secs: now_secs,
        });
    }

    // Returns the reward info (amount and unlock time) for a specific project
    #[view]
    public fun get_reward_info(organization: address, project_id: String): (u64, u64) acquires RewardLocks {
        assert!(exists<RewardLocks>(organization), error::not_found(EORGANIZATION_NOT_INITIALIZED));
        let locks = borrow_global<RewardLocks>(organization);
        assert!(table::contains(&locks.locks, project_id), error::not_found(EREWARD_NOT_FOUND));
        
        let lock = table::borrow(&locks.locks, project_id);
        (coin::value(&lock.reward_coins), lock.unlock_time_secs)
    }

    // Returns the total amount of all locked rewards for an organization
    #[view]
    public fun get_total_locked_rewards(organization: address): u64 acquires RewardLocks {
        if (!exists<RewardLocks>(organization)) {
            return 0
        };
        
        let locks = borrow_global<RewardLocks>(organization);
        let total = 0u64;
        let i = 0;
        let len = vector::length(&locks.project_ids);
        
        while (i < len) {
            let project_id = vector::borrow(&locks.project_ids, i);
            let lock = table::borrow(&locks.locks, *project_id);
            total = total + coin::value(&lock.reward_coins);
            i = i + 1;
        };
        
        total
    }
}