if (typeof document !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const reveals = Array.from(entry.target.querySelectorAll('.reveal'));
            
            if (entry.isIntersecting) {
                reveals.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
                
                reveals.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('reveal-active');
                    }, index * 80);
                });
            } else {
                reveals.forEach((el) => {
                    el.classList.remove('reveal-active');
                });
            }
        });
    }, { 
        threshold: 0.15 
    });

    document.querySelectorAll('.snap-target, .reveal-container').forEach(section => {
        observer.observe(section);
    });
}
