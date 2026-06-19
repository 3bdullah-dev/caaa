document.addEventListener("DOMContentLoaded", () => {
  // 1. تشغيل مكتبة الأنيمشن - مع تعطيل على الجوال للأداء
  const isMobile = window.innerWidth < 768;
  
  AOS.init({
    duration: isMobile ? 0 : 800,
    easing: "ease-out-cubic",
    once: true,
    mirror: false,
    offset: 50,
    disable: isMobile, // تعطيل على الجوال لمنع القفز
  });

  // 2. القائمة المتجاوبة
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      icon.className = navMenu.classList.contains("active") 
        ? "fas fa-times" 
        : "fas fa-bars";
    });
  }

  const navLinks = document.querySelectorAll(".nav-menu ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.querySelector("i").className = "fas fa-bars";
      }
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 3. التبويبات مع إصلاح القفز
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => {
        panel.classList.remove("active");
        const cards = panel.querySelectorAll(".product-card");
        cards.forEach((card) => {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8) translateY(30px)";
          card.style.animation = "none";
        });
      });
      
      button.classList.add("active");
      
      const targetId = button.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);
      
      if (targetPanel) {
        setTimeout(() => {
          targetPanel.classList.add("active");
          
          const cards = targetPanel.querySelectorAll(".product-card");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1) translateY(0)";
              card.style.animation = `blurFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            }, index * 150);
          });
          
          // تأخير AOS.refresh لمنع القفز
          setTimeout(() => {
            if (!isMobile) AOS.refresh();
          }, 700);
        }, 50);
      }
    });
  });

  // 4. الهيدر
  const header = document.querySelector(".main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.padding = "10px 0";
      header.style.background = "rgba(10, 21, 32, 0.95)";
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    } else {
      header.style.padding = "15px 0";
      header.style.background = "rgba(10, 21, 32, 0.85)";
      header.style.boxShadow = "none";
    }
  }, { passive: true });

  // 5. Lightbox
  const lightboxOverlay = document.createElement("div");
  lightboxOverlay.className = "lightbox-overlay";
  lightboxOverlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="إغلاق"><i class="fas fa-times"></i></button>
      <button class="lightbox-nav lightbox-prev" aria-label="السابق"><i class="fas fa-chevron-right"></i></button>
      <img src="" alt="صورة المنتج" class="lightbox-image">
      <button class="lightbox-nav lightbox-next" aria-label="التالي"><i class="fas fa-chevron-left"></i></button>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  let currentImages = [];
  let currentIndex = 0;

  const openLightbox = (wrapper) => {
    const hiddenImagesDiv = wrapper.querySelector(".hidden-images");
    if (!hiddenImagesDiv) return;
    
    const imgs = hiddenImagesDiv.querySelectorAll("img");
    currentImages = Array.from(imgs).map((img) => img.src);
    currentIndex = 0;
    
    updateLightboxImage();
    lightboxOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const updateLightboxImage = () => {
    const lightboxImg = lightboxOverlay.querySelector(".lightbox-image");
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
      lightboxImg.src = currentImages[currentIndex];
      lightboxImg.style.opacity = "1";
    }, 150);
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".product-gallery-wrapper").forEach((wrapper) => {
    wrapper.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(wrapper);
    });
  });

  lightboxOverlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  
  lightboxOverlay.addEventListener("click", (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
  
  lightboxOverlay.querySelector(".lightbox-next").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
  });
  
  lightboxOverlay.querySelector(".lightbox-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
  });

  // 6. العدادات
  const counters = document.querySelectorAll(".counter-num");
  const sectionAbout = document.getElementById("about");
  let started = false;
  
  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      let count = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  // استخدام Intersection Observer للأداء
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    if (sectionAbout) {
      observer.observe(sectionAbout);
    }
  } else {
    // Fallback للـ scroll القديم
    window.addEventListener("scroll", () => {
      if (sectionAbout && window.scrollY >= sectionAbout.offsetTop - 300 && !started) {
        started = true;
        animateCounters();
      }
    }, { passive: true });
  }

  // 7. 3D Tilt - على الكمبيوتر فقط
  if (!isMobile && window.matchMedia("(hover: hover)").matches) {
    const tiltCards = document.querySelectorAll(".product-card");
    
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xRotation = -(((y - rect.height / 2) / rect.height) * 6);
        const yRotation = ((x - rect.width / 2) / rect.width) * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-5px)`;
      });
      
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }
});
