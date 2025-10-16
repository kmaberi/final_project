// Comments System - Uganda Footy Hub

// Comments storage (in-memory, could be enhanced with localStorage)
let commentsData = {};

// Initialize Comments System
export function initComments(entityId, entityType = 'team') {
    const commentsSection = document.getElementById('commentsList');
    const commentForm = document.getElementById('commentForm');
    
    if (!commentsSection) return;
    
    // Initialize entity comments if not exists
    if (!commentsData[entityId]) {
        commentsData[entityId] = [];
    }
    
    // Setup comment form
    if (commentForm) {
        const submitBtn = commentForm.querySelector('#submitComment');
        const textArea = commentForm.querySelector('#commentText');
        
        if (submitBtn && textArea) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                submitComment(entityId, textArea.value);
            });
            
            // Auto-resize textarea
            textArea.addEventListener('input', (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });
            
            // Load saved author name
            const savedName = localStorage.getItem('commentAuthorName');
            if (savedName) {
                const nameInput = commentForm.querySelector('#commentAuthorName');
                if (nameInput) nameInput.value = savedName;
            }
        }
    }
    
    // Display existing comments
    displayComments(entityId);
}

// Submit Comment
function submitComment(entityId, text) {
    const commentText = text.trim();
    const nameInput = document.getElementById('commentAuthorName');
    const authorName = nameInput ? nameInput.value.trim() : 'Anonymous Fan';
    
    // Validation
    if (!commentText) {
        showCommentError('Please write a comment before submitting.');
        return;
    }
    
    if (commentText.length < 10) {
        showCommentError('Comment must be at least 10 characters long.');
        return;
    }
    
    if (commentText.length > 500) {
        showCommentError('Comment must be less than 500 characters.');
        return;
    }
    
    if (authorName && authorName.length > 50) {
        showCommentError('Name must be less than 50 characters.');
        return;
    }
    
    // Create comment object
    const comment = {
        id: Date.now() + Math.random(), // Simple unique ID
        text: commentText,
        author: authorName || 'Anonymous Fan',
        timestamp: new Date().toISOString(),
        likes: 0,
        entityId: entityId
    };
    
    // Add to comments
    if (!commentsData[entityId]) {
        commentsData[entityId] = [];
    }
    commentsData[entityId].unshift(comment); // Add to beginning
    
    // Save author name for future use
    if (authorName && authorName !== 'Anonymous Fan') {
        localStorage.setItem('commentAuthorName', authorName);
    }
    
    // Clear form
    document.getElementById('commentText').value = '';
    document.getElementById('commentText').style.height = 'auto';
    
    // Refresh display
    displayComments(entityId);
    
    // Show success message
    showCommentSuccess('Comment posted successfully!');
}

// Display Comments
function displayComments(entityId) {
    const container = document.getElementById('commentsList');
    if (!container) return;
    
    const comments = commentsData[entityId] || [];
    
    if (comments.length === 0) {
        container.innerHTML = `
            <div class="empty-comments">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h4>No comments yet</h4>
                <p>Be the first to share your thoughts!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
    
    // Add event listeners for comment actions
    addCommentEventListeners(entityId);
}

// Create Comment HTML
function createCommentHTML(comment) {
    const timeAgo = getTimeAgo(new Date(comment.timestamp));
    
    return `
        <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">
                        ${comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div class="author-info">
                        <span class="author-name">${escapeHtml(comment.author)}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                </div>
                <div class="comment-actions">
                    <button class="comment-like-btn" data-comment-id="${comment.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="like-count">${comment.likes || 0}</span>
                    </button>
                    <button class="comment-delete-btn" data-comment-id="${comment.id}" title="Delete comment">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="comment-text">
                ${escapeHtml(comment.text).replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
}

// Add Event Listeners for Comments
function addCommentEventListeners(entityId) {
    // Like buttons
    document.querySelectorAll('.comment-like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const commentId = parseFloat(btn.dataset.commentId);
            likeComment(entityId, commentId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.comment-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const commentId = parseFloat(btn.dataset.commentId);
            deleteComment(entityId, commentId);
        });
    });
}

// Like Comment
function likeComment(entityId, commentId) {
    const comments = commentsData[entityId];
    if (!comments) return;
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    
    comment.likes = (comment.likes || 0) + 1;
    
    // Update the like count in the DOM
    const likeBtn = document.querySelector(`[data-comment-id="${commentId}"].comment-like-btn`);
    if (likeBtn) {
        const countSpan = likeBtn.querySelector('.like-count');
        if (countSpan) {
            countSpan.textContent = comment.likes;
        }
        
        // Add animation effect
        likeBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// Delete Comment
function deleteComment(entityId, commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    const comments = commentsData[entityId];
    if (!comments) return;
    
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return;
    
    // Remove from array
    comments.splice(index, 1);
    
    // Refresh display
    displayComments(entityId);
    
    showCommentSuccess('Comment deleted successfully.');
}

// Get Time Ago
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show Comment Error
function showCommentError(message) {
    showCommentMessage(message, 'error');
}

// Show Comment Success
function showCommentSuccess(message) {
    showCommentMessage(message, 'success');
}

// Show Comment Message
function showCommentMessage(message, type = 'info') {
    // Remove existing messages
    document.querySelectorAll('.comment-message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `comment-message comment-message-${type}`;
    messageDiv.textContent = message;
    
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.insertBefore(messageDiv, commentForm.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Get Comments Count
export function getCommentsCount(entityId) {
    return commentsData[entityId] ? commentsData[entityId].length : 0;
}

// Get All Comments for Entity
export function getComments(entityId) {
    return commentsData[entityId] || [];
}

// Clear All Comments for Entity
export function clearComments(entityId) {
    if (confirm('Are you sure you want to clear all comments? This cannot be undone.')) {
        commentsData[entityId] = [];
        displayComments(entityId);
        showCommentSuccess('All comments cleared.');
        return true;
    }
    return false;
}

// Export comments data for debugging
export { commentsData };