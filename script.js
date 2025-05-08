document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const headerForFade = document.querySelector('header'); // Renamed for clarity

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Toggle a class for CSS transitions perhaps, or directly style
            navLinks.classList.toggle('active'); // Example: Use a class to show/hide
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open and active
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    const formStatus = document.querySelector('.form-status'); // Get the status div

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => { // Make async for await
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-button');
            const formData = new FormData(contactForm);

            // Ensure the action URL is not the placeholder
            if (contactForm.action.includes('YOUR_FORMSPREE_ENDPOINT_HERE')) {
                formStatus.textContent = 'Please configure the form endpoint first.';
                formStatus.style.color = 'orange';
                return; 
            }

            submitButton.disabled = true;
            formStatus.textContent = 'Sending...';
            formStatus.style.color = 'var(--dark-gray)'; // Use a CSS variable or a neutral color

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({})); // Catch if response isn't valid JSON
                    if (data.errors && data.errors.length > 0) {
                        formStatus.textContent = data.errors.map(error => error.message).join(', ');
                    } else if (response.status === 422) { // Common Formspree error for field issues
                         formStatus.textContent = 'Please check the form fields and try again.';
                    } else {
                        formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                    }
                    formStatus.style.color = 'var(--primary-red)'; // Use a CSS variable for error color
                }
            } catch (error) {
                formStatus.textContent = 'Oops! There was a network error. Please try again.';
                formStatus.style.color = 'var(--primary-red)';
                console.error('Form submission error:', error);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Header scroll up/down behavior (Keep this if desired)
    const headerScroll = document.querySelector('header');
    let lastScroll = 0;
    if(headerScroll) { // Check if header exists
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                headerScroll.classList.remove('scroll-up');
                headerScroll.classList.remove('scroll-down'); // Remove scroll-down as well when at top
                return;
            }
            if (currentScroll > lastScroll && !headerScroll.classList.contains('scroll-down')) {
                headerScroll.classList.remove('scroll-up');
                headerScroll.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && headerScroll.classList.contains('scroll-down')) {
                headerScroll.classList.remove('scroll-down');
                headerScroll.classList.add('scroll-up');
            }
            lastScroll = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
        });
    }

    // Scroll Fade-In Animation (Keep this)
    const fadeElements = document.querySelectorAll('.fade-in-section');
    if (fadeElements.length > 0) {
        const observerOptionsFade = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.1
        };
        const observerCallbackFade = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } 
            });
        };
        const intersectionObserverFade = new IntersectionObserver(observerCallbackFade, observerOptionsFade);
        fadeElements.forEach(el => {
            intersectionObserverFade.observe(el);
        });
    }

    // REMOVED Dynamic Navbar Styling Section
}); 