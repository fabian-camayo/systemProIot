export interface IBlockChain {
  id?: number;
  block?: string | null;
}

export class BlockChain implements IBlockChain {
  constructor(public id?: number, public block?: string | null) {}
}

export function getBlockChainIdentifier(blockChain: IBlockChain): number | undefined {
  return blockChain.id;
}
