document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to category links
    const categoryLinks = document.querySelectorAll('.category');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior

            // Get the category title from the clicked link
            const categoryTitle = link.querySelector('h1').textContent.trim();

            // Save the selected category to localStorage
            localStorage.setItem('selectedCategory', categoryTitle);

            // Redirect to questions.html
            window.location.href = 'oddOneChoose.html';
        });
    });
});