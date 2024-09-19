import { backend } from 'declarations/backend';

let currentDocumentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const documentsList = document.getElementById('documents');
    const newDocumentButton = document.getElementById('new-document');
    const saveDocumentButton = document.getElementById('save-document');
    const titleInput = document.getElementById('document-title');
    const contentDiv = document.getElementById('content');
    const toolbarButtons = document.querySelectorAll('#toolbar button');

    async function loadDocuments() {
        const documents = await backend.listDocuments();
        documentsList.innerHTML = '';
        documents.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = doc.title;
            li.onclick = () => loadDocument(doc.id);
            documentsList.appendChild(li);
        });
    }

    async function loadDocument(id) {
        const doc = await backend.getDocument(id);
        if (doc) {
            currentDocumentId = id;
            titleInput.value = doc.title;
            contentDiv.innerHTML = doc.content;
        }
    }

    newDocumentButton.onclick = () => {
        currentDocumentId = null;
        titleInput.value = '';
        contentDiv.innerHTML = '';
    };

    saveDocumentButton.onclick = async () => {
        const title = titleInput.value;
        const content = contentDiv.innerHTML;

        if (currentDocumentId === null) {
            currentDocumentId = await backend.createDocument(title, content);
        } else {
            await backend.updateDocument(currentDocumentId, title, content);
        }

        await loadDocuments();
    };

    toolbarButtons.forEach(button => {
        button.onclick = () => {
            document.execCommand(button.dataset.command, false, null);
        };
    });

    await loadDocuments();
});
