export interface IChannelBody {
  handle: string;
  name: string;
}

export interface IChannel extends IChannelBody {
  owner: string;
}

export interface IGetChannel {
  id?: string;
  handle?: string;
  owner?: string;
  name?: string;
}
type AtleastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  { [K in Keys]: Required<Pick<T, K>> }[Keys];
export type TGetChannelParams = AtleastOne<IGetChannel>;
