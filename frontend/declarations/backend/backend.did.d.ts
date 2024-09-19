import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Document {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'lastModified' : bigint,
}
export interface _SERVICE {
  'createDocument' : ActorMethod<[string, string], bigint>,
  'deleteDocument' : ActorMethod<[bigint], boolean>,
  'getDocument' : ActorMethod<[bigint], [] | [Document]>,
  'listDocuments' : ActorMethod<[], Array<Document>>,
  'updateDocument' : ActorMethod<[bigint, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
