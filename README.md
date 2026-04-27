<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://compto.com">
    <img src="https://compto.com/assets/assets/images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Comptoken.js</h3>

  <p align="center">
    JS library for interacting with the comptoken program on Solana
    <br />
    <a href="https://github.com/compto-com/comptoken.js"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/compto-com/comptoken.js/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/compto-com/comptoken.js/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <!--<li><a href="#license">License</a></li>-->
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![solana.web3.js][solana-shield]][solana-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1. Install from GitHub

    ```sh
    npm install github:compto-com/comptoken.js#master
    ```

2. (optional) install Solana dependencies explicitly if your app does not already include them

    ```sh
    npm install --save @solana/spl-token @solana/web3.js
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

`@compto/comptoken.js` exports:

- Factory helpers
    - `getDefaultComptokenIdl`, `getDefaultSolanaWorldIdIdl`
    - `getComptokenIdl`, `getSolanaWorldIdIdl`
    - `createComptokenProgram`, `createSolanaWorldIdProgram`, `createDummyProvider`, `getComptokenConstants`
- Namespaces
    - `transactions` (RPC helpers like `collect`, `stake`, `submitMiningProof`, `getValidBlockhashes`)
    - `addresses` (PDA and token-account helpers)
    - `utils` (`decodeValidBlockhashesReturn`, `getReturnLog`, `getValidBlockhashesReturn`, `normalizeTimestamp`)
- Classes and direct helpers
    - `ComptokenProof`
    - Distribution helpers like `getDistributionOwed`, `isVerifiedHuman`, `getDaysSinceLastClaim`, etc.

Typical workflow

1. Create an Anchor provider and wrapped program.
2. Use `addresses` helpers to derive PDAs/token accounts.
3. Use `transactions` helpers to send instructions.

Example

```js
import { AnchorProvider, web3 } from "@coral-xyz/anchor";
import { TOKEN_2022_PROGRAM_ID, transferChecked } from "@solana/spl-token";
import {
    ComptokenProof,
    addresses,
    createComptokenProgram,
    getDefaultComptokenIdl,
    getComptokenConstants,
    transactions,
} from "@compto/comptoken.js";

const provider = AnchorProvider.local(); // or configure a custom Anchor Provider
const userWallet = provider.wallet.payer; // Anchor local wallet signer
const program = createComptokenProgram(getDefaultComptokenIdl(), provider);
const constants = getComptokenConstants();
const destination = new web3.PublicKey("REPLACE_WITH_DESTINATION_PUBKEY");

// 1) Initialize user data account (capacity is proofs/day before resize is needed)
await transactions.createUserDataAccount({
    program,
    capacity: 10,
    accounts: { userWallet },
});

// 2) Collect first (required before proof-submit / stake / unstake)
await transactions.collect({ program, accounts: { userWallet } });

// 3) Read valid mining blockhash
const { result } = await transactions.getValidBlockhashes({ program });

// 4) Build proof (JS mining is only practical for local/devnet testing)
const proof = new ComptokenProof({
    pubkey: addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey),
    recentBlockHash: result.valid,
    extraData: new Uint8Array(32),
    nonce: 0,
    version: 0,
    timestamp: Math.floor(Date.now() / 1000),
    target: ComptokenProof.TARGET_BYTES_DEVNET,
});

// 5) Submit proof and query combined balance (staked + unstaked)
await transactions.submitMiningProof({ program, proof, accounts: { userWallet } });
const total = await transactions.getComptokenBalance({ program, user: userWallet.publicKey });
console.log("Total Comptoken balance:", total);

// 6) Stake and unstake
await transactions.stake({
    program,
    amount: Number(constants.miningRewardAmount),
    accounts: { userWallet },
});

await transactions.unstake({
    program,
    amount: 10,
    accounts: { userWallet },
});

// 7) Transfer
await transferChecked(
    program.provider.connection,
    userWallet, // payer
    addresses.getUserUnstakedAssociatedTokenAddress(program, userWallet.publicKey),
    addresses.getUnstakedMintAddress(program),
    destination,
    userWallet.publicKey, // owner
    10, // amount
    Number(program.constants.mintDecimals),
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
);
```

Notes

- `transactions.*` methods expect a `Signer` for `accounts.userWallet` (for example, a `Keypair`).
- `getComptokenConstants()` returns constants directly from the bundled default comptoken IDL.
- `program.constants` is available on wrapped programs and contains useful IDL constants (seeds, mint decimals, reward amounts, etc.).
- `ComptokenProof.mine(...)` is test-only convenience and should not be used in production mining paths.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

See the [open issues](https://github.com/compto-com/comptoken.js/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/compto-com/comptoken.js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=compto-com/comptoken.js" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->
<!--
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
-->

<!-- CONTACT -->

## Contact

Connor Funk - connor@compto.com  
David Trost - [@ComptoDavid](https://twitter.com/ComptoDavid) - david@compto.com

Project Link: [https://github.com/compto-com/comptoken.js](https://github.com/compto-com/comptoken.js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/compto-com/comptoken.js.svg?style=for-the-badge
[contributors-url]: https://github.com/compto-com/comptoken.js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/compto-com/comptoken.js.svg?style=for-the-badge
[forks-url]: https://github.com/compto-com/comptoken.js/network/members
[stars-shield]: https://img.shields.io/github/stars/compto-com/comptoken.js.svg?style=for-the-badge
[stars-url]: https://github.com/compto-com/comptoken.js/stargazers
[issues-shield]: https://img.shields.io/github/issues/compto-com/comptoken.js.svg?style=for-the-badge
[issues-url]: https://github.com/compto-com/comptoken.js/issues
[license-shield]: https://img.shields.io/github/license/compto-com/comptoken.js.svg?style=for-the-badge
[license-url]: https://github.com/compto-com/comptoken.js/blob/master/LICENSE.txt
[solana-shield]: https://img.shields.io/badge/Solana-121212?style=for-the-badge&logo=solana
[solana-url]: https://github.com/solana-labs/solana
