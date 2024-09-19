import { backend } from 'declarations/backend';

let currentDocumentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const documentsList = document.getElementById('documents');
    const newDocumentButton = document.getElementById('new-document');
    const saveDocumentButton = document.getElementById('save-document');
    const titleInput = document.getElementById('document-title');
    const contentDiv = document.getElementById('content');
    const toolbarButtons = document.querySelectorAll('#toolbar button');
    const notification = document.getElementById('notification');

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = type;
        setTimeout(() => {
            notification.className = 'hidden';
        }, 3000);
    }

    async function loadDocuments() {
        try {
            const documents = await backend.listDocuments();
            documentsList.innerHTML = '';
            documents.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = doc.title;
                li.onclick = () => loadDocument(doc.id);
                documentsList.appendChild(li);
            });
        } catch (error) {
            showNotification('Failed to load documents', 'error');
        }
    }

    async function loadDocument(id) {
        try {
            const doc = await backend.getDocument(id);
            if (doc) {
                currentDocumentId = id;
                titleInput.value = doc.title;
                contentDiv.innerHTML = doc.content;
            }
        } catch (error) {
            showNotification('Failed to load document', 'error');
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

        try {
            if (currentDocumentId === null) {
                currentDocumentId = await backend.createDocument(title, content);
                showNotification('Document created successfully', 'success');
            } else {
                await backend.updateDocument(currentDocumentId, title, content);
                showNotification('Document updated successfully', 'success');
            }
            await loadDocuments();
        } catch (error) {
            showNotification('Failed to save document', 'error');
        }
    };

    toolbarButtons.forEach(button => {
        button.onclick = () => {
            const command = button.dataset.command;
            switch (command) {
                case 'bold':
                    document.execCommand('bold', false, null);
                    break;
                case 'italic':
                    document.execCommand('italic', false, null);
                    break;
                case 'underline':
                    document.execCommand('underline', false, null);
                    break;
            }
            button.classList.toggle('active');
        };
    });

    contentDiv.addEventListener('keydown', (e) => {
        if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.execCommand('bold', false, null);
        } else if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.execCommand('italic', false, null);
        } else if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            document.execCommand('underline', false, null);
        }
    });

    await loadDocuments();
});
