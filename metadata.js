export function metadata() {
    return {
        "source": {
            "hash": "0x45d25e83009260f939b63e5dfd144d1f69f281085b994541b27172166d45ca56",
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
                        "type": 8
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
                    "type": 6
                },
                "balance": {
                    "displayName": [
                        "Balance"
                    ],
                    "type": 17
                },
                "blockNumber": {
                    "displayName": [
                        "BlockNumber"
                    ],
                    "type": 19
                },
                "chainExtension": {
                    "displayName": [
                        "ChainExtension"
                    ],
                    "type": 20
                },
                "hash": {
                    "displayName": [
                        "Hash"
                    ],
                    "type": 18
                },
                "maxEventTopics": 4,
                "timestamp": {
                    "displayName": [
                        "Timestamp"
                    ],
                    "type": 2
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
                                "type": 6
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
                                "type": 6
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
                                "type": 6
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
                }
            ],
            "lang_error": {
                "displayName": [
                    "ink",
                    "LangError"
                ],
                "type": 10
            },
            "messages": [
                {
                    "args": [
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
                                    "u64"
                                ],
                                "type": 2
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
                        "type": 8
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
                        "type": 11
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
                        "type": 8
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
                                "type": 6
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
                        "type": 14
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
                        "type": 8
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
                        "type": 14
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
                        " The default value of the claimer is the caller. In this scenerio, the length of the vector will be the flag on the client side"
                    ],
                    "label": "property_detail",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 15
                    },
                    "selector": "0xb2617c4d"
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
                                                                "ty": 2
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
                                                "ty": 3
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
                                                "ty": 5
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
                                                                "ty": 6
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
                                            "struct": {
                                                "fields": [
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x4b4a0a00",
                                                                "ty": 0
                                                            }
                                                        },
                                                        "name": "property"
                                                    },
                                                    {
                                                        "layout": {
                                                            "leaf": {
                                                                "key": "0x4b4a0a00",
                                                                "ty": 2
                                                            }
                                                        },
                                                        "name": "timestamp"
                                                    }
                                                ],
                                                "name": "IssueInfo"
                                            }
                                        },
                                        "root_key": "0x4b4a0a00"
                                    }
                                },
                                "name": "assertions"
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
                        "primitive": "u64"
                    }
                }
            },
            {
                "id": 3,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 4
                        }
                    }
                }
            },
            {
                "id": 4,
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
                "id": 5,
                "type": {
                    "def": {
                        "sequence": {
                            "type": 0
                        }
                    }
                }
            },
            {
                "id": 6,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 7,
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
                "id": 7,
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
                "id": 8,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 9
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 10
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
                            "type": 9
                        },
                        {
                            "name": "E",
                            "type": 10
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 9,
                "type": {
                    "def": {
                        "tuple": []
                    }
                }
            },
            {
                "id": 10,
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
                "id": 11,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 12
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 10
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
                            "type": 12
                        },
                        {
                            "name": "E",
                            "type": 10
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 12,
                "type": {
                    "def": {
                        "tuple": [
                            13,
                            0
                        ]
                    }
                }
            },
            {
                "id": 13,
                "type": {
                    "def": {
                        "primitive": "bool"
                    }
                }
            },
            {
                "id": 14,
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
                                            "type": 10
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
                            "type": 10
                        }
                    ],
                    "path": [
                        "Result"
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
                                            "type": 10
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
                            "type": 10
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
                            6,
                            0
                        ]
                    }
                }
            },
            {
                "id": 17,
                "type": {
                    "def": {
                        "primitive": "u128"
                    }
                }
            },
            {
                "id": 18,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 7,
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
                "id": 19,
                "type": {
                    "def": {
                        "primitive": "u32"
                    }
                }
            },
            {
                "id": 20,
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