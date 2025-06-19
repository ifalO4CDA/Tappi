    document.addEventListener('DOMContentLoaded', () => {
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        
        if (mobileNavToggle) {
            mobileNavToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        }
    });