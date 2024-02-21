export function metadata() {
    return {
        "source": {
            "hash": "0xfce8db2a72091053a5f14d0ddf5fe96a196168d644a1135d4e78da862b54b71c",
            "language": "ink! 4.3.0",
            "compiler": "rustc 1.75.0-nightly",
            "build_info": {
                "build_mode": "Debug",
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
                        "type": 4
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
                    "type": 10
                },
                "balance": {
                    "displayName": [
                        "Balance"
                    ],
                    "type": 13
                },
                "blockNumber": {
                    "displayName": [
                        "BlockNumber"
                    ],
                    "type": 15
                },
                "chainExtension": {
                    "displayName": [
                        "ChainExtension"
                    ],
                    "type": 16
                },
                "hash": {
                    "displayName": [
                        "Hash"
                    ],
                    "type": 14
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
                                "type": 10
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
                                "type": 10
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
                }
            ],
            "lang_error": {
                "displayName": [
                    "ink",
                    "LangError"
                ],
                "type": 6
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
                        "type": 4
                    },
                    "selector": "0x22557465"
                },
                {
                    "args": [],
                    "default": false,
                    "docs": [
                        " Check if an account exists",
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
                        "type": 7
                    },
                    "selector": "0x5ec33906"
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
                        " Register a property type",
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
                        "type": 4
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
                                "type": 10
                            }
                        }
                    ],
                    "default": false,
                    "docs": [
                        " Return the IPFS addresses of the property type documents created by a certain authority",
                        " They are returned as concatenated bytes separated by the '#' character"
                    ],
                    "label": "ptype_documents",
                    "mutates": false,
                    "payable": true,
                    "returnType": {
                        "displayName": [
                            "ink",
                            "MessageResult"
                        ],
                        "type": 12
                    },
                    "selector": "0xda2d9f3c"
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
                                                "key": "0x76dfbe41",
                                                "ty": 0
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
                                                "key": "0xae501552",
                                                "ty": 0
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
                            "type": 0
                        }
                    }
                }
            },
            {
                "id": 4,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 5
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 6
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
                            "type": 5
                        },
                        {
                            "name": "E",
                            "type": 6
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 5,
                "type": {
                    "def": {
                        "tuple": []
                    }
                }
            },
            {
                "id": 6,
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
                "id": 7,
                "type": {
                    "def": {
                        "variant": {
                            "variants": [
                                {
                                    "fields": [
                                        {
                                            "type": 8
                                        }
                                    ],
                                    "index": 0,
                                    "name": "Ok"
                                },
                                {
                                    "fields": [
                                        {
                                            "type": 6
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
                            "type": 8
                        },
                        {
                            "name": "E",
                            "type": 6
                        }
                    ],
                    "path": [
                        "Result"
                    ]
                }
            },
            {
                "id": 8,
                "type": {
                    "def": {
                        "tuple": [
                            9,
                            0
                        ]
                    }
                }
            },
            {
                "id": 9,
                "type": {
                    "def": {
                        "primitive": "bool"
                    }
                }
            },
            {
                "id": 10,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 11,
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
                "id": 11,
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
                "id": 12,
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
                                            "type": 6
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
                            "type": 6
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
                        "primitive": "u128"
                    }
                }
            },
            {
                "id": 14,
                "type": {
                    "def": {
                        "composite": {
                            "fields": [
                                {
                                    "type": 11,
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
                "id": 15,
                "type": {
                    "def": {
                        "primitive": "u32"
                    }
                }
            },
            {
                "id": 16,
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