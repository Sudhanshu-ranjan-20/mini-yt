import { AtleastOne } from "../utilities";

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

export type TGetChannelParams = AtleastOne<IGetChannel>;
