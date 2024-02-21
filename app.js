// Copyright (c) 2024 Algorealm, Inc.

// imports
import { createRequire } from "module";
import path, { parse } from 'path';
import { fileURLToPath } from 'url';

// imports
const require = createRequire(import.meta.url);
const bodyParser = require('body-parser');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const express = require('express');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

// set views
app.set('views', './views');
app.set('view engine', 'ejs');

// blockchain essentials
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { mnemonicGenerate, cryptoWaitReady, blake2AsHex, xxhashAsHex } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';

// contract API import
const chain = await import('./contract.cjs');

// contract metadata import
import * as meta from "./metadata.js";

// storage API import
import * as storg from "./storage.js";

// blockchain config
const contract_addr = "5HSCkfAsHSR8pfnoZB4F1EUuhXR8rK36MzpKP76fty9QqDgY";
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider });
const contract = new ContractPromise(api, meta.metadata(), contract_addr);
const keyring = new Keyring({ type: 'sr25519' });
let alice = undefined;
let bob = undefined;

// wait 5 secs for the wasm init
setTimeout(async () => {
    await cryptoWaitReady().then(() => {
        alice = keyring.addFromUri('//Alice');    // for running tests
        bob = keyring.addFromUri('//Bob');    // for running tests
    });
}, 5000);

// a very simple session cache
class SessionCache {
    cache = {}

    get = (key) => {
        return this.cache[key];
    }

    set = (key, value) => {
        this.cache[key] = value;
        return value;
    }

    del = (key) => {
        const val = cache[key];
        delete this.cache[key];
        return val;
    }

    has = (key) => {
        return key in this.cache;
    }
}

let delphiCache = new SessionCache();

// route request handlers
app.get('/', (req, res) => {
    res.render('index', { text: 'This is sparta' });
});

app.post('/sign-in', (req, res) => {
    authAccount(req.body, res);
});

app.post('/gen-keys', (req, res) => {
    createAccount(req.body, res);
});

app.post('/register-ptype', (req, res) => {
    createPropertyType(req.body, res);
});

app.post('/fetch-ptypes', (req, res) => {
    fetchPropertyTypes(req.body, res);
});

app.post('/connect-chains', (req, res) => {
    (async function () {
        await isChainLive().then(() => res.send({ status: "connected", error: false }));
    })();
});

// try to connect to the contract node
async function isChainLive(req) {
    return await api.query.timestamp.now();
}

app.get('/heartbeat', (req, res) => {
    checkConnection(res);
});

// check if chain is still connected
async function checkConnection(res) {
    const now = await api.query.timestamp.now();
    res.send({ now });
}

// create a new account on chain
async function createAccount(req, res) {
    try {
        // first generate the mnemonics and account
        const mnemonic = mnemonicGenerate();
        const user = keyring.createFromUri(mnemonic, 'sr25519');

        // generate auth nonce to keep session data
        let session_nonce = blake2AsHex(mnemonicGenerate());
        delphiCache.set(session_nonce, {
            keyPair: user,
            name: req.name,
            ss58_addr: user.address
        });

        // so normally this is the `user` account that should call the contract
        // but the account is not funded, so we'll be using alice || bob

        // call contract to register account
        await chain.createAccount(api, contract, /* user */alice, req.name, getUnixTimestamp()).then(() => {
            // return the keys to the user for next auth
            return res.send({
                data: {
                    seed: mnemonic,
                    nonce: session_nonce,
                    ss58_addr: user.address
                },
                error: false
            })
        });
    } catch (e) {
        return res.send({
            data: {
                seed: "",
                nonce: ""
            },
            error: true
        })
    }
}

// sign the user in and customize session
async function authAccount(req, res) {
    try {
        // first check if its a nonce that was sent, maybe the user reloaded the tab and the nonce has not been cleared
        if (req.keys.indexOf(" ") == -1 && delphiCache.has(req.keys)) {
            let data = delphiCache.get(req.keys);
            return res.send({
                data: {
                    nonce: req.keys,
                    name: data.name,
                    ss58_addr: data.ss58_addr
                },
                error: false
            });
        }

        // first generate account from seed
        const user = keyring.createFromUri(req.keys, 'sr25519');

        // get did document from IPFS
        await chain.authAccount(api, contract, /* user */alice).then(data => {
            const hexString = data.Ok.data.slice(2);
            const buffer = Buffer.from(hexString.slice(2), 'hex');
            const name = filterNonStringChars(buffer.toString())

            if (name.length) {
                let session_nonce = blake2AsHex(mnemonicGenerate());
                delphiCache.set(session_nonce, {
                    keyPair: user,
                    name,
                    ss58_addr: user.address
                });

                return res.send({
                    data: {
                        nonce: session_nonce,
                        name,
                        ss58_addr: user.address
                    },
                    error: false
                })
            } else {
                return res.send({
                    data: {
                        msg: "account does not exists."
                    },
                    error: true
                })
            }
        });
    } catch (e) {
        return res.send({
            data: {
                msg: "could not sign you in."
            },
            error: true
        })
    }
}

// create type of property
async function createPropertyType(req, res) {
    try {
        let sessionData = authUser(req.nonce);
        if (sessionData) {
            // create a JSON document containing the required property data;
            let document = createPropertyDocument(sessionData, req.attributes, req.title);

            // It's important that we store it on IPFS because the document has to be immutable
            // and then store the CID onchain in an authenticated (only-key-changing) manner

            // we'll store it on IPFS and keep its cid
            await storg.uploadToIPFS(JSON.stringify(document)).then(async ptypeCid => {
                // Get a unique property document ID
                // Property name + random number
                let docId = `${req.title}-${generateRandomNumber()}`;

                // call contract to register property type onchain
                await chain.registerPtype(api, contract, /* sessionData.user */alice, docId, ptypeCid).then(() => {
                    // return success
                    return res.send({
                        data: {},
                        error: false
                    })
                });
            });
        } else throw new Error("User not recognized!");
    } catch (e) {
        return res.send({
            data: {
                msg: e.message
            },
            error: true
        })
    }
}

// fetch property document types registered by an authority
async function fetchPropertyTypes(req, res) {
    try {
        let sessionData = authUser(req.nonce);
        if (sessionData) {
            // get authority address
            let authAddr = req.address;

            // now fetch CIDs of all the property document types registered
            await chain.ptypeDocuments(api, contract, /* sessionData.user */alice, authAddr).then(data => {
                console.log(parseContractBytes(data));
            });

            // query IPFS to get the DID document
            // await storg.getFromIPFS(registrar_cid).then(async data => {
            //     let didDoc = JSON.parse(data);

            //     // get the credential from IPFS also
            //     await storg.getFromIPFS(credential_cid).then(async cdata => {
            //         let cred = JSON.parse(cdata);

            //         // create a verifiable presentation from the credential
            //         let presentation = await kilt.getPresentation(cred, didDoc.mnemonic);

            //         // check validity
            //         let isValid1 = kilt.verifyPresentation(presentation);     // KILTs API throws errors here

            //         // improvise to check validity
            //         let isValid2 = verifiers.includes(registrar);

            //         // return validity
            //         return res.send({
            //             data: {
            //                 isValid: isValid1 && isValid2,
            //                 registrar,
            //                 claimers,
            //                 claimer: claimers[claimers.length - 1],
            //                 timestamp
            //             },
            //             error: false
            //         });
            //     });
            // });
        }
    } catch (e) {
        return res.send({
            data: {
                claimer: null
            },
            error: true
        });
    }
}

// helper functions
function getUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function filterNonStringChars(str) {
    return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

function authUser(nonce) {
    if (delphiCache.has(nonce)) {
        return delphiCache.get(nonce);
    }

    return false;
}

function createPropertyDocument(ss58_address, attributes, title) {
    // split string
    attributes = attributes.split("~");

    return {
        title,
        attributes,
        "registrar": ss58_address,
        "timestamp": getUnixTimestamp()
    }
}

function generateRandomNumber() {
    let min = 111111;
    let max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseContractBytes(data) {
    const hexString = data.Ok.data;
    let string =  api.createType("String", hexToU8a(hexString)).toString();
    console.log(hexString);
    console.log(hexToU8a(hexString));
    return string;
}

// listen on port 3000
app.listen(port, () => console.info(`listening on port ${port}`));

