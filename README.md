# Notary DApp

## Description

Notary is a decentralized application (DApp) that facilitates the management and verification of documents on the blockchain. It allows users to securely store documents, verify their authenticity, and revoke access when necessary.

- Users can upload documents to the platform, which are then hashed and stored on the blockchain for security.
- Documents can be accessed and verified using their unique hashes, ensuring authenticity and integrity.
- Users have the ability to revoke access to documents, preventing unauthorized parties from viewing them.

## Features

1. Upload documents to the platform
2. View and verify documents using their unique hashes
3. Revoke access to documents when needed
4. Downloading of authorized documents on the platform

## Tech Stack

Notary DApp is built using the following technologies:

- [Solidity](https://docs.soliditylang.org/): Programming language for Ethereum smart contracts.
- [React next js](https://reactjs.org/): JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org): Strongly typed programming language that builds on JavaScript.
- [Rainbowkit-celo](https://docs.celo.org/developer/rainbowkit-celo): React library for wallet connection in DApps.
- [Wagmi](https://wagmi.sh): Collection of React Hooks for Ethereum development.
- [Hardhat](https://hardhat.org/): Development environment for Ethereum smart contracts.
- [Tailwind CSS](https://tailwindcss.com): CSS framework for styling web applications.

## Installation

To run the Notary DApp locally, follow these steps:

1. Clone the repository to your local machine: 
    ```bash
    git clone https://github.com/Oladayo-Ahmod/notary.git
    ```
2. Navigate to the project directory:
    ```bash
    cd notary/packages/react-app
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```
5. Open the DApp in your web browser at [http://localhost:3000](http://localhost:3000)

## Usage

1. Connect your wallet to the DApp using a supported wallet provider.
2. Upload documents to the platform by providing relevant details and descriptions.
3. View and verify documents using their unique hashes.
4. Revoke access to documents when necessary, preventing unauthorized access.
5. Download your documents.

## Contributing

1. Fork this repository.
2. Create a new branch for your changes:
    ```bash
    git checkout -b my-feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "feat: add new feature"
    ```
4. Push your changes to your fork:
    ```bash
    git push origin my-feature-branch
    ```
5. Open a pull request to this repository with a description of your changes.

Contributions and feedback are welcome! Please ensure that your code follows the Solidity Style Guide and the React Style Guide. Additionally, consider adding tests for new features or changes to improve reliability.