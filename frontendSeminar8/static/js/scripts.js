document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    document.getElementById('new-post-button').addEventListener('click', showForm);
    document.getElementById('save-button').addEventListener('click', addPost);
    document.getElementById('cancel-button').addEventListener('click', hideForm);
    // 하나 예시로 주고 나머지 쓰게 하는게 어떨까,,

});

function showForm() { // 함수 이름은 주고 아래것 힌트를 주고 쓰게 하기
    document.getElementById('post-form').style.display = 'block';
}

function hideForm() {
    document.getElementById('post-form').style.display = 'none';
}

async function loadPosts() {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    const response = await fetch('http://localhost:8000/api/posts/');
    const posts = await response.json();
    posts.forEach((post) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button class="delete-button" data-id="${post.id}">삭제</button>
        `;
        postList.appendChild(li);
    });

    // Add event listener for edit and delete buttons
    postList.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editPost(button.getAttribute('data-id')));
    });

    postList.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => deletePost(button.getAttribute('data-id')));
    });
}


async function addPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    if (title && content) {
        const post = { title, content };
        await fetch('http://localhost:8000/api/posts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        document.getElementById('new-post-form').reset();
        hideForm();
        loadPosts();
    } else {
        alert('제목과 내용을 입력하세요.');
    }
}


async function deletePost(id) {
    const response = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadPosts();
    } else {
        alert('삭제에 실패했습니다.');
    }
}