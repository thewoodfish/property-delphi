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
const contract_addr = "5CqXCe1J2hFjFCPe6JaJbjFkT1263DEqoqAFcTufbFUtjkXa";
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider });
const contract = new ContractPromise(api, meta.metadata(), contract_addr);
const keyring = new Keyring({ type: 'sr25519' });

// test accounts
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

app.post('/sign-claim', (req, res) => {
    signPropertyClaim(req.body, res);
});

app.post('/fetch-ptypes', (req, res) => {
    fetchPropertyTypes(req.body, res);
});

app.post('/submit-document', (req, res) => {
    submitDocumentDetails(req.body, res);
});

app.post('/fetch-properties', (req, res) => {
    fetchPropertyDocs(req.body, res);
});

app.post('/fetch-property', (req, res) => {
    fetchPropertyClaim(req.body, res);
});

app.post('/transfer-property', (req, res) => {
    transferProperty(req.body, res);
});

app.post('/enquire', (req, res) => {
    makePropertyEnquiry(req.body, res);
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
        await chain.createAccount(api, contract, /* user */alice, req.name, getUnixTimestampAsString()).then(() => {
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
            const name = filterNonStringChars(decodeContractData(data));

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
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // create a JSON document containing the required property data;
            let document = createPropertyDocument(/* sessionUser.ss58_addr */ alice.address, req.attributes, req.title);

            // It's important that we store it on IPFS because the document has to be immutable
            // and then store the CID onchain in an authenticated (only-key-changing) manner

            // we'll store it on IPFS and keep its cid
            await storg.uploadToIPFS(JSON.stringify(document)).then(async ptypeCid => {
                // Get a unique property document ID
                // Property name + random number
                let docId = `${req.title.replaceAll("-", " ")}-${generateRandomNumber()}`;

                // call contract to register property type onchain
                await chain.registerPtype(api, contract, /* sessionUser.user */alice, docId, ptypeCid).then(() => {
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
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // get authority address
            let authAddr = req.address;

            // now fetch CIDs of all the property document types registered
            await chain.ptypeDocuments(api, contract, /* sessionUser.user */alice, authAddr).then(async data => {
                const titles = [];
                const entries = decodeContractData(data).split("###");

                for (var j = 0; j < entries.length; j++) {
                    let e = entries[j];
                    if (e) {
                        const sanitizedEntry = filterNonStringChars(e);
                        const [_, ipfsAddr] = sanitizedEntry.split("~");
                        const titleObj = { slug: sanitizedEntry };

                        if (ipfsAddr) {
                            try {
                                const property_doc = JSON.parse(await storg.getFromIPFS(ipfsAddr));
                                titleObj.name = property_doc.title;
                                titleObj.attributes = property_doc.attributes;
                            } catch (error) {
                                // Handle error from IPFS query
                                console.error("Error fetching property document from IPFS:", error);
                            }

                            titles.push(titleObj);
                        }
                    }
                }

                res.send({ data: titles, error: false });
            });
        } else throw new Error("User not recognized!");
    } catch (e) {
        return res.send({
            data: {
                msg: e ? e.toString() : "An error occurred. Please try again."
            },
            error: true
        });
    }
}

// submit filled document and create an unattested claim
async function submitDocumentDetails(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            const propertyTitle = req.title.split("~")[0];

            // construct JSON document
            const filled_doc = createPropertyDocument(/* sessionUser.ss58_addr */ alice.address, req.values, propertyTitle.split("-")[0], req.labels);

            // upload filled document to IPFS and retrieve CID
            await storg.uploadToIPFS(JSON.stringify(filled_doc)).then(async claimCid => {
                // generate a unique property claim ID
                // CID + random number
                const propClaimId = `${claimCid}-${generateRandomNumber()}`;

                // call contract to register property claim onchain, to await verification and attestation
                await chain.registerClaim(api, contract, /* sessionUser.user */alice, propertyTitle, propClaimId, claimCid).then(() => {
                    // return success
                    return res.send({
                        data: {
                            propClaimId
                        },
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

// fetch property documents 
async function fetchPropertyDocs(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // first thing is to get the property type ID of documents we want to get
            const [propertyTypeId, _] = req.value.split("~");
            let propertyFiles = [];

            // fetch all the IDs of properties that are registered under this property type
            await chain.propertyClaims(api, contract, /* sessionUser.user */alice, propertyTypeId).then(async data => {
                // remove all unicode replacement characters
                const parsedData = decodeContractData(data).replaceAll("�", "");
                let propertyIds = parsedData.split("#");
                // remove the last empty string
                propertyIds.pop();
                console.log(propertyIds);

                for (var i = 0; i < propertyIds.length; i++) {
                    let propId = getStringStartingFrom('Q', propertyIds[i]);
                    // query the chain to get the information about a property
                    // mostly the IPFS address of the claim
                    await chain.propertyDetail(api, contract, /* sessionUser.user */alice, propId).then(async data => {
                        const [claimersAddress, ipfsCid, _] = decodeContractData(data).replaceAll("�", "").split('$');

                        // now retrieve the property claim details from IPFS
                        if (ipfsCid) {
                            try {
                                const propertyDoc = JSON.parse(await storg.getFromIPFS(ipfsCid));
                                propertyFiles.push({
                                    id: propId,
                                    claimer: propertyDoc.registrar,
                                    cid: ipfsCid,
                                    labels: propertyDoc.labels,
                                    title: propertyDoc.title.substring(1),
                                    timestamp: propertyDoc.timestamp,
                                    attributes: propertyDoc.attributes
                                });
                            } catch (error) {
                                // Handle error from IPFS query
                                console.error("Error fetching property document from IPFS:", error);
                            }
                        } else throw new Error("Could not fetch document from IPFS");
                    });
                };
            });

            return res.send({
                data: sortBy("timestamp", propertyFiles),
                error: false
            })

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

// fetch details of a property
async function fetchPropertyClaim(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // query the chain to get the information about a property
            // mostly the IPFS address of the claim
            await chain.propertyDetail(api, contract, /* sessionUser.user */alice, req.propertyId).then(async data => {
                console.log(decodeContractData(data));
                const [claimerAddress, ipfsCid, propertyTypeId] = decodeContractData(data).replaceAll("�", "").split('$');

                // now retrieve the property claim details from IPFS
                if (ipfsCid) {
                    console.log(ipfsCid);
                    try {
                        const propertyDoc = JSON.parse(await storg.getFromIPFS(ipfsCid));
                        return res.send({
                            data: {
                                claimer: claimerAddress,
                                title: propertyDoc.title,
                                attr: matchProperties(propertyDoc.labels, propertyDoc.attributes),
                                propertyTypeId
                            },
                            error: false
                        });
                    } catch (error) {
                        // Handle error from IPFS query
                        console.error("Error fetching property document from IPFS:", error);
                    }
                } else throw new Error("Could not fetch document from IPFS");
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

// transfer property to a new owner 
async function transferProperty(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // first make sure the recipient is not the session user
            if (alice.address /* sessionUser.ss58_addr */ == req.recipient) throw new Error("you cannot transfer to yourself!");

            // query the chain to get the information about the property
            // mostly the IPFS address of the claim
            await chain.propertyDetail(api, contract, /* sessionUser.user */alice, req.propertyId).then(async data => {
                const [__, ipfsCid, _] = decodeContractData(data).replaceAll("�", "").split('$');

                // now retrieve the property claim details from IPFS
                if (ipfsCid) {
                    try {
                        // we have the property document now
                        let propertyDoc = JSON.parse(await storg.getFromIPFS(ipfsCid));

                        // is it a full transfer or not?
                        if (req.transferAll) {
                            // change the address of the `registrar`
                            propertyDoc.registrar = req.recipient;
                            propertyDoc.attributes = req.values.split("~");

                            // upload updated document to IPFS and retrieve CID
                            await storg.uploadToIPFS(JSON.stringify(propertyDoc)).then(async claimCid => {
                                // generate a unique property claim ID
                                // CID + random number
                                const propClaimId = `${claimCid}-${generateRandomNumber()}`;

                                // call contract to enforce and witness the transfer of the property
                                await chain.transferProperty(api, contract, /* sessionUser.user */alice,
                                    req.propertyId, req.recipient, claimCid, propClaimId, "", "", getUnixTimestampAsString()
                                ).then(() => {
                                    // return success
                                    return res.send({
                                        data: {},
                                        error: false
                                    })
                                });
                            });
                        } else {
                            // we'll have to deal with two separate documents (sender & recipient)
                            let sendersDoc = propertyDoc;

                            // the changes for the recipients properties are more profound
                            let recipientsDoc = { ...propertyDoc, registrar: req.recipient, attributes: req.values.split("~"), timestamp: getUnixTimestamp() };

                            // the changes to be made to the senders properties are only that of (property i.e land) size
                            let landMass = sendersDoc.attributes[1].split(" ");  // -> [5, "hectares"]
                            sendersDoc.attributes[1] = `${parseInt(landMass[0]) - parseInt(req.propertySize)} ${landMass[1]}`;
                            sendersDoc.timestamp = getUnixTimestamp();
                            sendersDoc.registrar = /* sessionUser.ss58_addr */ alice.address;;

                            // upload each to ipfs one after the other and get their CIDs
                            await storg.uploadToIPFS(JSON.stringify(sendersDoc)).then(async sClaimCid => {
                                await storg.uploadToIPFS(JSON.stringify(recipientsDoc)).then(async rClaimCid => {
                                    // generate a unique property claim ID
                                    // CID + random number
                                    const sPropClaimId = `${sClaimCid}-${generateRandomNumber()}`;
                                    const rPropClaimId = `${rClaimCid}-${generateRandomNumber()}`;

                                    // call contract to enforce and witness the transfer of the property
                                    await chain.transferProperty(api, contract, /* sessionUser.user */alice,
                                        req.propertyId, req.recipient, sClaimCid, sPropClaimId, rClaimCid, rPropClaimId, getUnixTimestampAsString()
                                    ).then(() => {
                                        // return success
                                        return res.send({
                                            data: {},
                                            error: false
                                        })
                                    });
                                });
                            });
                        }
                    } catch (error) {
                        // Handle error from IPFS query
                        console.error("Error fetching property document from IPFS:", error);
                    }
                } else throw new Error("Could not fetch document from IPFS");
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

// sign property claim
async function signPropertyClaim(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // try to sign document
            await chain.signDocument(api, contract, /* sessionUser.user */alice, req.propertyId, req.propertyTypeId, getUnixTimestampAsString()).then(() => {
                return res.send({
                    data: {},
                    error: false
                })
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

// retreive important information to decide the validity of an individuals claim to a property
async function makePropertyEnquiry(req, res) {
    try {
        let sessionUser = authUser(req.nonce);
        if (sessionUser) {
            // get claimer
            await chain.propertyDetail(api, contract, /* sessionUser.user */alice, req.propertyId).then(async data => {
                const [claimersAddress, _ipfsCid, _] = decodeContractData(data).replaceAll("�", "").split('$');

                // make property enquiry
                await chain.attestationStatus(api, contract, /* sessionUser.user */alice, req.propertyId).then(data => {
                    const attestation_data = decodeContractData(data);
                    let [claimers_history, timestamp] = attestation_data.split('@');
                    return res.send({
                        data: {
                            claimer: claimersAddress,
                            claimers: claimers_history.length < 10 ? ["Not transferred"] : claimers_history.replaceAll("�", "").split('$'),
                            timestamp,
                            isValid: timestamp ? true : false
                        },
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

// helper functions
function getUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function getUnixTimestampAsString() {
    // Get the current date
    const currentDate = new Date();

    // Convert it to Unix timestamp in seconds
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000);

    // Convert the Unix timestamp to a well-formatted date string
    const dateString = new Date(unixTimestamp * 1000).toLocaleString();

    return dateString;
}


function filterNonStringChars(str) {
    return str.replace(/[^a-zA-Z0-9 \-~]/g, "");
}

function authUser(nonce) {
    if (delphiCache.has(nonce)) {
        return delphiCache.get(nonce);
    }

    return false;
}

function createPropertyDocument(ss58_address, attributes, title, labels) {
    // split string
    attributes = attributes.split("~");
    if (labels) {
        labels = labels.split("~");

        return {
            title,
            attributes,
            labels,
            "registrar": ss58_address,
            "timestamp": getUnixTimestamp(),
        }
    } else {
        return {
            title,
            attributes,
            "registrar": ss58_address,
            "timestamp": getUnixTimestamp(),
        }
    }
}

function generateRandomNumber() {
    let min = 111111;
    let max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decodeContractData(data) {
    const hexString = data.Ok.data.slice(2);
    const buffer = Buffer.from(hexString.slice(2), 'hex');
    return buffer.toString().trim();
}

function splitStringIntoEqualParts(inputString, numParts) {
    const partLength = Math.ceil(inputString.length / numParts);
    const parts = [];

    for (let i = 0; i < inputString.length; i += partLength) {
        const part = inputString.substring(i, i + partLength);
        parts.push(part);
    }

    return parts;
}

function splitAndTrimHexString(str) {
    // get the number of the strings we'll get from the larger hex string
    str = str.substring(8);
    let no = Math.floor(str.length / 64);
    // break the string into {{no}} parts
    let strings = splitStringIntoEqualParts(str, no);
    let trimmed_strings = [];

    for (const i of strings) {
        let new_str = "0x" + i;
        trimmed_strings.push(new_str.substring(0, new_str.length - 2));
    }

    return trimmed_strings;
}

function sortBy(key, arr) {
    return arr.sort((a, b) => {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        } else {
            return 0;
        }
    });
}

function matchProperties(attr, values) {
    let props = {};
    attr.map((x, i) => props[x] = values[i]);
    return props;
}

function getStringStartingFrom(char, inputString) {
    const indexQ = inputString.indexOf(char);
    if (indexQ !== -1) { // Check if 'Q' is found in the string
        return inputString.substring(indexQ);
    } else {
        console.log("String does not contain 'Q'" + inputString);
        return "";
    }
}


// listen on port 3000
app.listen(port, () => console.info(`listening on port ${port}`));

