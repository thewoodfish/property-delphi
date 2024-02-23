"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClaim = exports.ptypeDocuments = exports.registerPtype = exports.authAccount = exports.createAccount = void 0;
var util_1 = require("@polkadot/util");
var MAX_CALL_WEIGHT = new util_1.BN(5000000000000).isub(util_1.BN_ONE);
var PROOFSIZE = new util_1.BN(1000000);
var storageDepositLimit = new util_1.BN(1000);
function createAccount(api, contract, account, name, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var gasLimit, _a, gasRequired, storageDeposit, result, error, dispatchError, flags, type, typeName, error, estimatedGas, unsub;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    gasLimit = api.registry.createType('WeightV2', api.consts.system.blockWeights['maxBlock']);
                    return [4 /*yield*/, contract.query.registerAccount(account.address, {
                            gasLimit: gasLimit,
                            storageDepositLimit: null,
                            value: new util_1.BN('1000000000000000000')
                        }, name, timestamp)
                        // Check for errors
                    ];
                case 1:
                    _a = _b.sent(), gasRequired = _a.gasRequired, storageDeposit = _a.storageDeposit, result = _a.result;
                    // Check for errors
                    if (result.isErr) {
                        error = '';
                        if (result.asErr.isModule) {
                            dispatchError = api.registry.findMetaError(result.asErr.asModule);
                            error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name;
                        }
                        else {
                            error = result.asErr.toString();
                        }
                        console.error(error);
                        return [2 /*return*/];
                    }
                    // Even if the result is Ok, it could be a revert in the contract execution
                    if (result.isOk) {
                        flags = result.asOk.flags.toHuman();
                        // Check if the result is a revert via flags
                        if (flags.includes('Revert')) {
                            type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
                            ;
                            typeName = (type === null || type === void 0 ? void 0 : type.lookupName) || (type === null || type === void 0 ? void 0 : type.type) || '';
                            error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman();
                            console.error(error ? error.Err : 'Revert');
                            return [2 /*return*/];
                        }
                    }
                    estimatedGas = api.registry.createType('WeightV2', {
                        refTime: gasRequired.refTime.toBn().mul(util_1.BN_TWO),
                        proofSize: gasRequired.proofSize.toBn().mul(util_1.BN_TWO),
                    });
                    return [4 /*yield*/, contract.tx
                            .registerAccount({
                            gasLimit: estimatedGas,
                            storageDepositLimit: null,
                            value: new util_1.BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
                        }, name, timestamp)
                            .signAndSend(account, function (res) {
                            // Send the transaction, like elsewhere this is a normal extrinsic
                            // with the same rules as applied in the API (As with the read example,
                            // additional params, if required can follow)
                            if (res.status.isInBlock) {
                                console.log('in a block');
                            }
                            if (res.status.isFinalized) {
                                console.log('Successfully sent the txn');
                                unsub();
                            }
                        })];
                case 2:
                    unsub = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.createAccount = createAccount;
function authAccount(api, contract, account) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, result, output;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contract.query.accountExists(account.address, {
                        gasLimit: api === null || api === void 0 ? void 0 : api.registry.createType('WeightV2', {
                            refTime: MAX_CALL_WEIGHT,
                            proofSize: PROOFSIZE,
                        }),
                        storageDepositLimit: storageDepositLimit,
                    })];
                case 1:
                    _a = _b.sent(), result = _a.result, output = _a.output;
                    return [2 /*return*/, result.toHuman()];
            }
        });
    });
}
exports.authAccount = authAccount;
function registerPtype(api, contract, account, docID, ptypeCid) {
    return __awaiter(this, void 0, void 0, function () {
        var gasLimit, _a, gasRequired, storageDeposit, result, error, dispatchError, flags, type, typeName, error, estimatedGas, unsub;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    gasLimit = api.registry.createType('WeightV2', api.consts.system.blockWeights['maxBlock']);
                    return [4 /*yield*/, contract.query.registerPtype(account.address, {
                            gasLimit: gasLimit,
                            storageDepositLimit: null,
                            value: new util_1.BN('1000000000000000000')
                        }, docID, ptypeCid)
                        // Check for errors
                    ];
                case 1:
                    _a = _b.sent(), gasRequired = _a.gasRequired, storageDeposit = _a.storageDeposit, result = _a.result;
                    // Check for errors
                    if (result.isErr) {
                        error = '';
                        if (result.asErr.isModule) {
                            dispatchError = api.registry.findMetaError(result.asErr.asModule);
                            error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name;
                        }
                        else {
                            error = result.asErr.toString();
                        }
                        console.error(error);
                        return [2 /*return*/];
                    }
                    // Even if the result is Ok, it could be a revert in the contract execution
                    if (result.isOk) {
                        flags = result.asOk.flags.toHuman();
                        // Check if the result is a revert via flags
                        if (flags.includes('Revert')) {
                            type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
                            ;
                            typeName = (type === null || type === void 0 ? void 0 : type.lookupName) || (type === null || type === void 0 ? void 0 : type.type) || '';
                            error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman();
                            console.error(error ? error.Err : 'Revert');
                            return [2 /*return*/];
                        }
                    }
                    estimatedGas = api.registry.createType('WeightV2', {
                        refTime: gasRequired.refTime.toBn().mul(util_1.BN_TWO),
                        proofSize: gasRequired.proofSize.toBn().mul(util_1.BN_TWO),
                    });
                    return [4 /*yield*/, contract.tx
                            .registerPtype({
                            gasLimit: estimatedGas,
                            storageDepositLimit: null,
                            value: new util_1.BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
                        }, docID, ptypeCid)
                            .signAndSend(account, function (res) {
                            // Send the transaction, like elsewhere this is a normal extrinsic
                            // with the same rules as applied in the API (As with the read example,
                            // additional params, if required can follow)
                            if (res.status.isInBlock) {
                                console.log('in a block');
                            }
                            if (res.status.isFinalized) {
                                console.log('Successfully sent the txn');
                                unsub();
                            }
                        })];
                case 2:
                    unsub = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.registerPtype = registerPtype;
function ptypeDocuments(api, contract, account, authAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, result, output;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contract.query.ptypeDocuments(account.address, {
                        gasLimit: api === null || api === void 0 ? void 0 : api.registry.createType('WeightV2', {
                            refTime: MAX_CALL_WEIGHT,
                            proofSize: PROOFSIZE,
                        }),
                        storageDepositLimit: storageDepositLimit,
                    }, authAddr)];
                case 1:
                    _a = _b.sent(), result = _a.result, output = _a.output;
                    return [2 /*return*/, result.toHuman()];
            }
        });
    });
}
exports.ptypeDocuments = ptypeDocuments;
function registerClaim(api, contract, account, propertyTitle, propClaimId, claimCid) {
    return __awaiter(this, void 0, void 0, function () {
        var gasLimit, _a, gasRequired, storageDeposit, result, error, dispatchError, flags, type, typeName, error, estimatedGas, unsub;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    gasLimit = api.registry.createType('WeightV2', api.consts.system.blockWeights['maxBlock']);
                    return [4 /*yield*/, contract.query.registerClaim(account.address, {
                            gasLimit: gasLimit,
                            storageDepositLimit: null,
                            value: new util_1.BN('1000000000000000000')
                        }, propertyTitle, propClaimId, claimCid)
                        // Check for errors
                    ];
                case 1:
                    _a = _b.sent(), gasRequired = _a.gasRequired, storageDeposit = _a.storageDeposit, result = _a.result;
                    // Check for errors
                    if (result.isErr) {
                        error = '';
                        if (result.asErr.isModule) {
                            dispatchError = api.registry.findMetaError(result.asErr.asModule);
                            error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name;
                        }
                        else {
                            error = result.asErr.toString();
                        }
                        console.error(error);
                        return [2 /*return*/];
                    }
                    // Even if the result is Ok, it could be a revert in the contract execution
                    if (result.isOk) {
                        flags = result.asOk.flags.toHuman();
                        // Check if the result is a revert via flags
                        if (flags.includes('Revert')) {
                            type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
                            ;
                            typeName = (type === null || type === void 0 ? void 0 : type.lookupName) || (type === null || type === void 0 ? void 0 : type.type) || '';
                            error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman();
                            console.error(error ? error.Err : 'Revert');
                            return [2 /*return*/];
                        }
                    }
                    estimatedGas = api.registry.createType('WeightV2', {
                        refTime: gasRequired.refTime.toBn().mul(util_1.BN_TWO),
                        proofSize: gasRequired.proofSize.toBn().mul(util_1.BN_TWO),
                    });
                    return [4 /*yield*/, contract.tx
                            .registerClaim({
                            gasLimit: estimatedGas,
                            storageDepositLimit: null,
                            value: new util_1.BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
                        }, propertyTitle, propClaimId, claimCid)
                            .signAndSend(account, function (res) {
                            // Send the transaction, like elsewhere this is a normal extrinsic
                            // with the same rules as applied in the API (As with the read example,
                            // additional params, if required can follow)
                            if (res.status.isInBlock) {
                                console.log('in a block');
                            }
                            if (res.status.isFinalized) {
                                console.log('Successfully sent the txn');
                                unsub();
                            }
                        })];
                case 2:
                    unsub = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.registerClaim = registerClaim;
