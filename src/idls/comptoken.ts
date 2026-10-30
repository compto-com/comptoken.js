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
    "version": "0.3.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
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
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        },
        {
          "name": "lpMint",
          "docs": [
            "validated against pool_state in the handler"
          ],
          "writable": true
        },
        {
          "name": "comptokenLiquidityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  67,
                  79,
                  77,
                  80
                ]
              }
            ]
          }
        },
        {
          "name": "usdcLiquidityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  85,
                  83,
                  68,
                  67
                ]
              }
            ]
          }
        },
        {
          "name": "comptokenLpTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "globalData"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "lpMint"
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
          "name": "poolComptokenVault",
          "docs": [
            "validated against pool_state in the handler"
          ],
          "writable": true
        },
        {
          "name": "poolUsdcVault",
          "docs": [
            "validated against pool_state in the handler"
          ],
          "writable": true
        },
        {
          "name": "poolState",
          "writable": true,
          "address": "2wRw8foEASWECmNLu1aWsEtSr4wfVfWqGXPkqYGU1BcE"
        },
        {
          "name": "ammConfig",
          "docs": [
            "address validated against pool_state in the handler"
          ]
        },
        {
          "name": "raydiumAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  110,
                  100,
                  95,
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  95,
                  115,
                  101,
                  101,
                  100
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "raydiumCpSwapProgram"
            }
          }
        },
        {
          "name": "observationState",
          "docs": [
            "validated against pool_state in the handler"
          ],
          "writable": true
        },
        {
          "name": "raydiumCpSwapProgram",
          "address": "GVSzpfu4CzCxgU7wNeNy4eCeDX6R7ecY3vKSRLuDJfu1"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "token2022Program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
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
          "name": "token2022Program",
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
          "name": "comptokenLiquidityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  67,
                  79,
                  77,
                  80
                ]
              }
            ]
          }
        },
        {
          "name": "token2022Program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
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
          "name": "stakedMint",
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
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
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
          "name": "comptokenLiquidityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  67,
                  79,
                  77,
                  80
                ]
              }
            ]
          }
        },
        {
          "name": "usdcLiquidityTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  105,
                  116,
                  121,
                  95,
                  85,
                  83,
                  68,
                  67
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
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "token2022Program",
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
          "name": "worldIdProgram",
          "address": "7UyhiPLoB6zwVZMYzEcizhDQeCF5ixQgp4sFeAyu8U1g"
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
          "name": "stakedMint",
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
                "path": "token2022Program"
              },
              {
                "kind": "account",
                "path": "stakedMint"
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
          "name": "token2022Program",
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
          "name": "token2022Program",
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
      "name": "syncValidBlockhashes",
      "discriminator": [
        127,
        131,
        158,
        199,
        184,
        137,
        182,
        90
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
          "name": "currentBlockhashes"
        }
      }
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
          "name": "stakedMint",
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
                "path": "token2022Program"
              },
              {
                "kind": "account",
                "path": "stakedMint"
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
          "name": "token2022Program",
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
      "name": "unverifyWithProofRecovery",
      "discriminator": [
        79,
        111,
        27,
        98,
        224,
        170,
        111,
        39
      ],
      "accounts": [
        {
          "name": "userWallet",
          "docs": [
            "",
            "intentionally not a Signer since the user may not have access to the wallet used in the original verification"
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
          "address": "7UyhiPLoB6zwVZMYzEcizhDQeCF5ixQgp4sFeAyu8U1g"
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
      "name": "unverifyWithWalletSignature",
      "discriminator": [
        61,
        189,
        57,
        95,
        92,
        139,
        234,
        206
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
              "name": "unverifyWithWalletSignatureArgs"
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
          "address": "7UyhiPLoB6zwVZMYzEcizhDQeCF5ixQgp4sFeAyu8U1g"
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
          "name": "token2022Program",
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
      "name": "ammConfig",
      "discriminator": [
        218,
        244,
        33,
        104,
        203,
        203,
        43,
        111
      ]
    },
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
      "name": "observationState",
      "discriminator": [
        122,
        174,
        197,
        53,
        129,
        9,
        165,
        132
      ]
    },
    {
      "name": "poolState",
      "discriminator": [
        247,
        237,
        227,
        245,
        215,
        195,
        222,
        70
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
      "name": "sessionAlreadyInUse",
      "msg": "Session already in use"
    },
    {
      "code": 6002,
      "name": "userDataNotCurrent",
      "msg": "User data account is not current"
    },
    {
      "code": 6003,
      "name": "invalidMiningProof",
      "msg": "Invalid mining proof submitted"
    },
    {
      "code": 6004,
      "name": "duplicateMiningProof",
      "msg": "Duplicate mining proof submitted"
    },
    {
      "code": 6005,
      "name": "userDataProofsCapacityExceeded",
      "msg": "User data proofs capacity exceeded, consider increasing capacity"
    },
    {
      "code": 6006,
      "name": "invalidNullifierOwner",
      "msg": "Invalid nullifier owner"
    },
    {
      "code": 6007,
      "name": "invalidVerification",
      "msg": "Invalid verification for user data"
    },
    {
      "code": 6008,
      "name": "accountAlreadyVerified",
      "msg": "Account has already been verified"
    },
    {
      "code": 6009,
      "name": "invalidCapacity",
      "msg": "Invalid capacity for resizing user data account"
    },
    {
      "code": 6010,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in token account"
    },
    {
      "code": 6011,
      "name": "accountAlreadyInitialized",
      "msg": "Account has already been initialized"
    },
    {
      "code": 6012,
      "name": "staleValidBlockhash",
      "msg": "Stale valid blockhash"
    },
    {
      "code": 6013,
      "name": "liquidityPoolFeeNotZero",
      "msg": "Liquidity pool has non-zero fee"
    },
    {
      "code": 6014,
      "name": "liquidityPoolEmpty",
      "msg": "Liquidity pool is empty"
    }
  ],
  "types": [
    {
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "disableCreatePool",
            "type": "bool"
          },
          {
            "name": "index",
            "type": "u16"
          },
          {
            "name": "tradeFeeRate",
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "type": "u64"
          },
          {
            "name": "fundFeeRate",
            "type": "u64"
          },
          {
            "name": "createPoolFee",
            "type": "u64"
          },
          {
            "name": "protocolOwner",
            "type": "pubkey"
          },
          {
            "name": "fundOwner",
            "type": "pubkey"
          },
          {
            "name": "creatorFeeRate",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                15
              ]
            }
          }
        ]
      }
    },
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
      "name": "currentBlockhashes",
      "docs": [
        "The announced and currently valid blockhashes after a sync operation."
      ],
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
                "name": "validBlockhashes"
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
      "name": "observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "type": "u64"
          },
          {
            "name": "cumulativeToken0PriceX32",
            "type": "u128"
          },
          {
            "name": "cumulativeToken1PriceX32",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "observationState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "observationIndex",
            "type": "u16"
          },
          {
            "name": "poolId",
            "type": "pubkey"
          },
          {
            "name": "observations",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "observation"
                  }
                },
                100
              ]
            }
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ammConfig",
            "type": "pubkey"
          },
          {
            "name": "poolCreator",
            "type": "pubkey"
          },
          {
            "name": "token0Vault",
            "type": "pubkey"
          },
          {
            "name": "token1Vault",
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "type": "pubkey"
          },
          {
            "name": "token0Mint",
            "type": "pubkey"
          },
          {
            "name": "token1Mint",
            "type": "pubkey"
          },
          {
            "name": "token0Program",
            "type": "pubkey"
          },
          {
            "name": "token1Program",
            "type": "pubkey"
          },
          {
            "name": "observationKey",
            "type": "pubkey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "lpMintDecimals",
            "type": "u8"
          },
          {
            "name": "mint0Decimals",
            "type": "u8"
          },
          {
            "name": "mint1Decimals",
            "type": "u8"
          },
          {
            "name": "lpSupply",
            "type": "u64"
          },
          {
            "name": "protocolFeesToken0",
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "type": "u64"
          },
          {
            "name": "recentEpoch",
            "type": "u64"
          },
          {
            "name": "creatorFeeOn",
            "type": "u8"
          },
          {
            "name": "enableCreatorFee",
            "type": "bool"
          },
          {
            "name": "padding1",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "creatorFeesToken0",
            "type": "u64"
          },
          {
            "name": "creatorFeesToken1",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                28
              ]
            }
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
      "docs": [
        "Raw proof bytes submitted by the client for Bitcoin-style proof-of-work validation."
      ],
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
      "name": "unverifyWithWalletSignatureArgs",
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
            "name": "verification",
            "type": {
              "defined": {
                "name": "verification"
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
      "name": "validBlockhashes",
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
    },
    {
      "name": "verification",
      "docs": [
        "Tracks which World ID verification flow (if any) a user is currently bound to.",
        "`ubi_claimed` is carried through every variant and is only ever set true, never reset,",
        "so the one-time early adopter UBI cannot be re-claimed by unverifying and verifying",
        "again (v3, v4, or across versions)."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "unverified"
          },
          {
            "name": "nullifier",
            "fields": [
              {
                "name": "hash",
                "type": {
                  "defined": {
                    "name": "hash"
                  }
                }
              }
            ]
          },
          {
            "name": "session",
            "fields": [
              {
                "name": "id",
                "type": {
                  "defined": {
                    "name": "hash"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "worldIdVerificationData",
      "docs": [
        "Proof inputs needed to verify a user's World ID membership proof on-chain."
      ],
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
      "name": "comptokenLiquidityTokenAccountSeed",
      "type": "bytes",
      "value": "[108, 105, 113, 117, 105, 100, 105, 116, 121, 95, 67, 79, 77, 80]"
    },
    {
      "name": "compUsdcPoolAddress",
      "type": "pubkey",
      "value": "2wRw8foEASWECmNLu1aWsEtSr4wfVfWqGXPkqYGU1BcE"
    },
    {
      "name": "dailyDistributionDataHistoryLength",
      "type": "u64",
      "value": "365"
    },
    {
      "name": "earlyAdopterCount",
      "type": "u32",
      "value": "1000000000"
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
      "name": "liquidityMaxPriceDeviationBps",
      "type": "u64",
      "value": "200"
    },
    {
      "name": "liquidityPoolPercent",
      "type": "f64",
      "value": "0.05"
    },
    {
      "name": "liquidityTwapMinWindowSeconds",
      "type": "u64",
      "value": "1440"
    },
    {
      "name": "miningRewardAmount",
      "type": "u64",
      "value": "10000"
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
      "name": "raydiumAmmConfigIndex",
      "type": "u16",
      "value": "0"
    },
    {
      "name": "reverifySignalAction",
      "type": "bytes",
      "value": "[114, 101, 118, 101, 114, 105, 102, 121]"
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
      "name": "unverifySignalAction",
      "type": "bytes",
      "value": "[117, 110, 118, 101, 114, 105, 102, 121]"
    },
    {
      "name": "usdcLiquidityTokenAccountSeed",
      "type": "bytes",
      "value": "[108, 105, 113, 117, 105, 100, 105, 116, 121, 95, 85, 83, 68, 67]"
    },
    {
      "name": "usdcMintAddress",
      "type": "pubkey",
      "value": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    },
    {
      "name": "userDataSeed",
      "type": "bytes",
      "value": "[117, 115, 101, 114, 95, 100, 97, 116, 97]"
    },
    {
      "name": "userDataSizeWithoutProofs",
      "type": "u64",
      "value": "100"
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
      "name": "verifySignalAction",
      "type": "bytes",
      "value": "[118, 101, 114, 105, 102, 121]"
    },
    {
      "name": "worldAction",
      "type": "bytes",
      "value": "[118, 101, 114, 105, 102, 121, 104, 117, 109, 97, 110]"
    },
    {
      "name": "worldAppId",
      "type": "bytes",
      "value": "[97, 112, 112, 95, 54, 53, 57, 57, 57, 54, 52, 97, 50, 57, 54, 52, 49, 101, 52, 55, 99, 54, 102, 51, 56, 99, 53, 54, 50, 100, 97, 48, 54, 50, 56, 100]"
    },
    {
      "name": "worldIdProofLength",
      "type": "u64",
      "value": "256"
    },
    {
      "name": "worldIdV4Action",
      "type": "bytes",
      "value": "[118, 101, 114, 105, 102, 121, 104, 117, 109, 97, 110, 45, 118, 52]"
    },
    {
      "name": "worldIdV4CredentialGenesisIssuedAtMin",
      "type": "u64",
      "value": "0"
    },
    {
      "name": "worldIdV4RpId",
      "type": "u64",
      "value": "1"
    },
    {
      "name": "worldIdV4SessionSeed",
      "type": "bytes",
      "value": "[119, 111, 114, 108, 100, 95, 105, 100, 95, 115, 101, 115, 115, 105, 111, 110]"
    }
  ]
};
