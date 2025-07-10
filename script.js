// Progress Bar Animation with Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  // Handle regular progress bars (skills section)
  const progressBars = document.querySelectorAll(".progress-fill");

  // Handle circular progress bars (education section)
  const circularProgressBars = document.querySelectorAll(".progress-ring-bar");

  console.log("Found progress bars:", progressBars.length);
  console.log("Found circular progress bars:", circularProgressBars.length);

  // Store original widths and set all regular progress bars to 0% initially
  progressBars.forEach((bar) => {
    const originalWidth = bar.style.width;
    bar.dataset.targetWidth = originalWidth;
    bar.style.width = "0%";
  });

  // Store original percentages and set all circular progress bars to 0% initially
  circularProgressBars.forEach((bar) => {
    const originalPercentage = bar.style.getPropertyValue("--percentage");
    // Extract numeric value from percentage string
    const numericValue = parseFloat(originalPercentage);
    bar.dataset.targetPercentage = numericValue;
    bar.style.strokeDashoffset = "326.56"; // Start with empty circle

    // Initialize percentage counter to 0%
    const progressContainer = bar.closest(".circular-progress");
    const percentageElement = progressContainer.querySelector(
      ".progress-percentage"
    );
    const valueElement = progressContainer.querySelector(".progress-value");

    if (percentageElement) {
      percentageElement.textContent = "0%";
    }

    // Store original values and set to 0 initially
    if (valueElement) {
      const originalValue = valueElement.textContent;
      valueElement.dataset.targetValue = originalValue;

      // Set initial value based on type
      if (originalValue.includes("/")) {
        // Credits format: "74/135" -> "0/135"
        const parts = originalValue.split("/");
        valueElement.textContent = "0/" + parts[1];
      } else {
        // GPA format: "4.0" -> "0.0"
        valueElement.textContent = "0.0";
      }
    }

    console.log("Circular progress bar found:", bar, "Target:", numericValue);
  });

  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Handle regular progress bars
        if (entry.target.classList.contains("progress-fill")) {
          const progressFill = entry.target;
          const targetWidth = progressFill.dataset.targetWidth;
          setTimeout(() => {
            progressFill.style.width = targetWidth;
          }, 200);
        }

        // Handle circular progress bars
        if (entry.target.classList.contains("progress-ring-bar")) {
          const circularProgressFill = entry.target;
          const targetPercentage = parseFloat(
            circularProgressFill.dataset.targetPercentage
          );

          // Find the corresponding elements
          const progressContainer =
            circularProgressFill.closest(".circular-progress");
          const percentageElement = progressContainer.querySelector(
            ".progress-percentage"
          );
          const valueElement =
            progressContainer.querySelector(".progress-value");

          // Get target values
          const targetValue = valueElement.dataset.targetValue;
          let targetNumericValue, totalValue;

          if (targetValue.includes("/")) {
            // Credits format: "74/135"
            const parts = targetValue.split("/");
            targetNumericValue = parseFloat(parts[0]);
            totalValue = parseFloat(parts[1]);
          } else {
            // GPA format: "4.0"
            targetNumericValue = parseFloat(targetValue);
          }

          // Animate from 0 to target percentage
          let currentPercentage = 0;
          const duration = 2500; // 2.5 seconds
          const startTime = performance.now();

          const animateCircular = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            currentPercentage = targetPercentage * easeOutCubic;
            const currentValue = targetNumericValue * easeOutCubic;

            // Update the SVG progress (anti-clockwise)
            const dashArray = 326.56; // 2 * π * 52
            const dashOffset = dashArray * (1 - currentPercentage / 100);
            circularProgressFill.style.strokeDashoffset = dashOffset;

            // Update the percentage text
            if (percentageElement) {
              percentageElement.textContent =
                Math.round(currentPercentage * 10) / 10 + "%";
            }

            // Update the value text
            if (valueElement) {
              if (targetValue.includes("/")) {
                // Credits format
                valueElement.textContent =
                  Math.round(currentValue) + "/" + totalValue;
              } else {
                // GPA format
                valueElement.textContent = (
                  Math.round(currentValue * 10) / 10
                ).toFixed(1);
              }
            }

            if (progress < 1) {
              requestAnimationFrame(animateCircular);
            }
          };

          setTimeout(() => {
            requestAnimationFrame(animateCircular);
          }, 200);
        }
      } else {
        // Reset regular progress bars
        if (entry.target.classList.contains("progress-fill")) {
          entry.target.style.width = "0%";
        }

        // Reset circular progress bars
        if (entry.target.classList.contains("progress-ring-bar")) {
          entry.target.style.strokeDashoffset = "326.56"; // Reset to empty circle

          // Reset the percentage display and value
          const progressContainer = entry.target.closest(".circular-progress");
          const percentageElement = progressContainer.querySelector(
            ".progress-percentage"
          );
          const valueElement =
            progressContainer.querySelector(".progress-value");

          if (percentageElement) {
            percentageElement.textContent = "0%";
          }

          if (valueElement) {
            const targetValue = valueElement.dataset.targetValue;
            if (targetValue.includes("/")) {
              // Credits format: reset to "0/135"
              const parts = targetValue.split("/");
              valueElement.textContent = "0/" + parts[1];
            } else {
              // GPA format: reset to "0.0"
              valueElement.textContent = "0.0";
            }
          }
        }
      }
    });
  }, observerOptions);

  // Start observing all progress bars
  progressBars.forEach((bar) => {
    observer.observe(bar);
  });

  // Start observing all circular progress bars
  circularProgressBars.forEach((bar) => {
    observer.observe(bar);
  });

  // Add smooth scrolling for navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add loading animation on page load
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

  // Add scroll-to-top functionality
  const createScrollToTopButton = () => {
    const button = document.createElement("button");
    button.innerHTML = "↑";
    button.className = "scroll-to-top";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `;

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        button.style.opacity = "1";
        button.style.visibility = "visible";
      } else {
        button.style.opacity = "0";
        button.style.visibility = "hidden";
      }
    });

    document.body.appendChild(button);
  };

  // Initialize scroll-to-top button
  createScrollToTopButton();

  // Add hover effects for project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add typing animation for tagline
  const tagline = document.querySelector(".tagline");
  if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = "";

    let index = 0;
    const typeWriter = () => {
      if (index < originalText.length) {
        tagline.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
      }
    };

    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
  }
});
