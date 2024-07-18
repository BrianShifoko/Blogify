
document.addEventListener('DOMContentLoaded', function () {
    // Initialize event listeners and other setup code

    // Function to handle form submission for creating a new post
    function handleCreatePostFormSubmission(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const postDetails = {
            title: formData.get('title'),
            summary: formData.get('summary'),
            content: formData.get('content'),
            image: formData.get('image')
        };
        console.log('New Post Created:', postDetails);
        // Implement further logic such as sending data to a server
    }

    // Function to handle search functionality
    function handleSearch(event) {
        const query = event.target.value.toLowerCase();
        console.log('Search Query:', query);
        // Implement search logic such as filtering blog posts
    }

    // Function to handle comment submission
    function handleCommentSubmission(event) {
        event.preventDefault();
        const commentText = event.target.querySelector('textarea').value;
        const commentDetails = {
            author: 'Current User',  // Replace with actual user data
            text: commentText,
            date: new Date().toLocaleString()
        };
        console.log('New Comment:', commentDetails);
        // Implement further logic such as displaying the comment on the page
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
    }
});
