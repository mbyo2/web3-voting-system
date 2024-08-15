import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/web3_voting_system_backend/index';

const HOST = process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:8000';

export const getActor = async (identity) => {
  const agent = new HttpAgent({ host: HOST, identity });
  
  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.WEB3_VOTING_SYSTEM_BACKEND_CANISTER_ID,
  });
};