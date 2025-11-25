<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

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
    <!--
    <a href="https://github.com/compto-com/comptoken.js">View Demo</a>
    ·
    -->
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
    <!--<li><a href="#roadmap">Roadmap</a></li>-->
    <li><a href="#contributing">Contributing</a></li>
    <!--<li><a href="#license">License</a></li>-->
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `compto-com`, `comptoken.js`, `ComptoDavid`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

-   [![solana.web3.js][solana-shield]][solana-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1. (recommended) add Solana dependencies

    ```sh
    npm install --save @solana/spl-token @solana/web3.js
    ```

2. add to package.json
    ```sh
    npm install github:compto-com/comptoken.js#master
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The library exposes a small set of helpers to interact with the Comptoken Anchor program:

-   `getDefaultComptokenIdl()` / `getDefaultSolanaWorldIdIdl()` - load bundled IDLs.
-   `getComptokenIdl(idlPath)` / `getSolanaWroldIdIdl(idlPath)` - load a custom IDL from the fs.
-   `createComptokenProgram(idl, provider)` / `createSolanaWorldIdProgram(idl, provider)` - create a `ProgramWithConstants` wrapper around an Anchor `Program` (gives access to IDL constants).
-   `ComptokenProof` - helper class that serializes/verifies mining proofs (includes a `mine()` convenience method for tests).
-   Transaction helpers: `createUserDataAccount`, `submitMiningProof`, `stake`, `unstake`, `collect`, `getValidBlockhashes`, `resizeUserDataAccount`, `verify`, `reverify`, `unverify`, `unverify2`, and `getComptokenBalance`.
-   Address helpers: `getUserStakedTokensAddress`, `getUserUnstakedAssociatedTokenAddress`, `getGlobalDataAddress`, etc.
-   Utility helpers: `decodeValidBlockhashesReturn`, `getReturnLog`, `normalizeTimestamp`, `daysSinceEpoch`.

Typical workflow

1. Create an Anchor `Provider` and program instance using the bundled IDL.
2. Use address helpers to compute PDAs and token account addresses.
3. Use transaction helpers to build and send RPC calls.

Example (basic):

```js
import { AnchorProvider } from "@coral-xyz/anchor";
import {
    getDefaultComptokenIdl,
    createComptokenProgram,
    ComptokenProof,
    createUserDataAccount,
    submitMiningProof,
    getValidBlockhashes,
    getComptokenBalance,
    collect,
    stake,
    unstake,
    getUserUnstakedAssociatedTokenAddress,
    getUnstakedMintAddress,
} from "@compto/comptoken.js";

// 1) Create provider & program
const provider = AnchorProvider.local(); // or configure a custom Anchor Provider
const idl = getDefaultComptokenIdl();
const program = createComptokenProgram(idl, provider);

// 2) Create a user's data account
const user = provider.wallet.publicKey;
// capacity 10 means a user can submit 10 proofs/day without resizing
await createUserDataAccount({ program, capacity: 10, accounts: { userWallet: user } });

// 3) Collect yields
// must have collected today to submit proofs, stake, or unstake
await collect({ program, accounts: { userWallet: user } });

// 4) Get valid blockhashes (program returns this via logs)
const { sig, result } = await getValidBlockhashes({ program });
console.log("valid blockhashes signature:", sig);
console.log("valid blockhash:", result.valid); // used to mine for a proof
console.log("announced blockhash:", result.announced); // announced up to 5 min before switchover to allow zero downtime mining

// 5) Build a proof
const proof = new ComptokenProof({
    pubkey: getUserUnstakedAssociatedTokenAddress(program, user),
    recentBlockHash: result.valid,
    extraData: new Uint8Array(32),
    nonce: 0,
    version: 0,
    timestamp: Math.floor(Date.now() / 1000),
    target: ComptokenProof.TARGET_BYTES_DEVNET, // can be skipped for mainnet
});

// 6) Submit the proof
await submitMiningProof({ program, proof, accounts: { userWallet: user } });

// 7) Query combined staked + unstaked balance
const total = await getComptokenBalance({ program, user });
console.log("total comptoken balance:", total);

// 8) Stake newly minted Comptokens
await stake({
    program,
    amount: program.constants.miningRewardAmount,
    accounts: { userWallet: user },
});

// 9) transfer
await unstake({ program, amount: 10 accounts: { userWallet: user }});

import { transferChecked } from "@solana/spl-token";
await transferChecked(
    program.provider.connection,
    user, // payer
    getUserUnstakedAssociatedTokenAddress(program, user),
    getUnstakedMintAddress(program),
    destination,
    user, // owner
    10, // amount
    program.constants.MINT_DECIMALS,
    undefined, // multisigners
    undefined, // confirm options
    SPL_TOKEN_2022
);

```

Notes

-   Mining proofs in JavaScript is extremely slow and only suitable for local/devnet testing.
-   The `ProgramWithConstants` wrapper exposes IDL constants as `program.constants` (useful for seeds and mint addresses).

<!--_For more examples, please refer to the [Documentation](https://example.com)_-->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

-   [ ] add license
-   [ ] Publish Package
-   [ ] Add helper functions
    -   [ ] create Token Account and data account
    -   [ ] parse getValidBlockhashes output
-   [ ] Add Tests

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

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

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
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[solana-shield]: https://img.shields.io/badge/Solana-121212?style=for-the-badge&logo=solana
[solana]: https://solana.com/src/img/branding/solanaLogo.png
[solana-url]: https://github.com/solana-labs/solana
