import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import List "mo:base/List";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor WordDocument {
    // Document type
    public type Document = {
        id: Nat;
        title: Text;
        content: Text;
        lastModified: Int;
    };

    private stable var nextId: Nat = 0;
    private stable var documentsEntries: [(Nat, Document)] = [];
    private var documents = HashMap.HashMap<Nat, Document>(0, Nat.equal, Nat.hash);

    system func preupgrade() {
        documentsEntries := Iter.toArray(documents.entries());
    };

    system func postupgrade() {
        documents := HashMap.fromIter<Nat, Document>(documentsEntries.vals(), 1, Nat.equal, Nat.hash);
    };

    // Create a new document
    public func createDocument(title: Text, content: Text) : async Nat {
        let id = nextId;
        nextId += 1;
        let document: Document = {
            id = id;
            title = title;
            content = content;
            lastModified = Time.now();
        };
        documents.put(id, document);
        id
    };

    // Get a document by id
    public query func getDocument(id: Nat) : async ?Document {
        documents.get(id)
    };

    // Update a document
    public func updateDocument(id: Nat, title: Text, content: Text) : async Bool {
        switch (documents.get(id)) {
            case (null) { false };
            case (?existingDoc) {
                let updatedDoc: Document = {
                    id = id;
                    title = title;
                    content = content;
                    lastModified = Time.now();
                };
                documents.put(id, updatedDoc);
                true
            };
        }
    };

    // Delete a document
    public func deleteDocument(id: Nat) : async Bool {
        switch (documents.remove(id)) {
            case (null) { false };
            case (?_) { true };
        }
    };

    // List all documents
    public query func listDocuments() : async [Document] {
        Iter.toArray(documents.vals())
    };
}
