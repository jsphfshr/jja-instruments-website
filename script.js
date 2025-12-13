/**
 * Flow Phantom Website JavaScript
 * Handles mobile menu, smooth scrolling, and animations
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");

      // Animate hamburger
      this.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });

  // Animate elements on scroll
  const observerOptions = {
    root: null,
    rootMargin: "100px",
    threshold: 0.05,
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(".feature-card, .app-card, .testimonial-card, .spec-row");
  animateElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
    fadeInObserver.observe(el);
  });

  // Add visible class styles dynamically
  const style = document.createElement("style");
  style.textContent = `
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    summary.addEventListener("click", (e) => {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.hasAttribute("open")) {
          otherItem.removeAttribute("open");
        }
      });
    });
  });

  // Form submission handling with Formspree
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);

      // Simple validation
      const requiredFields = ["name", "email", "organization"];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = this.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
          input.style.borderColor = "#ef4444";
          isValid = false;
        } else {
          input.style.borderColor = "";
        }
      });

      if (!isValid) {
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success
          submitBtn.textContent = "Message Sent! ✓";
          submitBtn.style.background = "#10b981";

          // Show success message
          const successMsg = document.createElement("div");
          successMsg.className = "form-success-message";
          successMsg.innerHTML = `
            <p><strong>Thank you for your inquiry!</strong></p>
            <p>We'll respond within 1-2 business days.</p>
          `;
          successMsg.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
          `;
          this.appendChild(successMsg);

          // Reset form after delay
          setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
            successMsg.remove();
          }, 5000);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        // Error handling
        submitBtn.textContent = "Error - Try Again";
        submitBtn.style.background = "#ef4444";

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Velocity display animation
  const velocityReading = document.querySelector(".velocity-reading");
  if (velocityReading) {
    let currentVelocity = 25.0;
    const targetVelocities = [25.0, 50.0, 75.0, 100.0, 50.0, 25.0];
    let velocityIndex = 0;

    setInterval(() => {
      const target = targetVelocities[velocityIndex];
      const step = target > currentVelocity ? 0.5 : -0.5;

      if (Math.abs(currentVelocity - target) > 0.5) {
        currentVelocity += step;
      } else {
        velocityIndex = (velocityIndex + 1) % targetVelocities.length;
      }

      velocityReading.textContent = currentVelocity.toFixed(1);
    }, 100);
  }

  // Screen value animation in specs section
  const screenValue = document.querySelector(".screen-value");
  if (screenValue) {
    let screenVelocity = 25.0;
    setInterval(() => {
      screenVelocity = 20 + Math.random() * 10;
      screenValue.textContent = screenVelocity.toFixed(1);
    }, 2000);
  }
});

// Lazy load images when they come into view
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: "200px" });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}

// ==========================================
// INTERNATIONALIZATION (i18n) SUPPORT
// Languages: English, Hindi, Chinese, Japanese
// ==========================================

const translations = {
  en: {
    // Meta
    "meta.title": "JJ&A Instruments | Precision Ultrasound Equipment & Calibration Services",

    // Navigation
    "nav.products": "Products",
    "nav.services": "Services",
    "nav.industries": "Industries",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.contact": "Contact Us",
    "nav.doppler": "Mark V Doppler Phantom",
    "nav.hifu": "HIFU RF Power Generator",
    "nav.quote": "Request Quote",

    // Doppler Page Hero
    "hero.badge": "Medical Ultrasound Quality Assurance Solutions",
    "hero.title": "Doppler Phantom &<br><em>Ultrasound QA</em>",
    "hero.subtitle": "The gold standard in medical ultrasound quality assurance. Our Mark V Doppler Phantom delivers NIST-traceable accuracy for clinical QA programs, regulatory compliance, and research applications—trusted by hospitals, OEMs, and academic institutions worldwide.",
    "hero.cta1": "Request a Quote",
    "hero.cta2": "QA & Compliance",

    // Trust badges
    "trust.compliant": "Compliant",
    "trust.accuracy": "Accuracy",
    "trust.traceable": "Traceable",

    // Home Hero Section
    "home.hero.badge": "Precision Ultrasound Technology",
    "home.hero.title": "Advancing Medical<br><em>Ultrasound Innovation</em>",
    "home.hero.subtitle": "JJ&A Instruments designs and manufactures precision ultrasound equipment for diagnostic QA and therapeutic applications. From Doppler phantoms to HIFU RF power generators, we empower healthcare providers, researchers, and OEMs with reliable, high-performance solutions.",
    "home.hero.cta1": "Explore Products",
    "home.hero.cta2": "Contact Sales",
    "home.hero.years": "Years Experience",
    "home.hero.countries": "Countries Served",
    "home.hero.certified": "Certified",
    "home.hero.scroll": "Scroll to explore",

    // Products Section
    "products.tag": "Our Products",
    "products.title": "Precision Ultrasound Solutions",
    "products.desc": "Two product lines serving the complete spectrum of ultrasound applications—from diagnostic quality assurance to high-intensity therapeutic systems.",
    "products.doppler.tag": "Diagnostic QA",
    "products.doppler.title": "Mark V Doppler Phantom",
    "products.doppler.desc": "The gold standard for Doppler ultrasound velocity calibration. NIST-traceable accuracy for clinical QA, regulatory compliance, and accreditation requirements.",
    "products.doppler.feature1": "10-200 cm/s velocity range",
    "products.doppler.feature2": "±1% NIST-traceable accuracy",
    "products.doppler.feature3": "ACR, IAC, ICAVL compliant",
    "products.doppler.feature4": "5-minute setup time",
    "products.hifu.tag": "Therapeutic HIFU",
    "products.hifu.title": "HIFU RF Power Generator",
    "products.hifu.desc": "High-performance RF power amplifier for driving focused ultrasound transducers. Ideal for HIFU system OEMs, researchers, and therapeutic device developers.",
    "products.hifu.feature1": "0.5-7 MHz frequency range",
    "products.hifu.feature2": "Up to 500W output power",
    "products.hifu.feature3": "MRI-compatible options",
    "products.hifu.feature4": "Multi-channel array support",
    "products.learnmore": "Learn More",
    "products.getquote": "Get Quote",

    // Services Section
    "services.tag": "Our Services",
    "services.title": "Comprehensive Support",
    "services.desc": "Beyond equipment, we offer calibration, compliance consulting, and technical support to ensure optimal performance throughout your product lifecycle.",
    "services.calibration.title": "Calibration Services",
    "services.calibration.desc": "NIST-traceable calibration for Doppler phantoms and ultrasound equipment. Maintain accuracy and compliance with annual or biannual service plans.",
    "services.consulting.title": "Compliance Consulting",
    "services.consulting.desc": "Expert guidance on ACR, IAC, and ICAVL accreditation requirements. We help you develop and maintain compliant QA programs.",
    "services.custom.title": "Custom Engineering",
    "services.custom.desc": "Custom phantom configurations and RF generator specifications tailored to your unique research or manufacturing requirements.",
    "services.oem.title": "OEM Partnerships",
    "services.oem.desc": "White-label solutions and volume pricing for ultrasound equipment manufacturers integrating our technology into their product lines.",
    "services.global.title": "Global Support",
    "services.global.desc": "Worldwide shipping and support network. Local service partners in North America, Europe, and Asia-Pacific regions.",
    "services.emergency.title": "Emergency Response",
    "services.emergency.desc": "48-hour expedited service for critical calibration needs. Priority support for accreditation deadlines and equipment failures.",

    // Industries Section
    "industries.tag": "Industries We Serve",
    "industries.title": "Trusted Across Healthcare",
    "industries.desc": "Our solutions serve a diverse range of healthcare and research organizations worldwide.",
    "industries.hospitals.title": "Hospitals & Clinics",
    "industries.hospitals.desc": "Supporting diagnostic imaging departments with reliable QA equipment.",
    "industries.research.title": "Research Institutions",
    "industries.research.desc": "Enabling breakthrough discoveries in ultrasound therapeutics and diagnostics.",
    "industries.oem.title": "OEM Manufacturers",
    "industries.oem.desc": "Providing components and systems for ultrasound device production.",
    "industries.regulatory.title": "Regulatory Bodies",
    "industries.regulatory.desc": "Supporting equipment certification and standards compliance testing.",

    // Blog Section
    "blog.tag": "Insights & Updates",
    "blog.title": "Blog & Resources",
    "blog.desc": "Expert articles on ultrasound quality assurance, HIFU technology, compliance updates, and industry best practices.",
    "blog.allposts": "All Posts",
    "blog.loading": "Loading articles...",
    "blog.back": "Back to Articles",
    "blog.comments": "Comments",
    "blog.leavecomment": "Leave a Comment",
    "blog.name": "Name *",
    "blog.email": "Email * (not published)",
    "blog.comment": "Comment *",
    "blog.postcomment": "Post Comment",
    "blog.nocomments": "No comments yet. Be the first to share your thoughts!",
    "blog.reply": "Reply",
    "blog.replyingto": "Replying to",
    "blog.cancel": "Cancel",

    // About Section
    "about.tag": "About JJ&A Instruments",
    "about.title": "Engineering Excellence Since 1998",
    "about.desc1": "For over 25 years, JJ&A Instruments has been at the forefront of ultrasound technology innovation. Based in San Diego, California, we combine deep technical expertise with a commitment to quality that has made us a trusted partner to healthcare organizations worldwide.",
    "about.desc2": "Founded by ultrasound engineers with backgrounds in both clinical and industrial applications, we understand the rigorous demands of medical device quality assurance and therapeutic ultrasound systems.",
    "about.desc3": "Our team combines deep expertise in RF engineering, acoustic physics, and regulatory compliance to deliver products that meet the highest standards of accuracy and reliability.",
    "about.desc2": "Our team of engineers and scientists continuously push the boundaries of what's possible in ultrasound calibration and therapeutic applications, ensuring our customers have access to the most accurate, reliable equipment available.",
    "about.stat1.number": "5,000+",
    "about.stat1.label": "Units Deployed",
    "about.stat2.number": "100+",
    "about.stat2.label": "OEM Partners",
    "about.stat3.number": "24/7",
    "about.stat3.label": "Support Available",
    "about.cert.title": "Certifications & Standards",
    "about.cert1": "ISO 13485",
    "about.cert1.desc": "Medical Devices QMS",
    "about.cert2": "CE Marked",
    "about.cert2.desc": "European Conformity",
    "about.cert3": "FDA Registered",
    "about.cert3.desc": "US Food and Drug Administration",

    "about.cert4": "Traceable",
    "about.cert4.desc": "NIST Traceable Calibration",
    // Contact Section
    "contact.tag": "Get in Touch",
    "contact.title": "Contact Us",
    "contact.desc": "Ready to discuss your ultrasound equipment needs? Our team is here to help with product selection, custom configurations, and technical questions.",
    "contact.call": "Call Us",
    "contact.email": "Email",
    "contact.hq": "Headquarters",
    "contact.name": "Full Name *",
    "contact.workemail": "Work Email *",
    "contact.org": "Organization *",
    "contact.phone": "Phone Number",
    "contact.interest": "I'm interested in:",
    "contact.interest.doppler": "Mark V Doppler Phantom",
    "contact.interest.hifu": "HIFU RF Power Generator",
    "contact.interest.calibration": "Calibration Services",
    "contact.interest.oem": "OEM Partnership",
    "contact.interest.custom": "Custom Engineering",
    "contact.interest.general": "General Inquiry",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Tell us about your project, requirements, or questions...",
    "contact.submit": "Send Message",
    "contact.success": "Thank you for your inquiry!",
    "contact.response": "We'll respond within 1-2 business days.",

    // Footer
    "footer.products": "Products",
    "footer.services": "Services",
    "footer.calibration": "Calibration",
    "footer.consulting": "Compliance Consulting",
    "footer.customeng": "Custom Engineering",
    "footer.oem": "OEM Solutions",
    "footer.resources": "Resources",
    "footer.support": "Technical Support",
    "footer.docs": "Documentation",
    "footer.company": "Company",
    "footer.careers": "Careers",
    "footer.news": "News",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2024 JJ&A Instruments. All rights reserved.",
    "footer.location": "San Diego, CA, USA",
    // Doppler Page
    "doppler.hero.badge": "Medical Ultrasound Quality Assurance Solutions",
    "doppler.hero.title": "Doppler Phantom &<br><em>Ultrasound QA</em>",
    "doppler.hero.subtitle": "The gold standard in medical ultrasound quality assurance. Our Mark V Doppler Phantom delivers NIST-traceable accuracy for clinical QA programs, regulatory compliance, and research applications—trusted by hospitals, OEMs, and academic institutions worldwide.",
    "doppler.hero.cta1": "Request a Quote",
    "doppler.hero.cta2": "QA & Compliance",
    "doppler.whatis.tag": "Understanding Medical Ultrasound QA",
    "doppler.whatis.title": "What is Ultrasound Quality Assurance?",
    "doppler.whatis.lead": "Medical ultrasound quality assurance (QA) is a systematic program of testing and verification that ensures diagnostic ultrasound equipment performs accurately and consistently for patient care.",
    "doppler.whatis.p1": "<strong>Ultrasound QA encompasses</strong> routine performance testing, calibration verification, and documentation required by accrediting bodies such as the American College of Radiology (ACR), Intersocietal Accreditation Commission (IAC), and regulatory agencies including the FDA. A comprehensive QA program protects patients, ensures diagnostic accuracy, and maintains compliance with healthcare standards.",
    "doppler.whatis.p2": "<strong>Doppler velocity calibration</strong> is a critical component of ultrasound QA. Accurate blood flow velocity measurements are essential for diagnosing vascular disease severity, assessing cardiac function, monitoring fetal well-being, and guiding treatment decisions. The JJ&A Instruments Mark V Doppler Phantom provides the NIST-traceable reference standard needed to verify your ultrasound systems measure velocity accurately.",
    "doppler.whatis.p3": "<strong>Why QA matters:</strong> Studies show that uncalibrated ultrasound systems can produce velocity measurement errors of 10-20%, potentially leading to misdiagnosis of conditions like carotid stenosis or cardiac valve disease. Regular QA testing with calibrated phantoms ensures your clinical measurements remain within acceptable accuracy limits.",
    "doppler.whatis.diagram.title": "Ultrasound QA Program Components",
    "doppler.whatis.step1.title": "Doppler Velocity Verification",
    "doppler.whatis.step1.desc": "Verify blood flow velocity accuracy using calibrated string phantoms",
    "doppler.whatis.step2.title": "Image Quality Assessment",
    "doppler.whatis.step2.desc": "Test spatial resolution, contrast, uniformity with tissue phantoms",
    "doppler.whatis.step3.title": "Transducer Performance",
    "doppler.whatis.step3.desc": "Evaluate probe sensitivity, dead elements, and acoustic output",
    "doppler.whatis.step4.title": "Documentation & Compliance",
    "doppler.whatis.step4.desc": "Maintain records for ACR, IAC, ICAVL, Joint Commission audits",
    "doppler.product.tag": "Our Products",
    "doppler.product.title": "Mark V Doppler Phantom",
    "doppler.product.desc": "The industry standard for Doppler velocity calibration and ultrasound quality assurance. Trusted by clinical facilities, OEM manufacturers, and research institutions worldwide.",
    "doppler.features.range.title": "Clinical Velocity Range",
    "doppler.features.range.desc": "10-200 cm/s covers all clinical blood flow velocities from venous flow to peak arterial systole, supporting vascular, cardiac, obstetric, and transcranial Doppler QA.",
    "doppler.features.accuracy.title": "NIST-Traceable Accuracy",
    "doppler.features.accuracy.desc": "±1% velocity accuracy with Certificate of Calibration traceable to National Institute of Standards and Technology—essential for regulatory compliance.",
    "doppler.features.compliance.title": "Compliance Ready",
    "doppler.features.compliance.desc": "Designed to meet ACR, IAC, ICAVL, AIUM, and Joint Commission ultrasound QA requirements. Export documentation in accreditation-ready formats.",
    "doppler.features.setup.title": "5-Minute Setup",
    "doppler.features.setup.desc": "No blood-mimicking fluid preparation, temperature stabilization, or complex alignment. Rapid setup maximizes QA testing efficiency.",
    "doppler.features.angles.title": "Multi-Angle Testing",
    "doppler.features.angles.desc": "Verify Doppler angle correction accuracy at 30°, 45°, and 60° angles using integrated positioning guides—critical for proper velocity calculation.",
    "doppler.features.export.title": "USB Data Export",
    "doppler.features.export.desc": "Export calibration results in PDF and CSV formats. Integrate with QA management systems for streamlined documentation and audit trails.",
    "doppler.compliance.tag": "Regulatory Compliance",
    "doppler.compliance.title": "Ultrasound Compliance & Accreditation",
    "doppler.compliance.desc": "Meet the quality assurance requirements of major accrediting bodies and regulatory agencies with documented Doppler velocity calibration.",
    "doppler.compliance.row1": "Annual Doppler QA required",
    "doppler.compliance.row2": "Echo & Vascular standards",
    "doppler.compliance.row3": "Velocity accuracy verification",
    "doppler.compliance.row4": "Equipment management standards",
    "doppler.compliance.row5": "Quality System Regulation",
    "doppler.compliance.row6": "Ultrasound field characterization",
    "doppler.compliance.row7": "Practice guidelines compliance",
    "doppler.compliance.row8": "Medical device QMS",
    "doppler.compliance.cta": "Get Compliance Support",
    "doppler.compliance.doclabel": "Accreditation-Ready Documentation",
    "doppler.services.tag": "Professional Services",
    "doppler.services.title": "Ultrasound Calibration Services",
    "doppler.services.desc": "Comprehensive NIST-traceable calibration services for Doppler ultrasound equipment. Supporting clinical facilities, OEM manufacturers, and research institutions with expert quality assurance.",
    "doppler.services.onsite.title": "On-Site Calibration",
    "doppler.services.onsite.desc": "Our technicians come to your facility with calibrated reference equipment. Minimize downtime while ensuring your ultrasound systems meet accuracy specifications.",
    "doppler.services.depot.title": "Depot Calibration",
    "doppler.services.depot.desc": "Ship your phantom to our ISO 17025-compliant laboratory for comprehensive calibration. 5-7 business day turnaround with detailed certification documentation.",
    "doppler.services.accreditation.title": "Accreditation Support",
    "doppler.services.accreditation.desc": "Complete documentation packages for ACR, IAC, ICAVL, and Joint Commission audits. QA protocol templates and compliance consulting available.",
    "doppler.services.recert.title": "Annual Recertification",
    "doppler.services.recert.desc": "Keep your phantom NIST-traceable with annual recertification services. Maintain compliance with accreditation requirements and ensure ongoing accuracy.",
    "doppler.services.training.title": "QA Training",
    "doppler.services.training.desc": "On-site training for your sonographers and QA staff. Learn proper phantom operation, testing protocols, and documentation procedures.",
    "doppler.services.emergency.title": "Emergency Service",
    "doppler.services.emergency.desc": "48-hour expedited calibration available for urgent needs. Don't let equipment issues delay your accreditation or patient care.",
    "doppler.research.tag": "Beyond Clinical",
    "doppler.research.title": "Production & Research Applications",
    "doppler.research.desc": "Our doppler phantoms serve critical roles in ultrasound manufacturing quality control, academic research, and medical device development.",
    "doppler.research.oem.title": "OEM Manufacturing QA",
    "doppler.research.oem.desc": "Ultrasound manufacturers rely on our phantoms for production line testing and final QA verification. Ensure every unit shipped meets Doppler velocity specifications with NIST-traceable reference standards. Support ISO 13485 and FDA 21 CFR Part 820 compliance.",
    "doppler.research.rnd.title": "R&D and Product Development",
    "doppler.research.rnd.desc": "Develop and validate new Doppler algorithms, signal processing techniques, and imaging modalities. Our phantoms provide the consistent, repeatable velocity references needed for quantitative research and regulatory submissions.",
    "doppler.research.academic.title": "Academic Research",
    "doppler.research.academic.desc": "Universities and research institutions use our phantoms for hemodynamic studies, cardiovascular imaging research, and sonography education. Published velocity accuracy data supports peer-reviewed research credibility.",
    "doppler.research.service.title": "Service Organizations",
    "doppler.research.service.desc": "Biomedical equipment service companies use our phantoms for post-repair verification and preventive maintenance testing. Demonstrate to customers that repaired equipment meets original performance specifications.",
    "doppler.apps.tag": "Clinical Applications",
    "doppler.apps.title": "Blood Flow Velocity Calibration",
    "doppler.apps.desc": "Essential for any facility performing Doppler ultrasound examinations where verified blood flow velocity accuracy impacts patient diagnosis and treatment.",
    "doppler.apps.vascular.title": "Vascular Laboratory QA",
    "doppler.apps.vascular.desc": "Verify carotid artery velocity measurements critical for stenosis grading per NASCET/ECST criteria. Ensure peripheral arterial and venous Doppler accuracy for DVT diagnosis and arterial disease assessment.",
    "doppler.apps.echo.title": "Echocardiography",
    "doppler.apps.echo.desc": "Validate transmitral and transaortic flow velocities for cardiac output calculations. Essential for accurate E/A ratio, valve gradient measurements, and hemodynamic assessments per ASE guidelines.",
    "doppler.apps.ob.title": "Obstetric Doppler",
    "doppler.apps.ob.desc": "Calibrate umbilical artery and middle cerebral artery measurements. Accurate velocities and ratios are critical for fetal well-being assessment, IUGR detection, and high-risk pregnancy monitoring.",
    "doppler.apps.tcd.title": "Transcranial Doppler",
    "doppler.apps.tcd.desc": "Verify TCD velocity accuracy for stroke risk assessment, vasospasm monitoring in SAH patients, brain death determination protocols, and sickle cell disease screening programs.",
    "doppler.apps.acceptance.title": "Equipment Acceptance Testing",
    "doppler.apps.acceptance.desc": "Baseline Doppler calibration for new ultrasound system installation. Verify performance meets manufacturer specifications before clinical use—essential for capital equipment validation.",
    "doppler.apps.compliance.title": "Accreditation Compliance",
    "doppler.apps.compliance.desc": "Meet ACR, IAC, ICAVL, and Joint Commission ultrasound accreditation requirements with documented Doppler velocity calibration and comprehensive QA protocols.",
    "doppler.specs.tag": "Technical Details",
    "doppler.specs.title": "Mark V Specifications",
    "doppler.specs.desc": "Engineered to meet the demanding requirements of clinical ultrasound QA and regulatory compliance testing.",
    "doppler.specs.velocity.title": "Velocity Performance",
    "doppler.specs.velocity.desc": "<strong>Range:</strong> 10 – 200 cm/s<br><strong>Accuracy:</strong> ±1% of reading<br><strong>Resolution:</strong> 0.1 cm/s<br><strong>Stability:</strong> ±0.5% over 8 hours",
    "doppler.specs.physical.title": "Physical Specifications",
    "doppler.specs.physical.desc": "<strong>Dimensions:</strong> 45 × 25 × 18 cm<br><strong>Weight:</strong> 5.2 kg (11.5 lbs)<br><strong>String:</strong> 0.1mm nylon monofilament<br><strong>Tank:</strong> Degassed water bath",
    "doppler.specs.acoustic.title": "Acoustic Properties",
    "doppler.specs.acoustic.desc": "<strong>Window:</strong> TPX membrane 60×120mm<br><strong>Probe Compatibility:</strong> 2-15 MHz<br><strong>Doppler Angles:</strong> 30°, 45°, 60° guides<br><strong>Depth:</strong> 2-8 cm adjustable",
    "doppler.specs.standards.title": "Compliance & Standards",
    "doppler.specs.standards.desc": "<strong>Standards:</strong> IEC 62359, FDA QSR<br><strong>Power:</strong> 100-240V AC, 50/60Hz<br><strong>Certifications:</strong> CE marked<br><strong>Warranty:</strong> 2 years comprehensive",
    "doppler.faq.tag": "Common Questions",
    "doppler.faq.title": "Ultrasound QA FAQ",
    "doppler.faq.q1": "How often should Doppler ultrasound equipment be calibrated?",
    "doppler.faq.a1": "The American College of Radiology (ACR) and Intersocietal Accreditation Commission (IAC) recommend Doppler velocity verification at least annually. Many accredited vascular laboratories perform quarterly calibration checks as part of their quality assurance program. Additional testing is recommended after equipment service, software updates, transducer replacement, or any time measurement accuracy is questioned.",
    "doppler.faq.q2": "What accreditation standards require ultrasound QA testing?",
    "doppler.faq.a2": "Multiple accrediting bodies require documented ultrasound quality assurance programs: <strong>ACR</strong> (American College of Radiology) requires annual phantom testing; <strong>IAC</strong> (Intersocietal Accreditation Commission) covers echocardiography and vascular testing; <strong>ICAVL</strong> (Intersocietal Commission for the Accreditation of Vascular Laboratories) requires velocity accuracy verification; <strong>The Joint Commission</strong> mandates equipment management and QA programs; and <strong>AIUM</strong> (American Institute of Ultrasound in Medicine) publishes practice guidelines. Our phantom and documentation support all these standards.",
    "doppler.faq.q3": "What is the difference between a string phantom and a flow phantom?",
    "doppler.faq.a3": "String phantoms use a moving filament at precisely controlled velocities, eliminating variables like blood-mimicking fluid temperature, viscosity, and particle concentration. This provides more consistent, reproducible calibration results with minimal maintenance. Flow phantoms with blood-mimicking fluid can better simulate certain acoustic properties like scattering, but require temperature control, regular fluid replacement, and more complex setup. For Doppler velocity calibration, string phantoms offer superior accuracy and practicality.",
    "doppler.faq.q4": "Is the Mark V compatible with my ultrasound system?",
    "doppler.faq.a4": "Yes. The Mark V Doppler Phantom is compatible with all diagnostic ultrasound systems with Doppler capability, including GE, Philips, Siemens, Canon (Toshiba), Samsung, Fujifilm, Mindray, and other manufacturers. The 2-15 MHz probe compatibility covers virtually all clinical transducers used in vascular, cardiac, obstetric, and general imaging applications.",
    "doppler.faq.q5": "What blood flow velocities can I test?",
    "doppler.faq.a5": "The Mark V covers 10-200 cm/s, spanning the full range of clinical blood flow velocities: venous flow (10-30 cm/s), normal arterial flow (30-100 cm/s), and peak systolic velocities in stenotic vessels or cardiac applications (up to 200 cm/s and beyond). This range supports carotid stenosis grading, peripheral vascular assessment, cardiac valve evaluation, obstetric Doppler, and transcranial Doppler applications.",
    "doppler.faq.q6": "How does NIST-traceable calibration work?",
    "doppler.faq.a6": "NIST-traceable calibration means our phantom's velocity accuracy can be documented through an unbroken chain of comparisons back to the National Institute of Standards and Technology. Each Mark V ships with a Certificate of Calibration showing measurement uncertainty and traceability. Annual recertification maintains this traceability—essential for regulatory compliance and accreditation audits.",
    "doppler.faq.q7": "What documentation is provided for accreditation?",
    "doppler.faq.a7": "Each Mark V ships with a Certificate of Calibration traceable to NIST standards. The unit exports test results in PDF and CSV formats compatible with ACR, IAC, ICAVL, and Joint Commission accreditation requirements. We also provide template QA protocols, testing procedure documentation, and guidance for laboratory accreditation submissions. Our support team can assist with specific accreditation documentation requirements.",
    "doppler.faq.q8": "Do you support OEM and research applications?",
    "doppler.faq.a8": "Yes. We supply doppler phantoms to ultrasound OEM manufacturers for production testing and QA, to medical device developers for R&D and regulatory submissions, and to academic institutions for research and education. Volume pricing and custom configurations are available for OEM and institutional customers. Contact us to discuss your specific requirements.",
    // HIFU Page
    "hifu.hero.badge": "Complete HIFU Driving System",
    "hifu.hero.title": "HIFU RF<br><em>Power System</em>",
    "hifu.hero.subtitle": "A complete, ready-to-use HIFU driving system—just add your transducer. Frequency generator, precision timing circuits, power amplifier, safety systems, and full system control all integrated in one unit. Simple ASCII commands via a single USB port. Power on and start treating.",
    "hifu.hero.cta2": "View Specifications",
    "hifu.trust.usb": "USB Port",
    "hifu.trust.allinone.num": "All-in-One",
    "hifu.trust.allinone.label": "Complete System",
    "hifu.trust.power": "Max Power",
    "hifu.whatis.tag": "Understanding HIFU Technology",
    "hifu.whatis.title": "What is High-Intensity Focused Ultrasound?",
    "hifu.whatis.lead": "High-Intensity Focused Ultrasound (HIFU) is a non-invasive therapeutic technique that uses focused acoustic energy to precisely heat and ablate tissue deep within the body—without incisions or radiation.",
    "hifu.whatis.p1": "<strong>A complete system, not just an amplifier:</strong> Our HIFU RF Power System integrates everything you need to drive your transducer: precision frequency generator, timing and gating circuits, high-power RF amplifier, comprehensive safety systems, and full digital control. Just connect your transducer and you're ready to go.",
    "hifu.whatis.p2": "<strong>Simple USB control:</strong> No complex interfaces or proprietary software. Send simple ASCII text commands through a single USB port to control frequency, power, pulse timing, and all system functions. Works with any programming language or terminal program. Full documentation included.",
    "hifu.whatis.p3": "<strong>Built-in safety:</strong> VSWR protection, over-temperature shutdown, arc detection, and hardware interlocks are all integrated. Focus on your application—the safety systems handle the rest.",
    "hifu.whatis.diagram.title": "What's Included",
    "hifu.whatis.step1.title": "Frequency Generator",
    "hifu.whatis.step1.desc": "Precision DDS synthesis, 0.5-7 MHz range",
    "hifu.whatis.step2.title": "Timing & Gating Circuits",
    "hifu.whatis.step2.desc": "Programmable pulse control, <10 μs response",
    "hifu.whatis.step3.title": "RF Power Amplifier",
    "hifu.whatis.step3.desc": "Up to 500W continuous, impedance matched",
    "hifu.whatis.step4.title": "Safety Systems",
    "hifu.whatis.step4.desc": "VSWR, thermal, arc protection & interlocks",
    "hifu.whatis.step5.title": "USB Control Interface",
    "hifu.whatis.step5.desc": "Simple ASCII commands, works with any software",
    "hifu.whatis.diagram.footer": "You provide: Your transducer",
    "hifu.features.tag": "Complete System Features",
    "hifu.features.title": "Everything You Need, Integrated",
    "hifu.features.desc": "A turnkey HIFU driving solution—connect your transducer, plug in USB, and you're ready. No external signal generators, amplifiers, or control systems required.",
    "hifu.features.power.title": "High Power Output",
    "hifu.features.power.desc": "Up to 500W continuous wave (CW) or pulsed output. Scalable configurations from 100W to multi-kilowatt systems for different clinical applications.",
    "hifu.features.freq.title": "Wide Frequency Range",
    "hifu.features.freq.desc": "0.5 MHz to 7 MHz covers all HIFU applications—from deep tissue ablation (0.5-1 MHz) to superficial aesthetic treatments (3-7 MHz).",
    "hifu.features.array.title": "Multi-Channel Arrays",
    "hifu.features.array.desc": "Support for phased array transducers with up to 256 independently controlled channels. Electronic beam steering and focal point adjustment.",
    "hifu.features.response.title": "Fast Response Time",
    "hifu.features.response.desc": "<10 μs rise/fall times for precise pulsed operation. Real-time power control for temperature-guided therapy and motion tracking.",
    "hifu.features.safety.title": "Built-in Safety Systems",
    "hifu.features.safety.desc": "VSWR protection, over-temperature shutdown, and arc detection. Hardware interlocks and software limits ensure safe operation.",
    "hifu.features.control.title": "Simple ASCII Control",
    "hifu.features.control.desc": "One USB port. Simple ASCII text commands. Control frequency, power, timing—everything—from any terminal or programming language. No proprietary software needed.",
    "hifu.apps.tag": "Clinical & Research Applications",
    "hifu.apps.title": "HIFU Applications",
    "hifu.apps.desc": "Our RF power generators support the full spectrum of focused ultrasound applications—from life-saving tumor ablation to cutting-edge research.",
    "hifu.apps.oncology.title": "Oncology & Tumor Ablation",
    "hifu.apps.oncology.desc": "Non-invasive treatment of solid tumors in prostate, liver, breast, kidney, and bone. HIFU offers an alternative to surgery for patients who are not surgical candidates. The 2024 oncology segment represents 41% of the global HIFU market, with FDA-cleared systems like Focal One® driving adoption.",
    "hifu.apps.neuro.title": "Neurology & Brain Therapy",
    "hifu.apps.neuro.desc": "MRI-guided focused ultrasound for essential tremor, Parkinson's disease tremor, and neuropathic pain. HIFU can create precise lesions in deep brain structures without opening the skull—a breakthrough alternative to invasive neurosurgery. Our MRI-compatible generators enable integration with MRgFUS platforms.",
    "hifu.apps.aesthetic.title": "Aesthetic & Cosmetic",
    "hifu.apps.aesthetic.desc": "Non-invasive skin tightening, wrinkle reduction, and body contouring. Higher frequency HIFU (3-7 MHz) targets the SMAS layer and subcutaneous fat for cosmetic improvement without surgery. The aesthetic HIFU segment is the fastest-growing market, driven by consumer demand for minimally invasive treatments.",
    "hifu.apps.rnd.title": "Research & Development",
    "hifu.apps.rnd.desc": "Flexible configurations for academic and industrial R&D. Develop new HIFU applications, validate treatment protocols, and characterize transducer performance. Our generators support the full research cycle from bench experiments to preclinical studies and regulatory submissions.",
    "hifu.apps.oem.title": "OEM System Integration",
    "hifu.apps.oem.desc": "Designed for integration into commercial HIFU systems. Compact form factor, comprehensive API, and regulatory documentation support FDA 510(k) and CE marking submissions. Volume pricing and design-in support for OEM partnerships.",
    "hifu.apps.drug.title": "Drug Delivery & Sonoporation",
    "hifu.apps.drug.desc": "Low-intensity pulsed HIFU for enhanced drug delivery, blood-brain barrier opening, and sonodynamic therapy research. Precise pulse control enables investigation of bioeffects beyond thermal ablation.",
    "hifu.specs.tag": "Technical Details",
    "hifu.specs.title": "Complete System Specifications",
    "hifu.specs.desc": "All-in-one system includes frequency generator, timing circuits, amplifier, safety systems, and USB control. Just connect your transducer.",
    "hifu.specs.row1.label": "Frequency Range",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "Frequency Stability",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "Output Power (CW)",
    "hifu.specs.row3.value": "100W / 250W / 500W models",
    "hifu.specs.row4.label": "Output Power (Pulsed)",
    "hifu.specs.row4.value": "Up to 1000W peak",
    "hifu.specs.row5.label": "Power Resolution",
    "hifu.specs.row5.value": "0.1W (digital control)",
    "hifu.specs.row6.label": "Rise/Fall Time",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "Duty Cycle",
    "hifu.specs.row7.value": "0-100% (CW or pulsed)",
    "hifu.specs.row8.label": "Output Impedance",
    "hifu.specs.row8.value": "50Ω nominal",
    "hifu.specs.row9.label": "VSWR Protection",
    "hifu.specs.row9.value": "Auto-shutdown at 3:1",
    "hifu.specs.row10.label": "Control Interface",
    "hifu.specs.row10.value": "USB (ASCII commands)",
    "hifu.specs.row11.label": "Cooling",
    "hifu.specs.row11.value": "Forced air / Water options",
    "hifu.specs.row12.label": "MRI Compatibility",
    "hifu.specs.row12.value": "Optional shielded version",
    "hifu.specs.cta": "Request Full Specifications",
    "hifu.specs.avail": "Available: 100W, 250W, 500W Models",
    "hifu.why.tag": "Why JJ&A Instruments",
    "hifu.why.title": "The HIFU Generator Advantage",
    "hifu.why.desc": "Purpose-built for therapeutic ultrasound with the reliability and support that medical device developers demand.",
    "hifu.why.quality.title": "Medical-Grade Quality",
    "hifu.why.quality.desc": "ISO 13485 certified manufacturing. Designed and documented to support FDA 510(k) and CE marking submissions for your HIFU system.",
    "hifu.why.support.title": "Applications Engineering",
    "hifu.why.support.desc": "Our RF engineers understand HIFU applications. Get expert support for transducer matching, thermal management, and system integration.",
    "hifu.why.global.title": "Global Availability",
    "hifu.why.global.desc": "Worldwide shipping with local support in North America, Europe, and Asia-Pacific. Evaluation units available for qualified projects.",
    "hifu.why.api.title": "Comprehensive APIs",
    "hifu.why.api.desc": "Full software control via documented APIs. LabVIEW VIs, Python libraries, and C/C++ SDK included. Rapid integration with your control system.",
    "hifu.why.longterm.title": "Long-Term Support",
    "hifu.why.longterm.desc": "5-year product availability guarantee. Extended warranty options. Calibration and maintenance services to keep your system running.",
    "hifu.why.custom.title": "Custom Configurations",
    "hifu.why.custom.desc": "Need a specific frequency, power level, or form factor? Our engineering team can customize generators for your unique requirements.",
    "hifu.faq.tag": "Common Questions",
    "hifu.faq.title": "HIFU Generator FAQ",
    "hifu.faq.q1": "What is HIFU and how does it work?",
    "hifu.faq.a1": "High-Intensity Focused Ultrasound (HIFU) uses focused acoustic energy to heat and destroy targeted tissue non-invasively. An RF power generator drives piezoelectric transducers that convert electrical energy into ultrasound waves. These waves are focused to a precise point in the body—like sunlight through a magnifying glass—where temperatures reach 60-85°C, causing thermal ablation of the target tissue while sparing surrounding structures.",
    "hifu.faq.q2": "What frequency should I use for my HIFU application?",
    "hifu.faq.a2": "Frequency selection depends on treatment depth and target tissue. <strong>Lower frequencies (0.5-1 MHz)</strong> penetrate deeper (up to 15 cm) and are used for tumor ablation in liver, kidney, and prostate. <strong>Mid-range frequencies (1-3 MHz)</strong> are common for neurological HIFU and general therapeutic applications. <strong>Higher frequencies (3-7 MHz)</strong> provide precise, shallow penetration for aesthetic treatments targeting skin layers. Our team can help you select the optimal frequency for your specific application.",
    "hifu.faq.q3": "Is the generator compatible with MRI environments?",
    "hifu.faq.a3": "Yes. We offer MRI-compatible versions with EMI shielding and non-magnetic construction for MR-guided Focused Ultrasound (MRgFUS) applications. These generators can operate inside the MRI suite without interfering with imaging. The shielded version has been validated at 1.5T and 3T field strengths. Contact us to discuss your specific MRI integration requirements.",
    "hifu.faq.q4": "Can the generator drive phased array transducers?",
    "hifu.faq.a4": "Yes. We offer multi-channel configurations with up to 256 independently controlled channels for phased array transducers. Each channel provides individual amplitude and phase control for electronic beam steering and focal point adjustment. Multi-channel systems include synchronization features for coherent operation. Single-element and annular array transducers are also fully supported.",
    "hifu.faq.q5": "What safety features are included?",
    "hifu.faq.a5": "Safety is built into every generator: <strong>VSWR protection</strong> automatically reduces power if reflected power exceeds safe limits (prevents transducer damage). <strong>Over-temperature protection</strong> monitors internal temperatures and shuts down before overheating. <strong>Arc detection</strong> instantly cuts power if arcing is detected in the RF path. <strong>Hardware interlocks</strong> support external safety switches and emergency stops. <strong>Software limits</strong> allow you to define application-specific power and duration limits.",
    "hifu.faq.q6": "What regulatory documentation is available?",
    "hifu.faq.a6": "We provide comprehensive documentation to support your regulatory submissions: <strong>Design history file</strong> including specifications, test reports, and traceability. <strong>Risk analysis</strong> per ISO 14971. <strong>EMC test reports</strong> per IEC 60601-1-2. <strong>Electrical safety testing</strong> per IEC 60601-1. <strong>Certificates</strong> of conformance and calibration. Our regulatory affairs team can assist with FDA 510(k) and CE marking questions.",
    "hifu.faq.q7": "Do you support OEM integration and custom configurations?",
    "hifu.faq.a7": "Yes. We work closely with HIFU system developers on OEM projects: <strong>Custom frequencies</strong> matched to your transducer. <strong>Modified form factors</strong> for integration into your system enclosure. <strong>Custom interfaces</strong> and control protocols. <strong>Private labeling</strong> available. <strong>Volume pricing</strong> for production quantities. We can also provide design-in support, prototypes, and engineering samples for evaluation.",
    "hifu.faq.q8": "What is the warranty and support policy?",
    "hifu.faq.a8": "Standard warranty is 2 years covering parts and labor. Extended warranty options up to 5 years are available. Support includes: <strong>Phone and email technical support</strong> during business hours. <strong>Remote diagnostics</strong> via network connection. <strong>Repair and calibration services</strong> at our facility. <strong>Loaner units</strong> available for qualified customers during repairs. <strong>On-site service</strong> available for an additional fee.",
    "hifu.contact.desc": "Ready to power your HIFU application? Contact us for pricing, specifications, or to discuss your project requirements with our engineering team.",
    "footer.applications": "Applications",
    "hifu.apps.oncology.short": "Tumor Ablation",
    "hifu.apps.neuro.short": "Neurology",
    "hifu.apps.aesthetic.short": "Aesthetics",
    "hifu.apps.rnd.short": "Research",
    "nav.compliance": "QA & Compliance",
    "footer.recertification": "Phantom Recertification",
    "nav.faq": "FAQ",
    "footer.docs": "Technical Documents",
    "footer.protocols": "QA Protocols",
    "nav.specs": "Specifications",
    "nav.home": "Home",
    "footer.desc": "Precision ultrasound equipment for diagnostic QA and therapeutic applications. Trusted by healthcare providers and researchers worldwide.",
    "footer.accessories": "Accessories",
    "footer.parts": "Replacement Parts",
    "footer.descDoppler": "Precision doppler phantoms and ultrasound calibration services for medical ultrasound quality assurance, regulatory compliance, and research applications.",
    "footer.oemResearch": "OEM & Research",

    // Navigation - Additional
    "nav.calibration": "Calibration Services",
    "nav.applications": "Applications",

    // Aria Labels for Accessibility
    "aria.mainNav": "Main navigation",
    "aria.home": "JJ&A Instruments Home",
    "aria.toggleMenu": "Toggle menu",
    "aria.selectLang": "Select language",
    "aria.contactForm": "Contact form",
    "aria.footerNav": "Footer navigation",

    // Placeholders
    "placeholder.comment": "Share your thoughts...",
    "placeholder.message": "Tell us about your project, requirements, or questions...",
    "placeholder.messageDoppler": "Tell us about your ultrasound QA needs, accreditation requirements, or research applications...",

    // Contact Form Options - Index page
    "contact.option.doppler": "Mark V Doppler Phantom",
    "contact.option.hifu": "HIFU RF Power Generator",
    "contact.option.calibration": "Calibration Services",
    "contact.option.oem": "OEM Partnership",
    "contact.option.custom": "Custom Engineering",
    "contact.option.general": "General Inquiry",

    // Contact Form Options - Doppler page
    "contact.option.phantomQuote": "Mark V Doppler Phantom Quote",
    "contact.option.calibrationService": "Ultrasound Calibration Services",
    "contact.option.qaCompliance": "QA & Compliance Support",
    "contact.option.oemResearch": "OEM / Research Applications",
    "contact.option.recertification": "Phantom Recertification",

    // Contact Form Options - HIFU page
    "contact.option.hifuQuote": "HIFU RF Generator Quote",
    "contact.option.hifuSpecs": "Technical Specifications",
    "contact.option.hifuCustom": "Custom Configuration",
    "contact.option.hifuResearch": "Research Application",
    "contact.option.hifuEval": "Evaluation Unit",

    // Placeholder - HIFU page
    "placeholder.messageHifu": "Tell us about your HIFU application, target frequency, power requirements, or integration needs...",
  },

  zh: {
    // Meta
    "meta.title": "JJ&A Instruments | 精密超声设备与校准服务",

    // Navigation
    "nav.products": "产品",
    "nav.services": "服务",
    "nav.industries": "行业",
    "nav.blog": "博客",
    "nav.about": "关于我们",
    "nav.contact": "联系我们",
    "nav.doppler": "Mark V 多普勒模体",
    "nav.hifu": "HIFU射频功率发生器",
    "nav.quote": "获取报价",

    // Doppler Page Hero
    "hero.badge": "医学超声质量保证解决方案",
    "hero.title": "多普勒模体与<br><em>超声质量保证</em>",
    "hero.subtitle": "医学超声质量保证的黄金标准。我们的Mark V多普勒模体为临床QA计划、法规合规和研究应用提供NIST可追溯的精确度——受到全球医院、OEM制造商和学术机构的信赖。",
    "hero.cta1": "获取报价",
    "hero.cta2": "质量保证与合规",

    // Trust badges
    "trust.compliant": "合规",
    "trust.accuracy": "精度",
    "trust.traceable": "可追溯",

    // Home Hero Section
    "home.hero.badge": "精密超声技术",
    "home.hero.title": "推进医学<br><em>超声创新</em>",
    "home.hero.subtitle": "JJ&A Instruments设计和制造用于诊断QA和治疗应用的精密超声设备。从多普勒模体到HIFU射频功率发生器，我们为医疗保健提供者、研究人员和OEM提供可靠、高性能的解决方案。",
    "home.hero.cta1": "探索产品",
    "home.hero.cta2": "联系销售",
    "home.hero.years": "年经验",
    "home.hero.countries": "服务国家",
    "home.hero.certified": "认证",
    "home.hero.scroll": "滚动探索",

    // Products Section
    "products.tag": "我们的产品",
    "products.title": "精密超声解决方案",
    "products.desc": "两条产品线服务于从诊断质量保证到高强度治疗系统的完整超声应用领域。",
    "products.doppler.tag": "诊断QA",
    "products.doppler.title": "Mark V 多普勒模体",
    "products.doppler.desc": "多普勒超声速度校准的黄金标准。为临床QA、法规合规和认证要求提供NIST可追溯精度。",
    "products.doppler.feature1": "10-200 cm/s速度范围",
    "products.doppler.feature2": "±1% NIST可追溯精度",
    "products.doppler.feature3": "ACR、IAC、ICAVL合规",
    "products.doppler.feature4": "5分钟设置时间",
    "products.hifu.tag": "治疗性HIFU",
    "products.hifu.title": "HIFU射频功率发生器",
    "products.hifu.desc": "用于驱动聚焦超声换能器的高性能射频功率放大器。适用于HIFU系统OEM、研究人员和治疗设备开发人员。",
    "products.hifu.feature1": "0.5-7 MHz频率范围",
    "products.hifu.feature2": "高达500W输出功率",
    "products.hifu.feature3": "MRI兼容选项",
    "products.hifu.feature4": "多通道阵列支持",
    "products.learnmore": "了解更多",
    "products.getquote": "获取报价",

    // Services Section
    "services.tag": "我们的服务",
    "services.title": "全面支持",
    "services.desc": "除设备外，我们还提供校准、合规咨询和技术支持，确保您的产品在整个生命周期内保持最佳性能。",
    "services.calibration.title": "校准服务",
    "services.calibration.desc": "多普勒模体和超声设备的NIST可追溯校准。通过年度或半年度服务计划保持精度和合规性。",
    "services.consulting.title": "合规咨询",
    "services.consulting.desc": "ACR、IAC和ICAVL认证要求的专家指导。我们帮助您开发和维护合规的QA程序。",
    "services.custom.title": "定制工程",
    "services.custom.desc": "根据您独特的研究或制造需求定制模体配置和射频发生器规格。",
    "services.oem.title": "OEM合作",
    "services.oem.desc": "为将我们的技术集成到其产品线中的超声设备制造商提供白标解决方案和批量定价。",
    "services.global.title": "全球支持",
    "services.global.desc": "全球物流和支持网络。北美、欧洲和亚太地区的本地服务合作伙伴。",
    "services.emergency.title": "紧急响应",
    "services.emergency.desc": "48小时加急服务，满足关键校准需求。为认证截止日期和设备故障提供优先支持。",

    // Industries Section
    "industries.tag": "我们服务的行业",
    "industries.title": "医疗保健领域的信赖之选",
    "industries.desc": "我们的解决方案服务于全球各种医疗保健和研究机构。",
    "industries.hospitals.title": "医院和诊所",
    "industries.hospitals.desc": "为诊断影像科室提供可靠的QA设备支持。",
    "industries.research.title": "研究机构",
    "industries.research.desc": "推动超声治疗和诊断领域的突破性发现。",
    "industries.oem.title": "OEM制造商",
    "industries.oem.desc": "为超声设备生产提供组件和系统。",
    "industries.regulatory.title": "监管机构",
    "industries.regulatory.desc": "支持设备认证和标准合规测试。",

    // Blog Section
    "blog.tag": "洞察与更新",
    "blog.title": "博客与资源",
    "blog.desc": "关于超声质量保证、HIFU技术、合规更新和行业最佳实践的专家文章。",
    "blog.allposts": "所有文章",
    "blog.loading": "加载文章中...",
    "blog.back": "返回文章列表",
    "blog.comments": "评论",
    "blog.leavecomment": "发表评论",
    "blog.name": "姓名 *",
    "blog.email": "邮箱 *（不公开）",
    "blog.comment": "评论 *",
    "blog.postcomment": "发布评论",
    "blog.nocomments": "暂无评论。成为第一个分享想法的人！",
    "blog.reply": "回复",
    "blog.replyingto": "回复给",
    "blog.cancel": "取消",

    // About Section
    "about.tag": "关于JJ&A Instruments",
    "about.title": "自1998年以来的卓越工程",
    "about.desc1": "25年来，JJ&A Instruments一直处于超声技术创新的前沿。我们位于加利福尼亚州圣地亚哥，将深厚的技术专长与对质量的承诺相结合，成为全球医疗保健组织值得信赖的合作伙伴。",
    "about.desc2": "由具有临床和工业应用背景的超声工程师创立，我们了解医疗设备质量保证和治疗超声系统的严格要求。",
    "about.desc3": "我们的团队结合了射频工程、声学物理和法规合规方面的深厚专业知识，提供符合最高精度和可靠性标准的产品。",
    "about.desc2": "Founded by ultrasound engineers with backgrounds in both clinical and industrial applications, we understand the rigorous demands of medical device quality assurance and therapeutic ultrasound systems.",
    "about.desc3": "Our team combines deep expertise in RF engineering, acoustic physics, and regulatory compliance to deliver products that meet the highest standards of accuracy and reliability.",
    "about.desc2": "我们的工程师和科学家团队不断突破超声校准和治疗应用的可能性边界，确保客户能够获得最准确、最可靠的设备。",
    "about.stat1.number": "5,000+",
    "about.stat1.label": "已部署设备",
    "about.stat2.number": "100+",
    "about.stat2.label": "OEM合作伙伴",
    "about.stat3.number": "24/7",
    "about.stat3.label": "全天候支持",
    "about.cert.title": "认证与标准",
    "about.cert1": "ISO 13485",
    "about.cert1.desc": "医疗器械质量管理体系",
    "about.cert2": "CE Marked",
    "about.cert2.desc": "欧洲合规",
    "about.cert3": "FDA Registered",
    "about.cert3.desc": "美国食品药品监督管理局",
    "about.cert4": "可追溯",
    "about.cert4.desc": "NIST可追溯校准",

    // Contact Section
    "contact.tag": "联系我们",
    "contact.title": "联系我们",
    "contact.desc": "准备好讨论您的超声设备需求了吗？我们的团队随时为您提供产品选择、定制配置和技术问题方面的帮助。",
    "contact.call": "致电我们",
    "contact.email": "邮箱",
    "contact.hq": "总部",
    "contact.name": "全名 *",
    "contact.workemail": "工作邮箱 *",
    "contact.org": "组织 *",
    "contact.phone": "电话号码",
    "contact.interest": "我感兴趣的是：",
    "contact.interest.doppler": "Mark V 多普勒模体",
    "contact.interest.hifu": "HIFU射频功率发生器",
    "contact.interest.calibration": "校准服务",
    "contact.interest.oem": "OEM合作",
    "contact.interest.custom": "定制工程",
    "contact.interest.general": "一般咨询",
    "contact.message": "留言",
    "contact.messagePlaceholder": "告诉我们您的项目、需求或问题...",
    "contact.submit": "发送消息",
    "contact.success": "感谢您的咨询！",
    "contact.response": "我们将在1-2个工作日内回复。",

    // Footer
    "footer.products": "产品",
    "footer.services": "服务",
    "footer.calibration": "校准",
    "footer.consulting": "合规咨询",
    "footer.customeng": "定制工程",
    "footer.oem": "OEM解决方案",
    "footer.resources": "资源",
    "footer.support": "技术支持",
    "footer.docs": "文档",
    "footer.company": "公司",
    "footer.careers": "职业机会",
    "footer.news": "新闻",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.copyright": "© 2024 JJ&A Instruments。保留所有权利。",
    "footer.location": "美国加利福尼亚州圣地亚哥",
    // Doppler Page
    "doppler.hero.badge": "Medical Ultrasound Quality Assurance Solutions",
    "doppler.hero.title": "Doppler Phantom &<br><em>Ultrasound QA</em>",
    "doppler.hero.subtitle": "The gold standard in medical ultrasound quality assurance. Our Mark V Doppler Phantom delivers NIST-traceable accuracy for clinical QA programs, regulatory compliance, and research applications—trusted by hospitals, OEMs, and academic institutions worldwide.",
    "doppler.hero.cta1": "Request a Quote",
    "doppler.hero.cta2": "QA & Compliance",
    "doppler.whatis.tag": "Understanding Medical Ultrasound QA",
    "doppler.whatis.title": "What is Ultrasound Quality Assurance?",
    "doppler.whatis.lead": "Medical ultrasound quality assurance (QA) is a systematic program of testing and verification that ensures diagnostic ultrasound equipment performs accurately and consistently for patient care.",
    "doppler.whatis.p1": "<strong>Ultrasound QA encompasses</strong> routine performance testing, calibration verification, and documentation required by accrediting bodies such as the American College of Radiology (ACR), Intersocietal Accreditation Commission (IAC), and regulatory agencies including the FDA. A comprehensive QA program protects patients, ensures diagnostic accuracy, and maintains compliance with healthcare standards.",
    "doppler.whatis.p2": "<strong>Doppler velocity calibration</strong> is a critical component of ultrasound QA. Accurate blood flow velocity measurements are essential for diagnosing vascular disease severity, assessing cardiac function, monitoring fetal well-being, and guiding treatment decisions. The JJ&A Instruments Mark V Doppler Phantom provides the NIST-traceable reference standard needed to verify your ultrasound systems measure velocity accurately.",
    "doppler.whatis.p3": "<strong>Why QA matters:</strong> Studies show that uncalibrated ultrasound systems can produce velocity measurement errors of 10-20%, potentially leading to misdiagnosis of conditions like carotid stenosis or cardiac valve disease. Regular QA testing with calibrated phantoms ensures your clinical measurements remain within acceptable accuracy limits.",
    "doppler.whatis.diagram.title": "Ultrasound QA Program Components",
    "doppler.whatis.step1.title": "Doppler Velocity Verification",
    "doppler.whatis.step1.desc": "Verify blood flow velocity accuracy using calibrated string phantoms",
    "doppler.whatis.step2.title": "Image Quality Assessment",
    "doppler.whatis.step2.desc": "Test spatial resolution, contrast, uniformity with tissue phantoms",
    "doppler.whatis.step3.title": "Transducer Performance",
    "doppler.whatis.step3.desc": "Evaluate probe sensitivity, dead elements, and acoustic output",
    "doppler.whatis.step4.title": "Documentation & Compliance",
    "doppler.whatis.step4.desc": "Maintain records for ACR, IAC, ICAVL, Joint Commission audits",
    "doppler.product.tag": "Our Products",
    "doppler.product.title": "Mark V Doppler Phantom",
    "doppler.product.desc": "The industry standard for Doppler velocity calibration and ultrasound quality assurance. Trusted by clinical facilities, OEM manufacturers, and research institutions worldwide.",
    "doppler.features.range.title": "Clinical Velocity Range",
    "doppler.features.range.desc": "10-200 cm/s covers all clinical blood flow velocities from venous flow to peak arterial systole, supporting vascular, cardiac, obstetric, and transcranial Doppler QA.",
    "doppler.features.accuracy.title": "NIST-Traceable Accuracy",
    "doppler.features.accuracy.desc": "±1% velocity accuracy with Certificate of Calibration traceable to National Institute of Standards and Technology—essential for regulatory compliance.",
    "doppler.features.compliance.title": "Compliance Ready",
    "doppler.features.compliance.desc": "Designed to meet ACR, IAC, ICAVL, AIUM, and Joint Commission ultrasound QA requirements. Export documentation in accreditation-ready formats.",
    "doppler.features.setup.title": "5-Minute Setup",
    "doppler.features.setup.desc": "No blood-mimicking fluid preparation, temperature stabilization, or complex alignment. Rapid setup maximizes QA testing efficiency.",
    "doppler.features.angles.title": "Multi-Angle Testing",
    "doppler.features.angles.desc": "Verify Doppler angle correction accuracy at 30°, 45°, and 60° angles using integrated positioning guides—critical for proper velocity calculation.",
    "doppler.features.export.title": "USB Data Export",
    "doppler.features.export.desc": "Export calibration results in PDF and CSV formats. Integrate with QA management systems for streamlined documentation and audit trails.",
    "doppler.compliance.tag": "Regulatory Compliance",
    "doppler.compliance.title": "Ultrasound Compliance & Accreditation",
    "doppler.compliance.desc": "Meet the quality assurance requirements of major accrediting bodies and regulatory agencies with documented Doppler velocity calibration.",
    "doppler.compliance.row1": "Annual Doppler QA required",
    "doppler.compliance.row2": "Echo & Vascular standards",
    "doppler.compliance.row3": "Velocity accuracy verification",
    "doppler.compliance.row4": "Equipment management standards",
    "doppler.compliance.row5": "Quality System Regulation",
    "doppler.compliance.row6": "Ultrasound field characterization",
    "doppler.compliance.row7": "Practice guidelines compliance",
    "doppler.compliance.row8": "Medical device QMS",
    "doppler.compliance.cta": "Get Compliance Support",
    "doppler.compliance.doclabel": "Accreditation-Ready Documentation",
    "doppler.services.tag": "Professional Services",
    "doppler.services.title": "Ultrasound Calibration Services",
    "doppler.services.desc": "Comprehensive NIST-traceable calibration services for Doppler ultrasound equipment. Supporting clinical facilities, OEM manufacturers, and research institutions with expert quality assurance.",
    "doppler.services.onsite.title": "On-Site Calibration",
    "doppler.services.onsite.desc": "Our technicians come to your facility with calibrated reference equipment. Minimize downtime while ensuring your ultrasound systems meet accuracy specifications.",
    "doppler.services.depot.title": "Depot Calibration",
    "doppler.services.depot.desc": "Ship your phantom to our ISO 17025-compliant laboratory for comprehensive calibration. 5-7 business day turnaround with detailed certification documentation.",
    "doppler.services.accreditation.title": "Accreditation Support",
    "doppler.services.accreditation.desc": "Complete documentation packages for ACR, IAC, ICAVL, and Joint Commission audits. QA protocol templates and compliance consulting available.",
    "doppler.services.recert.title": "Annual Recertification",
    "doppler.services.recert.desc": "Keep your phantom NIST-traceable with annual recertification services. Maintain compliance with accreditation requirements and ensure ongoing accuracy.",
    "doppler.services.training.title": "QA Training",
    "doppler.services.training.desc": "On-site training for your sonographers and QA staff. Learn proper phantom operation, testing protocols, and documentation procedures.",
    "doppler.services.emergency.title": "Emergency Service",
    "doppler.services.emergency.desc": "48-hour expedited calibration available for urgent needs. Don't let equipment issues delay your accreditation or patient care.",
    "doppler.research.tag": "Beyond Clinical",
    "doppler.research.title": "Production & Research Applications",
    "doppler.research.desc": "Our doppler phantoms serve critical roles in ultrasound manufacturing quality control, academic research, and medical device development.",
    "doppler.research.oem.title": "OEM Manufacturing QA",
    "doppler.research.oem.desc": "Ultrasound manufacturers rely on our phantoms for production line testing and final QA verification. Ensure every unit shipped meets Doppler velocity specifications with NIST-traceable reference standards. Support ISO 13485 and FDA 21 CFR Part 820 compliance.",
    "doppler.research.rnd.title": "R&D and Product Development",
    "doppler.research.rnd.desc": "Develop and validate new Doppler algorithms, signal processing techniques, and imaging modalities. Our phantoms provide the consistent, repeatable velocity references needed for quantitative research and regulatory submissions.",
    "doppler.research.academic.title": "Academic Research",
    "doppler.research.academic.desc": "Universities and research institutions use our phantoms for hemodynamic studies, cardiovascular imaging research, and sonography education. Published velocity accuracy data supports peer-reviewed research credibility.",
    "doppler.research.service.title": "Service Organizations",
    "doppler.research.service.desc": "Biomedical equipment service companies use our phantoms for post-repair verification and preventive maintenance testing. Demonstrate to customers that repaired equipment meets original performance specifications.",
    "doppler.apps.tag": "Clinical Applications",
    "doppler.apps.title": "Blood Flow Velocity Calibration",
    "doppler.apps.desc": "Essential for any facility performing Doppler ultrasound examinations where verified blood flow velocity accuracy impacts patient diagnosis and treatment.",
    "doppler.apps.vascular.title": "Vascular Laboratory QA",
    "doppler.apps.vascular.desc": "Verify carotid artery velocity measurements critical for stenosis grading per NASCET/ECST criteria. Ensure peripheral arterial and venous Doppler accuracy for DVT diagnosis and arterial disease assessment.",
    "doppler.apps.echo.title": "Echocardiography",
    "doppler.apps.echo.desc": "Validate transmitral and transaortic flow velocities for cardiac output calculations. Essential for accurate E/A ratio, valve gradient measurements, and hemodynamic assessments per ASE guidelines.",
    "doppler.apps.ob.title": "Obstetric Doppler",
    "doppler.apps.ob.desc": "Calibrate umbilical artery and middle cerebral artery measurements. Accurate velocities and ratios are critical for fetal well-being assessment, IUGR detection, and high-risk pregnancy monitoring.",
    "doppler.apps.tcd.title": "Transcranial Doppler",
    "doppler.apps.tcd.desc": "Verify TCD velocity accuracy for stroke risk assessment, vasospasm monitoring in SAH patients, brain death determination protocols, and sickle cell disease screening programs.",
    "doppler.apps.acceptance.title": "Equipment Acceptance Testing",
    "doppler.apps.acceptance.desc": "Baseline Doppler calibration for new ultrasound system installation. Verify performance meets manufacturer specifications before clinical use—essential for capital equipment validation.",
    "doppler.apps.compliance.title": "Accreditation Compliance",
    "doppler.apps.compliance.desc": "Meet ACR, IAC, ICAVL, and Joint Commission ultrasound accreditation requirements with documented Doppler velocity calibration and comprehensive QA protocols.",
    "doppler.specs.tag": "Technical Details",
    "doppler.specs.title": "Mark V Specifications",
    "doppler.specs.desc": "Engineered to meet the demanding requirements of clinical ultrasound QA and regulatory compliance testing.",
    "doppler.specs.velocity.title": "Velocity Performance",
    "doppler.specs.velocity.desc": "<strong>Range:</strong> 10 – 200 cm/s<br><strong>Accuracy:</strong> ±1% of reading<br><strong>Resolution:</strong> 0.1 cm/s<br><strong>Stability:</strong> ±0.5% over 8 hours",
    "doppler.specs.physical.title": "Physical Specifications",
    "doppler.specs.physical.desc": "<strong>Dimensions:</strong> 45 × 25 × 18 cm<br><strong>Weight:</strong> 5.2 kg (11.5 lbs)<br><strong>String:</strong> 0.1mm nylon monofilament<br><strong>Tank:</strong> Degassed water bath",
    "doppler.specs.acoustic.title": "Acoustic Properties",
    "doppler.specs.acoustic.desc": "<strong>Window:</strong> TPX membrane 60×120mm<br><strong>Probe Compatibility:</strong> 2-15 MHz<br><strong>Doppler Angles:</strong> 30°, 45°, 60° guides<br><strong>Depth:</strong> 2-8 cm adjustable",
    "doppler.specs.standards.title": "Compliance & Standards",
    "doppler.specs.standards.desc": "<strong>Standards:</strong> IEC 62359, FDA QSR<br><strong>Power:</strong> 100-240V AC, 50/60Hz<br><strong>Certifications:</strong> CE marked<br><strong>Warranty:</strong> 2 years comprehensive",
    "doppler.faq.tag": "Common Questions",
    "doppler.faq.title": "Ultrasound QA FAQ",
    "doppler.faq.q1": "How often should Doppler ultrasound equipment be calibrated?",
    "doppler.faq.a1": "The American College of Radiology (ACR) and Intersocietal Accreditation Commission (IAC) recommend Doppler velocity verification at least annually. Many accredited vascular laboratories perform quarterly calibration checks as part of their quality assurance program. Additional testing is recommended after equipment service, software updates, transducer replacement, or any time measurement accuracy is questioned.",
    "doppler.faq.q2": "What accreditation standards require ultrasound QA testing?",
    "doppler.faq.a2": "Multiple accrediting bodies require documented ultrasound quality assurance programs: <strong>ACR</strong> (American College of Radiology) requires annual phantom testing; <strong>IAC</strong> (Intersocietal Accreditation Commission) covers echocardiography and vascular testing; <strong>ICAVL</strong> (Intersocietal Commission for the Accreditation of Vascular Laboratories) requires velocity accuracy verification; <strong>The Joint Commission</strong> mandates equipment management and QA programs; and <strong>AIUM</strong> (American Institute of Ultrasound in Medicine) publishes practice guidelines. Our phantom and documentation support all these standards.",
    "doppler.faq.q3": "What is the difference between a string phantom and a flow phantom?",
    "doppler.faq.a3": "String phantoms use a moving filament at precisely controlled velocities, eliminating variables like blood-mimicking fluid temperature, viscosity, and particle concentration. This provides more consistent, reproducible calibration results with minimal maintenance. Flow phantoms with blood-mimicking fluid can better simulate certain acoustic properties like scattering, but require temperature control, regular fluid replacement, and more complex setup. For Doppler velocity calibration, string phantoms offer superior accuracy and practicality.",
    "doppler.faq.q4": "Is the Mark V compatible with my ultrasound system?",
    "doppler.faq.a4": "Yes. The Mark V Doppler Phantom is compatible with all diagnostic ultrasound systems with Doppler capability, including GE, Philips, Siemens, Canon (Toshiba), Samsung, Fujifilm, Mindray, and other manufacturers. The 2-15 MHz probe compatibility covers virtually all clinical transducers used in vascular, cardiac, obstetric, and general imaging applications.",
    "doppler.faq.q5": "What blood flow velocities can I test?",
    "doppler.faq.a5": "The Mark V covers 10-200 cm/s, spanning the full range of clinical blood flow velocities: venous flow (10-30 cm/s), normal arterial flow (30-100 cm/s), and peak systolic velocities in stenotic vessels or cardiac applications (up to 200 cm/s and beyond). This range supports carotid stenosis grading, peripheral vascular assessment, cardiac valve evaluation, obstetric Doppler, and transcranial Doppler applications.",
    "doppler.faq.q6": "How does NIST-traceable calibration work?",
    "doppler.faq.a6": "NIST-traceable calibration means our phantom's velocity accuracy can be documented through an unbroken chain of comparisons back to the National Institute of Standards and Technology. Each Mark V ships with a Certificate of Calibration showing measurement uncertainty and traceability. Annual recertification maintains this traceability—essential for regulatory compliance and accreditation audits.",
    "doppler.faq.q7": "What documentation is provided for accreditation?",
    "doppler.faq.a7": "Each Mark V ships with a Certificate of Calibration traceable to NIST standards. The unit exports test results in PDF and CSV formats compatible with ACR, IAC, ICAVL, and Joint Commission accreditation requirements. We also provide template QA protocols, testing procedure documentation, and guidance for laboratory accreditation submissions. Our support team can assist with specific accreditation documentation requirements.",
    "doppler.faq.q8": "Do you support OEM and research applications?",
    "doppler.faq.a8": "Yes. We supply doppler phantoms to ultrasound OEM manufacturers for production testing and QA, to medical device developers for R&D and regulatory submissions, and to academic institutions for research and education. Volume pricing and custom configurations are available for OEM and institutional customers. Contact us to discuss your specific requirements.",
    // HIFU Page
    "hifu.hero.badge": "Complete HIFU Driving System",
    "hifu.hero.title": "HIFU RF<br><em>Power System</em>",
    "hifu.hero.subtitle": "A complete, ready-to-use HIFU driving system—just add your transducer. Frequency generator, precision timing circuits, power amplifier, safety systems, and full system control all integrated in one unit. Simple ASCII commands via a single USB port. Power on and start treating.",
    "hifu.hero.cta2": "View Specifications",
    "hifu.trust.usb": "USB Port",
    "hifu.trust.allinone.num": "All-in-One",
    "hifu.trust.allinone.label": "Complete System",
    "hifu.trust.power": "Max Power",
    "hifu.whatis.tag": "Understanding HIFU Technology",
    "hifu.whatis.title": "What is High-Intensity Focused Ultrasound?",
    "hifu.whatis.lead": "High-Intensity Focused Ultrasound (HIFU) is a non-invasive therapeutic technique that uses focused acoustic energy to precisely heat and ablate tissue deep within the body—without incisions or radiation.",
    "hifu.whatis.p1": "<strong>A complete system, not just an amplifier:</strong> Our HIFU RF Power System integrates everything you need to drive your transducer: precision frequency generator, timing and gating circuits, high-power RF amplifier, comprehensive safety systems, and full digital control. Just connect your transducer and you're ready to go.",
    "hifu.whatis.p2": "<strong>Simple USB control:</strong> No complex interfaces or proprietary software. Send simple ASCII text commands through a single USB port to control frequency, power, pulse timing, and all system functions. Works with any programming language or terminal program. Full documentation included.",
    "hifu.whatis.p3": "<strong>Built-in safety:</strong> VSWR protection, over-temperature shutdown, arc detection, and hardware interlocks are all integrated. Focus on your application—the safety systems handle the rest.",
    "hifu.whatis.diagram.title": "What's Included",
    "hifu.whatis.step1.title": "Frequency Generator",
    "hifu.whatis.step1.desc": "Precision DDS synthesis, 0.5-7 MHz range",
    "hifu.whatis.step2.title": "Timing & Gating Circuits",
    "hifu.whatis.step2.desc": "Programmable pulse control, <10 μs response",
    "hifu.whatis.step3.title": "RF Power Amplifier",
    "hifu.whatis.step3.desc": "Up to 500W continuous, impedance matched",
    "hifu.whatis.step4.title": "Safety Systems",
    "hifu.whatis.step4.desc": "VSWR, thermal, arc protection & interlocks",
    "hifu.whatis.step5.title": "USB Control Interface",
    "hifu.whatis.step5.desc": "Simple ASCII commands, works with any software",
    "hifu.whatis.diagram.footer": "You provide: Your transducer",
    "hifu.features.tag": "Complete System Features",
    "hifu.features.title": "Everything You Need, Integrated",
    "hifu.features.desc": "A turnkey HIFU driving solution—connect your transducer, plug in USB, and you're ready. No external signal generators, amplifiers, or control systems required.",
    "hifu.features.power.title": "High Power Output",
    "hifu.features.power.desc": "Up to 500W continuous wave (CW) or pulsed output. Scalable configurations from 100W to multi-kilowatt systems for different clinical applications.",
    "hifu.features.freq.title": "Wide Frequency Range",
    "hifu.features.freq.desc": "0.5 MHz to 7 MHz covers all HIFU applications—from deep tissue ablation (0.5-1 MHz) to superficial aesthetic treatments (3-7 MHz).",
    "hifu.features.array.title": "Multi-Channel Arrays",
    "hifu.features.array.desc": "Support for phased array transducers with up to 256 independently controlled channels. Electronic beam steering and focal point adjustment.",
    "hifu.features.response.title": "Fast Response Time",
    "hifu.features.response.desc": "<10 μs rise/fall times for precise pulsed operation. Real-time power control for temperature-guided therapy and motion tracking.",
    "hifu.features.safety.title": "Built-in Safety Systems",
    "hifu.features.safety.desc": "VSWR protection, over-temperature shutdown, and arc detection. Hardware interlocks and software limits ensure safe operation.",
    "hifu.features.control.title": "Simple ASCII Control",
    "hifu.features.control.desc": "One USB port. Simple ASCII text commands. Control frequency, power, timing—everything—from any terminal or programming language. No proprietary software needed.",
    "hifu.apps.tag": "Clinical & Research Applications",
    "hifu.apps.title": "HIFU Applications",
    "hifu.apps.desc": "Our RF power generators support the full spectrum of focused ultrasound applications—from life-saving tumor ablation to cutting-edge research.",
    "hifu.apps.oncology.title": "Oncology & Tumor Ablation",
    "hifu.apps.oncology.desc": "Non-invasive treatment of solid tumors in prostate, liver, breast, kidney, and bone. HIFU offers an alternative to surgery for patients who are not surgical candidates. The 2024 oncology segment represents 41% of the global HIFU market, with FDA-cleared systems like Focal One® driving adoption.",
    "hifu.apps.neuro.title": "Neurology & Brain Therapy",
    "hifu.apps.neuro.desc": "MRI-guided focused ultrasound for essential tremor, Parkinson's disease tremor, and neuropathic pain. HIFU can create precise lesions in deep brain structures without opening the skull—a breakthrough alternative to invasive neurosurgery. Our MRI-compatible generators enable integration with MRgFUS platforms.",
    "hifu.apps.aesthetic.title": "Aesthetic & Cosmetic",
    "hifu.apps.aesthetic.desc": "Non-invasive skin tightening, wrinkle reduction, and body contouring. Higher frequency HIFU (3-7 MHz) targets the SMAS layer and subcutaneous fat for cosmetic improvement without surgery. The aesthetic HIFU segment is the fastest-growing market, driven by consumer demand for minimally invasive treatments.",
    "hifu.apps.rnd.title": "Research & Development",
    "hifu.apps.rnd.desc": "Flexible configurations for academic and industrial R&D. Develop new HIFU applications, validate treatment protocols, and characterize transducer performance. Our generators support the full research cycle from bench experiments to preclinical studies and regulatory submissions.",
    "hifu.apps.oem.title": "OEM System Integration",
    "hifu.apps.oem.desc": "Designed for integration into commercial HIFU systems. Compact form factor, comprehensive API, and regulatory documentation support FDA 510(k) and CE marking submissions. Volume pricing and design-in support for OEM partnerships.",
    "hifu.apps.drug.title": "Drug Delivery & Sonoporation",
    "hifu.apps.drug.desc": "Low-intensity pulsed HIFU for enhanced drug delivery, blood-brain barrier opening, and sonodynamic therapy research. Precise pulse control enables investigation of bioeffects beyond thermal ablation.",
    "hifu.specs.tag": "Technical Details",
    "hifu.specs.title": "Complete System Specifications",
    "hifu.specs.desc": "All-in-one system includes frequency generator, timing circuits, amplifier, safety systems, and USB control. Just connect your transducer.",
    "hifu.specs.row1.label": "Frequency Range",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "Frequency Stability",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "Output Power (CW)",
    "hifu.specs.row3.value": "100W / 250W / 500W models",
    "hifu.specs.row4.label": "Output Power (Pulsed)",
    "hifu.specs.row4.value": "Up to 1000W peak",
    "hifu.specs.row5.label": "Power Resolution",
    "hifu.specs.row5.value": "0.1W (digital control)",
    "hifu.specs.row6.label": "Rise/Fall Time",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "Duty Cycle",
    "hifu.specs.row7.value": "0-100% (CW or pulsed)",
    "hifu.specs.row8.label": "Output Impedance",
    "hifu.specs.row8.value": "50Ω nominal",
    "hifu.specs.row9.label": "VSWR Protection",
    "hifu.specs.row9.value": "Auto-shutdown at 3:1",
    "hifu.specs.row10.label": "Control Interface",
    "hifu.specs.row10.value": "USB (ASCII commands)",
    "hifu.specs.row11.label": "Cooling",
    "hifu.specs.row11.value": "Forced air / Water options",
    "hifu.specs.row12.label": "MRI Compatibility",
    "hifu.specs.row12.value": "Optional shielded version",
    "hifu.specs.cta": "Request Full Specifications",
    "hifu.specs.avail": "Available: 100W, 250W, 500W Models",
    "hifu.why.tag": "Why JJ&A Instruments",
    "hifu.why.title": "The HIFU Generator Advantage",
    "hifu.why.desc": "Purpose-built for therapeutic ultrasound with the reliability and support that medical device developers demand.",
    "hifu.why.quality.title": "Medical-Grade Quality",
    "hifu.why.quality.desc": "ISO 13485 certified manufacturing. Designed and documented to support FDA 510(k) and CE marking submissions for your HIFU system.",
    "hifu.why.support.title": "Applications Engineering",
    "hifu.why.support.desc": "Our RF engineers understand HIFU applications. Get expert support for transducer matching, thermal management, and system integration.",
    "hifu.why.global.title": "Global Availability",
    "hifu.why.global.desc": "Worldwide shipping with local support in North America, Europe, and Asia-Pacific. Evaluation units available for qualified projects.",
    "hifu.why.api.title": "Comprehensive APIs",
    "hifu.why.api.desc": "Full software control via documented APIs. LabVIEW VIs, Python libraries, and C/C++ SDK included. Rapid integration with your control system.",
    "hifu.why.longterm.title": "Long-Term Support",
    "hifu.why.longterm.desc": "5-year product availability guarantee. Extended warranty options. Calibration and maintenance services to keep your system running.",
    "hifu.why.custom.title": "Custom Configurations",
    "hifu.why.custom.desc": "Need a specific frequency, power level, or form factor? Our engineering team can customize generators for your unique requirements.",
    "hifu.faq.tag": "Common Questions",
    "hifu.faq.title": "HIFU Generator FAQ",
    "hifu.faq.q1": "What is HIFU and how does it work?",
    "hifu.faq.a1": "High-Intensity Focused Ultrasound (HIFU) uses focused acoustic energy to heat and destroy targeted tissue non-invasively. An RF power generator drives piezoelectric transducers that convert electrical energy into ultrasound waves. These waves are focused to a precise point in the body—like sunlight through a magnifying glass—where temperatures reach 60-85°C, causing thermal ablation of the target tissue while sparing surrounding structures.",
    "hifu.faq.q2": "What frequency should I use for my HIFU application?",
    "hifu.faq.a2": "Frequency selection depends on treatment depth and target tissue. <strong>Lower frequencies (0.5-1 MHz)</strong> penetrate deeper (up to 15 cm) and are used for tumor ablation in liver, kidney, and prostate. <strong>Mid-range frequencies (1-3 MHz)</strong> are common for neurological HIFU and general therapeutic applications. <strong>Higher frequencies (3-7 MHz)</strong> provide precise, shallow penetration for aesthetic treatments targeting skin layers. Our team can help you select the optimal frequency for your specific application.",
    "hifu.faq.q3": "Is the generator compatible with MRI environments?",
    "hifu.faq.a3": "Yes. We offer MRI-compatible versions with EMI shielding and non-magnetic construction for MR-guided Focused Ultrasound (MRgFUS) applications. These generators can operate inside the MRI suite without interfering with imaging. The shielded version has been validated at 1.5T and 3T field strengths. Contact us to discuss your specific MRI integration requirements.",
    "hifu.faq.q4": "Can the generator drive phased array transducers?",
    "hifu.faq.a4": "Yes. We offer multi-channel configurations with up to 256 independently controlled channels for phased array transducers. Each channel provides individual amplitude and phase control for electronic beam steering and focal point adjustment. Multi-channel systems include synchronization features for coherent operation. Single-element and annular array transducers are also fully supported.",
    "hifu.faq.q5": "What safety features are included?",
    "hifu.faq.a5": "Safety is built into every generator: <strong>VSWR protection</strong> automatically reduces power if reflected power exceeds safe limits (prevents transducer damage). <strong>Over-temperature protection</strong> monitors internal temperatures and shuts down before overheating. <strong>Arc detection</strong> instantly cuts power if arcing is detected in the RF path. <strong>Hardware interlocks</strong> support external safety switches and emergency stops. <strong>Software limits</strong> allow you to define application-specific power and duration limits.",
    "hifu.faq.q6": "What regulatory documentation is available?",
    "hifu.faq.a6": "We provide comprehensive documentation to support your regulatory submissions: <strong>Design history file</strong> including specifications, test reports, and traceability. <strong>Risk analysis</strong> per ISO 14971. <strong>EMC test reports</strong> per IEC 60601-1-2. <strong>Electrical safety testing</strong> per IEC 60601-1. <strong>Certificates</strong> of conformance and calibration. Our regulatory affairs team can assist with FDA 510(k) and CE marking questions.",
    "hifu.faq.q7": "Do you support OEM integration and custom configurations?",
    "hifu.faq.a7": "Yes. We work closely with HIFU system developers on OEM projects: <strong>Custom frequencies</strong> matched to your transducer. <strong>Modified form factors</strong> for integration into your system enclosure. <strong>Custom interfaces</strong> and control protocols. <strong>Private labeling</strong> available. <strong>Volume pricing</strong> for production quantities. We can also provide design-in support, prototypes, and engineering samples for evaluation.",
    "hifu.faq.q8": "What is the warranty and support policy?",
    "hifu.faq.a8": "Standard warranty is 2 years covering parts and labor. Extended warranty options up to 5 years are available. Support includes: <strong>Phone and email technical support</strong> during business hours. <strong>Remote diagnostics</strong> via network connection. <strong>Repair and calibration services</strong> at our facility. <strong>Loaner units</strong> available for qualified customers during repairs. <strong>On-site service</strong> available for an additional fee.",
    "hifu.contact.desc": "Ready to power your HIFU application? Contact us for pricing, specifications, or to discuss your project requirements with our engineering team.",
    "footer.applications": "Applications",
    "hifu.apps.oncology.short": "Tumor Ablation",
    "hifu.apps.neuro.short": "Neurology",
    "hifu.apps.aesthetic.short": "Aesthetics",
    "hifu.apps.rnd.short": "Research",
    "nav.compliance": "QA & Compliance",
    "footer.recertification": "Phantom Recertification",
    "nav.faq": "FAQ",
    "footer.docs": "Technical Documents",
    "footer.protocols": "QA Protocols",
    "nav.specs": "Specifications",
    "nav.home": "Home",
    "footer.desc": "用于诊断QA和治疗应用的精密超声设备。受到全球医疗保健提供者和研究人员的信赖。",
    "footer.accessories": "配件",
    "footer.parts": "替换零件",
    "footer.descDoppler": "用于医学超声质量保证、法规合规和研究应用的精密多普勒模体和超声校准服务。",
    "footer.oemResearch": "OEM与研究",

    // Navigation - Additional
    "nav.calibration": "校准服务",
    "nav.applications": "应用",

    // Aria Labels for Accessibility
    "aria.mainNav": "主导航",
    "aria.home": "JJ&A Instruments 首页",
    "aria.toggleMenu": "切换菜单",
    "aria.selectLang": "选择语言",
    "aria.contactForm": "联系表单",
    "aria.footerNav": "页脚导航",

    // Placeholders
    "placeholder.comment": "分享您的想法...",
    "placeholder.message": "告诉我们您的项目、需求或问题...",
    "placeholder.messageDoppler": "告诉我们您的超声QA需求、认证要求或研究应用...",

    // Contact Form Options - Index page
    "contact.option.doppler": "Mark V 多普勒模体",
    "contact.option.hifu": "HIFU射频功率发生器",
    "contact.option.calibration": "校准服务",
    "contact.option.oem": "OEM合作",
    "contact.option.custom": "定制工程",
    "contact.option.general": "一般咨询",

    // Contact Form Options - Doppler page
    "contact.option.phantomQuote": "Mark V 多普勒模体报价",
    "contact.option.calibrationService": "超声校准服务",
    "contact.option.qaCompliance": "QA与合规支持",
    "contact.option.oemResearch": "OEM/研究应用",
    "contact.option.recertification": "模体再认证",

    // Contact Form Options - HIFU page
    "contact.option.hifuQuote": "HIFU射频发生器报价",
    "contact.option.hifuSpecs": "技术规格",
    "contact.option.hifuCustom": "定制配置",
    "contact.option.hifuResearch": "研究应用",
    "contact.option.hifuEval": "评估样机",

    // Placeholder - HIFU page
    "placeholder.messageHifu": "告诉我们您的HIFU应用、目标频率、功率要求或集成需求...",
  },

  ja: {
    // Meta
    "meta.title": "JJ&A Instruments | 精密超音波機器・校正サービス",

    // Navigation
    "nav.products": "製品",
    "nav.services": "サービス",
    "nav.industries": "産業",
    "nav.blog": "ブログ",
    "nav.about": "会社概要",
    "nav.contact": "お問い合わせ",
    "nav.doppler": "Mark V ドップラーファントム",
    "nav.hifu": "HIFU RF パワージェネレーター",
    "nav.quote": "見積もり依頼",

    // Doppler Page Hero
    "hero.badge": "医療用超音波品質保証ソリューション",
    "hero.title": "ドップラーファントム＆<br><em>超音波QA</em>",
    "hero.subtitle": "医療用超音波品質保証のゴールドスタンダード。Mark Vドップラーファントムは、臨床QAプログラム、規制遵守、研究用途にNISTトレーサブルな精度を提供します。世界中の病院、OEMメーカー、学術機関から信頼されています。",
    "hero.cta1": "見積もり依頼",
    "hero.cta2": "QAとコンプライアンス",

    // Trust badges
    "trust.compliant": "準拠",
    "trust.accuracy": "精度",
    "trust.traceable": "トレーサブル",

    // Home Hero Section
    "home.hero.badge": "精密超音波技術",
    "home.hero.title": "医療用<br><em>超音波イノベーション</em>の推進",
    "home.hero.subtitle": "JJ&A Instrumentsは、診断QAおよび治療用アプリケーション向けの精密超音波機器を設計・製造しています。ドップラーファントムからHIFU RFパワージェネレーターまで、医療従事者、研究者、OEMに信頼性の高い高性能ソリューションを提供しています。",
    "home.hero.cta1": "製品を見る",
    "home.hero.cta2": "営業に連絡",
    "home.hero.years": "年の実績",
    "home.hero.countries": "カ国で導入",
    "home.hero.certified": "認証取得",
    "home.hero.scroll": "スクロールして探索",

    // Products Section
    "products.tag": "製品紹介",
    "products.title": "精密超音波ソリューション",
    "products.desc": "診断品質保証から高強度治療システムまで、超音波アプリケーションの全領域をカバーする2つの製品ライン。",
    "products.doppler.tag": "診断QA",
    "products.doppler.title": "Mark V ドップラーファントム",
    "products.doppler.desc": "ドップラー超音波速度校正のゴールドスタンダード。臨床QA、規制遵守、認定要件に対応するNISTトレーサブル精度。",
    "products.doppler.feature1": "10-200 cm/s速度範囲",
    "products.doppler.feature2": "±1% NISTトレーサブル精度",
    "products.doppler.feature3": "ACR、IAC、ICAVL準拠",
    "products.doppler.feature4": "5分セットアップ",
    "products.hifu.tag": "治療用HIFU",
    "products.hifu.title": "HIFU RF パワージェネレーター",
    "products.hifu.desc": "集束超音波トランスデューサー駆動用の高性能RFパワーアンプ。HIFUシステムOEM、研究者、治療デバイス開発者に最適。",
    "products.hifu.feature1": "0.5-7 MHz周波数範囲",
    "products.hifu.feature2": "最大500W出力",
    "products.hifu.feature3": "MRI対応オプション",
    "products.hifu.feature4": "マルチチャンネルアレイ対応",
    "products.learnmore": "詳細を見る",
    "products.getquote": "見積もり依頼",

    // Services Section
    "services.tag": "サービス",
    "services.title": "包括的なサポート",
    "services.desc": "機器だけでなく、校正、コンプライアンスコンサルティング、技術サポートを提供し、製品ライフサイクル全体で最適なパフォーマンスを確保します。",
    "services.calibration.title": "校正サービス",
    "services.calibration.desc": "ドップラーファントムと超音波機器のNISTトレーサブル校正。年次または半年ごとのサービスプランで精度とコンプライアンスを維持。",
    "services.consulting.title": "コンプライアンスコンサルティング",
    "services.consulting.desc": "ACR、IAC、ICAVL認定要件に関する専門家によるガイダンス。コンプライアントなQAプログラムの開発・維持をサポート。",
    "services.custom.title": "カスタムエンジニアリング",
    "services.custom.desc": "お客様独自の研究や製造要件に合わせたカスタムファントム構成とRFジェネレーター仕様。",
    "services.oem.title": "OEMパートナーシップ",
    "services.oem.desc": "当社技術を製品ラインに統合する超音波機器メーカー向けのホワイトラベルソリューションとボリューム価格。",
    "services.global.title": "グローバルサポート",
    "services.global.desc": "世界規模の出荷とサポートネットワーク。北米、欧州、アジア太平洋地域の現地サービスパートナー。",
    "services.emergency.title": "緊急対応",
    "services.emergency.desc": "重要な校正ニーズに対する48時間迅速サービス。認定期限と機器故障への優先サポート。",

    // Industries Section
    "industries.tag": "対象産業",
    "industries.title": "医療分野で信頼される存在",
    "industries.desc": "当社のソリューションは、世界中の多様な医療・研究機関にサービスを提供しています。",
    "industries.hospitals.title": "病院・クリニック",
    "industries.hospitals.desc": "診断画像部門に信頼性の高いQA機器を提供。",
    "industries.research.title": "研究機関",
    "industries.research.desc": "超音波治療・診断における画期的な発見を支援。",
    "industries.oem.title": "OEMメーカー",
    "industries.oem.desc": "超音波デバイス製造向けのコンポーネントとシステムを提供。",
    "industries.regulatory.title": "規制機関",
    "industries.regulatory.desc": "機器認証と規格適合性試験をサポート。",

    // Blog Section
    "blog.tag": "インサイト＆アップデート",
    "blog.title": "ブログ＆リソース",
    "blog.desc": "超音波品質保証、HIFU技術、コンプライアンス更新、業界ベストプラクティスに関する専門記事。",
    "blog.allposts": "すべての記事",
    "blog.loading": "記事を読み込み中...",
    "blog.back": "記事一覧に戻る",
    "blog.comments": "コメント",
    "blog.leavecomment": "コメントを残す",
    "blog.name": "名前 *",
    "blog.email": "メール *（非公開）",
    "blog.comment": "コメント *",
    "blog.postcomment": "コメントを投稿",
    "blog.nocomments": "まだコメントはありません。最初に意見を共有してください！",
    "blog.reply": "返信",
    "blog.replyingto": "返信先",
    "blog.cancel": "キャンセル",

    // About Section
    "about.tag": "JJ&A Instrumentsについて",
    "about.title": "1998年以来の卓越したエンジニアリング",
    "about.desc1": "25年以上にわたり、JJ&A Instrumentsは超音波技術革新の最前線に立ってきました。カリフォルニア州サンディエゴを拠点に、深い技術専門知識と品質へのコミットメントを組み合わせ、世界中の医療機関から信頼されるパートナーとなっています。",
    "about.desc2": "臨床および産業用アプリケーションのバックグラウンドを持つ超音波エンジニアによって設立され、医療機器の品質保証と治療用超音波システムの厳格な要件を理解しています。",
    "about.desc3": "当社のチームは、RF工学、音響物理学、規制コンプライアンスの深い専門知識を組み合わせ、最高の精度と信頼性の基準を満たす製品を提供しています。",
    "about.desc2": "Founded by ultrasound engineers with backgrounds in both clinical and industrial applications, we understand the rigorous demands of medical device quality assurance and therapeutic ultrasound systems.",
    "about.desc3": "Our team combines deep expertise in RF engineering, acoustic physics, and regulatory compliance to deliver products that meet the highest standards of accuracy and reliability.",
    "about.desc2": "当社のエンジニアと科学者のチームは、超音波校正と治療アプリケーションの可能性を絶えず広げ、お客様が最も正確で信頼性の高い機器にアクセスできるようにしています。",
    "about.stat1.number": "5,000+",
    "about.stat1.label": "導入台数",
    "about.stat2.number": "100+",
    "about.stat2.label": "OEMパートナー",
    "about.stat3.number": "24/7",
    "about.stat3.label": "24時間サポート",
    "about.cert.title": "認証と規格",
    "about.cert1": "ISO 13485",
    "about.cert1.desc": "医療機器QMS",
    "about.cert2": "CE Marked",
    "about.cert2.desc": "欧州適合",
    "about.cert3": "FDA Registered",
    "about.cert3.desc": "米国食品医薬品局",
    "about.cert4": "トレーサブル",
    "about.cert4.desc": "NISTトレーサブル校正",

    // Contact Section
    "contact.tag": "お問い合わせ",
    "contact.title": "お問い合わせ",
    "contact.desc": "超音波機器のニーズについてご相談ください。製品選択、カスタム構成、技術的な質問についてサポートいたします。",
    "contact.call": "お電話",
    "contact.email": "メール",
    "contact.hq": "本社",
    "contact.name": "氏名 *",
    "contact.workemail": "勤務先メール *",
    "contact.org": "組織名 *",
    "contact.phone": "電話番号",
    "contact.interest": "ご興味のある内容：",
    "contact.interest.doppler": "Mark V ドップラーファントム",
    "contact.interest.hifu": "HIFU RF パワージェネレーター",
    "contact.interest.calibration": "校正サービス",
    "contact.interest.oem": "OEMパートナーシップ",
    "contact.interest.custom": "カスタムエンジニアリング",
    "contact.interest.general": "一般的なお問い合わせ",
    "contact.message": "メッセージ",
    "contact.messagePlaceholder": "プロジェクト、要件、質問についてお聞かせください...",
    "contact.submit": "送信",
    "contact.success": "お問い合わせありがとうございます！",
    "contact.response": "1〜2営業日以内にご連絡いたします。",

    // Footer
    "footer.products": "製品",
    "footer.services": "サービス",
    "footer.calibration": "校正",
    "footer.consulting": "コンプライアンスコンサルティング",
    "footer.customeng": "カスタムエンジニアリング",
    "footer.oem": "OEMソリューション",
    "footer.resources": "リソース",
    "footer.support": "技術サポート",
    "footer.docs": "ドキュメント",
    "footer.company": "会社情報",
    "footer.careers": "採用情報",
    "footer.news": "ニュース",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
    "footer.copyright": "© 2024 JJ&A Instruments. All rights reserved.",
    "footer.location": "米国カリフォルニア州サンディエゴ",
    // Doppler Page
    "doppler.hero.badge": "Medical Ultrasound Quality Assurance Solutions",
    "doppler.hero.title": "Doppler Phantom &<br><em>Ultrasound QA</em>",
    "doppler.hero.subtitle": "The gold standard in medical ultrasound quality assurance. Our Mark V Doppler Phantom delivers NIST-traceable accuracy for clinical QA programs, regulatory compliance, and research applications—trusted by hospitals, OEMs, and academic institutions worldwide.",
    "doppler.hero.cta1": "Request a Quote",
    "doppler.hero.cta2": "QA & Compliance",
    "doppler.whatis.tag": "Understanding Medical Ultrasound QA",
    "doppler.whatis.title": "What is Ultrasound Quality Assurance?",
    "doppler.whatis.lead": "Medical ultrasound quality assurance (QA) is a systematic program of testing and verification that ensures diagnostic ultrasound equipment performs accurately and consistently for patient care.",
    "doppler.whatis.p1": "<strong>Ultrasound QA encompasses</strong> routine performance testing, calibration verification, and documentation required by accrediting bodies such as the American College of Radiology (ACR), Intersocietal Accreditation Commission (IAC), and regulatory agencies including the FDA. A comprehensive QA program protects patients, ensures diagnostic accuracy, and maintains compliance with healthcare standards.",
    "doppler.whatis.p2": "<strong>Doppler velocity calibration</strong> is a critical component of ultrasound QA. Accurate blood flow velocity measurements are essential for diagnosing vascular disease severity, assessing cardiac function, monitoring fetal well-being, and guiding treatment decisions. The JJ&A Instruments Mark V Doppler Phantom provides the NIST-traceable reference standard needed to verify your ultrasound systems measure velocity accurately.",
    "doppler.whatis.p3": "<strong>Why QA matters:</strong> Studies show that uncalibrated ultrasound systems can produce velocity measurement errors of 10-20%, potentially leading to misdiagnosis of conditions like carotid stenosis or cardiac valve disease. Regular QA testing with calibrated phantoms ensures your clinical measurements remain within acceptable accuracy limits.",
    "doppler.whatis.diagram.title": "Ultrasound QA Program Components",
    "doppler.whatis.step1.title": "Doppler Velocity Verification",
    "doppler.whatis.step1.desc": "Verify blood flow velocity accuracy using calibrated string phantoms",
    "doppler.whatis.step2.title": "Image Quality Assessment",
    "doppler.whatis.step2.desc": "Test spatial resolution, contrast, uniformity with tissue phantoms",
    "doppler.whatis.step3.title": "Transducer Performance",
    "doppler.whatis.step3.desc": "Evaluate probe sensitivity, dead elements, and acoustic output",
    "doppler.whatis.step4.title": "Documentation & Compliance",
    "doppler.whatis.step4.desc": "Maintain records for ACR, IAC, ICAVL, Joint Commission audits",
    "doppler.product.tag": "Our Products",
    "doppler.product.title": "Mark V Doppler Phantom",
    "doppler.product.desc": "The industry standard for Doppler velocity calibration and ultrasound quality assurance. Trusted by clinical facilities, OEM manufacturers, and research institutions worldwide.",
    "doppler.features.range.title": "Clinical Velocity Range",
    "doppler.features.range.desc": "10-200 cm/s covers all clinical blood flow velocities from venous flow to peak arterial systole, supporting vascular, cardiac, obstetric, and transcranial Doppler QA.",
    "doppler.features.accuracy.title": "NIST-Traceable Accuracy",
    "doppler.features.accuracy.desc": "±1% velocity accuracy with Certificate of Calibration traceable to National Institute of Standards and Technology—essential for regulatory compliance.",
    "doppler.features.compliance.title": "Compliance Ready",
    "doppler.features.compliance.desc": "Designed to meet ACR, IAC, ICAVL, AIUM, and Joint Commission ultrasound QA requirements. Export documentation in accreditation-ready formats.",
    "doppler.features.setup.title": "5-Minute Setup",
    "doppler.features.setup.desc": "No blood-mimicking fluid preparation, temperature stabilization, or complex alignment. Rapid setup maximizes QA testing efficiency.",
    "doppler.features.angles.title": "Multi-Angle Testing",
    "doppler.features.angles.desc": "Verify Doppler angle correction accuracy at 30°, 45°, and 60° angles using integrated positioning guides—critical for proper velocity calculation.",
    "doppler.features.export.title": "USB Data Export",
    "doppler.features.export.desc": "Export calibration results in PDF and CSV formats. Integrate with QA management systems for streamlined documentation and audit trails.",
    "doppler.compliance.tag": "Regulatory Compliance",
    "doppler.compliance.title": "Ultrasound Compliance & Accreditation",
    "doppler.compliance.desc": "Meet the quality assurance requirements of major accrediting bodies and regulatory agencies with documented Doppler velocity calibration.",
    "doppler.compliance.row1": "Annual Doppler QA required",
    "doppler.compliance.row2": "Echo & Vascular standards",
    "doppler.compliance.row3": "Velocity accuracy verification",
    "doppler.compliance.row4": "Equipment management standards",
    "doppler.compliance.row5": "Quality System Regulation",
    "doppler.compliance.row6": "Ultrasound field characterization",
    "doppler.compliance.row7": "Practice guidelines compliance",
    "doppler.compliance.row8": "Medical device QMS",
    "doppler.compliance.cta": "Get Compliance Support",
    "doppler.compliance.doclabel": "Accreditation-Ready Documentation",
    "doppler.services.tag": "Professional Services",
    "doppler.services.title": "Ultrasound Calibration Services",
    "doppler.services.desc": "Comprehensive NIST-traceable calibration services for Doppler ultrasound equipment. Supporting clinical facilities, OEM manufacturers, and research institutions with expert quality assurance.",
    "doppler.services.onsite.title": "On-Site Calibration",
    "doppler.services.onsite.desc": "Our technicians come to your facility with calibrated reference equipment. Minimize downtime while ensuring your ultrasound systems meet accuracy specifications.",
    "doppler.services.depot.title": "Depot Calibration",
    "doppler.services.depot.desc": "Ship your phantom to our ISO 17025-compliant laboratory for comprehensive calibration. 5-7 business day turnaround with detailed certification documentation.",
    "doppler.services.accreditation.title": "Accreditation Support",
    "doppler.services.accreditation.desc": "Complete documentation packages for ACR, IAC, ICAVL, and Joint Commission audits. QA protocol templates and compliance consulting available.",
    "doppler.services.recert.title": "Annual Recertification",
    "doppler.services.recert.desc": "Keep your phantom NIST-traceable with annual recertification services. Maintain compliance with accreditation requirements and ensure ongoing accuracy.",
    "doppler.services.training.title": "QA Training",
    "doppler.services.training.desc": "On-site training for your sonographers and QA staff. Learn proper phantom operation, testing protocols, and documentation procedures.",
    "doppler.services.emergency.title": "Emergency Service",
    "doppler.services.emergency.desc": "48-hour expedited calibration available for urgent needs. Don't let equipment issues delay your accreditation or patient care.",
    "doppler.research.tag": "Beyond Clinical",
    "doppler.research.title": "Production & Research Applications",
    "doppler.research.desc": "Our doppler phantoms serve critical roles in ultrasound manufacturing quality control, academic research, and medical device development.",
    "doppler.research.oem.title": "OEM Manufacturing QA",
    "doppler.research.oem.desc": "Ultrasound manufacturers rely on our phantoms for production line testing and final QA verification. Ensure every unit shipped meets Doppler velocity specifications with NIST-traceable reference standards. Support ISO 13485 and FDA 21 CFR Part 820 compliance.",
    "doppler.research.rnd.title": "R&D and Product Development",
    "doppler.research.rnd.desc": "Develop and validate new Doppler algorithms, signal processing techniques, and imaging modalities. Our phantoms provide the consistent, repeatable velocity references needed for quantitative research and regulatory submissions.",
    "doppler.research.academic.title": "Academic Research",
    "doppler.research.academic.desc": "Universities and research institutions use our phantoms for hemodynamic studies, cardiovascular imaging research, and sonography education. Published velocity accuracy data supports peer-reviewed research credibility.",
    "doppler.research.service.title": "Service Organizations",
    "doppler.research.service.desc": "Biomedical equipment service companies use our phantoms for post-repair verification and preventive maintenance testing. Demonstrate to customers that repaired equipment meets original performance specifications.",
    "doppler.apps.tag": "Clinical Applications",
    "doppler.apps.title": "Blood Flow Velocity Calibration",
    "doppler.apps.desc": "Essential for any facility performing Doppler ultrasound examinations where verified blood flow velocity accuracy impacts patient diagnosis and treatment.",
    "doppler.apps.vascular.title": "Vascular Laboratory QA",
    "doppler.apps.vascular.desc": "Verify carotid artery velocity measurements critical for stenosis grading per NASCET/ECST criteria. Ensure peripheral arterial and venous Doppler accuracy for DVT diagnosis and arterial disease assessment.",
    "doppler.apps.echo.title": "Echocardiography",
    "doppler.apps.echo.desc": "Validate transmitral and transaortic flow velocities for cardiac output calculations. Essential for accurate E/A ratio, valve gradient measurements, and hemodynamic assessments per ASE guidelines.",
    "doppler.apps.ob.title": "Obstetric Doppler",
    "doppler.apps.ob.desc": "Calibrate umbilical artery and middle cerebral artery measurements. Accurate velocities and ratios are critical for fetal well-being assessment, IUGR detection, and high-risk pregnancy monitoring.",
    "doppler.apps.tcd.title": "Transcranial Doppler",
    "doppler.apps.tcd.desc": "Verify TCD velocity accuracy for stroke risk assessment, vasospasm monitoring in SAH patients, brain death determination protocols, and sickle cell disease screening programs.",
    "doppler.apps.acceptance.title": "Equipment Acceptance Testing",
    "doppler.apps.acceptance.desc": "Baseline Doppler calibration for new ultrasound system installation. Verify performance meets manufacturer specifications before clinical use—essential for capital equipment validation.",
    "doppler.apps.compliance.title": "Accreditation Compliance",
    "doppler.apps.compliance.desc": "Meet ACR, IAC, ICAVL, and Joint Commission ultrasound accreditation requirements with documented Doppler velocity calibration and comprehensive QA protocols.",
    "doppler.specs.tag": "Technical Details",
    "doppler.specs.title": "Mark V Specifications",
    "doppler.specs.desc": "Engineered to meet the demanding requirements of clinical ultrasound QA and regulatory compliance testing.",
    "doppler.specs.velocity.title": "Velocity Performance",
    "doppler.specs.velocity.desc": "<strong>Range:</strong> 10 – 200 cm/s<br><strong>Accuracy:</strong> ±1% of reading<br><strong>Resolution:</strong> 0.1 cm/s<br><strong>Stability:</strong> ±0.5% over 8 hours",
    "doppler.specs.physical.title": "Physical Specifications",
    "doppler.specs.physical.desc": "<strong>Dimensions:</strong> 45 × 25 × 18 cm<br><strong>Weight:</strong> 5.2 kg (11.5 lbs)<br><strong>String:</strong> 0.1mm nylon monofilament<br><strong>Tank:</strong> Degassed water bath",
    "doppler.specs.acoustic.title": "Acoustic Properties",
    "doppler.specs.acoustic.desc": "<strong>Window:</strong> TPX membrane 60×120mm<br><strong>Probe Compatibility:</strong> 2-15 MHz<br><strong>Doppler Angles:</strong> 30°, 45°, 60° guides<br><strong>Depth:</strong> 2-8 cm adjustable",
    "doppler.specs.standards.title": "Compliance & Standards",
    "doppler.specs.standards.desc": "<strong>Standards:</strong> IEC 62359, FDA QSR<br><strong>Power:</strong> 100-240V AC, 50/60Hz<br><strong>Certifications:</strong> CE marked<br><strong>Warranty:</strong> 2 years comprehensive",
    "doppler.faq.tag": "Common Questions",
    "doppler.faq.title": "Ultrasound QA FAQ",
    "doppler.faq.q1": "How often should Doppler ultrasound equipment be calibrated?",
    "doppler.faq.a1": "The American College of Radiology (ACR) and Intersocietal Accreditation Commission (IAC) recommend Doppler velocity verification at least annually. Many accredited vascular laboratories perform quarterly calibration checks as part of their quality assurance program. Additional testing is recommended after equipment service, software updates, transducer replacement, or any time measurement accuracy is questioned.",
    "doppler.faq.q2": "What accreditation standards require ultrasound QA testing?",
    "doppler.faq.a2": "Multiple accrediting bodies require documented ultrasound quality assurance programs: <strong>ACR</strong> (American College of Radiology) requires annual phantom testing; <strong>IAC</strong> (Intersocietal Accreditation Commission) covers echocardiography and vascular testing; <strong>ICAVL</strong> (Intersocietal Commission for the Accreditation of Vascular Laboratories) requires velocity accuracy verification; <strong>The Joint Commission</strong> mandates equipment management and QA programs; and <strong>AIUM</strong> (American Institute of Ultrasound in Medicine) publishes practice guidelines. Our phantom and documentation support all these standards.",
    "doppler.faq.q3": "What is the difference between a string phantom and a flow phantom?",
    "doppler.faq.a3": "String phantoms use a moving filament at precisely controlled velocities, eliminating variables like blood-mimicking fluid temperature, viscosity, and particle concentration. This provides more consistent, reproducible calibration results with minimal maintenance. Flow phantoms with blood-mimicking fluid can better simulate certain acoustic properties like scattering, but require temperature control, regular fluid replacement, and more complex setup. For Doppler velocity calibration, string phantoms offer superior accuracy and practicality.",
    "doppler.faq.q4": "Is the Mark V compatible with my ultrasound system?",
    "doppler.faq.a4": "Yes. The Mark V Doppler Phantom is compatible with all diagnostic ultrasound systems with Doppler capability, including GE, Philips, Siemens, Canon (Toshiba), Samsung, Fujifilm, Mindray, and other manufacturers. The 2-15 MHz probe compatibility covers virtually all clinical transducers used in vascular, cardiac, obstetric, and general imaging applications.",
    "doppler.faq.q5": "What blood flow velocities can I test?",
    "doppler.faq.a5": "The Mark V covers 10-200 cm/s, spanning the full range of clinical blood flow velocities: venous flow (10-30 cm/s), normal arterial flow (30-100 cm/s), and peak systolic velocities in stenotic vessels or cardiac applications (up to 200 cm/s and beyond). This range supports carotid stenosis grading, peripheral vascular assessment, cardiac valve evaluation, obstetric Doppler, and transcranial Doppler applications.",
    "doppler.faq.q6": "How does NIST-traceable calibration work?",
    "doppler.faq.a6": "NIST-traceable calibration means our phantom's velocity accuracy can be documented through an unbroken chain of comparisons back to the National Institute of Standards and Technology. Each Mark V ships with a Certificate of Calibration showing measurement uncertainty and traceability. Annual recertification maintains this traceability—essential for regulatory compliance and accreditation audits.",
    "doppler.faq.q7": "What documentation is provided for accreditation?",
    "doppler.faq.a7": "Each Mark V ships with a Certificate of Calibration traceable to NIST standards. The unit exports test results in PDF and CSV formats compatible with ACR, IAC, ICAVL, and Joint Commission accreditation requirements. We also provide template QA protocols, testing procedure documentation, and guidance for laboratory accreditation submissions. Our support team can assist with specific accreditation documentation requirements.",
    "doppler.faq.q8": "Do you support OEM and research applications?",
    "doppler.faq.a8": "Yes. We supply doppler phantoms to ultrasound OEM manufacturers for production testing and QA, to medical device developers for R&D and regulatory submissions, and to academic institutions for research and education. Volume pricing and custom configurations are available for OEM and institutional customers. Contact us to discuss your specific requirements.",
    // HIFU Page
    "hifu.hero.badge": "Complete HIFU Driving System",
    "hifu.hero.title": "HIFU RF<br><em>Power System</em>",
    "hifu.hero.subtitle": "A complete, ready-to-use HIFU driving system—just add your transducer. Frequency generator, precision timing circuits, power amplifier, safety systems, and full system control all integrated in one unit. Simple ASCII commands via a single USB port. Power on and start treating.",
    "hifu.hero.cta2": "View Specifications",
    "hifu.trust.usb": "USB Port",
    "hifu.trust.allinone.num": "All-in-One",
    "hifu.trust.allinone.label": "Complete System",
    "hifu.trust.power": "Max Power",
    "hifu.whatis.tag": "Understanding HIFU Technology",
    "hifu.whatis.title": "What is High-Intensity Focused Ultrasound?",
    "hifu.whatis.lead": "High-Intensity Focused Ultrasound (HIFU) is a non-invasive therapeutic technique that uses focused acoustic energy to precisely heat and ablate tissue deep within the body—without incisions or radiation.",
    "hifu.whatis.p1": "<strong>A complete system, not just an amplifier:</strong> Our HIFU RF Power System integrates everything you need to drive your transducer: precision frequency generator, timing and gating circuits, high-power RF amplifier, comprehensive safety systems, and full digital control. Just connect your transducer and you're ready to go.",
    "hifu.whatis.p2": "<strong>Simple USB control:</strong> No complex interfaces or proprietary software. Send simple ASCII text commands through a single USB port to control frequency, power, pulse timing, and all system functions. Works with any programming language or terminal program. Full documentation included.",
    "hifu.whatis.p3": "<strong>Built-in safety:</strong> VSWR protection, over-temperature shutdown, arc detection, and hardware interlocks are all integrated. Focus on your application—the safety systems handle the rest.",
    "hifu.whatis.diagram.title": "What's Included",
    "hifu.whatis.step1.title": "Frequency Generator",
    "hifu.whatis.step1.desc": "Precision DDS synthesis, 0.5-7 MHz range",
    "hifu.whatis.step2.title": "Timing & Gating Circuits",
    "hifu.whatis.step2.desc": "Programmable pulse control, <10 μs response",
    "hifu.whatis.step3.title": "RF Power Amplifier",
    "hifu.whatis.step3.desc": "Up to 500W continuous, impedance matched",
    "hifu.whatis.step4.title": "Safety Systems",
    "hifu.whatis.step4.desc": "VSWR, thermal, arc protection & interlocks",
    "hifu.whatis.step5.title": "USB Control Interface",
    "hifu.whatis.step5.desc": "Simple ASCII commands, works with any software",
    "hifu.whatis.diagram.footer": "You provide: Your transducer",
    "hifu.features.tag": "Complete System Features",
    "hifu.features.title": "Everything You Need, Integrated",
    "hifu.features.desc": "A turnkey HIFU driving solution—connect your transducer, plug in USB, and you're ready. No external signal generators, amplifiers, or control systems required.",
    "hifu.features.power.title": "High Power Output",
    "hifu.features.power.desc": "Up to 500W continuous wave (CW) or pulsed output. Scalable configurations from 100W to multi-kilowatt systems for different clinical applications.",
    "hifu.features.freq.title": "Wide Frequency Range",
    "hifu.features.freq.desc": "0.5 MHz to 7 MHz covers all HIFU applications—from deep tissue ablation (0.5-1 MHz) to superficial aesthetic treatments (3-7 MHz).",
    "hifu.features.array.title": "Multi-Channel Arrays",
    "hifu.features.array.desc": "Support for phased array transducers with up to 256 independently controlled channels. Electronic beam steering and focal point adjustment.",
    "hifu.features.response.title": "Fast Response Time",
    "hifu.features.response.desc": "<10 μs rise/fall times for precise pulsed operation. Real-time power control for temperature-guided therapy and motion tracking.",
    "hifu.features.safety.title": "Built-in Safety Systems",
    "hifu.features.safety.desc": "VSWR protection, over-temperature shutdown, and arc detection. Hardware interlocks and software limits ensure safe operation.",
    "hifu.features.control.title": "Simple ASCII Control",
    "hifu.features.control.desc": "One USB port. Simple ASCII text commands. Control frequency, power, timing—everything—from any terminal or programming language. No proprietary software needed.",
    "hifu.apps.tag": "Clinical & Research Applications",
    "hifu.apps.title": "HIFU Applications",
    "hifu.apps.desc": "Our RF power generators support the full spectrum of focused ultrasound applications—from life-saving tumor ablation to cutting-edge research.",
    "hifu.apps.oncology.title": "Oncology & Tumor Ablation",
    "hifu.apps.oncology.desc": "Non-invasive treatment of solid tumors in prostate, liver, breast, kidney, and bone. HIFU offers an alternative to surgery for patients who are not surgical candidates. The 2024 oncology segment represents 41% of the global HIFU market, with FDA-cleared systems like Focal One® driving adoption.",
    "hifu.apps.neuro.title": "Neurology & Brain Therapy",
    "hifu.apps.neuro.desc": "MRI-guided focused ultrasound for essential tremor, Parkinson's disease tremor, and neuropathic pain. HIFU can create precise lesions in deep brain structures without opening the skull—a breakthrough alternative to invasive neurosurgery. Our MRI-compatible generators enable integration with MRgFUS platforms.",
    "hifu.apps.aesthetic.title": "Aesthetic & Cosmetic",
    "hifu.apps.aesthetic.desc": "Non-invasive skin tightening, wrinkle reduction, and body contouring. Higher frequency HIFU (3-7 MHz) targets the SMAS layer and subcutaneous fat for cosmetic improvement without surgery. The aesthetic HIFU segment is the fastest-growing market, driven by consumer demand for minimally invasive treatments.",
    "hifu.apps.rnd.title": "Research & Development",
    "hifu.apps.rnd.desc": "Flexible configurations for academic and industrial R&D. Develop new HIFU applications, validate treatment protocols, and characterize transducer performance. Our generators support the full research cycle from bench experiments to preclinical studies and regulatory submissions.",
    "hifu.apps.oem.title": "OEM System Integration",
    "hifu.apps.oem.desc": "Designed for integration into commercial HIFU systems. Compact form factor, comprehensive API, and regulatory documentation support FDA 510(k) and CE marking submissions. Volume pricing and design-in support for OEM partnerships.",
    "hifu.apps.drug.title": "Drug Delivery & Sonoporation",
    "hifu.apps.drug.desc": "Low-intensity pulsed HIFU for enhanced drug delivery, blood-brain barrier opening, and sonodynamic therapy research. Precise pulse control enables investigation of bioeffects beyond thermal ablation.",
    "hifu.specs.tag": "Technical Details",
    "hifu.specs.title": "Complete System Specifications",
    "hifu.specs.desc": "All-in-one system includes frequency generator, timing circuits, amplifier, safety systems, and USB control. Just connect your transducer.",
    "hifu.specs.row1.label": "Frequency Range",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "Frequency Stability",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "Output Power (CW)",
    "hifu.specs.row3.value": "100W / 250W / 500W models",
    "hifu.specs.row4.label": "Output Power (Pulsed)",
    "hifu.specs.row4.value": "Up to 1000W peak",
    "hifu.specs.row5.label": "Power Resolution",
    "hifu.specs.row5.value": "0.1W (digital control)",
    "hifu.specs.row6.label": "Rise/Fall Time",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "Duty Cycle",
    "hifu.specs.row7.value": "0-100% (CW or pulsed)",
    "hifu.specs.row8.label": "Output Impedance",
    "hifu.specs.row8.value": "50Ω nominal",
    "hifu.specs.row9.label": "VSWR Protection",
    "hifu.specs.row9.value": "Auto-shutdown at 3:1",
    "hifu.specs.row10.label": "Control Interface",
    "hifu.specs.row10.value": "USB (ASCII commands)",
    "hifu.specs.row11.label": "Cooling",
    "hifu.specs.row11.value": "Forced air / Water options",
    "hifu.specs.row12.label": "MRI Compatibility",
    "hifu.specs.row12.value": "Optional shielded version",
    "hifu.specs.cta": "Request Full Specifications",
    "hifu.specs.avail": "Available: 100W, 250W, 500W Models",
    "hifu.why.tag": "Why JJ&A Instruments",
    "hifu.why.title": "The HIFU Generator Advantage",
    "hifu.why.desc": "Purpose-built for therapeutic ultrasound with the reliability and support that medical device developers demand.",
    "hifu.why.quality.title": "Medical-Grade Quality",
    "hifu.why.quality.desc": "ISO 13485 certified manufacturing. Designed and documented to support FDA 510(k) and CE marking submissions for your HIFU system.",
    "hifu.why.support.title": "Applications Engineering",
    "hifu.why.support.desc": "Our RF engineers understand HIFU applications. Get expert support for transducer matching, thermal management, and system integration.",
    "hifu.why.global.title": "Global Availability",
    "hifu.why.global.desc": "Worldwide shipping with local support in North America, Europe, and Asia-Pacific. Evaluation units available for qualified projects.",
    "hifu.why.api.title": "Comprehensive APIs",
    "hifu.why.api.desc": "Full software control via documented APIs. LabVIEW VIs, Python libraries, and C/C++ SDK included. Rapid integration with your control system.",
    "hifu.why.longterm.title": "Long-Term Support",
    "hifu.why.longterm.desc": "5-year product availability guarantee. Extended warranty options. Calibration and maintenance services to keep your system running.",
    "hifu.why.custom.title": "Custom Configurations",
    "hifu.why.custom.desc": "Need a specific frequency, power level, or form factor? Our engineering team can customize generators for your unique requirements.",
    "hifu.faq.tag": "Common Questions",
    "hifu.faq.title": "HIFU Generator FAQ",
    "hifu.faq.q1": "What is HIFU and how does it work?",
    "hifu.faq.a1": "High-Intensity Focused Ultrasound (HIFU) uses focused acoustic energy to heat and destroy targeted tissue non-invasively. An RF power generator drives piezoelectric transducers that convert electrical energy into ultrasound waves. These waves are focused to a precise point in the body—like sunlight through a magnifying glass—where temperatures reach 60-85°C, causing thermal ablation of the target tissue while sparing surrounding structures.",
    "hifu.faq.q2": "What frequency should I use for my HIFU application?",
    "hifu.faq.a2": "Frequency selection depends on treatment depth and target tissue. <strong>Lower frequencies (0.5-1 MHz)</strong> penetrate deeper (up to 15 cm) and are used for tumor ablation in liver, kidney, and prostate. <strong>Mid-range frequencies (1-3 MHz)</strong> are common for neurological HIFU and general therapeutic applications. <strong>Higher frequencies (3-7 MHz)</strong> provide precise, shallow penetration for aesthetic treatments targeting skin layers. Our team can help you select the optimal frequency for your specific application.",
    "hifu.faq.q3": "Is the generator compatible with MRI environments?",
    "hifu.faq.a3": "Yes. We offer MRI-compatible versions with EMI shielding and non-magnetic construction for MR-guided Focused Ultrasound (MRgFUS) applications. These generators can operate inside the MRI suite without interfering with imaging. The shielded version has been validated at 1.5T and 3T field strengths. Contact us to discuss your specific MRI integration requirements.",
    "hifu.faq.q4": "Can the generator drive phased array transducers?",
    "hifu.faq.a4": "Yes. We offer multi-channel configurations with up to 256 independently controlled channels for phased array transducers. Each channel provides individual amplitude and phase control for electronic beam steering and focal point adjustment. Multi-channel systems include synchronization features for coherent operation. Single-element and annular array transducers are also fully supported.",
    "hifu.faq.q5": "What safety features are included?",
    "hifu.faq.a5": "Safety is built into every generator: <strong>VSWR protection</strong> automatically reduces power if reflected power exceeds safe limits (prevents transducer damage). <strong>Over-temperature protection</strong> monitors internal temperatures and shuts down before overheating. <strong>Arc detection</strong> instantly cuts power if arcing is detected in the RF path. <strong>Hardware interlocks</strong> support external safety switches and emergency stops. <strong>Software limits</strong> allow you to define application-specific power and duration limits.",
    "hifu.faq.q6": "What regulatory documentation is available?",
    "hifu.faq.a6": "We provide comprehensive documentation to support your regulatory submissions: <strong>Design history file</strong> including specifications, test reports, and traceability. <strong>Risk analysis</strong> per ISO 14971. <strong>EMC test reports</strong> per IEC 60601-1-2. <strong>Electrical safety testing</strong> per IEC 60601-1. <strong>Certificates</strong> of conformance and calibration. Our regulatory affairs team can assist with FDA 510(k) and CE marking questions.",
    "hifu.faq.q7": "Do you support OEM integration and custom configurations?",
    "hifu.faq.a7": "Yes. We work closely with HIFU system developers on OEM projects: <strong>Custom frequencies</strong> matched to your transducer. <strong>Modified form factors</strong> for integration into your system enclosure. <strong>Custom interfaces</strong> and control protocols. <strong>Private labeling</strong> available. <strong>Volume pricing</strong> for production quantities. We can also provide design-in support, prototypes, and engineering samples for evaluation.",
    "hifu.faq.q8": "What is the warranty and support policy?",
    "hifu.faq.a8": "Standard warranty is 2 years covering parts and labor. Extended warranty options up to 5 years are available. Support includes: <strong>Phone and email technical support</strong> during business hours. <strong>Remote diagnostics</strong> via network connection. <strong>Repair and calibration services</strong> at our facility. <strong>Loaner units</strong> available for qualified customers during repairs. <strong>On-site service</strong> available for an additional fee.",
    "hifu.contact.desc": "Ready to power your HIFU application? Contact us for pricing, specifications, or to discuss your project requirements with our engineering team.",
    "footer.applications": "Applications",
    "hifu.apps.oncology.short": "Tumor Ablation",
    "hifu.apps.neuro.short": "Neurology",
    "hifu.apps.aesthetic.short": "Aesthetics",
    "hifu.apps.rnd.short": "Research",
    "nav.compliance": "QA & Compliance",
    "footer.recertification": "Phantom Recertification",
    "nav.faq": "FAQ",
    "footer.docs": "Technical Documents",
    "footer.protocols": "QA Protocols",
    "nav.specs": "Specifications",
    "nav.home": "Home",
    "footer.desc": "診断QAおよび治療用アプリケーション向けの精密超音波機器。世界中の医療従事者や研究者から信頼されています。",
    "footer.accessories": "アクセサリー",
    "footer.parts": "交換部品",
    "footer.descDoppler": "医療用超音波品質保証、規制遵守、研究用途向けの精密ドップラーファントムと超音波校正サービス。",
    "footer.oemResearch": "OEM＆研究",

    // Navigation - Additional
    "nav.calibration": "校正サービス",
    "nav.applications": "アプリケーション",

    // Aria Labels for Accessibility
    "aria.mainNav": "メインナビゲーション",
    "aria.home": "JJ&A Instruments ホーム",
    "aria.toggleMenu": "メニュー切替",
    "aria.selectLang": "言語選択",
    "aria.contactForm": "お問い合わせフォーム",
    "aria.footerNav": "フッターナビゲーション",

    // Placeholders
    "placeholder.comment": "ご意見をお聞かせください...",
    "placeholder.message": "プロジェクト、要件、ご質問についてお聞かせください...",
    "placeholder.messageDoppler": "超音波QAニーズ、認定要件、研究用途についてお聞かせください...",

    // Contact Form Options - Index page
    "contact.option.doppler": "Mark V ドップラーファントム",
    "contact.option.hifu": "HIFU RF パワージェネレーター",
    "contact.option.calibration": "校正サービス",
    "contact.option.oem": "OEMパートナーシップ",
    "contact.option.custom": "カスタムエンジニアリング",
    "contact.option.general": "一般的なお問い合わせ",

    // Contact Form Options - Doppler page
    "contact.option.phantomQuote": "Mark V ドップラーファントム見積もり",
    "contact.option.calibrationService": "超音波校正サービス",
    "contact.option.qaCompliance": "QA＆コンプライアンスサポート",
    "contact.option.oemResearch": "OEM/研究用途",
    "contact.option.recertification": "ファントム再認証",

    // Contact Form Options - HIFU page
    "contact.option.hifuQuote": "HIFU RFジェネレーター見積もり",
    "contact.option.hifuSpecs": "技術仕様",
    "contact.option.hifuCustom": "カスタム構成",
    "contact.option.hifuResearch": "研究用途",
    "contact.option.hifuEval": "評価ユニット",

    // Placeholder - HIFU page
    "placeholder.messageHifu": "HIFUアプリケーション、目標周波数、電力要件、または統合ニーズについてお聞かせください...",
  },

  hi: {
    // Meta
    "meta.title": "JJ&A Instruments | सटीक अल्ट्रासाउंड उपकरण और कैलिब्रेशन सेवाएं",

    // Navigation
    "nav.products": "उत्पाद",
    "nav.services": "सेवाएं",
    "nav.industries": "उद्योग",
    "nav.blog": "ब्लॉग",
    "nav.about": "हमारे बारे में",
    "nav.contact": "संपर्क करें",
    "nav.doppler": "Mark V डॉप्लर फैंटम",
    "nav.hifu": "HIFU RF पावर जनरेटर",
    "nav.quote": "कोट का अनुरोध करें",

    // Doppler Page Hero
    "hero.badge": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन समाधान",
    "hero.title": "डॉप्लर फैंटम और<br><em>अल्ट्रासाउंड QA</em>",
    "hero.subtitle": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन में स्वर्ण मानक। हमारा Mark V डॉप्लर फैंटम क्लिनिकल QA कार्यक्रमों, नियामक अनुपालन और अनुसंधान अनुप्रयोगों के लिए NIST-ट्रेसेबल सटीकता प्रदान करता है—दुनिया भर के अस्पतालों, OEM और शैक्षणिक संस्थानों द्वारा विश्वसनीय।",
    "hero.cta1": "कोट का अनुरोध करें",
    "hero.cta2": "QA और अनुपालन",

    // Trust badges
    "trust.compliant": "अनुपालन",
    "trust.accuracy": "सटीकता",
    "trust.traceable": "ट्रेसेबल",

    // Home Hero Section
    "home.hero.badge": "सटीक अल्ट्रासाउंड तकनीक",
    "home.hero.title": "चिकित्सा<br><em>अल्ट्रासाउंड नवाचार</em> को आगे बढ़ाना",
    "home.hero.subtitle": "JJ&A Instruments डायग्नोस्टिक QA और चिकित्सीय अनुप्रयोगों के लिए सटीक अल्ट्रासाउंड उपकरण डिज़ाइन और निर्माण करता है। डॉप्लर फैंटम से HIFU RF पावर जनरेटर तक, हम स्वास्थ्य सेवा प्रदाताओं, शोधकर्ताओं और OEM को विश्वसनीय, उच्च-प्रदर्शन समाधान प्रदान करते हैं।",
    "home.hero.cta1": "उत्पाद देखें",
    "home.hero.cta2": "बिक्री से संपर्क करें",
    "home.hero.years": "वर्ष का अनुभव",
    "home.hero.countries": "देशों में सेवा",
    "home.hero.certified": "प्रमाणित",
    "home.hero.scroll": "अधिक जानने के लिए स्क्रॉल करें",

    // Products Section
    "products.tag": "हमारे उत्पाद",
    "products.title": "सटीक अल्ट्रासाउंड समाधान",
    "products.desc": "डायग्नोस्टिक गुणवत्ता आश्वासन से लेकर उच्च-तीव्रता चिकित्सीय प्रणालियों तक - अल्ट्रासाउंड अनुप्रयोगों की पूरी श्रृंखला के लिए दो उत्पाद लाइनें।",
    "products.doppler.tag": "डायग्नोस्टिक QA",
    "products.doppler.title": "Mark V डॉप्लर फैंटम",
    "products.doppler.desc": "डॉप्लर अल्ट्रासाउंड वेग कैलिब्रेशन का स्वर्ण मानक। क्लिनिकल QA, नियामक अनुपालन और प्रत्यायन आवश्यकताओं के लिए NIST-ट्रेसेबल सटीकता।",
    "products.doppler.feature1": "10-200 cm/s वेग रेंज",
    "products.doppler.feature2": "±1% NIST-ट्रेसेबल सटीकता",
    "products.doppler.feature3": "ACR, IAC, ICAVL अनुपालन",
    "products.doppler.feature4": "5 मिनट सेटअप समय",
    "products.hifu.tag": "चिकित्सीय HIFU",
    "products.hifu.title": "HIFU RF पावर जनरेटर",
    "products.hifu.desc": "फोकस्ड अल्ट्रासाउंड ट्रांसड्यूसर चलाने के लिए उच्च-प्रदर्शन RF पावर एम्पलीफायर। HIFU सिस्टम OEM, शोधकर्ताओं और चिकित्सीय डिवाइस डेवलपर्स के लिए आदर्श।",
    "products.hifu.feature1": "0.5-7 MHz फ्रीक्वेंसी रेंज",
    "products.hifu.feature2": "500W तक आउटपुट पावर",
    "products.hifu.feature3": "MRI-संगत विकल्प",
    "products.hifu.feature4": "मल्टी-चैनल ऐरे सपोर्ट",
    "products.learnmore": "और जानें",
    "products.getquote": "कोट प्राप्त करें",

    // Services Section
    "services.tag": "हमारी सेवाएं",
    "services.title": "व्यापक सहायता",
    "services.desc": "उपकरणों के अलावा, हम कैलिब्रेशन, अनुपालन परामर्श और तकनीकी सहायता प्रदान करते हैं ताकि आपके उत्पाद जीवनचक्र में इष्टतम प्रदर्शन सुनिश्चित हो।",
    "services.calibration.title": "कैलिब्रेशन सेवाएं",
    "services.calibration.desc": "डॉप्लर फैंटम और अल्ट्रासाउंड उपकरणों के लिए NIST-ट्रेसेबल कैलिब्रेशन। वार्षिक या द्विवार्षिक सेवा योजनाओं के साथ सटीकता और अनुपालन बनाए रखें।",
    "services.consulting.title": "अनुपालन परामर्श",
    "services.consulting.desc": "ACR, IAC और ICAVL प्रत्यायन आवश्यकताओं पर विशेषज्ञ मार्गदर्शन। हम आपको अनुपालन QA कार्यक्रम विकसित और बनाए रखने में मदद करते हैं।",
    "services.custom.title": "कस्टम इंजीनियरिंग",
    "services.custom.desc": "आपकी अनूठी अनुसंधान या विनिर्माण आवश्यकताओं के अनुरूप कस्टम फैंटम कॉन्फ़िगरेशन और RF जनरेटर विनिर्देश।",
    "services.oem.title": "OEM साझेदारी",
    "services.oem.desc": "अपनी उत्पाद लाइनों में हमारी तकनीक को एकीकृत करने वाले अल्ट्रासाउंड उपकरण निर्माताओं के लिए व्हाइट-लेबल समाधान और वॉल्यूम प्राइसिंग।",
    "services.global.title": "वैश्विक सहायता",
    "services.global.desc": "विश्वव्यापी शिपिंग और सहायता नेटवर्क। उत्तरी अमेरिका, यूरोप और एशिया-प्रशांत क्षेत्रों में स्थानीय सेवा भागीदार।",
    "services.emergency.title": "आपातकालीन प्रतिक्रिया",
    "services.emergency.desc": "महत्वपूर्ण कैलिब्रेशन आवश्यकताओं के लिए 48-घंटे त्वरित सेवा। प्रत्यायन समय सीमा और उपकरण विफलताओं के लिए प्राथमिकता समर्थन।",

    // Industries Section
    "industries.tag": "हम जिन उद्योगों की सेवा करते हैं",
    "industries.title": "स्वास्थ्य सेवा में विश्वसनीय",
    "industries.desc": "हमारे समाधान विश्व भर में विविध स्वास्थ्य सेवा और अनुसंधान संगठनों की सेवा करते हैं।",
    "industries.hospitals.title": "अस्पताल और क्लीनिक",
    "industries.hospitals.desc": "विश्वसनीय QA उपकरणों के साथ डायग्नोस्टिक इमेजिंग विभागों का समर्थन।",
    "industries.research.title": "अनुसंधान संस्थान",
    "industries.research.desc": "अल्ट्रासाउंड थेरेप्यूटिक्स और डायग्नोस्टिक्स में अभूतपूर्व खोजों को सक्षम बनाना।",
    "industries.oem.title": "OEM निर्माता",
    "industries.oem.desc": "अल्ट्रासाउंड डिवाइस उत्पादन के लिए कंपोनेंट और सिस्टम प्रदान करना।",
    "industries.regulatory.title": "नियामक निकाय",
    "industries.regulatory.desc": "उपकरण प्रमाणन और मानक अनुपालन परीक्षण का समर्थन।",

    // Blog Section
    "blog.tag": "अंतर्दृष्टि और अपडेट",
    "blog.title": "ब्लॉग और संसाधन",
    "blog.desc": "अल्ट्रासाउंड गुणवत्ता आश्वासन, HIFU तकनीक, अनुपालन अपडेट और उद्योग सर्वोत्तम प्रथाओं पर विशेषज्ञ लेख।",
    "blog.allposts": "सभी पोस्ट",
    "blog.loading": "लेख लोड हो रहे हैं...",
    "blog.back": "लेखों पर वापस जाएं",
    "blog.comments": "टिप्पणियां",
    "blog.leavecomment": "टिप्पणी छोड़ें",
    "blog.name": "नाम *",
    "blog.email": "ईमेल * (प्रकाशित नहीं)",
    "blog.comment": "टिप्पणी *",
    "blog.postcomment": "टिप्पणी पोस्ट करें",
    "blog.nocomments": "अभी तक कोई टिप्पणी नहीं। अपने विचार साझा करने वाले पहले व्यक्ति बनें!",
    "blog.reply": "जवाब दें",
    "blog.replyingto": "जवाब दे रहे हैं",
    "blog.cancel": "रद्द करें",

    // About Section
    "about.tag": "JJ&A Instruments के बारे में",
    "about.title": "1998 से इंजीनियरिंग उत्कृष्टता",
    "about.desc1": "25 से अधिक वर्षों से, JJ&A Instruments अल्ट्रासाउंड तकनीक नवाचार में अग्रणी रहा है। कैलिफोर्निया के सैन डिएगो में स्थित, हम गहन तकनीकी विशेषज्ञता को गुणवत्ता के प्रति प्रतिबद्धता के साथ जोड़ते हैं जिसने हमें विश्व भर के स्वास्थ्य सेवा संगठनों का विश्वसनीय भागीदार बनाया है।",
    "about.desc2": "क्लिनिकल और औद्योगिक अनुप्रयोगों में पृष्ठभूमि वाले अल्ट्रासाउंड इंजीनियरों द्वारा स्थापित, हम चिकित्सा उपकरण गुणवत्ता आश्वासन और चिकित्सीय अल्ट्रासाउंड प्रणालियों की कठोर मांगों को समझते हैं।",
    "about.desc3": "हमारी टीम RF इंजीनियरिंग, ध्वनिक भौतिकी और नियामक अनुपालन में गहरी विशेषज्ञता को जोड़ती है ताकि ऐसे उत्पाद प्रदान किए जा सकें जो सटीकता और विश्वसनीयता के उच्चतम मानकों को पूरा करें।",
    "about.desc2": "Founded by ultrasound engineers with backgrounds in both clinical and industrial applications, we understand the rigorous demands of medical device quality assurance and therapeutic ultrasound systems.",
    "about.desc3": "Our team combines deep expertise in RF engineering, acoustic physics, and regulatory compliance to deliver products that meet the highest standards of accuracy and reliability.",
    "about.desc2": "हमारे इंजीनियरों और वैज्ञानिकों की टीम अल्ट्रासाउंड कैलिब्रेशन और चिकित्सीय अनुप्रयोगों में संभावनाओं की सीमाओं को लगातार आगे बढ़ाती है, यह सुनिश्चित करते हुए कि हमारे ग्राहकों को सबसे सटीक, विश्वसनीय उपकरण उपलब्ध हों।",
    "about.stat1.number": "5,000+",
    "about.stat1.label": "इकाइयां तैनात",
    "about.stat2.number": "100+",
    "about.stat2.label": "OEM भागीदार",
    "about.stat3.number": "24/7",
    "about.stat3.label": "24/7 सहायता",
    "about.cert.title": "प्रमाणन और मानक",
    "about.cert1": "ISO 13485",
    "about.cert1.desc": "मेडिकल डिवाइस QMS",
    "about.cert2": "CE Marked",
    "about.cert2.desc": "यूरोपीय अनुरूपता",
    "about.cert3": "FDA Registered",
    "about.cert3.desc": "अमेरिकी खाद्य एवं औषधि प्रशासन",
    "about.cert4": "ट्रेसेबल",
    "about.cert4.desc": "NIST ट्रेसेबल कैलिब्रेशन",

    // Contact Section
    "contact.tag": "संपर्क करें",
    "contact.title": "संपर्क करें",
    "contact.desc": "अपनी अल्ट्रासाउंड उपकरण आवश्यकताओं पर चर्चा करने के लिए तैयार हैं? उत्पाद चयन, कस्टम कॉन्फ़िगरेशन और तकनीकी प्रश्नों में सहायता के लिए हमारी टीम यहां है।",
    "contact.call": "कॉल करें",
    "contact.email": "ईमेल",
    "contact.hq": "मुख्यालय",
    "contact.name": "पूरा नाम *",
    "contact.workemail": "कार्य ईमेल *",
    "contact.org": "संगठन *",
    "contact.phone": "फोन नंबर",
    "contact.interest": "मुझे इसमें रुचि है:",
    "contact.interest.doppler": "Mark V डॉप्लर फैंटम",
    "contact.interest.hifu": "HIFU RF पावर जनरेटर",
    "contact.interest.calibration": "कैलिब्रेशन सेवाएं",
    "contact.interest.oem": "OEM साझेदारी",
    "contact.interest.custom": "कस्टम इंजीनियरिंग",
    "contact.interest.general": "सामान्य पूछताछ",
    "contact.message": "संदेश",
    "contact.messagePlaceholder": "अपने प्रोजेक्ट, आवश्यकताओं या प्रश्नों के बारे में बताएं...",
    "contact.submit": "संदेश भेजें",
    "contact.success": "आपकी पूछताछ के लिए धन्यवाद!",
    "contact.response": "हम 1-2 कार्य दिवसों के भीतर जवाब देंगे।",

    // Footer
    "footer.products": "उत्पाद",
    "footer.services": "सेवाएं",
    "footer.calibration": "कैलिब्रेशन",
    "footer.consulting": "अनुपालन परामर्श",
    "footer.customeng": "कस्टम इंजीनियरिंग",
    "footer.oem": "OEM समाधान",
    "footer.resources": "संसाधन",
    "footer.support": "तकनीकी सहायता",
    "footer.docs": "दस्तावेज़ीकरण",
    "footer.company": "कंपनी",
    "footer.careers": "करियर",
    "footer.news": "समाचार",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा की शर्तें",
    "footer.copyright": "© 2024 JJ&A Instruments। सर्वाधिकार सुरक्षित।",
    "footer.location": "सैन डिएगो, CA, USA",
    // Doppler Page
    "doppler.hero.badge": "Medical Ultrasound Quality Assurance Solutions",
    "doppler.hero.title": "Doppler Phantom &<br><em>Ultrasound QA</em>",
    "doppler.hero.subtitle": "The gold standard in medical ultrasound quality assurance. Our Mark V Doppler Phantom delivers NIST-traceable accuracy for clinical QA programs, regulatory compliance, and research applications—trusted by hospitals, OEMs, and academic institutions worldwide.",
    "doppler.hero.cta1": "Request a Quote",
    "doppler.hero.cta2": "QA & Compliance",
    "doppler.whatis.tag": "Understanding Medical Ultrasound QA",
    "doppler.whatis.title": "What is Ultrasound Quality Assurance?",
    "doppler.whatis.lead": "Medical ultrasound quality assurance (QA) is a systematic program of testing and verification that ensures diagnostic ultrasound equipment performs accurately and consistently for patient care.",
    "doppler.whatis.p1": "<strong>Ultrasound QA encompasses</strong> routine performance testing, calibration verification, and documentation required by accrediting bodies such as the American College of Radiology (ACR), Intersocietal Accreditation Commission (IAC), and regulatory agencies including the FDA. A comprehensive QA program protects patients, ensures diagnostic accuracy, and maintains compliance with healthcare standards.",
    "doppler.whatis.p2": "<strong>Doppler velocity calibration</strong> is a critical component of ultrasound QA. Accurate blood flow velocity measurements are essential for diagnosing vascular disease severity, assessing cardiac function, monitoring fetal well-being, and guiding treatment decisions. The JJ&A Instruments Mark V Doppler Phantom provides the NIST-traceable reference standard needed to verify your ultrasound systems measure velocity accurately.",
    "doppler.whatis.p3": "<strong>Why QA matters:</strong> Studies show that uncalibrated ultrasound systems can produce velocity measurement errors of 10-20%, potentially leading to misdiagnosis of conditions like carotid stenosis or cardiac valve disease. Regular QA testing with calibrated phantoms ensures your clinical measurements remain within acceptable accuracy limits.",
    "doppler.whatis.diagram.title": "Ultrasound QA Program Components",
    "doppler.whatis.step1.title": "Doppler Velocity Verification",
    "doppler.whatis.step1.desc": "Verify blood flow velocity accuracy using calibrated string phantoms",
    "doppler.whatis.step2.title": "Image Quality Assessment",
    "doppler.whatis.step2.desc": "Test spatial resolution, contrast, uniformity with tissue phantoms",
    "doppler.whatis.step3.title": "Transducer Performance",
    "doppler.whatis.step3.desc": "Evaluate probe sensitivity, dead elements, and acoustic output",
    "doppler.whatis.step4.title": "Documentation & Compliance",
    "doppler.whatis.step4.desc": "Maintain records for ACR, IAC, ICAVL, Joint Commission audits",
    "doppler.product.tag": "Our Products",
    "doppler.product.title": "Mark V Doppler Phantom",
    "doppler.product.desc": "The industry standard for Doppler velocity calibration and ultrasound quality assurance. Trusted by clinical facilities, OEM manufacturers, and research institutions worldwide.",
    "doppler.features.range.title": "Clinical Velocity Range",
    "doppler.features.range.desc": "10-200 cm/s covers all clinical blood flow velocities from venous flow to peak arterial systole, supporting vascular, cardiac, obstetric, and transcranial Doppler QA.",
    "doppler.features.accuracy.title": "NIST-Traceable Accuracy",
    "doppler.features.accuracy.desc": "±1% velocity accuracy with Certificate of Calibration traceable to National Institute of Standards and Technology—essential for regulatory compliance.",
    "doppler.features.compliance.title": "Compliance Ready",
    "doppler.features.compliance.desc": "Designed to meet ACR, IAC, ICAVL, AIUM, and Joint Commission ultrasound QA requirements. Export documentation in accreditation-ready formats.",
    "doppler.features.setup.title": "5-Minute Setup",
    "doppler.features.setup.desc": "No blood-mimicking fluid preparation, temperature stabilization, or complex alignment. Rapid setup maximizes QA testing efficiency.",
    "doppler.features.angles.title": "Multi-Angle Testing",
    "doppler.features.angles.desc": "Verify Doppler angle correction accuracy at 30°, 45°, and 60° angles using integrated positioning guides—critical for proper velocity calculation.",
    "doppler.features.export.title": "USB Data Export",
    "doppler.features.export.desc": "Export calibration results in PDF and CSV formats. Integrate with QA management systems for streamlined documentation and audit trails.",
    "doppler.compliance.tag": "Regulatory Compliance",
    "doppler.compliance.title": "Ultrasound Compliance & Accreditation",
    "doppler.compliance.desc": "Meet the quality assurance requirements of major accrediting bodies and regulatory agencies with documented Doppler velocity calibration.",
    "doppler.compliance.row1": "Annual Doppler QA required",
    "doppler.compliance.row2": "Echo & Vascular standards",
    "doppler.compliance.row3": "Velocity accuracy verification",
    "doppler.compliance.row4": "Equipment management standards",
    "doppler.compliance.row5": "Quality System Regulation",
    "doppler.compliance.row6": "Ultrasound field characterization",
    "doppler.compliance.row7": "Practice guidelines compliance",
    "doppler.compliance.row8": "Medical device QMS",
    "doppler.compliance.cta": "Get Compliance Support",
    "doppler.compliance.doclabel": "Accreditation-Ready Documentation",
    "doppler.services.tag": "Professional Services",
    "doppler.services.title": "Ultrasound Calibration Services",
    "doppler.services.desc": "Comprehensive NIST-traceable calibration services for Doppler ultrasound equipment. Supporting clinical facilities, OEM manufacturers, and research institutions with expert quality assurance.",
    "doppler.services.onsite.title": "On-Site Calibration",
    "doppler.services.onsite.desc": "Our technicians come to your facility with calibrated reference equipment. Minimize downtime while ensuring your ultrasound systems meet accuracy specifications.",
    "doppler.services.depot.title": "Depot Calibration",
    "doppler.services.depot.desc": "Ship your phantom to our ISO 17025-compliant laboratory for comprehensive calibration. 5-7 business day turnaround with detailed certification documentation.",
    "doppler.services.accreditation.title": "Accreditation Support",
    "doppler.services.accreditation.desc": "Complete documentation packages for ACR, IAC, ICAVL, and Joint Commission audits. QA protocol templates and compliance consulting available.",
    "doppler.services.recert.title": "Annual Recertification",
    "doppler.services.recert.desc": "Keep your phantom NIST-traceable with annual recertification services. Maintain compliance with accreditation requirements and ensure ongoing accuracy.",
    "doppler.services.training.title": "QA Training",
    "doppler.services.training.desc": "On-site training for your sonographers and QA staff. Learn proper phantom operation, testing protocols, and documentation procedures.",
    "doppler.services.emergency.title": "Emergency Service",
    "doppler.services.emergency.desc": "48-hour expedited calibration available for urgent needs. Don't let equipment issues delay your accreditation or patient care.",
    "doppler.research.tag": "Beyond Clinical",
    "doppler.research.title": "Production & Research Applications",
    "doppler.research.desc": "Our doppler phantoms serve critical roles in ultrasound manufacturing quality control, academic research, and medical device development.",
    "doppler.research.oem.title": "OEM Manufacturing QA",
    "doppler.research.oem.desc": "Ultrasound manufacturers rely on our phantoms for production line testing and final QA verification. Ensure every unit shipped meets Doppler velocity specifications with NIST-traceable reference standards. Support ISO 13485 and FDA 21 CFR Part 820 compliance.",
    "doppler.research.rnd.title": "R&D and Product Development",
    "doppler.research.rnd.desc": "Develop and validate new Doppler algorithms, signal processing techniques, and imaging modalities. Our phantoms provide the consistent, repeatable velocity references needed for quantitative research and regulatory submissions.",
    "doppler.research.academic.title": "Academic Research",
    "doppler.research.academic.desc": "Universities and research institutions use our phantoms for hemodynamic studies, cardiovascular imaging research, and sonography education. Published velocity accuracy data supports peer-reviewed research credibility.",
    "doppler.research.service.title": "Service Organizations",
    "doppler.research.service.desc": "Biomedical equipment service companies use our phantoms for post-repair verification and preventive maintenance testing. Demonstrate to customers that repaired equipment meets original performance specifications.",
    "doppler.apps.tag": "Clinical Applications",
    "doppler.apps.title": "Blood Flow Velocity Calibration",
    "doppler.apps.desc": "Essential for any facility performing Doppler ultrasound examinations where verified blood flow velocity accuracy impacts patient diagnosis and treatment.",
    "doppler.apps.vascular.title": "Vascular Laboratory QA",
    "doppler.apps.vascular.desc": "Verify carotid artery velocity measurements critical for stenosis grading per NASCET/ECST criteria. Ensure peripheral arterial and venous Doppler accuracy for DVT diagnosis and arterial disease assessment.",
    "doppler.apps.echo.title": "Echocardiography",
    "doppler.apps.echo.desc": "Validate transmitral and transaortic flow velocities for cardiac output calculations. Essential for accurate E/A ratio, valve gradient measurements, and hemodynamic assessments per ASE guidelines.",
    "doppler.apps.ob.title": "Obstetric Doppler",
    "doppler.apps.ob.desc": "Calibrate umbilical artery and middle cerebral artery measurements. Accurate velocities and ratios are critical for fetal well-being assessment, IUGR detection, and high-risk pregnancy monitoring.",
    "doppler.apps.tcd.title": "Transcranial Doppler",
    "doppler.apps.tcd.desc": "Verify TCD velocity accuracy for stroke risk assessment, vasospasm monitoring in SAH patients, brain death determination protocols, and sickle cell disease screening programs.",
    "doppler.apps.acceptance.title": "Equipment Acceptance Testing",
    "doppler.apps.acceptance.desc": "Baseline Doppler calibration for new ultrasound system installation. Verify performance meets manufacturer specifications before clinical use—essential for capital equipment validation.",
    "doppler.apps.compliance.title": "Accreditation Compliance",
    "doppler.apps.compliance.desc": "Meet ACR, IAC, ICAVL, and Joint Commission ultrasound accreditation requirements with documented Doppler velocity calibration and comprehensive QA protocols.",
    "doppler.specs.tag": "Technical Details",
    "doppler.specs.title": "Mark V Specifications",
    "doppler.specs.desc": "Engineered to meet the demanding requirements of clinical ultrasound QA and regulatory compliance testing.",
    "doppler.specs.velocity.title": "Velocity Performance",
    "doppler.specs.velocity.desc": "<strong>Range:</strong> 10 – 200 cm/s<br><strong>Accuracy:</strong> ±1% of reading<br><strong>Resolution:</strong> 0.1 cm/s<br><strong>Stability:</strong> ±0.5% over 8 hours",
    "doppler.specs.physical.title": "Physical Specifications",
    "doppler.specs.physical.desc": "<strong>Dimensions:</strong> 45 × 25 × 18 cm<br><strong>Weight:</strong> 5.2 kg (11.5 lbs)<br><strong>String:</strong> 0.1mm nylon monofilament<br><strong>Tank:</strong> Degassed water bath",
    "doppler.specs.acoustic.title": "Acoustic Properties",
    "doppler.specs.acoustic.desc": "<strong>Window:</strong> TPX membrane 60×120mm<br><strong>Probe Compatibility:</strong> 2-15 MHz<br><strong>Doppler Angles:</strong> 30°, 45°, 60° guides<br><strong>Depth:</strong> 2-8 cm adjustable",
    "doppler.specs.standards.title": "Compliance & Standards",
    "doppler.specs.standards.desc": "<strong>Standards:</strong> IEC 62359, FDA QSR<br><strong>Power:</strong> 100-240V AC, 50/60Hz<br><strong>Certifications:</strong> CE marked<br><strong>Warranty:</strong> 2 years comprehensive",
    "doppler.faq.tag": "Common Questions",
    "doppler.faq.title": "Ultrasound QA FAQ",
    "doppler.faq.q1": "How often should Doppler ultrasound equipment be calibrated?",
    "doppler.faq.a1": "The American College of Radiology (ACR) and Intersocietal Accreditation Commission (IAC) recommend Doppler velocity verification at least annually. Many accredited vascular laboratories perform quarterly calibration checks as part of their quality assurance program. Additional testing is recommended after equipment service, software updates, transducer replacement, or any time measurement accuracy is questioned.",
    "doppler.faq.q2": "What accreditation standards require ultrasound QA testing?",
    "doppler.faq.a2": "Multiple accrediting bodies require documented ultrasound quality assurance programs: <strong>ACR</strong> (American College of Radiology) requires annual phantom testing; <strong>IAC</strong> (Intersocietal Accreditation Commission) covers echocardiography and vascular testing; <strong>ICAVL</strong> (Intersocietal Commission for the Accreditation of Vascular Laboratories) requires velocity accuracy verification; <strong>The Joint Commission</strong> mandates equipment management and QA programs; and <strong>AIUM</strong> (American Institute of Ultrasound in Medicine) publishes practice guidelines. Our phantom and documentation support all these standards.",
    "doppler.faq.q3": "What is the difference between a string phantom and a flow phantom?",
    "doppler.faq.a3": "String phantoms use a moving filament at precisely controlled velocities, eliminating variables like blood-mimicking fluid temperature, viscosity, and particle concentration. This provides more consistent, reproducible calibration results with minimal maintenance. Flow phantoms with blood-mimicking fluid can better simulate certain acoustic properties like scattering, but require temperature control, regular fluid replacement, and more complex setup. For Doppler velocity calibration, string phantoms offer superior accuracy and practicality.",
    "doppler.faq.q4": "Is the Mark V compatible with my ultrasound system?",
    "doppler.faq.a4": "Yes. The Mark V Doppler Phantom is compatible with all diagnostic ultrasound systems with Doppler capability, including GE, Philips, Siemens, Canon (Toshiba), Samsung, Fujifilm, Mindray, and other manufacturers. The 2-15 MHz probe compatibility covers virtually all clinical transducers used in vascular, cardiac, obstetric, and general imaging applications.",
    "doppler.faq.q5": "What blood flow velocities can I test?",
    "doppler.faq.a5": "The Mark V covers 10-200 cm/s, spanning the full range of clinical blood flow velocities: venous flow (10-30 cm/s), normal arterial flow (30-100 cm/s), and peak systolic velocities in stenotic vessels or cardiac applications (up to 200 cm/s and beyond). This range supports carotid stenosis grading, peripheral vascular assessment, cardiac valve evaluation, obstetric Doppler, and transcranial Doppler applications.",
    "doppler.faq.q6": "How does NIST-traceable calibration work?",
    "doppler.faq.a6": "NIST-traceable calibration means our phantom's velocity accuracy can be documented through an unbroken chain of comparisons back to the National Institute of Standards and Technology. Each Mark V ships with a Certificate of Calibration showing measurement uncertainty and traceability. Annual recertification maintains this traceability—essential for regulatory compliance and accreditation audits.",
    "doppler.faq.q7": "What documentation is provided for accreditation?",
    "doppler.faq.a7": "Each Mark V ships with a Certificate of Calibration traceable to NIST standards. The unit exports test results in PDF and CSV formats compatible with ACR, IAC, ICAVL, and Joint Commission accreditation requirements. We also provide template QA protocols, testing procedure documentation, and guidance for laboratory accreditation submissions. Our support team can assist with specific accreditation documentation requirements.",
    "doppler.faq.q8": "Do you support OEM and research applications?",
    "doppler.faq.a8": "Yes. We supply doppler phantoms to ultrasound OEM manufacturers for production testing and QA, to medical device developers for R&D and regulatory submissions, and to academic institutions for research and education. Volume pricing and custom configurations are available for OEM and institutional customers. Contact us to discuss your specific requirements.",
    // HIFU Page
    "hifu.hero.badge": "Complete HIFU Driving System",
    "hifu.hero.title": "HIFU RF<br><em>Power System</em>",
    "hifu.hero.subtitle": "A complete, ready-to-use HIFU driving system—just add your transducer. Frequency generator, precision timing circuits, power amplifier, safety systems, and full system control all integrated in one unit. Simple ASCII commands via a single USB port. Power on and start treating.",
    "hifu.hero.cta2": "View Specifications",
    "hifu.trust.usb": "USB Port",
    "hifu.trust.allinone.num": "All-in-One",
    "hifu.trust.allinone.label": "Complete System",
    "hifu.trust.power": "Max Power",
    "hifu.whatis.tag": "Understanding HIFU Technology",
    "hifu.whatis.title": "What is High-Intensity Focused Ultrasound?",
    "hifu.whatis.lead": "High-Intensity Focused Ultrasound (HIFU) is a non-invasive therapeutic technique that uses focused acoustic energy to precisely heat and ablate tissue deep within the body—without incisions or radiation.",
    "hifu.whatis.p1": "<strong>A complete system, not just an amplifier:</strong> Our HIFU RF Power System integrates everything you need to drive your transducer: precision frequency generator, timing and gating circuits, high-power RF amplifier, comprehensive safety systems, and full digital control. Just connect your transducer and you're ready to go.",
    "hifu.whatis.p2": "<strong>Simple USB control:</strong> No complex interfaces or proprietary software. Send simple ASCII text commands through a single USB port to control frequency, power, pulse timing, and all system functions. Works with any programming language or terminal program. Full documentation included.",
    "hifu.whatis.p3": "<strong>Built-in safety:</strong> VSWR protection, over-temperature shutdown, arc detection, and hardware interlocks are all integrated. Focus on your application—the safety systems handle the rest.",
    "hifu.whatis.diagram.title": "What's Included",
    "hifu.whatis.step1.title": "Frequency Generator",
    "hifu.whatis.step1.desc": "Precision DDS synthesis, 0.5-7 MHz range",
    "hifu.whatis.step2.title": "Timing & Gating Circuits",
    "hifu.whatis.step2.desc": "Programmable pulse control, <10 μs response",
    "hifu.whatis.step3.title": "RF Power Amplifier",
    "hifu.whatis.step3.desc": "Up to 500W continuous, impedance matched",
    "hifu.whatis.step4.title": "Safety Systems",
    "hifu.whatis.step4.desc": "VSWR, thermal, arc protection & interlocks",
    "hifu.whatis.step5.title": "USB Control Interface",
    "hifu.whatis.step5.desc": "Simple ASCII commands, works with any software",
    "hifu.whatis.diagram.footer": "You provide: Your transducer",
    "hifu.features.tag": "Complete System Features",
    "hifu.features.title": "Everything You Need, Integrated",
    "hifu.features.desc": "A turnkey HIFU driving solution—connect your transducer, plug in USB, and you're ready. No external signal generators, amplifiers, or control systems required.",
    "hifu.features.power.title": "High Power Output",
    "hifu.features.power.desc": "Up to 500W continuous wave (CW) or pulsed output. Scalable configurations from 100W to multi-kilowatt systems for different clinical applications.",
    "hifu.features.freq.title": "Wide Frequency Range",
    "hifu.features.freq.desc": "0.5 MHz to 7 MHz covers all HIFU applications—from deep tissue ablation (0.5-1 MHz) to superficial aesthetic treatments (3-7 MHz).",
    "hifu.features.array.title": "Multi-Channel Arrays",
    "hifu.features.array.desc": "Support for phased array transducers with up to 256 independently controlled channels. Electronic beam steering and focal point adjustment.",
    "hifu.features.response.title": "Fast Response Time",
    "hifu.features.response.desc": "<10 μs rise/fall times for precise pulsed operation. Real-time power control for temperature-guided therapy and motion tracking.",
    "hifu.features.safety.title": "Built-in Safety Systems",
    "hifu.features.safety.desc": "VSWR protection, over-temperature shutdown, and arc detection. Hardware interlocks and software limits ensure safe operation.",
    "hifu.features.control.title": "Simple ASCII Control",
    "hifu.features.control.desc": "One USB port. Simple ASCII text commands. Control frequency, power, timing—everything—from any terminal or programming language. No proprietary software needed.",
    "hifu.apps.tag": "Clinical & Research Applications",
    "hifu.apps.title": "HIFU Applications",
    "hifu.apps.desc": "Our RF power generators support the full spectrum of focused ultrasound applications—from life-saving tumor ablation to cutting-edge research.",
    "hifu.apps.oncology.title": "Oncology & Tumor Ablation",
    "hifu.apps.oncology.desc": "Non-invasive treatment of solid tumors in prostate, liver, breast, kidney, and bone. HIFU offers an alternative to surgery for patients who are not surgical candidates. The 2024 oncology segment represents 41% of the global HIFU market, with FDA-cleared systems like Focal One® driving adoption.",
    "hifu.apps.neuro.title": "Neurology & Brain Therapy",
    "hifu.apps.neuro.desc": "MRI-guided focused ultrasound for essential tremor, Parkinson's disease tremor, and neuropathic pain. HIFU can create precise lesions in deep brain structures without opening the skull—a breakthrough alternative to invasive neurosurgery. Our MRI-compatible generators enable integration with MRgFUS platforms.",
    "hifu.apps.aesthetic.title": "Aesthetic & Cosmetic",
    "hifu.apps.aesthetic.desc": "Non-invasive skin tightening, wrinkle reduction, and body contouring. Higher frequency HIFU (3-7 MHz) targets the SMAS layer and subcutaneous fat for cosmetic improvement without surgery. The aesthetic HIFU segment is the fastest-growing market, driven by consumer demand for minimally invasive treatments.",
    "hifu.apps.rnd.title": "Research & Development",
    "hifu.apps.rnd.desc": "Flexible configurations for academic and industrial R&D. Develop new HIFU applications, validate treatment protocols, and characterize transducer performance. Our generators support the full research cycle from bench experiments to preclinical studies and regulatory submissions.",
    "hifu.apps.oem.title": "OEM System Integration",
    "hifu.apps.oem.desc": "Designed for integration into commercial HIFU systems. Compact form factor, comprehensive API, and regulatory documentation support FDA 510(k) and CE marking submissions. Volume pricing and design-in support for OEM partnerships.",
    "hifu.apps.drug.title": "Drug Delivery & Sonoporation",
    "hifu.apps.drug.desc": "Low-intensity pulsed HIFU for enhanced drug delivery, blood-brain barrier opening, and sonodynamic therapy research. Precise pulse control enables investigation of bioeffects beyond thermal ablation.",
    "hifu.specs.tag": "Technical Details",
    "hifu.specs.title": "Complete System Specifications",
    "hifu.specs.desc": "All-in-one system includes frequency generator, timing circuits, amplifier, safety systems, and USB control. Just connect your transducer.",
    "hifu.specs.row1.label": "Frequency Range",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "Frequency Stability",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "Output Power (CW)",
    "hifu.specs.row3.value": "100W / 250W / 500W models",
    "hifu.specs.row4.label": "Output Power (Pulsed)",
    "hifu.specs.row4.value": "Up to 1000W peak",
    "hifu.specs.row5.label": "Power Resolution",
    "hifu.specs.row5.value": "0.1W (digital control)",
    "hifu.specs.row6.label": "Rise/Fall Time",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "Duty Cycle",
    "hifu.specs.row7.value": "0-100% (CW or pulsed)",
    "hifu.specs.row8.label": "Output Impedance",
    "hifu.specs.row8.value": "50Ω nominal",
    "hifu.specs.row9.label": "VSWR Protection",
    "hifu.specs.row9.value": "Auto-shutdown at 3:1",
    "hifu.specs.row10.label": "Control Interface",
    "hifu.specs.row10.value": "USB (ASCII commands)",
    "hifu.specs.row11.label": "Cooling",
    "hifu.specs.row11.value": "Forced air / Water options",
    "hifu.specs.row12.label": "MRI Compatibility",
    "hifu.specs.row12.value": "Optional shielded version",
    "hifu.specs.cta": "Request Full Specifications",
    "hifu.specs.avail": "Available: 100W, 250W, 500W Models",
    "hifu.why.tag": "Why JJ&A Instruments",
    "hifu.why.title": "The HIFU Generator Advantage",
    "hifu.why.desc": "Purpose-built for therapeutic ultrasound with the reliability and support that medical device developers demand.",
    "hifu.why.quality.title": "Medical-Grade Quality",
    "hifu.why.quality.desc": "ISO 13485 certified manufacturing. Designed and documented to support FDA 510(k) and CE marking submissions for your HIFU system.",
    "hifu.why.support.title": "Applications Engineering",
    "hifu.why.support.desc": "Our RF engineers understand HIFU applications. Get expert support for transducer matching, thermal management, and system integration.",
    "hifu.why.global.title": "Global Availability",
    "hifu.why.global.desc": "Worldwide shipping with local support in North America, Europe, and Asia-Pacific. Evaluation units available for qualified projects.",
    "hifu.why.api.title": "Comprehensive APIs",
    "hifu.why.api.desc": "Full software control via documented APIs. LabVIEW VIs, Python libraries, and C/C++ SDK included. Rapid integration with your control system.",
    "hifu.why.longterm.title": "Long-Term Support",
    "hifu.why.longterm.desc": "5-year product availability guarantee. Extended warranty options. Calibration and maintenance services to keep your system running.",
    "hifu.why.custom.title": "Custom Configurations",
    "hifu.why.custom.desc": "Need a specific frequency, power level, or form factor? Our engineering team can customize generators for your unique requirements.",
    "hifu.faq.tag": "Common Questions",
    "hifu.faq.title": "HIFU Generator FAQ",
    "hifu.faq.q1": "What is HIFU and how does it work?",
    "hifu.faq.a1": "High-Intensity Focused Ultrasound (HIFU) uses focused acoustic energy to heat and destroy targeted tissue non-invasively. An RF power generator drives piezoelectric transducers that convert electrical energy into ultrasound waves. These waves are focused to a precise point in the body—like sunlight through a magnifying glass—where temperatures reach 60-85°C, causing thermal ablation of the target tissue while sparing surrounding structures.",
    "hifu.faq.q2": "What frequency should I use for my HIFU application?",
    "hifu.faq.a2": "Frequency selection depends on treatment depth and target tissue. <strong>Lower frequencies (0.5-1 MHz)</strong> penetrate deeper (up to 15 cm) and are used for tumor ablation in liver, kidney, and prostate. <strong>Mid-range frequencies (1-3 MHz)</strong> are common for neurological HIFU and general therapeutic applications. <strong>Higher frequencies (3-7 MHz)</strong> provide precise, shallow penetration for aesthetic treatments targeting skin layers. Our team can help you select the optimal frequency for your specific application.",
    "hifu.faq.q3": "Is the generator compatible with MRI environments?",
    "hifu.faq.a3": "Yes. We offer MRI-compatible versions with EMI shielding and non-magnetic construction for MR-guided Focused Ultrasound (MRgFUS) applications. These generators can operate inside the MRI suite without interfering with imaging. The shielded version has been validated at 1.5T and 3T field strengths. Contact us to discuss your specific MRI integration requirements.",
    "hifu.faq.q4": "Can the generator drive phased array transducers?",
    "hifu.faq.a4": "Yes. We offer multi-channel configurations with up to 256 independently controlled channels for phased array transducers. Each channel provides individual amplitude and phase control for electronic beam steering and focal point adjustment. Multi-channel systems include synchronization features for coherent operation. Single-element and annular array transducers are also fully supported.",
    "hifu.faq.q5": "What safety features are included?",
    "hifu.faq.a5": "Safety is built into every generator: <strong>VSWR protection</strong> automatically reduces power if reflected power exceeds safe limits (prevents transducer damage). <strong>Over-temperature protection</strong> monitors internal temperatures and shuts down before overheating. <strong>Arc detection</strong> instantly cuts power if arcing is detected in the RF path. <strong>Hardware interlocks</strong> support external safety switches and emergency stops. <strong>Software limits</strong> allow you to define application-specific power and duration limits.",
    "hifu.faq.q6": "What regulatory documentation is available?",
    "hifu.faq.a6": "We provide comprehensive documentation to support your regulatory submissions: <strong>Design history file</strong> including specifications, test reports, and traceability. <strong>Risk analysis</strong> per ISO 14971. <strong>EMC test reports</strong> per IEC 60601-1-2. <strong>Electrical safety testing</strong> per IEC 60601-1. <strong>Certificates</strong> of conformance and calibration. Our regulatory affairs team can assist with FDA 510(k) and CE marking questions.",
    "hifu.faq.q7": "Do you support OEM integration and custom configurations?",
    "hifu.faq.a7": "Yes. We work closely with HIFU system developers on OEM projects: <strong>Custom frequencies</strong> matched to your transducer. <strong>Modified form factors</strong> for integration into your system enclosure. <strong>Custom interfaces</strong> and control protocols. <strong>Private labeling</strong> available. <strong>Volume pricing</strong> for production quantities. We can also provide design-in support, prototypes, and engineering samples for evaluation.",
    "hifu.faq.q8": "What is the warranty and support policy?",
    "hifu.faq.a8": "Standard warranty is 2 years covering parts and labor. Extended warranty options up to 5 years are available. Support includes: <strong>Phone and email technical support</strong> during business hours. <strong>Remote diagnostics</strong> via network connection. <strong>Repair and calibration services</strong> at our facility. <strong>Loaner units</strong> available for qualified customers during repairs. <strong>On-site service</strong> available for an additional fee.",
    "hifu.contact.desc": "Ready to power your HIFU application? Contact us for pricing, specifications, or to discuss your project requirements with our engineering team.",
    "footer.applications": "Applications",
    "hifu.apps.oncology.short": "Tumor Ablation",
    "hifu.apps.neuro.short": "Neurology",
    "hifu.apps.aesthetic.short": "Aesthetics",
    "hifu.apps.rnd.short": "Research",
    "nav.compliance": "QA & Compliance",
    "footer.recertification": "Phantom Recertification",
    "nav.faq": "FAQ",
    "footer.docs": "Technical Documents",
    "footer.protocols": "QA Protocols",
    "nav.specs": "Specifications",
    "nav.home": "Home",
    "footer.desc": "डायग्नोस्टिक QA और चिकित्सीय अनुप्रयोगों के लिए सटीक अल्ट्रासाउंड उपकरण। विश्व भर के स्वास्थ्य सेवा प्रदाताओं और शोधकर्ताओं द्वारा विश्वसनीय।",
    "footer.accessories": "सहायक उपकरण",
    "footer.parts": "प्रतिस्थापन पुर्जे",
    "footer.descDoppler": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन, नियामक अनुपालन और अनुसंधान अनुप्रयोगों के लिए सटीक डॉप्लर फैंटम और अल्ट्रासाउंड कैलिब्रेशन सेवाएं।",
    "footer.oemResearch": "OEM और अनुसंधान",

    // Navigation - Additional
    "nav.calibration": "कैलिब्रेशन सेवाएं",
    "nav.applications": "अनुप्रयोग",

    // Aria Labels for Accessibility
    "aria.mainNav": "मुख्य नेविगेशन",
    "aria.home": "JJ&A Instruments होम",
    "aria.toggleMenu": "मेनू टॉगल करें",
    "aria.selectLang": "भाषा चुनें",
    "aria.contactForm": "संपर्क फॉर्म",
    "aria.footerNav": "फुटर नेविगेशन",

    // Placeholders
    "placeholder.comment": "अपने विचार साझा करें...",
    "placeholder.message": "हमें अपनी परियोजना, आवश्यकताओं या प्रश्नों के बारे में बताएं...",
    "placeholder.messageDoppler": "हमें अपनी अल्ट्रासाउंड QA आवश्यकताओं, प्रत्यायन आवश्यकताओं या अनुसंधान अनुप्रयोगों के बारे में बताएं...",

    // Contact Form Options - Index page
    "contact.option.doppler": "Mark V डॉप्लर फैंटम",
    "contact.option.hifu": "HIFU RF पावर जनरेटर",
    "contact.option.calibration": "कैलिब्रेशन सेवाएं",
    "contact.option.oem": "OEM साझेदारी",
    "contact.option.custom": "कस्टम इंजीनियरिंग",
    "contact.option.general": "सामान्य पूछताछ",

    // Contact Form Options - Doppler page
    "contact.option.phantomQuote": "Mark V डॉप्लर फैंटम कोट",
    "contact.option.calibrationService": "अल्ट्रासाउंड कैलिब्रेशन सेवाएं",
    "contact.option.qaCompliance": "QA और अनुपालन समर्थन",
    "contact.option.oemResearch": "OEM / अनुसंधान अनुप्रयोग",
    "contact.option.recertification": "फैंटम पुन: प्रमाणन",

    // Contact Form Options - HIFU page
    "contact.option.hifuQuote": "HIFU RF जनरेटर कोट",
    "contact.option.hifuSpecs": "तकनीकी विनिर्देश",
    "contact.option.hifuCustom": "कस्टम कॉन्फ़िगरेशन",
    "contact.option.hifuResearch": "अनुसंधान अनुप्रयोग",
    "contact.option.hifuEval": "मूल्यांकन इकाई",

    // Placeholder - HIFU page
    "placeholder.messageHifu": "हमें अपने HIFU अनुप्रयोग, लक्ष्य आवृत्ति, पावर आवश्यकताओं या एकीकरण आवश्यकताओं के बारे में बताएं...",
  },
};

// Language display names
const languageNames = {
  en: {short: "EN", full: "🇺🇸 English"},
  hi: {short: "हिं", full: "🇮🇳 हिन्दी"},
  zh: {short: "中", full: "🇨🇳 中文"},
  ja: {short: "日", full: "🇯🇵 日本語"},
};

// i18n Class
class I18n {
  constructor() {
    this.currentLang = this.getStoredLanguage() || this.detectLanguage();
    this.init();
  }

  // Detect browser language
  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0];

    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    if (urlLang && translations[urlLang]) {
      return urlLang;
    }

    // Check if we support the browser language
    if (translations[langCode]) {
      return langCode;
    }

    // Check for Chinese variants
    if (browserLang.startsWith("zh")) {
      return "zh";
    }

    return "en"; // Default to English
  }

  // Get stored language preference
  getStoredLanguage() {
    try {
      return localStorage.getItem("preferred_language");
    } catch (e) {
      return null;
    }
  }

  // Store language preference
  storeLanguage(lang) {
    try {
      localStorage.setItem("preferred_language", lang);
    } catch (e) {
      // localStorage not available
    }
  }

  // Initialize i18n
  init() {
    this.setupLanguageSelector();
    this.applyTranslations();
    this.updateDocumentLang();

    // Auto-detect country if no preference stored
    if (!this.getStoredLanguage()) {
      this.detectCountry().then(lang => {
        if (lang && lang !== this.currentLang && translations[lang]) {
          console.log("Auto-switching to country language:", lang);
          this.changeLanguage(lang);
        }
      });
    }
  }

  async detectCountry() {
    try {
      const cachedGeo = sessionStorage.getItem("geo_language");
      if (cachedGeo) return cachedGeo;

      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) return null;
      const data = await response.json();
      const country = data.country_code;

      let lang = null;
      if (country === "CN") lang = "zh";
      else if (country === "JP") lang = "ja";
      else if (country === "IN") lang = "hi";

      if (lang) {
        sessionStorage.setItem("geo_language", lang);
        return lang;
      }
    } catch (e) {
      // Fail silently
    }
    return null;
  }

  // Setup language selector functionality
  setupLanguageSelector() {
    const langSelector = document.querySelector(".lang-selector");
    const langBtn = document.querySelector(".lang-btn");
    const langDropdown = document.querySelector(".lang-dropdown");
    const currentLangDisplay = document.querySelector(".current-lang");

    if (!langSelector || !langBtn) return;

    // Update current language display
    if (currentLangDisplay) {
      currentLangDisplay.textContent = languageNames[this.currentLang].short;
    }

    // Update active state in dropdown
    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add("active");
      }
    });

    // Toggle dropdown
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langSelector.classList.toggle("active");
      langBtn.setAttribute("aria-expanded", langSelector.classList.contains("active"));
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      langSelector.classList.remove("active");
      langBtn.setAttribute("aria-expanded", "false");
    });

    // Handle language selection
    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newLang = btn.dataset.lang;
        this.changeLanguage(newLang);
        langSelector.classList.remove("active");
      });
    });
  }

  // Change language
  changeLanguage(lang) {
    if (!translations[lang]) return;

    this.currentLang = lang;
    this.storeLanguage(lang);
    this.applyTranslations();
    this.updateDocumentLang();

    // Update URL without reload
    const url = new URL(window.location);
    if (lang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.pushState({}, "", url);

    // Update current language display
    const currentLangDisplay = document.querySelector(".current-lang");
    if (currentLangDisplay) {
      currentLangDisplay.textContent = languageNames[lang].short;
    }

    // Update active state in dropdown
    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
      }
    });
  }

  // Apply translations to the page
  applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      const key = el.dataset.i18n;
      const translation = translations[this.currentLang]?.[key];

      if (translation) {
        // Check if it contains HTML
        if (translation.includes("<")) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Apply aria-label translations
    const ariaElements = document.querySelectorAll("[data-i18n-aria]");
    ariaElements.forEach((el) => {
      const key = el.dataset.i18nAria;
      const translation = translations[this.currentLang]?.[key];
      if (translation) {
        el.setAttribute("aria-label", translation);
      }
    });

    // Apply placeholder translations
    const placeholderElements = document.querySelectorAll("[data-i18n-placeholder]");
    placeholderElements.forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const translation = translations[this.currentLang]?.[key];
      if (translation) {
        el.setAttribute("placeholder", translation);
      }
    });

    // Update page title
    const titleTranslation = translations[this.currentLang]?.["meta.title"];
    if (titleTranslation) {
      document.title = titleTranslation;
    }
  }

  // Update document lang attribute
  updateDocumentLang() {
    document.documentElement.lang = this.currentLang;

    // Update dir attribute for RTL languages (not needed for our languages)
    document.documentElement.dir = "ltr";
  }

  // Get translation
  t(key) {
    return translations[this.currentLang]?.[key] || translations.en?.[key] || key;
  }
}

// Initialize i18n when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.i18n = new I18n();
});

// ==========================================
// BLOG FUNCTIONALITY
// ==========================================

class Blog {
  constructor() {
    // API base URL - configurable for development/production
    this.apiBase = window.BLOG_API_URL || "/api";

    // State
    this.currentPage = 1;
    this.currentCategory = "all";
    this.currentSlug = null;
    this.postsPerPage = 6;

    // DOM Elements
    this.listView = document.getElementById("blog-list-view");
    this.postView = document.getElementById("blog-post-view");
    this.postsContainer = document.getElementById("blog-posts-container");
    this.paginationContainer = document.getElementById("blog-pagination");
    this.categoryFilters = document.getElementById("blog-category-filters");
    this.backBtn = document.getElementById("blog-back-btn");
    this.commentForm = document.getElementById("comment-form");
    this.commentsList = document.getElementById("comments-list");

    // Initialize
    this.init();
  }

  async init() {
    if (!this.postsContainer) return;

    // Load categories and posts
    await Promise.all([this.loadCategories(), this.loadPosts()]);

    // Setup event listeners
    this.setupEventListeners();

    // Check for post slug in URL hash
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());
  }

  setupEventListeners() {
    // Back button
    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.showListView());
    }

    // Category filter buttons
    document.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.filterByCategory(category);
      });
    });

    // Comment form
    if (this.commentForm) {
      this.commentForm.addEventListener("submit", (e) => this.handleCommentSubmit(e));
    }

    // Cancel reply button
    const cancelReply = document.getElementById("cancel-reply");
    if (cancelReply) {
      cancelReply.addEventListener("click", () => this.cancelReply());
    }
  }

  handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith("#blog/")) {
      const slug = hash.replace("#blog/", "");
      if (slug) {
        this.loadPost(slug);
      }
    } else if (hash === "#blog") {
      this.showListView();
    }
  }

  // ============ API Methods ============

  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      // Check content type to ensure we got JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:", contentType);
        throw new Error("API returned invalid response format");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({error: "Request failed"}));
        throw new Error(error.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ============ Posts Methods ============

  async loadCategories() {
    try {
      const categories = await this.fetchAPI("/categories");
      this.renderCategoryFilters(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  renderCategoryFilters(categories) {
    if (!this.categoryFilters) return;

    this.categoryFilters.innerHTML = categories
      .map(
        (cat) => `
      <button class="blog-filter-btn" data-category="${this.escapeHtml(cat.category)}">
        ${this.escapeHtml(cat.category)} (${cat.count})
      </button>
    `
      )
      .join("");

    // Add click listeners to new buttons
    this.categoryFilters.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.filterByCategory(category);
      });
    });
  }

  async loadPosts() {
    this.showLoading();

    try {
      let endpoint = `/posts?page=${this.currentPage}&per_page=${this.postsPerPage}`;
      if (this.currentCategory !== "all") {
        endpoint += `&category=${encodeURIComponent(this.currentCategory)}`;
      }

      const data = await this.fetchAPI(endpoint);

      // Handle fallback response when blog service is unavailable
      if (data.error) {
        console.warn("Blog API warning:", data.error);
      }

      this.renderPosts(data.posts || []);
      this.renderPagination(data.pagination || {page: 1, per_page: 6, total: 0, pages: 0});
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      this.showError("Failed to load blog posts. Please try again later.");
    }
  }

  renderPosts(posts) {
    if (!posts || posts.length === 0) {
      this.postsContainer.innerHTML = `
        <div class="blog-loading">
          <p>No articles found.</p>
        </div>
      `;
      return;
    }

    this.postsContainer.innerHTML = posts
      .map(
        (post) => `
      <article class="blog-card" data-slug="${this.escapeHtml(post.slug)}">
        <div class="blog-card-image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-category">${this.escapeHtml(post.category)}</span>
            <span class="blog-card-date">${this.formatDate(post.created_at)}</span>
          </div>
          <h3>${this.escapeHtml(post.title)}</h3>
          <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt || "")}</p>
          <div class="blog-card-author">
            <div class="author-avatar">${this.getInitials(post.author)}</div>
            <span>${this.escapeHtml(post.author)}</span>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    // Add click listeners to cards
    this.postsContainer.querySelectorAll(".blog-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slug = card.dataset.slug;
        window.location.hash = `blog/${slug}`;
      });
    });
  }

  renderPagination(pagination) {
    if (!this.paginationContainer || pagination.pages <= 1) {
      if (this.paginationContainer) this.paginationContainer.innerHTML = "";
      return;
    }

    let html = "";

    // Previous button
    html += `<button ${pagination.page === 1 ? "disabled" : ""} data-page="${pagination.page - 1}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M15 19l-7-7 7-7"/>
      </svg>
    </button>`;

    // Page numbers
    for (let i = 1; i <= pagination.pages; i++) {
      if (i === 1 || i === pagination.pages || (i >= pagination.page - 1 && i <= pagination.page + 1)) {
        html += `<button class="${i === pagination.page ? "active" : ""}" data-page="${i}">${i}</button>`;
      } else if (i === pagination.page - 2 || i === pagination.page + 2) {
        html += `<button disabled>...</button>`;
      }
    }

    // Next button
    html += `<button ${pagination.page === pagination.pages ? "disabled" : ""} data-page="${pagination.page + 1}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </button>`;

    this.paginationContainer.innerHTML = html;

    // Add click listeners
    this.paginationContainer.querySelectorAll("button[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        if (page && !btn.disabled) {
          this.currentPage = page;
          this.loadPosts();
          document.getElementById("blog").scrollIntoView({behavior: "smooth"});
        }
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;

    // Update active state
    document.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });

    this.loadPosts();
  }

  // ============ Single Post Methods ============

  async loadPost(slug) {
    this.currentSlug = slug;

    try {
      const post = await this.fetchAPI(`/posts/${slug}`);
      this.renderPost(post);
      this.showPostView();

      // Load comments
      this.loadComments(slug);
    } catch (error) {
      console.error("Failed to load post:", error);
      this.showListView();
    }
  }

  renderPost(post) {
    // Set post content
    document.getElementById("post-category").textContent = post.category;
    document.getElementById("post-date").textContent = this.formatDate(post.created_at);
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-author").textContent = post.author;
    document.getElementById("author-avatar").textContent = this.getInitials(post.author);
    document.getElementById("post-content").innerHTML = post.content;

    // Render tags
    const tagsContainer = document.getElementById("post-tags");
    if (post.tags) {
      const tags = post.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      tagsContainer.innerHTML = tags.map((tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join("");
    } else {
      tagsContainer.innerHTML = "";
    }
  }

  showListView() {
    this.listView.classList.remove("hidden");
    this.postView.classList.add("hidden");
    this.currentSlug = null;
    window.location.hash = "blog";
  }

  showPostView() {
    this.listView.classList.add("hidden");
    this.postView.classList.remove("hidden");

    // Scroll to top of blog section
    document.getElementById("blog").scrollIntoView({behavior: "smooth"});
  }

  // ============ Comments Methods ============

  async loadComments(slug) {
    try {
      const data = await this.fetchAPI(`/posts/${slug}/comments`);
      this.renderComments(data.comments, data.total);
    } catch (error) {
      console.error("Failed to load comments:", error);
      this.commentsList.innerHTML = '<p class="no-comments">Failed to load comments.</p>';
    }
  }

  renderComments(comments, total) {
    document.getElementById("comment-count").textContent = `(${total})`;

    if (!comments || comments.length === 0) {
      this.commentsList.innerHTML = `
        <div class="no-comments">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    this.commentsList.innerHTML = comments.map((comment) => this.renderComment(comment)).join("");

    // Add reply button listeners
    this.commentsList.querySelectorAll(".reply-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const commentId = btn.dataset.commentId;
        const authorName = btn.dataset.authorName;
        this.setReplyTo(commentId, authorName);
      });
    });
  }

  renderComment(comment) {
    const repliesHtml = comment.replies && comment.replies.length > 0 ? `<div class="comment-replies">${comment.replies.map((r) => this.renderComment(r)).join("")}</div>` : "";

    return `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author">
            <div class="author-avatar">${this.getInitials(comment.author_name)}</div>
            <div class="comment-author-info">
              <strong>${this.escapeHtml(comment.author_name)}</strong>
              <span>${this.formatDate(comment.created_at)}</span>
            </div>
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHtml(comment.content).replace(/\n/g, "<br>")}
        </div>
        <div class="comment-actions">
          <button class="reply-btn" data-comment-id="${comment.id}" data-author-name="${this.escapeHtml(comment.author_name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Reply
          </button>
        </div>
        ${repliesHtml}
      </div>
    `;
  }

  setReplyTo(commentId, authorName) {
    document.getElementById("comment-parent-id").value = commentId;
    document.getElementById("reply-to-name").textContent = authorName;
    document.getElementById("replying-to").classList.remove("hidden");

    // Scroll to form
    this.commentForm.scrollIntoView({behavior: "smooth"});
    document.getElementById("comment-name").focus();
  }

  cancelReply() {
    document.getElementById("comment-parent-id").value = "";
    document.getElementById("replying-to").classList.add("hidden");
  }

  async handleCommentSubmit(e) {
    e.preventDefault();

    const submitBtn = this.commentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Posting...";
    submitBtn.disabled = true;

    const formData = new FormData(this.commentForm);
    const data = {
      author_name: formData.get("author_name"),
      author_email: formData.get("author_email"),
      content: formData.get("content"),
      parent_id: formData.get("parent_id") || null,
    };

    try {
      await this.fetchAPI(`/posts/${this.currentSlug}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Success - reload comments and reset form
      this.commentForm.reset();
      this.cancelReply();
      await this.loadComments(this.currentSlug);

      submitBtn.textContent = "Posted!";
      submitBtn.style.background = "#10b981";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2000);
    } catch (error) {
      submitBtn.textContent = "Error - Try Again";
      submitBtn.style.background = "#ef4444";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 3000);
    }
  }

  // ============ Helper Methods ============

  showLoading() {
    this.postsContainer.innerHTML = `
      <div class="blog-loading">
        <div class="loading-spinner"></div>
        <p>Loading articles...</p>
      </div>
    `;
  }

  showError(message) {
    this.postsContainer.innerHTML = `
      <div class="blog-loading">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize Blog when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.blog = new Blog();
});

// Product Image Gallery
function changeImage(src, element) {
  const mainImage = document.getElementById('main-product-image');
  if (mainImage) {
    mainImage.src = src;
    mainImage.alt = element.querySelector('img').alt;
  }
  
  // Update active thumbnail
  document.querySelectorAll('.product-image-gallery .thumbnail').forEach(thumb => {
    thumb.classList.remove('active');
  });
  element.classList.add('active');
}
