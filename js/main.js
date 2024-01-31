function initToDoList() {
    const inputNote = document.querySelector('.input-creation');
    const submitNote = document.querySelector('.submit-creation');
    const todoList = document.querySelector('.todo-list');
    const deleteAllNote = document.querySelector('.clean-items');

    // Create and Add a new note:
    submitNote.addEventListener('click', () => {
        if (inputNote.value !== '' && submitNote.textContent === 'Save') {
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
        }
    });

    // Function to update the old cookie when editing a note:
    function updateCookie(oldName, newValue, newName) {
        const oldCookieString = `${encodeURIComponent(oldName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        document.cookie = oldCookieString;

        let date = new Date();
        date.setHours(date.getHours() + 2);

        const newCookieString = `${encodeURIComponent(newName)}=${encodeURIComponent(newValue)}; expires=${date}; path=/`;
        document.cookie = newCookieString;
    }

    // Function to delete cookies:
    function deleteCookie(cookieName) {
        document.cookie = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    }

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
        const cookieValue = parentListItem;
        
        // moving text to input when clicking on the note:
        if (clickedElement.classList.contains('item-title')) {
            inputNote.value = clickedElement.textContent;
            submitNote.classList.add('submit-creation-red');
            submitNote.innerHTML = 'Edit';
        }

        // editing the content of the text from the input to the note:
        if (submitNote.textContent === 'Edit') {
            submitNote.addEventListener('click', () => {
                clickedElement.innerHTML = inputNote.value;
                submitNote.classList.remove('submit-creation-red');
                submitNote.innerHTML = 'Save';
                saveNote.classList.remove('save-success');
                deleteNote.classList.remove('delete-red');
                inputNote.value = '';
    
                // Find and update the corresponding cookie:
                const newCookieName = inputNote.value;
                const newCookieValue = inputNote.value;
                updateCookie(cookieName, newCookieValue, newCookieName);
            });
        }

        // Creation cookie:
        if (clickedElement === saveNote) {
            let date = new Date();
            date.setHours(date.getHours() + 2);

            const cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}; expires=${date}; path=/`;
            document.cookie = cookieString;
    
            saveNote.classList.add('save-success');
            deleteNote.classList.add('delete-red');
        }
        
        // Deleting cookie and note:
        if (clickedElement === deleteNote) {
            const cookieString = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
            document.cookie = cookieString;
            deleteCookie(cookieName);

            parentListItem.remove();
            saveNote.classList.remove('save-success');
            deleteNote.classList.remove('delete-red');
        }
    });

    function deleteAllCookies() {
        const cookies = document.cookie.split(";");
    
        for (const cookie of cookies) {
            const cookieName = cookie.trim().split("=")[0];
            document.cookie = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
        }
    }

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
        const [cookieName, cookieValue] = cookie.split('=');
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
    });
});

document.addEventListener('DOMContentLoaded', initToDoList);