/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/comptoken.json`.
 */
export type Comptoken = {
  "address": "7j8p5AoS4z1LCPaDujSae6CXLRLKNThFbK5qqniGw9Nf",
  "metadata": {
    "name": "comptoken",
    "version": "0.2.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "collect",
      "discriminator": [
        208,
        47,
        194,
        155,
        17,
        98,
        82,
        236
      ],
      "accounts": [
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "userStakedTokenAccount"
        },
        {
          "name": "userUnstakedTokenAccount",
          "writable": true
        },
        {
          "name": "stakedMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "unstakedMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "globalData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "createUserDataAccount",
      "discriminator": [
        201,
        121,
        155,
        23,
        220,
        31,
        43,
        162
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createUserDataAccountArgs"
            }
          }
        }
      ]
    },
    {
      "name": "dailyDistribution",
      "discriminator": [
        115,
        202,
        47,
        246,
        23,
        104,
        84,
        16
      ],
      "accounts": [
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "stakedMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "unstakedMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "getValidBlockhashes",
      "discriminator": [
        19,
        134,
        134,
        42,
        30,
        157,
        237,
        235
      ],
      "accounts": [
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "slotHashes"
        }
      ],
      "args": [],
      "returns": {
        "defined": {
          "name": "comptoken::instructions::get_valid_blockhashes::ValidBlockhashes"
        }
      }
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mintStaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintUnstaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "slotHashes"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "resizeUserDataAccount",
      "discriminator": [
        252,
        102,
        157,
        155,
        16,
        77,
        128,
        58
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "globalData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "resizeUserDataAccountArgs"
            }
          }
        }
      ]
    },
    {
      "name": "reverify",
      "discriminator": [
        166,
        139,
        219,
        229,
        21,
        184,
        110,
        49
      ],
      "accounts": [
        {
          "name": "userWallet",
          "signer": true,
          "relations": [
            "worldIdNullifier"
          ]
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "worldIdProgram",
          "address": "5a3BkvmSEWSkWnBaFZGAUiywmjoqBqzspje9UmxcwG6L"
        },
        {
          "name": "worldIdRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "args.root_hash"
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdLatestRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  97,
                  116,
                  101,
                  115,
                  116,
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdNullifier",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "args.nullifier_hash"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "worldIdVerificationData"
            }
          }
        }
      ]
    },
    {
      "name": "stake",
      "discriminator": [
        206,
        176,
        202,
        18,
        200,
        209,
        179,
        108
      ],
      "accounts": [
        {
          "name": "globalData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "mintStaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintUnstaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "userStakedTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "userWallet"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintStaked"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userUnstakedTokenAccount",
          "writable": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "stakeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "submitMiningProof",
      "discriminator": [
        1,
        124,
        211,
        150,
        10,
        152,
        208,
        55
      ],
      "accounts": [
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "userUnstakedTokenAccount",
          "writable": true
        },
        {
          "name": "unstakedMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "submitMiningProofArgs"
            }
          }
        }
      ]
    },
    {
      "name": "unstake",
      "discriminator": [
        90,
        95,
        107,
        42,
        205,
        124,
        50,
        225
      ],
      "accounts": [
        {
          "name": "globalData",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "mintStaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintUnstaked",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "userStakedTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "userWallet"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mintStaked"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userUnstakedTokenAccount",
          "writable": true
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "unstakeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "unverify",
      "discriminator": [
        55,
        1,
        25,
        88,
        115,
        67,
        20,
        24
      ],
      "accounts": [
        {
          "name": "userWallet",
          "docs": [
            "and user data accounts."
          ],
          "relations": [
            "worldIdNullifier"
          ]
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "worldIdProgram",
          "address": "5a3BkvmSEWSkWnBaFZGAUiywmjoqBqzspje9UmxcwG6L"
        },
        {
          "name": "worldIdRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "args.root_hash"
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdLatestRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  97,
                  116,
                  101,
                  115,
                  116,
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdNullifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "args.nullifier_hash"
              }
            ]
          }
        },
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "worldIdVerificationData"
            }
          }
        }
      ]
    },
    {
      "name": "unverify2",
      "discriminator": [
        245,
        253,
        215,
        46,
        19,
        130,
        22,
        32
      ],
      "accounts": [
        {
          "name": "userWallet",
          "signer": true,
          "relations": [
            "worldIdNullifier"
          ]
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "worldIdNullifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "args.nullifier_hash"
              }
            ]
          }
        },
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "unverify2Args"
            }
          }
        }
      ]
    },
    {
      "name": "verify",
      "discriminator": [
        133,
        161,
        141,
        48,
        120,
        198,
        88,
        150
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "userWallet",
          "signer": true
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "userWallet"
              }
            ]
          }
        },
        {
          "name": "userUnstakedTokenAccount",
          "writable": true
        },
        {
          "name": "worldIdProgram",
          "address": "5a3BkvmSEWSkWnBaFZGAUiywmjoqBqzspje9UmxcwG6L"
        },
        {
          "name": "worldIdRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "args.root_hash"
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdLatestRoot",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  97,
                  116,
                  101,
                  115,
                  116,
                  82,
                  111,
                  111,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  0
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "worldIdProgram"
            }
          }
        },
        {
          "name": "worldIdNullifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  117,
                  108,
                  108,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "args.nullifier_hash"
              }
            ]
          }
        },
        {
          "name": "globalData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "unstakedMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  110,
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "worldIdVerificationData"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "globalData",
      "discriminator": [
        48,
        194,
        194,
        186,
        46,
        71,
        131,
        61
      ]
    },
    {
      "name": "latestRoot",
      "discriminator": [
        12,
        245,
        231,
        246,
        191,
        63,
        169,
        95
      ]
    },
    {
      "name": "nullifier",
      "discriminator": [
        18,
        56,
        142,
        165,
        181,
        158,
        187,
        133
      ]
    },
    {
      "name": "root",
      "discriminator": [
        46,
        159,
        131,
        37,
        245,
        84,
        5,
        9
      ]
    },
    {
      "name": "userData",
      "discriminator": [
        139,
        248,
        167,
        203,
        253,
        220,
        210,
        221
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nullifierAlreadyUsed",
      "msg": "Nullifier has already been used"
    },
    {
      "code": 6001,
      "name": "userDataNotCurrent",
      "msg": "User data account is not current"
    },
    {
      "code": 6002,
      "name": "invalidMiningProof",
      "msg": "Invalid mining proof submitted"
    },
    {
      "code": 6003,
      "name": "duplicateMiningProof",
      "msg": "Duplicate mining proof submitted"
    },
    {
      "code": 6004,
      "name": "userDataProofsCapacityExceeded",
      "msg": "User data proofs capacity exceeded, consider increasing capacity"
    },
    {
      "code": 6005,
      "name": "invalidNullifierOwner",
      "msg": "Invalid nullifier owner"
    },
    {
      "code": 6006,
      "name": "invalidNullifierHash",
      "msg": "Invalid nullifier hash for user data"
    },
    {
      "code": 6007,
      "name": "invalidCapacity",
      "msg": "Invalid capacity for resizing user data account"
    },
    {
      "code": 6008,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in token account"
    },
    {
      "code": 6009,
      "name": "accountAlreadyInitialized",
      "msg": "Account has already been initialized"
    },
    {
      "code": 6010,
      "name": "staleValidBlockhash",
      "msg": "Stale valid blockhash"
    }
  ],
  "types": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "docs": [
              "Owner of the program."
            ],
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "docs": [
              "Pending next owner (before claiming ownership)."
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "rootExpirySec",
            "docs": [
              "Time (in seconds) after which a root should be considered expired."
            ],
            "type": "u64"
          },
          {
            "name": "allowedUpdateStalenessSec",
            "docs": [
              "Time (in seconds) after which an attempted update should be rejected."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "createUserDataAccountArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "capacity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "dailyDistributionData",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalMinedToday",
            "type": "u64"
          },
          {
            "name": "highWaterMark",
            "type": "u64"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          },
          {
            "name": "perCapitaEarlyAdopterUbiAmount",
            "type": "u64"
          },
          {
            "name": "verifiedAccountsCount",
            "type": "u32"
          },
          {
            "name": "remainingEarlyAdopterCount",
            "type": "u32"
          },
          {
            "name": "historicDistributions",
            "type": {
              "defined": {
                "name": "ringBuffer",
                "generics": [
                  {
                    "kind": "type",
                    "type": {
                      "defined": {
                        "name": "historicDistribution"
                      }
                    }
                  },
                  {
                    "kind": "const",
                    "value": "365"
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "globalData",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dailyDistribution",
            "type": {
              "defined": {
                "name": "dailyDistributionData"
              }
            }
          },
          {
            "name": "validBlockhashes",
            "type": {
              "defined": {
                "name": "comptoken::state::global_data::valid_blockhashes::ValidBlockhashes"
              }
            }
          }
        ]
      }
    },
    {
      "name": "hash",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "array": [
              "u8",
              32
            ]
          }
        ]
      }
    },
    {
      "name": "historicDistribution",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "yieldRate",
            "type": "f64"
          },
          {
            "name": "ubiYield",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "latestRoot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "readBlockNumber",
            "docs": [
              "Block number from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "readBlockHash",
            "docs": [
              "Block hash from which the root was read."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "readBlockTimeUs",
            "docs": [
              "Block time (in microseconds) from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "root",
            "docs": [
              "Root hash of the last posted root account."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "verificationType",
            "docs": [
              "SEED: Verification type."
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "nullifier",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userWallet",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "resizeUserDataAccountArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newCapacity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ringBuffer",
      "repr": {
        "kind": "c"
      },
      "generics": [
        {
          "kind": "type",
          "name": "t"
        },
        {
          "kind": "const",
          "name": "n",
          "type": "usize"
        }
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "position",
            "type": "u64"
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                {
                  "generic": "t"
                },
                {
                  "generic": "n"
                }
              ]
            }
          }
        ]
      }
    },
    {
      "name": "root",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "readBlockNumber",
            "docs": [
              "Block number from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "readBlockHash",
            "docs": [
              "Block hash from which the root was read."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "readBlockTimeUs",
            "docs": [
              "Block time (in microseconds) from which the root was read."
            ],
            "type": "u64"
          },
          {
            "name": "refundRecipient",
            "docs": [
              "Payer of this root account, used for reimbursements upon cleanup."
            ],
            "type": "pubkey"
          },
          {
            "name": "root",
            "docs": [
              "SEED: Root hash."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "verificationType",
            "docs": [
              "SEED: Verification type."
            ],
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "stakeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "submitMiningProofArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rawData",
            "type": {
              "array": [
                "u8",
                76
              ]
            }
          }
        ]
      }
    },
    {
      "name": "testMintStakedUncheckedArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "testMintUnstakedUncheckedArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "unstakeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "unverify2Args",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nullifierHash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          }
        ]
      }
    },
    {
      "name": "userData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastClaimedTimestamp",
            "type": "i64"
          },
          {
            "name": "lastVerifiedTimestamp",
            "type": "i64"
          },
          {
            "name": "nullifierHash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "recentBlockhash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "proofs",
            "type": {
              "vec": {
                "defined": {
                  "name": "hash"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "worldIdVerificationData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rootHash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "nullifierHash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "proof",
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      "name": "comptoken::instructions::get_valid_blockhashes::ValidBlockhashes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "announced",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "valid",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          }
        ]
      }
    },
    {
      "name": "comptoken::state::global_data::valid_blockhashes::ValidBlockhashes",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "announcedBlockhash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "announcedBlockhashTime",
            "type": "i64"
          },
          {
            "name": "validBlockhash",
            "type": {
              "defined": {
                "name": "hash"
              }
            }
          },
          {
            "name": "validBlockhashTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "adjustFactor",
      "type": "f64",
      "value": "0.3"
    },
    {
      "name": "announcementInterval",
      "type": "i64",
      "value": "300"
    },
    {
      "name": "comptokenDistributionMultiplier",
      "type": "u64",
      "value": "146000"
    },
    {
      "name": "dailyDistributionDataHistoryLength",
      "type": "u64",
      "value": "365"
    },
    {
      "name": "earlyAdopterCount",
      "type": "u32",
      "value": "1000000"
    },
    {
      "name": "endGoalPercentIncrease",
      "type": "f64",
      "value": "0.00061"
    },
    {
      "name": "globalDataSeed",
      "type": "bytes",
      "value": "[103, 108, 111, 98, 97, 108, 95, 100, 97, 116, 97]"
    },
    {
      "name": "miningRewardAmount",
      "type": "u64",
      "value": "100"
    },
    {
      "name": "mintDecimals",
      "type": "u8",
      "value": "2"
    },
    {
      "name": "minSupplyLimitAmt",
      "type": "u64",
      "value": "1000000"
    },
    {
      "name": "nullifierSeed",
      "type": "bytes",
      "value": "[110, 117, 108, 108, 105, 102, 105, 101, 114]"
    },
    {
      "name": "proofDifficultyNbits",
      "type": "u32",
      "value": "403615192"
    },
    {
      "name": "proofDifficultyNbitsDevnet",
      "type": "u32",
      "value": "487501272"
    },
    {
      "name": "stakedMintSeed",
      "type": "bytes",
      "value": "[115, 116, 97, 107, 101, 100, 95, 109, 105, 110, 116]"
    },
    {
      "name": "unstakedMintSeed",
      "type": "bytes",
      "value": "[117, 110, 115, 116, 97, 107, 101, 100, 95, 109, 105, 110, 116]"
    },
    {
      "name": "userDataSeed",
      "type": "bytes",
      "value": "[117, 115, 101, 114, 95, 100, 97, 116, 97]"
    },
    {
      "name": "userDataSizeWithoutProofs",
      "type": "u64",
      "value": "92"
    },
    {
      "name": "verificationDuration",
      "type": "i64",
      "value": "2678400"
    },
    {
      "name": "verificationType",
      "type": {
        "array": [
          "u8",
          1
        ]
      },
      "value": "[0]"
    },
    {
      "name": "worldAction",
      "type": "bytes",
      "value": "[118, 101, 114, 105, 102, 121, 104, 117, 109, 97, 110]"
    },
    {
      "name": "worldAppId",
      "type": "bytes",
      "value": "[]"
    },
    {
      "name": "worldIdProofLength",
      "type": "u64",
      "value": "256"
    }
  ]
};
