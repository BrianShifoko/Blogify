document.addEventListener('DOMContentLoaded', function () {
    // Function to handle form submission for creating a new post
    function handleCreatePostFormSubmission(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const summary = formData.get('summary');
        const content = formData.get('content');
        const imageFile = formData.get('image');
        const imageUrl = formData.get('image-url');

        const reader = new FileReader();

        reader.onload = function (e) {
            const imageSrc = imageFile ? e.target.result : imageUrl;
            const postDetails = {
                title,
                summary,
                content,
                imageSrc,
                date: new Date().toLocaleDateString()
            };

            savePost(postDetails);
            window.location.href = `post.html?title=${encodeURIComponent(postDetails.title)}`;
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            reader.onload(); // Manually trigger the load event for imageUrl
        }
    }

    // Function to save the post to local storage
    function savePost(post) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Function to add post to index.html
    function addPostToIndex(post) {
        const recentPostsContainer = document.querySelector('#recent-posts');
        if (recentPostsContainer) {
            const postElement = createPostElement(post);
            recentPostsContainer.insertBefore(postElement, recentPostsContainer.firstChild);
        }
    }

    // Function to create a post element
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white p-4 rounded-lg shadow-md';
        postElement.innerHTML = `
            <img src="${post.imageSrc}" alt="${post.title}" class="w-full h-auto rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mt-2"><a href="post.html?title=${encodeURIComponent(post.title)}">${post.title}</a></h3>
            <p class="text-gray-600">${post.date}</p>
        `;
        return postElement;
    }

    // Function to display post on post.html
    function displayPost() {
        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(p => p.title === title);

        if (post) {
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-date').textContent = post.date;
            document.getElementById('post-image').src = post.imageSrc;
            document.getElementById('post-content').textContent = post.content;
        }
    }

    // Function to handle search functionality
    function handleSearch(event) {
        const query = event.target.value.toLowerCase();
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const results = posts.filter(post => post.title.toLowerCase().includes(query) || post.summary.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
        
        const recentPostsContainer = document.querySelector('#recent-posts');
        if (recentPostsContainer) {
            recentPostsContainer.innerHTML = '';
            results.forEach(post => {
                const postElement = createPostElement(post);
                recentPostsContainer.appendChild(postElement);
            });
        }
    }

    // Function to handle comment submission
    function handleCommentSubmission(event) {
        event.preventDefault();
        const commentText = event.target.querySelector('textarea').value;
        const postTitle = document.getElementById('post-title').textContent;
        const commentDetails = {
            author: 'Anonymous',  // This should be replaced with actual user data
            text: commentText,
            date: new Date().toLocaleString(),
            postTitle
        };

        saveComment(commentDetails);
        addCommentToPage(commentDetails);
        event.target.reset();
    }

    // Function to save comment to local storage
    function saveComment(comment) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Function to add comment to the page
    function addCommentToPage(comment) {
        const commentsSection = document.querySelector('#comments-section');
        if (commentsSection) {
            const commentElement = createCommentElement(comment);
            commentsSection.appendChild(commentElement);
        }
    }

    // Function to create a comment element
    function createCommentElement(comment) {
        const commentElement = document.createElement('div');
        commentElement.className = 'bg-gray-100 p-4 rounded-lg';
        commentElement.innerHTML = `
            <p class="text-gray-800 font-semibold">${comment.author}</p>
            <p class="text-gray-600">${comment.text}</p>
            <p class="text-gray-500 text-sm">${comment.date}</p>
            <button class="text-red-500 hover:text-red-700 delete-comment" data-date="${comment.date}">Delete</button>
        `;
        return commentElement;
    }

    // Function to display comments on post.html
    function displayComments() {
        const postTitle = document.getElementById('post-title').textContent;
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const postComments = comments.filter(comment => comment.postTitle === postTitle);

        postComments.forEach(comment => addCommentToPage(comment));
    }

    // Function to handle deleting comments
    function handleDeleteComment(event) {
        if (event.target.classList.contains('delete-comment')) {
            const date = event.target.getAttribute('data-date');
            let comments = JSON.parse(localStorage.getItem('comments')) || [];
            comments = comments.filter(comment => comment.date !== date);
            localStorage.setItem('comments', JSON.stringify(comments));
            event.target.parentElement.remove();
        }
    }

    // Event listener for form submission in create-post.html
    const createPostForm = document.querySelector('#create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePostFormSubmission);
    }

    // Event listener for search input
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Event listener for comment form submission in post.html
    const commentForm = document.querySelector('#comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmission);
        displayComments();  // Display existing comments when the page loads
    }

    // Event listener for deleting comments
    const commentsSection = document.querySelector('#comments-section');
    if (commentsSection) {
        commentsSection.addEventListener('click', handleDeleteComment);
    }

    // Display post content on post.html
    if (window.location.pathname.includes('post.html')) {
        displayPost();
    }

    // Display existing posts on index.html
    if (window.location.pathname.includes('index.html')) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.reverse().forEach(post => addPostToIndex(post));
    }
});
