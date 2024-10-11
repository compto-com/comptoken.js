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
    ```json
    {
        ... other fields
        "dependencies": {
            "@compto/comptoken.js": "git+https://github.com/compto-com/comptoken.js.git#master",
            ... other dependencies
        },
    }
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

note: this example includes mining for comptokens in javascript. This is a terrible
idea because, and we recommend using a dedicated bitcoin miner through our [stratum server](https://compto.com/info/mining)

```js
import {
    comptoken_mint_pubkey,
    ComptokenProof,
    createCreateUserDataAccountInstruction,
    createGetValidBlockhashesInstruction,
    createProofSubmissionInstruction,
    UserDataAccount,
} from "@compto/comptoken.js";
import {
    createAssociatedTokenAccount,
    getAccount,
    getAssociatedTokenAddressSync,
    TOKEN_2022_PROGRAM_ID,
    TokenAccountNotFoundError,
} from "@solana/spl-token";
import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";
import base64 from "base64-js";
import * as bs58_ from "bs58";
const bs58 = bs58_.default;

const connection = new Connection("https://api.devnet.solana.com");

const compto_wallet = Keypair.generate();
const compto_comptoken_account = await createAssociatedTokenAccount(
    connection,
    compto_wallet,
    comptoken_mint_pubkey,
    compto_wallet.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID
);

console.log("Compto Wallet: ", compto_wallet.publicKey.toBase58());
console.log("Compto Comptoken Account: ", compto_comptoken_account.toBase58());

// token accounts are effectively frozen until a data account is created
let tx0 = new Transaction();
tx0.add(
    await createCreateUserDataAccountInstruction(
        connection,
        300, // number of proofs the data account can store. min is 1
        compto_wallet.publicKey, // payer
        compto_wallet.publicKey, // owner
        compto_comptoken_account // comptoken token account
    )
);
let result0 = await sendAndConfirmTransaction(connection, tx0, [compto_wallet]);

let tx1 = new Transaction();
tx1.add(await createGetValidBlockhashesInstruction());

let getValidBlockhashesTransactionSignature = await sendAndConfirmTransaction(
    connection,
    tx1,
    [compto_wallet]
);

let result = await waitForTransactionConfirmation(
    getValidBlockhashesTransactionSignature
);

let resultData = result.meta.returnData.data[0];
let resultBytes = base64.toByteArray(resultData);
let currentBlockB58 = bs58.encode(resultBytes.slice(0, 32));
let announcedBlockB58 = bs58.encode(resultBytes.slice(32, 64));
let validBlockHashes = {
    current_block: currentBlockB58,
    announced_block: announcedBlockB58,
};
console.log("Valid Block Hashes: ", validBlockHashes);

for (let nonce = 0; nonce < 2 ** 32; nonce++) {
    let delay = new Promise((resolve) => setTimeout(resolve, 1000)); // to prevent ratelimiting issues

    let nonceBuffer = Buffer.alloc(4);
    nonceBuffer.writeUInt32LE(nonce);

    let comptoken_proof;
    try {
        comptoken_proof = new ComptokenProof(
            compto_comptoken_account.toBuffer(),
            resultBytes.slice(0, 32),
            Buffer.alloc(32, 0), // extraData,
            nonceBuffer, // 4 bytes
            Buffer.from([0, 0, 0, 0]), // version, 4 bytes
            Buffer.from([0, 0, 0, 0]) // timestamp, 4
        );
    } catch (e) {
        if (
            e instanceof Error &&
            e.message == "The provided proof does not have enough zeroes"
        ) {
            continue;
        }
        console.error(e);
        throw e;
    }

    await submitProof(comptoken_proof, compto_wallet, compto_comptoken_account);
    successes++;
    console.log("Successes: ", successes);
    if (successes >= 100) {
        break;
    }
    await delay;
}

async function submitProof(
    comptoken_proof,
    compto_wallet,
    compto_comptoken_account
) {
    console.log("nonce: ", bytesToBigInt(comptoken_proof.nonce));

    let tx2 = new Transaction();
    tx2.add(
        await createProofSubmissionInstruction(
            comptoken_proof,
            compto_wallet.publicKey,
            compto_comptoken_account
        )
    );

    let proofSubmissionTransactionSignature = await sendAndConfirmTransaction(
        connection,
        tx2,
        [compto_wallet]
    );

    let result2 = await waitForTransactionConfirmation(
        proofSubmissionTransactionSignature
    );

    console.log(
        "Proof Submission Transaction Signature: ",
        proofSubmissionTransactionSignature
    );
    console.log("Proof Submission Result: ", result2);
}

async function waitForTransactionConfirmation(
    signature,
    { max_attempts = 10 } = {}
) {
    let attempts = 0;
    while (attempts++ < max_attempts) {
        let result = await connection.getTransaction(signature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0,
        });
        if (result !== null) {
            return result;
        }
    }
    throw new Error(
        "Transaction not confirmed after " + max_attempts + " attempts"
    );
}

function bytesToBigInt(arr) {
    let int = 0n;
    for (let i = arr.length - 1; i >= 0; --i) {
        int <<= 8n;
        int |= BigInt(arr[i]);
    }
    return int;
}
```

<!--_For more examples, please refer to the [Documentation](https://example.com)_-->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

-   [ ] add license
-   [ ] Publish Package
-   [ ] Add helper functions
    -   [ ] create Token Account and data account
    -   [ ] parse getValidBlockhashes output

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
