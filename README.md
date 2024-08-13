# web3-voting-system
Decentralised voting System
# Web3 Voting System

This project is a decentralized voting system built on the Internet Computer using Motoko for the backend and React for the frontend. It allows users to create proposals and vote on them in a transparent and secure manner.

## Benefits

1. **Decentralization**: The voting system runs on the Internet Computer, ensuring that no single entity controls the voting process.
2. **Transparency**: All votes and proposals are publicly visible and verifiable on the blockchain.
3. **Security**: Leveraging blockchain technology, the system is resistant to tampering and fraud.
4. **Accessibility**: Users can participate in voting from anywhere with an internet connection.
5. **Immutability**: Once cast, votes cannot be altered or deleted, ensuring the integrity of the voting process.
6. **Cost-effective**: Eliminates the need for physical voting infrastructure and reduces administrative costs.

## Features

- Create new proposals
- View all existing proposals
- Vote on proposals (one vote per user)
- Real-time updates of voting results

## Prerequisites

- Node.js (v12 or later)
- npm (v6 or later)
- DFINITY Canister SDK (dfx)

## Installation

1. Clone the repository:
git clone https://github.com/yourusername/web3-voting-system.git
cd web3-voting-system

2. Install dependencies:
npm install

3. Start the local Internet Computer replica:
dfx start --background

4. Deploy the canisters:
dfx deploy

5. Start the development server:
npm start

## Usage

1. Open your web browser and navigate to `http://localhost:8080`.
2. Use the form to add new proposals.
3. Click the "Vote" button next to a proposal to cast your vote.
4. The list of proposals will update in real-time as votes are cast.

## Project Structure

- `src/`: Contains the React frontend code
- `voting_backend/`: Contains the Motoko backend code
- `declarations/`: Auto-generated TypeScript declarations for the canisters

## Development

To make changes to the backend:

1. Edit the Motoko code in `voting_backend/main.mo`
2. Redeploy the backend:

dfx deploy voting_backend
To make changes to the frontend:

1. Edit the React code in `src/`
2. The development server will automatically reload with your changes

## Testing

To run the test suite:

dfx canister call voting_backend runTests

## Deployment

To deploy to the Internet Computer mainnet:

1. Ensure you have sufficient cycles in your wallet
2. Run:


dfx deploy --network ic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

This is a prototype and should not be used for actual voting without further security audits and improvements.

## Contact

For any questions or concerns, please open an issue on the GitHub repository.



