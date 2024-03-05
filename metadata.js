export function metadata() {
    return {
        "source": {
            "hash": "0x6a1235cda5a1bec034cd3b79ccf81cc2429d451c65d4b9c2771f4b67bff01a6e",
            "language": "ink! 4.3.0",
            "compiler": "rustc 1.75.0-nightly",
            "build_info": {
                "build_mode": "Release",
                "cargo_contract_version": "3.2.0",
                "rust_toolchain": "nightly-aarch64-apple-darwin",
                "wasm_opt_settings": {
                    "keep_debug_symbols": false,
                    "optimization_passes": "Z"
                }
            }
        },
        "contract": {
            "name": "delphi",
            "version": "0.1.0",
            "authors": [
                "@thewoodfish jasonholt2002@gmail.com"
            ]
        },
        "spec": {
            "constructors": [
                {
                    "args": [],
                    "default": false,
                    "docs": [
                        "Constructor that initializes the default values and memory of the great Delphi"
                    ],
                    "label": "new",
                    "payable": false,
                    "returnType": {
                        "displayName": [
                            "ink_primitives",
                            "ConstructorResult"
                        ],
                        "type": 9
                    },
                    "selector": "0x9bae9d5e"
                }
            ],
            "docs": [],
            "environment": {
                "accountId": {
                    "displayName": [
                        "AccountId"
                    ],
                    "type": 5
                },
                "balance": {
                    "displayName": [
                        "Balance"
                    ],
                    "type": 19
                },
                "blockNumber": {
                    "displayName": [
                        "BlockNumber"
                    ],
                    "type": 22
                },
                "chainExtension": {
                    "displayName": [
                        "ChainExtension"
                    ],
                    "type": 23
                },
                "hash": {
                    "displayName": [
                        "Hash"
                    ],
                    "type": 20
                },
                "maxEventTopics": 4,
                "timestamp": {
                    "displayName": [
                        "Timestamp"
                    ],
                    "type": 21
                }
            },
            "events": [
                {
                    "args": [
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "account_id",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": false,
                            "label": "name",
                            "type": {
                                "displayName": [
                                    "Vec"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "docs": [],
                    "label": "AccountCreated"
                },
                {
                    "args": [
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "account_id",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": false,
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "docs": [],
                            "indexed": false,
                            "label": "ptype_ipfs_addr",
                            "type": {
                                "displayName": [
                                    "PropertyRequirementAddr"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "docs": [],
                    "label": "PropertyTypeRegistered"
                },
                {
                    "args": [
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "claimer",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "docs": [],
                            "indexed": false,
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "docs": [],
                    "label": "PropertyClaimRegistered"
                },
                {
                    "args": [
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "sender",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "recipient",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "docs": [
                        "Event to announce the successful transfer of a property"
                    ],
                    "label": "PropertyTransferred"
                },
                {
                    "args": [
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "attester",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "docs": [],
                            "indexed": true,
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "docs": [
                        "Event to announce the successful attestation of a property"
                    ],
                    "label": "PropertyDocumentSigned"
                }
            ],
            "lang_error": {
                "displayName": [
                    "ink",
                    "LangError"
                ],
                "type": 11
            },
            "messages": [
                {
                    "args": [
                        {
                            "label": "account_id",
                            "type": {
                                "displayName": [
                                    "AccountIdVec"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "name",
                            "type": {
                                "displayName": [
                                    "Vec"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "timestamp",
                            "type": {
                                "displayName": [
                                    "TimeString"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Register an account"
                    ],
                    "label": "register_account",
                    "mutates": true,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0x22557465"
                },
                {
                    "args": [],
                    "default": false,
                    "docs": [
                        " Check if an account exists.",
                        " It also returns the name of the user if it exists"
                    ],
                    "label": "account_exists",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 15
                    },
                    "selector": "0x5ec33906"
                },
                {
                    "args": [
                        {
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "ptype_ipfs_addr",
                            "type": {
                                "displayName": [
                                    "PropertyRequirementAddr"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Register a property type.",
                        " This should only be called by an authority figure (e.g Ministry of Lands)"
                    ],
                    "label": "register_ptype",
                    "mutates": true,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0xf89f6c67"
                },
                {
                    "args": [
                        {
                            "label": "account_id",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Return the info about property type documents created by a certain authority.",
                        " They are returned as concatenated bytes separated by the '###' character.",
                        " The property id and address are separated by a '~' character",
                        " E.g prop_id1~prop_addr1###prop_id2~prop_addr2"
                    ],
                    "label": "ptype_documents",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 18
                    },
                    "selector": "0xda2d9f3c"
                },
                {
                    "args": [
                        {
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "claim_ipfs_addr",
                            "type": {
                                "displayName": [
                                    "PropertyClaimAddr"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Submit a claim to a particular property.",
                        " This is the first step, preceeding verification and attestation"
                    ],
                    "label": "register_claim",
                    "mutates": true,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0x5940d1d5"
                },
                {
                    "args": [
                        {
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Returns a list of property (claims) IDs registered according to a particular property type",
                        " The property IDs are separated by the '#' character"
                    ],
                    "label": "property_claims",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 18
                    },
                    "selector": "0x88e13c2a"
                },
                {
                    "args": [
                        {
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Return the details of a property",
                        " The claimer is returned as the first element of the tuple",
                        " The default value of the claimer is the caller.",
                        " The vector is the claimers parsable account id + the claim's IPFS address + the property type ID separated by a '$' character"
                    ],
                    "label": "property_detail",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 18
                    },
                    "selector": "0xb2617c4d"
                },
                {
                    "args": [
                        {
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "recipient",
                            "type": {
                                "displayName": [
                                    "AccountId"
                                ],
                                "type": 5
                            }
                        },
                        {
                            "label": "senders_claim_ipfs_addr",
                            "type": {
                                "displayName": [
                                    "PropertyClaimAddr"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "senders_property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "recipients_claim_ipfs_addr",
                            "type": {
                                "displayName": [
                                    "PropertyClaimAddr"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "recipients_property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "time_of_transfer",
                            "type": {
                                "displayName": [
                                    "PropertyTransferTimestamp"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Transfer a property (or parts of it) from one user to the other",
                        " If a part of the property is transferred, the new properties automatically becomes unattested and have to be signed afresh"
                    ],
                    "label": "transfer_property",
                    "mutates": true,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0xb5e16f07"
                },
                {
                    "args": [
                        {
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "property_type_id",
                            "type": {
                                "displayName": [
                                    "PropertyTypeId"
                                ],
                                "type": 0
                            }
                        },
                        {
                            "label": "assertion_timestamp",
                            "type": {
                                "displayName": [
                                    "AssertionTimestamp"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Sign a property document and cement the owner as the undisputed rightful owner of the property.",
                        " It returns an error if the attested is unauthorized to attest ownership.",
                        " Authorization is gotten by checking for equality between the account that created the property type and the attesting account"
                    ],
                    "label": "sign_document",
                    "mutates": true,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0xcac900b8"
                },
                {
                    "args": [
                        {
                            "label": "property_id",
                            "type": {
                                "displayName": [
                                    "PropertyId"
                                ],
                                "type": 0
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Return the verification status of a property.",
                        " This verification status includes: 1. AccountIds showing transfer History 2. AssertionTimestamp",
                        " The accountId's showing transfer history are separated with a '$' character.",
                        " The history is separated from the timestamp by a '@' character"
                    ],
                    "label": "attestation_status",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 18
                    },
                    "selector": "0xf3c0a2f3"
                }
            ]
        },
        "storage": {
            "root": {
                "layout": {
                    "struct": {
                        "fields": [
                            {
                                "layout": {
                                    "root": {
                                        "layout": {
                                            "struct": {
                                                "fields": [
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0xe9674168",
                                                                "ty": 0
                                                            }
                                                        },
                                                        "name": "name"
                                                    },
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0xe9674168",
                                                                "ty": 0
                                                            }
                                                        },
                                                        "name": "timestamp"
                                                    }
                                                ],
                                                "name": "AccountInfo"
                                            }
                                        },
                                        "root_key": "0xe9674168"
                                    }
                                },
                                "name": "accounts"
                            },
                            {
                                "layout": {
                                    "root": {
                                        "layout": {
                                            "leaf": {
                                                "key": "0xf5a82dd0",
                                                "ty": 2
                                            }
                                        },
                                        "root_key": "0xf5a82dd0"
                                    }
                                },
                                "name": "registrations"
                            },
                            {
                                "layout": {
                                    "root": {
                                        "layout": {
                                            "leaf": {
                                                "key": "0xae501552",
                                                "ty": 4
                                            }
                                        },
                                        "root_key": "0xae501552"
                                    }
                                },
                                "name": "claims"
                            },
                            {
                                "layout": {
                                    "root": {
                                        "layout": {
                                            "struct": {
                                                "fields": [
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x76dfbe41",
                                                                "ty": 5
                                                            }
                                                        },
                                                        "name": "claimer"
                                                    },
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x76dfbe41",
                                                                "ty": 0
                                                            }
                                                        },
                                                        "name": "property_claim_addr"
                                                    },
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x76dfbe41",
                                                                "ty": 0
                                                            }
                                                        },
                                                        "name": "property_type_id"
                                                    },
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x76dfbe41",
                                                                "ty": 7
                                                            }
                                                        },
                                                        "name": "transfer_history"
                                                    },
                                                    {
                                                        "layout": {
                                                            "struct": {
                                                                "fields": [
                                                                    {
                                                                        "layout": {
                                                                            "leaf": {
                                                                                "key": "0x76dfbe41",
                                                                                "ty": 0
                                                                            }
                                                                        },
                                                                        "name": "0"
                                                                    },
                                                                    {
                                                                        "layout": {
                                                                            "leaf": {
                                                                                "key": "0x76dfbe41",
                                                                                "ty": 5
                                                                            }
                                                                        },
                                                                        "name": "1"
                                                                    }
                                                                ],
                                                                "name": "(A, B)"
                                                            }
                                                        },
                                                        "name": "assertion"
                                                    }
                                                ],
                                                "name": "Property"
                                            }
                                        },
                                        "root_key": "0x76dfbe41"
                                    }
                                },
                                "name": "properties"
                            },
                            {
                                "layout": {
                                    "root": {
                                        "layout": {
                                            "leaf": {
                                                "key": "0x893c589d",
                                                "ty": 0
                                            }
                                        },
                                        "root_key": "0x893c589d"
                                    }
                                },
                                "name": "account_ids"
                            }
                        ],
                        "name": "Delphi"
                    }
                },
                "root_key": "0x00000000"
            }
        },
        "types": [
            {
                "id": 0,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 1
                        }
                    }
                }
            },
            {
                "id": 1,
                "type": {
                    "def": {
                        "primitive": "u8"
                    }
                }
            },
            {
                "id": 2,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 3
                        }
                    }
                }
            },
            {
                "id": 3,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "name": "id",
                                    "type": 0,
                                    "typeName": "PropertyTypeId"
                                },
                                {
                                    "name": "address",
                                    "type": 0,
                                    "typeName": "PropertyRequirementAddr"
                                }
                            ]
                        }
                    },
                    "path": [
                        "delphi",
                        "delphi",
                        "PropertyType"
                    ]
                }
            },
            {
                "id": 4,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 0
                        }
                    }
                }
            },
            {
                "id": 5,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 6,
                                    "typeName": "[u8; 32]"
                                }
                            ]
                        }
                    },
                    "path": [
                        "ink_primitives",
                        "types",
                        "AccountId"
                    ]
                }
            },
            {
                "id": 6,
                "type": {
                    "def": {
                        "array": {
                            "len": 32,
                            "type": 1
                        }
                    }
                }
            },
            {
                "id": 7,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 8
                        }
                    }
                }
            },
            {
                "id": 8,
                "type": {
                    "def": {
                        "tuple": [
                            5,
                            0
                        ]
                    }
                }
            },
            {
                "id": 9,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 10
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 11
                                        }
                                    ],
                                    "index": 1,
                                    "name": "Err"
                                }
                            ]
                        }
                    },
                    "params": [
                        {
                            "name": "T",
                            "type": 10
                        },
                        {
                            "name": "E",
                            "type": 11
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 10,
                "type": {
                    "def": {
                        "tuple": []
                    }
                }
            },
            {
                "id": 11,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "index": 1,
                                    "name": "CouldNotReadInput"
                                }
                            ]
                        }
                    },
                    "path": [
                        "ink_primitives",
                        "LangError"
                    ]
                }
            },
            {
                "id": 12,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 13
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 11
                                        }
                                    ],
                                    "index": 1,
                                    "name": "Err"
                                }
                            ]
                        }
                    },
                    "params": [
                        {
                            "name": "T",
                            "type": 13
                        },
                        {
                            "name": "E",
                            "type": 11
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 13,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 10
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 14
                                        }
                                    ],
                                    "index": 1,
                                    "name": "Err"
                                }
                            ]
                        }
                    },
                    "params": [
                        {
                            "name": "T",
                            "type": 10
                        },
                        {
                            "name": "E",
                            "type": 14
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 14,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "index": 0,
                                    "name": "CannotTransferToSelf"
                                },
                                {
                                    "index": 1,
                                    "name": "UnauthorizedAccount"
                                }
                            ]
                        }
                    },
                    "path": [
                        "delphi",
                        "delphi",
                        "Error"
                    ]
                }
            },
            {
                "id": 15,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 16
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 11
                                        }
                                    ],
                                    "index": 1,
                                    "name": "Err"
                                }
                            ]
                        }
                    },
                    "params": [
                        {
                            "name": "T",
                            "type": 16
                        },
                        {
                            "name": "E",
                            "type": 11
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 16,
                "type": {
                    "def": {
                        "tuple": [
                            17,
                            0
                        ]
                    }
                }
            },
            {
                "id": 17,
                "type": {
                    "def": {
                        "primitive": "bool"
                    }
                }
            },
            {
                "id": 18,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 0
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 11
                                        }
                                    ],
                                    "index": 1,
                                    "name": "Err"
                                }
                            ]
                        }
                    },
                    "params": [
                        {
                            "name": "T",
                            "type": 0
                        },
                        {
                            "name": "E",
                            "type": 11
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 19,
                "type": {
                    "def": {
                        "primitive": "u128"
                    }
                }
            },
            {
                "id": 20,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 6,
                                    "typeName": "[u8; 32]"
                                }
                            ]
                        }
                    },
                    "path": [
                        "ink_primitives",
                        "types",
                        "Hash"
                    ]
                }
            },
            {
                "id": 21,
                "type": {
                    "def": {
                        "primitive": "u64"
                    }
                }
            },
            {
                "id": 22,
                "type": {
                    "def": {
                        "primitive": "u32"
                    }
                }
            },
            {
                "id": 23,
                "type": {
                    "def": {
                        "variant": {}
                    },
                    "path": [
                        "ink_env",
                        "types",
                        "NoChainExtension"
                    ]
                }
            }
        ],
        "version": "4"
    };
}