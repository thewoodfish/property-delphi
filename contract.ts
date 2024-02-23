import { BN, BN_ONE, BN_TWO } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);
const storageDepositLimit: BN = new BN(1000);

export async function createAccount(api: any, contract: any, account: any, name: string, timestamp: any) {
  // Get the initial gas WeightV2 using api.consts.system.blockWeights['maxBlock']
  const gasLimit = api.registry.createType(
    'WeightV2',
    api.consts.system.blockWeights['maxBlock']
  )

  // Query the contract message
  // This will return the gas required and storageDeposit to execute the message
  // and the result of the message
  const { gasRequired, storageDeposit, result } = await contract.query.registerAccount(
    account.address,
    {
      gasLimit: gasLimit,
      storageDepositLimit: null,
      value: new BN('1000000000000000000')
    }, name, timestamp
  )

  // Check for errors
  if (result.isErr) {
    let error = ''
    if (result.asErr.isModule) {
      const dispatchError = api.registry.findMetaError(result.asErr.asModule)
      error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
    } else {
      error = result.asErr.toString()
    }

    console.error(error)
    return
  }

  // Even if the result is Ok, it could be a revert in the contract execution
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman()
    // Check if the result is a revert via flags
    if (flags.includes('Revert')) {
      const type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
      const typeName = type?.lookupName || type?.type || ''
      const error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()

      console.error(error ? (error as any).Err : 'Revert')
      return
    }
  }

  // Gas require is more than gas returned in the query
  // To be safe, we double the gasLimit.
  // Note, doubling gasLimit will not cause spending more gas for the Tx
  const estimatedGas = api.registry.createType(
    'WeightV2',
    {
      refTime: gasRequired.refTime.toBn().mul(BN_TWO),
      proofSize: gasRequired.proofSize.toBn().mul(BN_TWO),
    }
  ) as WeightV2

  const unsub = await contract.tx
    .registerAccount({
      gasLimit: estimatedGas,
      storageDepositLimit: null,
      value: new BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
    }, name, timestamp)
    .signAndSend(account, (res: any) => {
      // Send the transaction, like elsewhere this is a normal extrinsic
      // with the same rules as applied in the API (As with the read example,
      // additional params, if required can follow)
      if (res.status.isInBlock) {
        console.log('in a block')
      }
      if (res.status.isFinalized) {
        console.log('Successfully sent the txn')
        unsub()
      }
    })
}

export async function authAccount(api: any, contract: any, account: any): Promise<any> {
  const { result, output } = await contract.query.accountExists(
    account.address,
    {
      gasLimit: api?.registry.createType('WeightV2', {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      }) as WeightV2,
      storageDepositLimit,
    });

  return result.toHuman();
}

export async function registerPtype(api: any, contract: any, account: any, docID: string, ptypeCid) {
  // Get the initial gas WeightV2 using api.consts.system.blockWeights['maxBlock']
  const gasLimit = api.registry.createType(
    'WeightV2',
    api.consts.system.blockWeights['maxBlock']
  )

  // Query the contract message
  // This will return the gas required and storageDeposit to execute the message
  // and the result of the message
  const { gasRequired, storageDeposit, result } = await contract.query.registerPtype(
    account.address,
    {
      gasLimit: gasLimit,
      storageDepositLimit: null,
      value: new BN('1000000000000000000')
    }, docID, ptypeCid
  )

  // Check for errors
  if (result.isErr) {
    let error = ''
    if (result.asErr.isModule) {
      const dispatchError = api.registry.findMetaError(result.asErr.asModule)
      error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
    } else {
      error = result.asErr.toString()
    }

    console.error(error)
    return
  }

  // Even if the result is Ok, it could be a revert in the contract execution
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman()
    // Check if the result is a revert via flags
    if (flags.includes('Revert')) {
      const type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
      const typeName = type?.lookupName || type?.type || ''
      const error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()

      console.error(error ? (error as any).Err : 'Revert')
      return
    }
  }

  // Gas require is more than gas returned in the query
  // To be safe, we double the gasLimit.
  // Note, doubling gasLimit will not cause spending more gas for the Tx
  const estimatedGas = api.registry.createType(
    'WeightV2',
    {
      refTime: gasRequired.refTime.toBn().mul(BN_TWO),
      proofSize: gasRequired.proofSize.toBn().mul(BN_TWO),
    }
  ) as WeightV2

  const unsub = await contract.tx
    .registerPtype({
      gasLimit: estimatedGas,
      storageDepositLimit: null,
      value: new BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
    }, docID, ptypeCid)
    .signAndSend(account, (res: any) => {
      // Send the transaction, like elsewhere this is a normal extrinsic
      // with the same rules as applied in the API (As with the read example,
      // additional params, if required can follow)
      if (res.status.isInBlock) {
        console.log('in a block')
      }
      if (res.status.isFinalized) {
        console.log('Successfully sent the txn')
        unsub()
      }
    })
}

export async function ptypeDocuments(api: any, contract: any, account: any, authAddr: any): Promise<any> {
  const { result, output } = await contract.query.ptypeDocuments(
    account.address,
    {
      gasLimit: api?.registry.createType('WeightV2', {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      }) as WeightV2,
      storageDepositLimit,
    }, authAddr);

  return result.toHuman();
}


export async function registerClaim(api: any, contract: any, account: any, propertyTitle: any, propClaimId: any, claimCid: any) {
  // Get the initial gas WeightV2 using api.consts.system.blockWeights['maxBlock']
  const gasLimit = api.registry.createType(
    'WeightV2',
    api.consts.system.blockWeights['maxBlock']
  )

  // Query the contract message
  // This will return the gas required and storageDeposit to execute the message
  // and the result of the message
  const { gasRequired, storageDeposit, result } = await contract.query.registerClaim(
    account.address,
    {
      gasLimit: gasLimit,
      storageDepositLimit: null,
      value: new BN('1000000000000000000')
    }, propertyTitle, propClaimId, claimCid
  )

  // Check for errors
  if (result.isErr) {
    let error = ''
    if (result.asErr.isModule) {
      const dispatchError = api.registry.findMetaError(result.asErr.asModule)
      error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
    } else {
      error = result.asErr.toString()
    }

    console.error(error)
    return
  }

  // Even if the result is Ok, it could be a revert in the contract execution
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman()
    // Check if the result is a revert via flags
    if (flags.includes('Revert')) {
      const type = contract.abi.messages[5].returnType // here 5 is the index of the message in the ABI
      const typeName = type?.lookupName || type?.type || ''
      const error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()

      console.error(error ? (error as any).Err : 'Revert')
      return
    }
  }

  // Gas require is more than gas returned in the query
  // To be safe, we double the gasLimit.
  // Note, doubling gasLimit will not cause spending more gas for the Tx
  const estimatedGas = api.registry.createType(
    'WeightV2',
    {
      refTime: gasRequired.refTime.toBn().mul(BN_TWO),
      proofSize: gasRequired.proofSize.toBn().mul(BN_TWO),
    }
  ) as WeightV2

  const unsub = await contract.tx
    .registerClaim({
      gasLimit: estimatedGas,
      storageDepositLimit: null,
      value: new BN('10000000') // 1 TOKEN or it could be value you want to send to the contract in title
    }, propertyTitle, propClaimId, claimCid)
    .signAndSend(account, (res: any) => {
      // Send the transaction, like elsewhere this is a normal extrinsic
      // with the same rules as applied in the API (As with the read example,
      // additional params, if required can follow)
      if (res.status.isInBlock) {
        console.log('in a block')
      }
      if (res.status.isFinalized) {
        console.log('Successfully sent the txn')
        unsub()
      }
    })
}