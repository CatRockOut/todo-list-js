function initToDoList() {
    const submitNote = document.querySelector('.submit-creation');

    if (!submitNote) {
        return;
    }

    const submitButtonText = document.querySelector('.submit-creation__save');
    const inputNote = document.querySelector('.input-creation');
    const todoList = document.querySelector('.todo-list');
    const deleteAllNote = document.querySelector('.clean-items');
    // To save a link to the edited note:
    let editingNote = null;

    // Function to update the old cookie when editing a note:
    function updateCookie(oldName, newName) {
        const oldCookieString = `${encodeURIComponent(oldName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        document.cookie = oldCookieString;

        const date = new Date();
        date.setHours(date.getHours() + 2);

        const newCookieString = `${encodeURIComponent(newName)}=; expires=${date}; path=/`;
        document.cookie = newCookieString;
    }

    // Function to delete cookies:
    function deleteCookie(cookieName) {
        document.cookie = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    }

    // Create and Add a new note:
    submitNote.addEventListener('click', () => {
        const currentTextInSubBtn = submitButtonText.getAttribute('data-text');

        if (inputNote.value !== '' && currentTextInSubBtn === 'Save' && !editingNote) {
            const newItem = document.createElement('li');
            newItem.classList.add('todo-list__item');
            newItem.innerHTML = `
                <p class="item-title">${inputNote.value}</p>
                <div class="todo-list_buttons">
                    <button class="save"></button>
                    <button class="delete"></button>
                </div>
            `;

            todoList.appendChild(newItem);
            inputNote.value = '';

            // Add a cookie only if the note has a name:
            if (inputNote.value.trim() !== '') {
                const date = new Date();
                date.setHours(date.getHours() + 2);
    
                const cookieString = `${encodeURIComponent(inputNote.value)}=; expires=${date}; path=/`;
                document.cookie = cookieString;
            }

        // Editing a note - transfer text from input to a note:
        } else if (currentTextInSubBtn === 'Edit' && editingNote) {
            const saveNote = editingNote.querySelector('.save');
            const deleteNote = editingNote.querySelector('.delete');
            const oldCookieName = editingNote.querySelector('.item-title').textContent;
            const newCookieName = inputNote.value;
            editingNote.querySelector('.item-title').textContent = newCookieName;

            submitButtonText.setAttribute('data-text', 'Save');
            submitNote.classList.add('submit-creation');
            submitNote.classList.remove('submit-creation-red');
            saveNote.classList.remove('save-success');
            deleteNote.classList.remove('delete-red');
            deleteAllNote.classList.remove('clean-items-red');

            editingNote = null;
            inputNote.value = '';

            // Find and update the corresponding cookie:
            saveNote.addEventListener('click', () => {
                if (oldCookieName) {
                    updateCookie(oldCookieName, newCookieName);
                }
            });
        }
    });

    // Editing a note:
    todoList.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const parentListItem = clickedElement.closest('.todo-list__item');

        if (!parentListItem) {
            return;
        }

        const saveNote = parentListItem.querySelector('.save');
        const deleteNote = parentListItem.querySelector('.delete');
        const cookieName = parentListItem.querySelector('.item-title').textContent;
        const cookieValue = parentListItem.querySelector('.item-title').textContent;
        
        // moving text to input when clicking on the note:
        if (clickedElement.classList.contains('item-title')) {
            inputNote.value = clickedElement.textContent;
            editingNote = parentListItem;

            submitButtonText.setAttribute('data-text', 'Edit');
            submitNote.classList.add('submit-creation-red');
            submitNote.classList.remove('submit-creation');
        }

        // Creation cookie:
        if (clickedElement === saveNote) {
            const date = new Date();
            date.setHours(date.getHours() + 2);

            const cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; expires=${date}; path=/`;
            document.cookie = cookieString;
    
            saveNote.classList.add('save-success');
            deleteNote.classList.add('delete-red');
            deleteAllNote.classList.add('clean-items-red');
        }
        
        // Deleting cookie and note:
        if (!deleteNote.classList.contains('delete-red')) {
            return;
        } else if (clickedElement === deleteNote) {
            const cookieString = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
            document.cookie = cookieString;
            deleteCookie(cookieName);

            parentListItem.remove();
            submitNote.classList.add('submit-creation');
            submitNote.classList.remove('submit-creation-red');
            saveNote.classList.remove('save-success');
            deleteNote.classList.remove('delete-red');
            deleteAllNote.classList.remove('clean-items-red');
        }
    });

    // Deleting all cookies and notes:
    deleteAllNote.addEventListener('click', () => {
        const cookies = document.cookie.split(';');
        
        // Deleting all cookies by name:
        cookies.forEach((cookie) => {
            const cookieName = cookie.trim().split("=")[0];
            deleteCookie(cookieName);
        });

        // Clearing the TODO list:
        todoList.innerHTML = '';

        deleteAllNote.classList.remove('clean-items-red');
    });
}

// Display all cookies in HTML when DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    if (!document.cookie) {
        return;
    }
    
    const allCookies = document.cookie.split('; ');
    const todoList = document.querySelector('.todo-list');

    allCookies.forEach((cookie) => {
        const [cookieName] = cookie.split('=');
        
        if (cookieName.trim() !== '') {
            const newItem = document.createElement('li');

            newItem.classList.add('todo-list__item');
            newItem.innerHTML = `
                <p class="item-title">${decodeURIComponent(cookieName)}</p>
                <div class="todo-list_buttons">
                    <button class="save"></button>
                    <button class="delete"></button>
                </div>
            `;
    
            todoList.appendChild(newItem);
            newItem.querySelector('.save').classList.add('save-success');
            newItem.querySelector('.delete').classList.add('delete-red');
            document.querySelector('.clean-items').classList.add('clean-items-red');
        }
    });
});

document.addEventListener('DOMContentLoaded', initToDoList);