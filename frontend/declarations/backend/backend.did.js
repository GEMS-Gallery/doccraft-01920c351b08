export const idlFactory = ({ IDL }) => {
  const Document = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'lastModified' : IDL.Int,
  });
  return IDL.Service({
    'createDocument' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'deleteDocument' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getDocument' : IDL.Func([IDL.Nat], [IDL.Opt(Document)], ['query']),
    'listDocuments' : IDL.Func([], [IDL.Vec(Document)], ['query']),
    'updateDocument' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
