// Copyright 2019-2022 @polkadot/wasm-node authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[path = "rs/trie.rs"]
pub mod trie;
