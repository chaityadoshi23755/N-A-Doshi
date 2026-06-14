/*
   N A Doshi & Company - Shared Interactive Scripts
*/

document.addEventListener("DOMContentLoaded", () => {
  // 1. Header scroll effect
  const header = document.querySelector(".header");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run initially to set correct state

  // 2. Mobile Menu toggle
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu .nav-link");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      // Prevent body scrolling when menu is open
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // 3. Image Slideshow (Home page)
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active-slide");
        } else {
          slide.classList.remove("active-slide");
        }
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    // Initialize first slide
    showSlide(currentSlide);
    
    // Auto-advance
    let sliderTimer = setInterval(nextSlide, slideInterval);

    // Pause on hover
    const slideshowContainer = document.querySelector(".slideshow-container");
    if (slideshowContainer) {
      slideshowContainer.addEventListener("mouseenter", () => {
        clearInterval(sliderTimer);
      });
      slideshowContainer.addEventListener("mouseleave", () => {
        sliderTimer = setInterval(nextSlide, slideInterval);
      });
    }
  }

  // 4. Smooth Active Link Highlighting in Navigation
  const currentPath = window.location.pathname;
  const pageName = currentPath.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar .nav-link, .mobile-menu .nav-link");

  navLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref === pageName || (pageName === "index.html" && linkHref.startsWith("#"))) {
      // Highlight exact matches
      link.classList.add("active");
    }
  });

  // 5. Custom Form Background Submission via Web3Forms
  // Copy and Paste your Access Key from Web3Forms here:
  const WEB3FORMS_ACCESS_KEY = "490a9617-2a73-4581-90d1-87d626464cf6";

  const inquiryForm = document.getElementById("inquiryForm");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const submitBtn = inquiryForm.querySelector("button[type='submit']");
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Show sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...`;

      const fullName = document.getElementById("fullName").value;
      const emailAddr = document.getElementById("emailAddr").value;
      const phoneNum = document.getElementById("phoneNum").value;
      const orgName = document.getElementById("orgName").value || "Not Specified";
      const orgType = document.getElementById("orgType").value;
      const serviceReq = document.getElementById("serviceReq").value;
      const message = document.getElementById("message").value || "No additional details provided";

      const subject = `N A Doshi Web Inquiry: ${serviceReq} - ${fullName}`;

      // Prepare payload for Web3Forms API
      const formData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subject,
        from_name: "N A Doshi & Co. Website",
        name: fullName,
        email: emailAddr,
        phone: phoneNum,
        organization_name: orgName,
        organization_type: orgType,
        service_category: serviceReq,
        message: message
      };

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          // Success Feedback
          inquiryForm.reset();
          
          // Create a temporary success toast notification
          const successDiv = document.createElement("div");
          successDiv.className = "form-success-toast";
          successDiv.innerHTML = `
            <div style="background: #10b981; color: white; padding: 15px 25px; border-radius: 12px; margin-top: 20px; font-weight: 600; text-align: center; font-family: var(--font-heading); box-shadow: var(--shadow-md); border: 1px solid #059669;">
              <i class="fa-solid fa-circle-check"></i> Thank you! Your inquiry was sent successfully. We will get back to you soon.
            </div>
          `;
          inquiryForm.appendChild(successDiv);
          
          // Remove message after 5 seconds
          setTimeout(() => {
            successDiv.remove();
          }, 6000);
        } else {
          // API error
          alert(json.message || "Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Form submission failed. Please check your internet connection or email info@nadoshi.co.in directly.");
      })
      .finally(() => {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      });
    });
  }
});
