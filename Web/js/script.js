document.addEventListener("DOMContentLoaded", () => {
    const heroHeading = document.querySelector(".hero-content h1");
    const textNodes = [...heroHeading.childNodes]; // Get all child nodes

    // Clear existing text
    heroHeading.innerHTML = "";

    let index = 0;

    // Function to wrap characters in spans
    const wrapTextInSpans = () => {
        index = 0; // Reset index for new animation
        textNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                text.split("").forEach(char => {
                    const span = document.createElement("span");
                    span.textContent = char === " " ? "\u00A0" : char; // Use non-breaking space for spacing
                    span.style.setProperty('--char-index', index++);
                    heroHeading.appendChild(span);
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const strongText = node.textContent;
                const strongSpan = document.createElement("span");
                strongText.split("").forEach(char => {
                    const span = document.createElement("span");
                    span.textContent = char;
                    span.style.color = "orangered"; // Style for the <strong> text
                    span.style.setProperty('--char-index', index++);
                    strongSpan.appendChild(span);
                });
                heroHeading.appendChild(strongSpan);
            }
        });
    };

    const animateText = () => {
        wrapTextInSpans();
        const spans = heroHeading.querySelectorAll("span");

        // Reset spans
        spans.forEach(span => {
            span.style.opacity = 0; // Hide all spans initially
        });

        // Animate spans
        spans.forEach((span, i) => {
            setTimeout(() => {
                span.style.opacity = 1; // Set span to visible
                span.style.transition = "opacity 0.5s"; // Add transition for fading in
            }, i * 100); // Delay each character's appearance
        });

        // Clear the content after all characters have been animated
        setTimeout(() => {
            spans.forEach(span => {
                span.style.opacity = 0; // Fade out each span
            });
            setTimeout(() => {
                heroHeading.innerHTML = ""; // Clear the text
                animateText(); // Restart animation
            }, 500); // Wait for fade-out to finish
        }, (spans.length * 100) + 1000); // Adjust timeout duration as needed
    };

    animateText(); // Start the animation
});
