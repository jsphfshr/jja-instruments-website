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
  const imageObserver = new IntersectionObserver(
    (entries) => {
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
    },
    {rootMargin: "200px"}
  );

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
    "home.hero.countries": "Woldwide Distribution",
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
    "doppler.hero.badge": "医学超声质量保证解决方案",
    "doppler.hero.title": "多普勒模体 &<br><em>超声QA</em>",
    "doppler.hero.subtitle": "医学超声质量保证的黄金标准。我们的Mark V多普勒模体为临床QA项目、法规合规和研究应用提供NIST可追溯精度——受到全球医院、OEM制造商和学术机构的信赖。",
    "doppler.hero.cta1": "申请报价",
    "doppler.hero.cta2": "QA与合规",
    "doppler.whatis.tag": "了解医学超声QA",
    "doppler.whatis.title": "什么是超声质量保证？",
    "doppler.whatis.lead": "医学超声质量保证（QA）是一套系统化的测试和验证程序，确保诊断超声设备为患者护理准确、一致地运行。",
    "doppler.whatis.p1": "<strong>超声QA涵盖</strong>常规性能测试、校准验证以及美国放射学院（ACR）、跨学科认证委员会（IAC）等认证机构和包括FDA在内的监管机构所要求的文件记录。全面的QA计划保护患者、确保诊断准确性并维持医疗标准合规。",
    "doppler.whatis.p2": "<strong>多普勒速度校准</strong>是超声QA的关键组成部分。准确的血流速度测量对于诊断血管疾病严重程度、评估心脏功能、监测胎儿健康和指导治疗决策至关重要。JJ&A Instruments Mark V多普勒模体提供验证超声系统速度测量准确性所需的NIST可追溯参考标准。",
    "doppler.whatis.p3": "<strong>QA的重要性：</strong>研究表明，未校准的超声系统可能产生10-20%的速度测量误差，可能导致颈动脉狭窄或心脏瓣膜疾病等病症的误诊。使用校准模体进行定期QA测试可确保您的临床测量保持在可接受的精度范围内。",
    "doppler.whatis.diagram.title": "超声QA计划组成部分",
    "doppler.whatis.step1.title": "多普勒速度验证",
    "doppler.whatis.step1.desc": "使用校准弦模体验证血流速度精度",
    "doppler.whatis.step2.title": "图像质量评估",
    "doppler.whatis.step2.desc": "使用组织模体测试空间分辨率、对比度和均匀性",
    "doppler.whatis.step3.title": "探头性能",
    "doppler.whatis.step3.desc": "评估探头灵敏度、死元素和声学输出",
    "doppler.whatis.step4.title": "文档与合规",
    "doppler.whatis.step4.desc": "为ACR、IAC、ICAVL、联合委员会审核维护记录",
    "doppler.product.tag": "我们的产品",
    "doppler.product.title": "Mark V 多普勒模体",
    "doppler.product.desc": "多普勒速度校准和超声质量保证的行业标准。受到全球临床设施、OEM制造商和研究机构的信赖。",
    "doppler.features.range.title": "临床速度范围",
    "doppler.features.range.desc": "10-200 cm/s覆盖从静脉流到动脉收缩峰值的所有临床血流速度，支持血管、心脏、产科和经颅多普勒QA。",
    "doppler.features.accuracy.title": "NIST可追溯精度",
    "doppler.features.accuracy.desc": "±1%速度精度，附带可追溯至美国国家标准与技术研究院的校准证书——法规合规的必备条件。",
    "doppler.features.compliance.title": "合规就绪",
    "doppler.features.compliance.desc": "设计满足ACR、IAC、ICAVL、AIUM和联合委员会超声QA要求。以认证就绪格式导出文档。",
    "doppler.features.setup.title": "5分钟设置",
    "doppler.features.setup.desc": "无需准备血液模拟液、温度稳定或复杂对准。快速设置最大化QA测试效率。",
    "doppler.features.angles.title": "多角度测试",
    "doppler.features.angles.desc": "使用集成定位导轨在30°、45°和60°角度验证多普勒角度校正精度——对正确速度计算至关重要。",
    "doppler.features.export.title": "USB数据导出",
    "doppler.features.export.desc": "以PDF和CSV格式导出校准结果。与QA管理系统集成，实现精简的文档记录和审计追踪。",
    "doppler.compliance.tag": "法规合规",
    "doppler.compliance.title": "超声合规与认证",
    "doppler.compliance.desc": "通过记录的多普勒速度校准满足主要认证机构和监管机构的质量保证要求。",
    "doppler.compliance.row1": "年度多普勒QA必需",
    "doppler.compliance.row2": "心脏超声与血管标准",
    "doppler.compliance.row3": "速度精度验证",
    "doppler.compliance.row4": "设备管理标准",
    "doppler.compliance.row5": "质量体系法规",
    "doppler.compliance.row6": "超声场特性描述",
    "doppler.compliance.row7": "实践指南合规",
    "doppler.compliance.row8": "医疗器械QMS",
    "doppler.compliance.cta": "获取合规支持",
    "doppler.compliance.doclabel": "认证就绪文档",
    "doppler.services.tag": "专业服务",
    "doppler.services.title": "超声校准服务",
    "doppler.services.desc": "为多普勒超声设备提供全面的NIST可追溯校准服务。以专业质量保证支持临床设施、OEM制造商和研究机构。",
    "doppler.services.onsite.title": "现场校准",
    "doppler.services.onsite.desc": "我们的技术人员携带校准参考设备到您的设施。最大限度减少停机时间，同时确保您的超声系统满足精度规格。",
    "doppler.services.depot.title": "送厂校准",
    "doppler.services.depot.desc": "将您的模体送至我们ISO 17025合规实验室进行全面校准。5-7个工作日周转，附带详细认证文档。",
    "doppler.services.accreditation.title": "认证支持",
    "doppler.services.accreditation.desc": "为ACR、IAC、ICAVL和联合委员会审核提供完整的文档包。可提供QA协议模板和合规咨询。",
    "doppler.services.recert.title": "年度再认证",
    "doppler.services.recert.desc": "通过年度再认证服务保持模体NIST可追溯性。维持认证要求合规并确保持续精度。",
    "doppler.services.training.title": "QA培训",
    "doppler.services.training.desc": "为您的超声技师和QA人员提供现场培训。学习正确的模体操作、测试协议和文档程序。",
    "doppler.services.emergency.title": "紧急服务",
    "doppler.services.emergency.desc": "48小时加急校准服务可用于紧急需求。不要让设备问题延误您的认证或患者护理。",
    "doppler.research.tag": "超越临床",
    "doppler.research.title": "生产与研究应用",
    "doppler.research.desc": "我们的多普勒模体在超声制造质量控制、学术研究和医疗器械开发中发挥关键作用。",
    "doppler.research.oem.title": "OEM制造QA",
    "doppler.research.oem.desc": "超声制造商依赖我们的模体进行生产线测试和最终QA验证。使用NIST可追溯参考标准确保每台出货设备满足多普勒速度规格。支持ISO 13485和FDA 21 CFR Part 820合规。",
    "doppler.research.rnd.title": "研发和产品开发",
    "doppler.research.rnd.desc": "开发和验证新的多普勒算法、信号处理技术和成像模式。我们的模体提供定量研究和法规提交所需的一致、可重复的速度参考。",
    "doppler.research.academic.title": "学术研究",
    "doppler.research.academic.desc": "大学和研究机构使用我们的模体进行血流动力学研究、心血管成像研究和超声教育。公开的速度精度数据支持同行评审研究的可信度。",
    "doppler.research.service.title": "服务机构",
    "doppler.research.service.desc": "生物医学设备服务公司使用我们的模体进行维修后验证和预防性维护测试。向客户证明维修后的设备满足原始性能规格。",
    "doppler.apps.tag": "临床应用",
    "doppler.apps.title": "血流速度校准",
    "doppler.apps.desc": "对于任何执行多普勒超声检查的设施至关重要，验证的血流速度精度影响患者诊断和治疗。",
    "doppler.apps.vascular.title": "血管实验室QA",
    "doppler.apps.vascular.desc": "验证颈动脉速度测量，这对按NASCET/ECST标准进行狭窄分级至关重要。确保外周动脉和静脉多普勒精度，用于DVT诊断和动脉疾病评估。",
    "doppler.apps.echo.title": "超声心动图",
    "doppler.apps.echo.desc": "验证二尖瓣和主动脉流速以计算心输出量。对于按ASE指南进行准确的E/A比值、瓣膜压差测量和血流动力学评估至关重要。",
    "doppler.apps.ob.title": "产科多普勒",
    "doppler.apps.ob.desc": "校准脐动脉和大脑中动脉测量。准确的速度和比值对胎儿健康评估、IUGR检测和高危妊娠监测至关重要。",
    "doppler.apps.tcd.title": "经颅多普勒",
    "doppler.apps.tcd.desc": "验证TCD速度精度，用于卒中风险评估、SAH患者血管痉挛监测、脑死亡判定协议和镰状细胞病筛查项目。",
    "doppler.apps.acceptance.title": "设备验收测试",
    "doppler.apps.acceptance.desc": "新超声系统安装的基线多普勒校准。在临床使用前验证性能满足制造商规格——资本设备验证的必要环节。",
    "doppler.apps.compliance.title": "认证合规",
    "doppler.apps.compliance.desc": "通过记录的多普勒速度校准和全面的QA协议满足ACR、IAC、ICAVL和联合委员会超声认证要求。",
    "doppler.specs.tag": "技术详情",
    "doppler.specs.title": "Mark V 规格",
    "doppler.specs.desc": "精心设计以满足临床超声QA和法规合规测试的严格要求。",
    "doppler.specs.velocity.title": "速度性能",
    "doppler.specs.velocity.desc": "<strong>范围：</strong>10 – 200 cm/s<br><strong>精度：</strong>±1%读数<br><strong>分辨率：</strong>0.1 cm/s<br><strong>稳定性：</strong>8小时内±0.5%",
    "doppler.specs.physical.title": "物理规格",
    "doppler.specs.physical.desc": "<strong>尺寸：</strong>45 × 25 × 18 cm<br><strong>重量：</strong>5.2 kg (11.5 lbs)<br><strong>弦线：</strong>0.1mm尼龙单丝<br><strong>水槽：</strong>脱气水浴",
    "doppler.specs.acoustic.title": "声学特性",
    "doppler.specs.acoustic.desc": "<strong>窗口：</strong>TPX薄膜 60×120mm<br><strong>探头兼容性：</strong>2-15 MHz<br><strong>多普勒角度：</strong>30°, 45°, 60°导轨<br><strong>深度：</strong>2-8 cm可调",
    "doppler.specs.standards.title": "合规与标准",
    "doppler.specs.standards.desc": "<strong>标准：</strong>IEC 62359, FDA QSR<br><strong>电源：</strong>100-240V AC, 50/60Hz<br><strong>认证：</strong>CE标志<br><strong>保修：</strong>2年全面保修",
    "doppler.faq.tag": "常见问题",
    "doppler.faq.title": "超声QA常见问题",
    "doppler.faq.q1": "多普勒超声设备应多久校准一次？",
    "doppler.faq.a1": "美国放射学院（ACR）和跨学科认证委员会（IAC）建议至少每年进行一次多普勒速度验证。许多经认证的血管实验室将季度校准检查作为其质量保证计划的一部分。建议在设备维修、软件更新、探头更换后或任何时候对测量精度有疑问时进行额外测试。",
    "doppler.faq.q2": "哪些认证标准要求超声QA测试？",
    "doppler.faq.a2": "多个认证机构要求记录的超声质量保证计划：<strong>ACR</strong>（美国放射学院）要求年度模体测试；<strong>IAC</strong>（跨学科认证委员会）涵盖超声心动图和血管测试；<strong>ICAVL</strong>（血管实验室认证跨学科委员会）要求速度精度验证；<strong>联合委员会</strong>要求设备管理和QA计划；<strong>AIUM</strong>（美国医学超声学会）发布实践指南。我们的模体和文档支持所有这些标准。",
    "doppler.faq.q3": "弦模体和流体模体有什么区别？",
    "doppler.faq.a3": "弦模体使用以精确控制速度移动的丝线，消除了血液模拟液温度、粘度和颗粒浓度等变量。这提供了更一致、可重复的校准结果，且维护最少。带血液模拟液的流体模体可以更好地模拟某些声学特性如散射，但需要温度控制、定期更换液体和更复杂的设置。对于多普勒速度校准，弦模体提供更优越的精度和实用性。",
    "doppler.faq.q4": "Mark V是否与我的超声系统兼容？",
    "doppler.faq.a4": "是的。Mark V多普勒模体与所有具有多普勒功能的诊断超声系统兼容，包括GE、Philips、Siemens、Canon (Toshiba)、Samsung、Fujifilm、Mindray及其他制造商。2-15 MHz探头兼容性覆盖血管、心脏、产科和一般成像应用中使用的几乎所有临床探头。",
    "doppler.faq.q5": "我可以测试哪些血流速度？",
    "doppler.faq.a5": "Mark V覆盖10-200 cm/s，涵盖临床血流速度的全部范围：静脉流（10-30 cm/s）、正常动脉流（30-100 cm/s）以及狭窄血管或心脏应用中的收缩峰值速度（高达200 cm/s及以上）。此范围支持颈动脉狭窄分级、外周血管评估、心脏瓣膜评估、产科多普勒和经颅多普勒应用。",
    "doppler.faq.q6": "NIST可追溯校准如何工作？",
    "doppler.faq.a6": "NIST可追溯校准意味着我们模体的速度精度可以通过一条不间断的比较链追溯到美国国家标准与技术研究院。每台Mark V附带显示测量不确定度和可追溯性的校准证书。年度再认证维持此可追溯性——对法规合规和认证审核至关重要。",
    "doppler.faq.q7": "认证提供哪些文档？",
    "doppler.faq.a7": "每台Mark V附带可追溯至NIST标准的校准证书。该设备以PDF和CSV格式导出测试结果，兼容ACR、IAC、ICAVL和联合委员会认证要求。我们还提供QA协议模板、测试程序文档和实验室认证提交指导。我们的支持团队可协助处理特定的认证文档要求。",
    "doppler.faq.q8": "你们支持OEM和研究应用吗？",
    "doppler.faq.a8": "是的。我们向超声OEM制造商供应多普勒模体用于生产测试和QA，向医疗器械开发商供应用于研发和法规提交，向学术机构供应用于研究和教育。OEM和机构客户可获得批量定价和定制配置。请联系我们讨论您的具体需求。",
    // HIFU Page
    "hifu.hero.badge": "完整HIFU驱动系统",
    "hifu.hero.title": "HIFU RF<br><em>功率系统</em>",
    "hifu.hero.subtitle": "一套完整、即用型HIFU驱动系统——只需添加您的换能器。频率发生器、精密定时电路、功率放大器、安全系统和完整系统控制全部集成于一体。通过单个USB端口发送简单ASCII命令。开机即可开始治疗。",
    "hifu.hero.cta2": "查看规格",
    "hifu.trust.usb": "USB端口",
    "hifu.trust.allinone.num": "一体化",
    "hifu.trust.allinone.label": "完整系统",
    "hifu.trust.power": "最大功率",
    "hifu.whatis.tag": "了解HIFU技术",
    "hifu.whatis.title": "什么是高强度聚焦超声？",
    "hifu.whatis.lead": "高强度聚焦超声（HIFU）是一种非侵入性治疗技术，利用聚焦声能精确加热和消融体内深处组织——无需切口或辐射。",
    "hifu.whatis.p1": "<strong>完整系统，不仅仅是放大器：</strong>我们的HIFU RF功率系统集成了驱动换能器所需的一切：精密频率发生器、定时和门控电路、高功率RF放大器、全面的安全系统和完整的数字控制。只需连接您的换能器即可开始使用。",
    "hifu.whatis.p2": "<strong>简单USB控制：</strong>无需复杂接口或专有软件。通过单个USB端口发送简单的ASCII文本命令来控制频率、功率、脉冲定时和所有系统功能。可与任何编程语言或终端程序配合使用。包含完整文档。",
    "hifu.whatis.p3": "<strong>内置安全：</strong>VSWR保护、过温关机、电弧检测和硬件互锁全部集成。专注于您的应用——安全系统处理其余一切。",
    "hifu.whatis.diagram.title": "包含内容",
    "hifu.whatis.step1.title": "频率发生器",
    "hifu.whatis.step1.desc": "精密DDS合成，0.5-7 MHz范围",
    "hifu.whatis.step2.title": "定时和门控电路",
    "hifu.whatis.step2.desc": "可编程脉冲控制，<10 μs响应",
    "hifu.whatis.step3.title": "RF功率放大器",
    "hifu.whatis.step3.desc": "高达500W连续，阻抗匹配",
    "hifu.whatis.step4.title": "安全系统",
    "hifu.whatis.step4.desc": "VSWR、热、电弧保护和互锁",
    "hifu.whatis.step5.title": "USB控制接口",
    "hifu.whatis.step5.desc": "简单ASCII命令，可与任何软件配合使用",
    "hifu.whatis.diagram.footer": "您提供：您的换能器",
    "hifu.features.tag": "完整系统功能",
    "hifu.features.title": "一体化集成，满足所有需求",
    "hifu.features.desc": "交钥匙HIFU驱动解决方案——连接换能器，插入USB，即可开始。无需外部信号发生器、放大器或控制系统。",
    "hifu.features.power.title": "高功率输出",
    "hifu.features.power.desc": "高达500W连续波（CW）或脉冲输出。可扩展配置从100W到多千瓦系统，适用于不同临床应用。",
    "hifu.features.freq.title": "宽频率范围",
    "hifu.features.freq.desc": "0.5 MHz至7 MHz覆盖所有HIFU应用——从深部组织消融（0.5-1 MHz）到表浅美容治疗（3-7 MHz）。",
    "hifu.features.array.title": "多通道阵列",
    "hifu.features.array.desc": "支持相控阵换能器，多达256个独立控制通道。电子波束转向和焦点调整。",
    "hifu.features.response.title": "快速响应时间",
    "hifu.features.response.desc": "<10 μs上升/下降时间，实现精确脉冲操作。用于温度引导治疗和运动追踪的实时功率控制。",
    "hifu.features.safety.title": "内置安全系统",
    "hifu.features.safety.desc": "VSWR保护、过温关机和电弧检测。硬件互锁和软件限制确保安全运行。",
    "hifu.features.control.title": "简单ASCII控制",
    "hifu.features.control.desc": "一个USB端口。简单ASCII文本命令。从任何终端或编程语言控制频率、功率、定时——一切。无需专有软件。",
    "hifu.apps.tag": "临床与研究应用",
    "hifu.apps.title": "HIFU应用",
    "hifu.apps.desc": "我们的RF功率发生器支持聚焦超声应用的完整范围——从挽救生命的肿瘤消融到前沿研究。",
    "hifu.apps.oncology.title": "肿瘤学与肿瘤消融",
    "hifu.apps.oncology.desc": "前列腺、肝脏、乳腺、肾脏和骨骼实体瘤的非侵入性治疗。HIFU为不适合手术的患者提供手术替代方案。2024年肿瘤学领域占全球HIFU市场的41%，FDA批准的系统如Focal One®推动了应用普及。",
    "hifu.apps.neuro.title": "神经病学与脑部治疗",
    "hifu.apps.neuro.desc": "用于特发性震颤、帕金森病震颤和神经病理性疼痛的MRI引导聚焦超声。HIFU可在不开颅的情况下在深部脑结构中创建精确病灶——侵入性神经外科手术的突破性替代方案。我们的MRI兼容发生器可与MRgFUS平台集成。",
    "hifu.apps.aesthetic.title": "美容与整形",
    "hifu.apps.aesthetic.desc": "非侵入性皮肤紧致、皱纹减少和身体塑形。高频HIFU（3-7 MHz）针对SMAS层和皮下脂肪进行美容改善，无需手术。美容HIFU领域是增长最快的市场，受到消费者对微创治疗需求的推动。",
    "hifu.apps.rnd.title": "研究与开发",
    "hifu.apps.rnd.desc": "灵活配置用于学术和工业研发。开发新的HIFU应用、验证治疗方案并表征换能器性能。我们的发生器支持从台面实验到临床前研究和法规提交的完整研究周期。",
    "hifu.apps.oem.title": "OEM系统集成",
    "hifu.apps.oem.desc": "设计用于集成到商业HIFU系统。紧凑外形、全面API和法规文档支持FDA 510(k)和CE标志提交。OEM合作伙伴可获得批量定价和设计导入支持。",
    "hifu.apps.drug.title": "药物递送与声孔效应",
    "hifu.apps.drug.desc": "用于增强药物递送、血脑屏障开放和声动力治疗研究的低强度脉冲HIFU。精确的脉冲控制可研究热消融以外的生物效应。",
    "hifu.specs.tag": "技术详情",
    "hifu.specs.title": "完整系统规格",
    "hifu.specs.desc": "一体化系统包括频率发生器、定时电路、放大器、安全系统和USB控制。只需连接您的换能器。",
    "hifu.specs.row1.label": "频率范围",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "频率稳定性",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "输出功率（CW）",
    "hifu.specs.row3.value": "100W / 250W / 500W型号",
    "hifu.specs.row4.label": "输出功率（脉冲）",
    "hifu.specs.row4.value": "峰值高达1000W",
    "hifu.specs.row5.label": "功率分辨率",
    "hifu.specs.row5.value": "0.1W（数字控制）",
    "hifu.specs.row6.label": "上升/下降时间",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "占空比",
    "hifu.specs.row7.value": "0-100%（CW或脉冲）",
    "hifu.specs.row8.label": "输出阻抗",
    "hifu.specs.row8.value": "50Ω标称",
    "hifu.specs.row9.label": "VSWR保护",
    "hifu.specs.row9.value": "3:1时自动关机",
    "hifu.specs.row10.label": "控制接口",
    "hifu.specs.row10.value": "USB（ASCII命令）",
    "hifu.specs.row11.label": "冷却",
    "hifu.specs.row11.value": "强制空气/水冷选项",
    "hifu.specs.row12.label": "MRI兼容性",
    "hifu.specs.row12.value": "可选屏蔽版本",
    "hifu.specs.cta": "申请完整规格",
    "hifu.specs.avail": "可选：100W、250W、500W型号",
    "hifu.why.tag": "为什么选择JJ&A Instruments",
    "hifu.why.title": "HIFU发生器优势",
    "hifu.why.desc": "专为治疗性超声设计，具有医疗器械开发商所需的可靠性和支持。",
    "hifu.why.quality.title": "医疗级质量",
    "hifu.why.quality.desc": "ISO 13485认证制造。设计和文档支持您的HIFU系统的FDA 510(k)和CE标志提交。",
    "hifu.why.support.title": "应用工程",
    "hifu.why.support.desc": "我们的RF工程师了解HIFU应用。获得换能器匹配、热管理和系统集成的专家支持。",
    "hifu.why.global.title": "全球供应",
    "hifu.why.global.desc": "全球发货，北美、欧洲和亚太地区有本地支持。合格项目可获得评估样机。",
    "hifu.why.api.title": "全面API",
    "hifu.why.api.desc": "通过完善文档的API进行完整软件控制。包含LabVIEW VIs、Python库和C/C++ SDK。快速与您的控制系统集成。",
    "hifu.why.longterm.title": "长期支持",
    "hifu.why.longterm.desc": "5年产品供应保证。可选延长保修。校准和维护服务保持系统运行。",
    "hifu.why.custom.title": "定制配置",
    "hifu.why.custom.desc": "需要特定频率、功率级别或外形尺寸？我们的工程团队可为您的独特需求定制发生器。",
    "hifu.faq.tag": "常见问题",
    "hifu.faq.title": "HIFU发生器常见问题",
    "hifu.faq.q1": "什么是HIFU，它如何工作？",
    "hifu.faq.a1": "高强度聚焦超声（HIFU）使用聚焦声能以非侵入方式加热和破坏目标组织。RF功率发生器驱动压电换能器将电能转换为超声波。这些波聚焦到体内的精确点——就像放大镜聚焦阳光——温度达到60-85°C，导致目标组织热消融同时不损伤周围结构。",
    "hifu.faq.q2": "我的HIFU应用应该使用什么频率？",
    "hifu.faq.a2": "频率选择取决于治疗深度和目标组织。<strong>较低频率（0.5-1 MHz）</strong>穿透更深（高达15 cm），用于肝脏、肾脏和前列腺的肿瘤消融。<strong>中频（1-3 MHz）</strong>常用于神经HIFU和一般治疗应用。<strong>较高频率（3-7 MHz）</strong>提供精确的浅层穿透，用于针对皮肤层的美容治疗。我们的团队可帮助您为特定应用选择最佳频率。",
    "hifu.faq.q3": "发生器是否与MRI环境兼容？",
    "hifu.faq.a3": "是的。我们提供具有EMI屏蔽和非磁性结构的MRI兼容版本，用于MR引导聚焦超声（MRgFUS）应用。这些发生器可在MRI室内操作而不干扰成像。屏蔽版本已在1.5T和3T场强下验证。请联系我们讨论您的具体MRI集成需求。",
    "hifu.faq.q4": "发生器能驱动相控阵换能器吗？",
    "hifu.faq.a4": "是的。我们为相控阵换能器提供多达256个独立控制通道的多通道配置。每个通道提供独立的幅度和相位控制，用于电子波束转向和焦点调整。多通道系统包括相干操作的同步功能。也完全支持单元件和环形阵列换能器。",
    "hifu.faq.q5": "包含哪些安全功能？",
    "hifu.faq.a5": "安全内置于每个发生器中：<strong>VSWR保护</strong>在反射功率超过安全限制时自动降低功率（防止换能器损坏）。<strong>过温保护</strong>监测内部温度并在过热前关机。<strong>电弧检测</strong>在RF路径中检测到电弧时立即切断电源。<strong>硬件互锁</strong>支持外部安全开关和紧急停止。<strong>软件限制</strong>允许您定义特定应用的功率和持续时间限制。",
    "hifu.faq.q6": "提供哪些法规文档？",
    "hifu.faq.a6": "我们提供全面文档支持您的法规提交：<strong>设计历史文件</strong>包括规格、测试报告和可追溯性。按ISO 14971的<strong>风险分析</strong>。按IEC 60601-1-2的<strong>EMC测试报告</strong>。按IEC 60601-1的<strong>电气安全测试</strong>。合规和校准<strong>证书</strong>。我们的法规事务团队可协助FDA 510(k)和CE标志问题。",
    "hifu.faq.q7": "你们支持OEM集成和定制配置吗？",
    "hifu.faq.a7": "是的。我们与HIFU系统开发商在OEM项目上密切合作：<strong>定制频率</strong>匹配您的换能器。<strong>修改外形</strong>以集成到您的系统外壳。<strong>定制接口</strong>和控制协议。可提供<strong>私有标签</strong>。生产数量的<strong>批量定价</strong>。我们还可提供设计导入支持、原型和评估工程样品。",
    "hifu.faq.q8": "保修和支持政策是什么？",
    "hifu.faq.a8": "标准保修为2年，涵盖零件和人工。可提供长达5年的延长保修选项。支持包括：<strong>工作时间电话和电子邮件技术支持</strong>。通过网络连接的<strong>远程诊断</strong>。我们设施的<strong>维修和校准服务</strong>。维修期间合格客户可获得<strong>备用机</strong>。可额外付费获得<strong>现场服务</strong>。",
    "hifu.contact.desc": "准备为您的HIFU应用提供动力？联系我们获取报价、规格，或与我们的工程团队讨论您的项目需求。",
    "footer.applications": "应用",
    "hifu.apps.oncology.short": "肿瘤消融",
    "hifu.apps.neuro.short": "神经病学",
    "hifu.apps.aesthetic.short": "美容",
    "hifu.apps.rnd.short": "研究",
    "nav.compliance": "QA与合规",
    "footer.recertification": "模体再认证",
    "nav.faq": "常见问题",
    "footer.docs": "技术文档",
    "footer.protocols": "QA协议",
    "nav.specs": "规格",
    "nav.home": "首页",
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
    "doppler.hero.badge": "医療用超音波品質保証ソリューション",
    "doppler.hero.title": "ドップラーファントム &<br><em>超音波QA</em>",
    "doppler.hero.subtitle": "医療用超音波品質保証のゴールドスタンダード。当社のMark Vドップラーファントムは、臨床QAプログラム、規制遵守、研究用途向けにNISTトレーサブルな精度を提供し、世界中の病院、OEM、学術機関から信頼されています。",
    "doppler.hero.cta1": "見積もりを依頼",
    "doppler.hero.cta2": "QA＆コンプライアンス",
    "doppler.whatis.tag": "医療用超音波QAの理解",
    "doppler.whatis.title": "超音波品質保証とは？",
    "doppler.whatis.lead": "医療用超音波品質保証（QA）は、診断用超音波機器が患者ケアのために正確かつ一貫して機能することを保証する体系的な試験・検証プログラムです。",
    "doppler.whatis.p1": "<strong>超音波QAには</strong>、米国放射線学会（ACR）、学際的認定委員会（IAC）などの認定機関やFDAを含む規制当局が要求する定期的な性能試験、校正検証、文書化が含まれます。包括的なQAプログラムは患者を保護し、診断精度を確保し、医療基準への適合を維持します。",
    "doppler.whatis.p2": "<strong>ドップラー速度校正</strong>は超音波QAの重要な構成要素です。正確な血流速度測定は、血管疾患の重症度診断、心機能評価、胎児の健康状態モニタリング、治療方針の決定に不可欠です。JJ&A Instruments Mark Vドップラーファントムは、超音波システムが速度を正確に測定していることを検証するために必要なNISTトレーサブルな基準を提供します。",
    "doppler.whatis.p3": "<strong>QAが重要な理由：</strong>研究によると、未校正の超音波システムは10-20%の速度測定誤差を生じる可能性があり、頸動脈狭窄や心臓弁膜症などの誤診につながる可能性があります。校正済みファントムによる定期的なQA試験により、臨床測定が許容精度範囲内に維持されます。",
    "doppler.whatis.diagram.title": "超音波QAプログラムの構成要素",
    "doppler.whatis.step1.title": "ドップラー速度検証",
    "doppler.whatis.step1.desc": "校正済みストリングファントムを使用して血流速度精度を検証",
    "doppler.whatis.step2.title": "画像品質評価",
    "doppler.whatis.step2.desc": "組織ファントムで空間分解能、コントラスト、均一性を試験",
    "doppler.whatis.step3.title": "トランスデューサ性能",
    "doppler.whatis.step3.desc": "プローブ感度、デッドエレメント、音響出力を評価",
    "doppler.whatis.step4.title": "文書化＆コンプライアンス",
    "doppler.whatis.step4.desc": "ACR、IAC、ICAVL、Joint Commission監査用の記録を維持",
    "doppler.product.tag": "製品紹介",
    "doppler.product.title": "Mark V ドップラーファントム",
    "doppler.product.desc": "ドップラー速度校正と超音波品質保証の業界標準。世界中の臨床施設、OEMメーカー、研究機関から信頼されています。",
    "doppler.features.range.title": "臨床速度範囲",
    "doppler.features.range.desc": "10-200 cm/sは静脈流から動脈収縮期ピークまでのすべての臨床血流速度をカバーし、血管、心臓、産科、経頭蓋ドップラーQAをサポートします。",
    "doppler.features.accuracy.title": "NISTトレーサブル精度",
    "doppler.features.accuracy.desc": "±1%の速度精度と米国国立標準技術研究所にトレーサブルな校正証明書付き—規制遵守に不可欠。",
    "doppler.features.compliance.title": "コンプライアンス対応",
    "doppler.features.compliance.desc": "ACR、IAC、ICAVL、AIUM、Joint Commissionの超音波QA要件を満たすよう設計。認定対応フォーマットで文書をエクスポート。",
    "doppler.features.setup.title": "5分セットアップ",
    "doppler.features.setup.desc": "血液模擬液の準備、温度安定化、複雑なアライメントは不要。迅速なセットアップでQA試験効率を最大化。",
    "doppler.features.angles.title": "マルチアングル試験",
    "doppler.features.angles.desc": "内蔵ポジショニングガイドを使用して30°、45°、60°角度でドップラー角度補正精度を検証—適切な速度計算に不可欠。",
    "doppler.features.export.title": "USBデータエクスポート",
    "doppler.features.export.desc": "PDF及びCSV形式で校正結果をエクスポート。QA管理システムと統合して文書化と監査証跡を効率化。",
    "doppler.compliance.tag": "規制遵守",
    "doppler.compliance.title": "超音波コンプライアンス＆認定",
    "doppler.compliance.desc": "文書化されたドップラー速度校正により、主要な認定機関と規制当局の品質保証要件を満たします。",
    "doppler.compliance.row1": "年次ドップラーQA必須",
    "doppler.compliance.row2": "心エコー＆血管基準",
    "doppler.compliance.row3": "速度精度検証",
    "doppler.compliance.row4": "機器管理基準",
    "doppler.compliance.row5": "品質システム規制",
    "doppler.compliance.row6": "超音波場特性評価",
    "doppler.compliance.row7": "実践ガイドライン遵守",
    "doppler.compliance.row8": "医療機器QMS",
    "doppler.compliance.cta": "コンプライアンスサポートを受ける",
    "doppler.compliance.doclabel": "認定対応文書",
    "doppler.services.tag": "専門サービス",
    "doppler.services.title": "超音波校正サービス",
    "doppler.services.desc": "ドップラー超音波機器向けの包括的なNISTトレーサブル校正サービス。臨床施設、OEMメーカー、研究機関を専門的な品質保証でサポート。",
    "doppler.services.onsite.title": "オンサイト校正",
    "doppler.services.onsite.desc": "当社の技術者が校正済み基準機器を持ってお客様の施設に訪問。ダウンタイムを最小限に抑えながら超音波システムが精度仕様を満たすことを確保。",
    "doppler.services.depot.title": "デポ校正",
    "doppler.services.depot.desc": "ファントムを当社のISO 17025準拠ラボに送付し包括的な校正を実施。詳細な認証文書付きで5-7営業日のターンアラウンド。",
    "doppler.services.accreditation.title": "認定サポート",
    "doppler.services.accreditation.desc": "ACR、IAC、ICAVL、Joint Commission監査用の完全な文書パッケージ。QAプロトコルテンプレートとコンプライアンスコンサルティングを提供。",
    "doppler.services.recert.title": "年次再認証",
    "doppler.services.recert.desc": "年次再認証サービスでファントムのNISTトレーサビリティを維持。認定要件への適合を維持し継続的な精度を確保。",
    "doppler.services.training.title": "QAトレーニング",
    "doppler.services.training.desc": "超音波検査士とQAスタッフ向けのオンサイトトレーニング。適切なファントム操作、試験プロトコル、文書化手順を習得。",
    "doppler.services.emergency.title": "緊急サービス",
    "doppler.services.emergency.desc": "緊急ニーズに対応する48時間特急校正。機器の問題で認定や患者ケアを遅らせないでください。",
    "doppler.research.tag": "臨床を超えて",
    "doppler.research.title": "製造＆研究用途",
    "doppler.research.desc": "当社のドップラーファントムは超音波製造品質管理、学術研究、医療機器開発において重要な役割を果たします。",
    "doppler.research.oem.title": "OEM製造QA",
    "doppler.research.oem.desc": "超音波メーカーは生産ライン試験と最終QA検証に当社のファントムを活用。NISTトレーサブル基準により出荷されるすべての機器がドップラー速度仕様を満たすことを確保。ISO 13485とFDA 21 CFR Part 820への適合をサポート。",
    "doppler.research.rnd.title": "R&D＆製品開発",
    "doppler.research.rnd.desc": "新しいドップラーアルゴリズム、信号処理技術、イメージングモダリティを開発・検証。当社のファントムは定量的研究と規制申請に必要な一貫した再現可能な速度基準を提供。",
    "doppler.research.academic.title": "学術研究",
    "doppler.research.academic.desc": "大学と研究機関は血行動態研究、心血管イメージング研究、超音波検査教育に当社のファントムを使用。公開された速度精度データが査読付き研究の信頼性をサポート。",
    "doppler.research.service.title": "サービス組織",
    "doppler.research.service.desc": "生体医工学機器サービス会社は修理後検証と予防保守試験に当社のファントムを使用。修理された機器が元の性能仕様を満たすことを顧客に証明。",
    "doppler.apps.tag": "臨床用途",
    "doppler.apps.title": "血流速度校正",
    "doppler.apps.desc": "検証済み血流速度精度が患者の診断と治療に影響するドップラー超音波検査を実施するすべての施設に不可欠。",
    "doppler.apps.vascular.title": "血管ラボQA",
    "doppler.apps.vascular.desc": "NASCET/ECST基準による狭窄グレーディングに重要な頸動脈速度測定を検証。DVT診断と動脈疾患評価のための末梢動脈・静脈ドップラー精度を確保。",
    "doppler.apps.echo.title": "心エコー",
    "doppler.apps.echo.desc": "心拍出量計算用の僧帽弁通過流速と大動脈弁通過流速を検証。ASEガイドラインに基づく正確なE/A比、弁圧較差測定、血行動態評価に不可欠。",
    "doppler.apps.ob.title": "産科ドップラー",
    "doppler.apps.ob.desc": "臍帯動脈と中大脳動脈の測定を校正。正確な速度と比率は胎児健康評価、IUGR検出、ハイリスク妊娠モニタリングに不可欠。",
    "doppler.apps.tcd.title": "経頭蓋ドップラー",
    "doppler.apps.tcd.desc": "脳卒中リスク評価、SAH患者の血管攣縮モニタリング、脳死判定プロトコル、鎌状赤血球症スクリーニングプログラム用のTCD速度精度を検証。",
    "doppler.apps.acceptance.title": "機器受入試験",
    "doppler.apps.acceptance.desc": "新規超音波システム設置時のベースラインドップラー校正。臨床使用前に性能がメーカー仕様を満たすことを検証—資本機器検証に不可欠。",
    "doppler.apps.compliance.title": "認定コンプライアンス",
    "doppler.apps.compliance.desc": "文書化されたドップラー速度校正と包括的なQAプロトコルによりACR、IAC、ICAVL、Joint Commission超音波認定要件を満たす。",
    "doppler.specs.tag": "技術詳細",
    "doppler.specs.title": "Mark V 仕様",
    "doppler.specs.desc": "臨床超音波QAと規制遵守試験の厳しい要件を満たすよう設計。",
    "doppler.specs.velocity.title": "速度性能",
    "doppler.specs.velocity.desc": "<strong>範囲：</strong>10 – 200 cm/s<br><strong>精度：</strong>読み取り値の±1%<br><strong>分解能：</strong>0.1 cm/s<br><strong>安定性：</strong>8時間で±0.5%",
    "doppler.specs.physical.title": "物理仕様",
    "doppler.specs.physical.desc": "<strong>寸法：</strong>45 × 25 × 18 cm<br><strong>重量：</strong>5.2 kg (11.5 lbs)<br><strong>ストリング：</strong>0.1mmナイロンモノフィラメント<br><strong>タンク：</strong>脱気水槽",
    "doppler.specs.acoustic.title": "音響特性",
    "doppler.specs.acoustic.desc": "<strong>ウィンドウ：</strong>TPX膜 60×120mm<br><strong>プローブ互換性：</strong>2-15 MHz<br><strong>ドップラー角度：</strong>30°, 45°, 60°ガイド<br><strong>深度：</strong>2-8 cm調整可能",
    "doppler.specs.standards.title": "コンプライアンス＆規格",
    "doppler.specs.standards.desc": "<strong>規格：</strong>IEC 62359, FDA QSR<br><strong>電源：</strong>100-240V AC, 50/60Hz<br><strong>認証：</strong>CEマーク<br><strong>保証：</strong>2年間総合保証",
    "doppler.faq.tag": "よくある質問",
    "doppler.faq.title": "超音波QA FAQ",
    "doppler.faq.q1": "ドップラー超音波機器はどのくらいの頻度で校正すべきですか？",
    "doppler.faq.a1": "米国放射線学会（ACR）と学際的認定委員会（IAC）は少なくとも年1回のドップラー速度検証を推奨しています。多くの認定血管ラボでは品質保証プログラムの一環として四半期ごとの校正チェックを実施しています。機器サービス、ソフトウェアアップデート、トランスデューサ交換後、または測定精度に疑問がある場合は追加試験が推奨されます。",
    "doppler.faq.q2": "どの認定基準が超音波QA試験を要求していますか？",
    "doppler.faq.a2": "複数の認定機関が文書化された超音波品質保証プログラムを要求しています：<strong>ACR</strong>（米国放射線学会）は年次ファントム試験を要求；<strong>IAC</strong>（学際的認定委員会）は心エコーと血管試験をカバー；<strong>ICAVL</strong>（血管ラボ認定学際委員会）は速度精度検証を要求；<strong>Joint Commission</strong>は機器管理とQAプログラムを義務付け；<strong>AIUM</strong>（米国医用超音波学会）は実践ガイドラインを発行。当社のファントムと文書はこれらすべての基準をサポートします。",
    "doppler.faq.q3": "ストリングファントムとフローファントムの違いは何ですか？",
    "doppler.faq.a3": "ストリングファントムは精密に制御された速度で移動するフィラメントを使用し、血液模擬液の温度、粘度、粒子濃度などの変数を排除します。これにより、最小限のメンテナンスでより一貫性のある再現可能な校正結果が得られます。血液模擬液を使用するフローファントムは散乱などの特定の音響特性をより良くシミュレートできますが、温度管理、定期的な液体交換、より複雑なセットアップが必要です。ドップラー速度校正には、ストリングファントムが優れた精度と実用性を提供します。",
    "doppler.faq.q4": "Mark Vは私の超音波システムと互換性がありますか？",
    "doppler.faq.a4": "はい。Mark Vドップラーファントムは、GE、Philips、Siemens、Canon (Toshiba)、Samsung、Fujifilm、Mindray、その他のメーカーを含むドップラー機能を備えたすべての診断用超音波システムと互換性があります。2-15 MHzのプローブ互換性は、血管、心臓、産科、一般イメージング用途で使用されるほぼすべての臨床トランスデューサをカバーします。",
    "doppler.faq.q5": "どの血流速度を試験できますか？",
    "doppler.faq.a5": "Mark Vは10-200 cm/sをカバーし、臨床血流速度の全範囲に対応：静脈流（10-30 cm/s）、正常動脈流（30-100 cm/s）、狭窄血管や心臓用途での収縮期ピーク速度（200 cm/s以上まで）。この範囲は頸動脈狭窄グレーディング、末梢血管評価、心臓弁評価、産科ドップラー、経頭蓋ドップラー用途をサポートします。",
    "doppler.faq.q6": "NISTトレーサブル校正はどのように機能しますか？",
    "doppler.faq.a6": "NISTトレーサブル校正とは、当社ファントムの速度精度が米国国立標準技術研究所まで途切れのない比較チェーンを通じて文書化できることを意味します。各Mark Vには測定不確かさとトレーサビリティを示す校正証明書が付属しています。年次再認証によりこのトレーサビリティが維持され、規制遵守と認定監査に不可欠です。",
    "doppler.faq.q7": "認定用にどのような文書が提供されますか？",
    "doppler.faq.a7": "各Mark VにはNIST基準にトレーサブルな校正証明書が付属しています。機器はACR、IAC、ICAVL、Joint Commission認定要件に対応したPDFとCSV形式で試験結果をエクスポートします。QAプロトコルテンプレート、試験手順文書、ラボ認定申請ガイダンスも提供します。当社のサポートチームが特定の認定文書要件をお手伝いします。",
    "doppler.faq.q8": "OEMや研究用途をサポートしていますか？",
    "doppler.faq.a8": "はい。超音波OEMメーカーに生産試験とQA用、医療機器開発者にR&Dと規制申請用、学術機関に研究と教育用にドップラーファントムを供給しています。OEMおよび機関向け顧客にはボリュームプライシングとカスタム構成が利用可能です。具体的な要件についてはお問い合わせください。",
    // HIFU Page
    "hifu.hero.badge": "完全なHIFU駆動システム",
    "hifu.hero.title": "HIFU RF<br><em>パワーシステム</em>",
    "hifu.hero.subtitle": "完全な、すぐに使用できるHIFU駆動システム—トランスデューサを追加するだけ。周波数発生器、精密タイミング回路、パワーアンプ、安全システム、完全なシステム制御がすべて1台に統合。単一のUSBポートを介したシンプルなASCIIコマンド。電源を入れて治療を開始。",
    "hifu.hero.cta2": "仕様を見る",
    "hifu.trust.usb": "USBポート",
    "hifu.trust.allinone.num": "オールインワン",
    "hifu.trust.allinone.label": "完全なシステム",
    "hifu.trust.power": "最大出力",
    "hifu.whatis.tag": "HIFU技術の理解",
    "hifu.whatis.title": "高強度集束超音波とは？",
    "hifu.whatis.lead": "高強度集束超音波（HIFU）は、集束された音響エネルギーを使用して体内深部の組織を正確に加熱・焼灼する非侵襲的治療技術です—切開や放射線は不要。",
    "hifu.whatis.p1": "<strong>アンプだけでなく完全なシステム：</strong>当社のHIFU RFパワーシステムは、トランスデューサを駆動するために必要なすべてを統合しています：精密周波数発生器、タイミングおよびゲーティング回路、高出力RFアンプ、包括的な安全システム、完全なデジタル制御。トランスデューサを接続するだけで準備完了。",
    "hifu.whatis.p2": "<strong>シンプルなUSB制御：</strong>複雑なインターフェースや専用ソフトウェアは不要。単一のUSBポートを介してシンプルなASCIIテキストコマンドを送信し、周波数、出力、パルスタイミング、すべてのシステム機能を制御。あらゆるプログラミング言語やターミナルプログラムで動作。完全なドキュメント付属。",
    "hifu.whatis.p3": "<strong>内蔵安全機能：</strong>VSWR保護、過温度シャットダウン、アーク検出、ハードウェアインターロックがすべて統合。アプリケーションに集中—安全システムが残りを処理。",
    "hifu.whatis.diagram.title": "含まれるもの",
    "hifu.whatis.step1.title": "周波数発生器",
    "hifu.whatis.step1.desc": "精密DDS合成、0.5-7 MHz範囲",
    "hifu.whatis.step2.title": "タイミング＆ゲーティング回路",
    "hifu.whatis.step2.desc": "プログラマブルパルス制御、<10 μs応答",
    "hifu.whatis.step3.title": "RF パワーアンプ",
    "hifu.whatis.step3.desc": "最大500W連続、インピーダンス整合",
    "hifu.whatis.step4.title": "安全システム",
    "hifu.whatis.step4.desc": "VSWR、熱、アーク保護＆インターロック",
    "hifu.whatis.step5.title": "USB制御インターフェース",
    "hifu.whatis.step5.desc": "シンプルなASCIIコマンド、あらゆるソフトウェアで動作",
    "hifu.whatis.diagram.footer": "お客様がご用意：トランスデューサ",
    "hifu.features.tag": "完全なシステム機能",
    "hifu.features.title": "必要なすべてを統合",
    "hifu.features.desc": "ターンキーHIFU駆動ソリューション—トランスデューサを接続し、USBを差し込めば準備完了。外部信号発生器、アンプ、制御システムは不要。",
    "hifu.features.power.title": "高出力",
    "hifu.features.power.desc": "最大500W連続波（CW）またはパルス出力。異なる臨床用途向けに100Wからマルチキロワットシステムまでスケーラブルな構成。",
    "hifu.features.freq.title": "広い周波数範囲",
    "hifu.features.freq.desc": "0.5 MHzから7 MHzまですべてのHIFU用途をカバー—深部組織焼灼（0.5-1 MHz）から表層美容治療（3-7 MHz）まで。",
    "hifu.features.array.title": "マルチチャネルアレイ",
    "hifu.features.array.desc": "最大256の独立制御チャネルを持つフェーズドアレイトランスデューサをサポート。電子ビームステアリングと焦点調整。",
    "hifu.features.response.title": "高速応答時間",
    "hifu.features.response.desc": "<10 μsの立ち上がり/立ち下がり時間で精密なパルス動作。温度誘導治療とモーショントラッキング用のリアルタイム出力制御。",
    "hifu.features.safety.title": "内蔵安全システム",
    "hifu.features.safety.desc": "VSWR保護、過温度シャットダウン、アーク検出。ハードウェアインターロックとソフトウェア制限で安全な動作を確保。",
    "hifu.features.control.title": "シンプルなASCII制御",
    "hifu.features.control.desc": "USBポート1つ。シンプルなASCIIテキストコマンド。あらゆるターミナルやプログラミング言語から周波数、出力、タイミング—すべてを制御。専用ソフトウェア不要。",
    "hifu.apps.tag": "臨床＆研究用途",
    "hifu.apps.title": "HIFU用途",
    "hifu.apps.desc": "当社のRFパワージェネレーターは、命を救う腫瘍焼灼から最先端の研究まで、集束超音波用途の全範囲をサポート。",
    "hifu.apps.oncology.title": "腫瘍学＆腫瘍焼灼",
    "hifu.apps.oncology.desc": "前立腺、肝臓、乳房、腎臓、骨の固形腫瘍の非侵襲的治療。HIFUは手術適応外の患者に手術の代替を提供。2024年の腫瘍学セグメントは世界のHIFU市場の41%を占め、Focal One®などのFDA承認システムが普及を推進。",
    "hifu.apps.neuro.title": "神経学＆脳治療",
    "hifu.apps.neuro.desc": "本態性振戦、パーキンソン病振戦、神経障害性疼痛向けのMRIガイド集束超音波。HIFUは開頭せずに深部脳構造に精密な病変を作成可能—侵襲的神経外科手術の画期的な代替。当社のMRI対応ジェネレーターはMRgFUSプラットフォームとの統合を可能に。",
    "hifu.apps.aesthetic.title": "美容＆コスメティック",
    "hifu.apps.aesthetic.desc": "非侵襲的な皮膚引き締め、しわ軽減、ボディコンタリング。高周波HIFU（3-7 MHz）はSMAS層と皮下脂肪をターゲットにし、手術なしで美容改善。美容HIFUセグメントは最も急成長している市場で、低侵襲治療への消費者需要が牽引。",
    "hifu.apps.rnd.title": "研究開発",
    "hifu.apps.rnd.desc": "学術・産業R&D向けの柔軟な構成。新しいHIFU用途の開発、治療プロトコルの検証、トランスデューサ性能の特性評価。当社のジェネレーターはベンチ実験から前臨床研究、規制申請までの完全な研究サイクルをサポート。",
    "hifu.apps.oem.title": "OEMシステム統合",
    "hifu.apps.oem.desc": "商用HIFUシステムへの統合用に設計。コンパクトなフォームファクター、包括的なAPI、規制文書がFDA 510(k)およびCEマーキング申請をサポート。OEMパートナーシップ向けのボリュームプライシングと設計導入サポート。",
    "hifu.apps.drug.title": "薬物送達＆ソノポレーション",
    "hifu.apps.drug.desc": "薬物送達強化、血液脳関門開放、音響力学療法研究向けの低強度パルスHIFU。精密なパルス制御により熱焼灼を超えた生物学的効果の研究が可能。",
    "hifu.specs.tag": "技術詳細",
    "hifu.specs.title": "完全なシステム仕様",
    "hifu.specs.desc": "オールインワンシステムには周波数発生器、タイミング回路、アンプ、安全システム、USB制御が含まれます。トランスデューサを接続するだけ。",
    "hifu.specs.row1.label": "周波数範囲",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "周波数安定性",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "出力（CW）",
    "hifu.specs.row3.value": "100W / 250W / 500Wモデル",
    "hifu.specs.row4.label": "出力（パルス）",
    "hifu.specs.row4.value": "ピーク最大1000W",
    "hifu.specs.row5.label": "出力分解能",
    "hifu.specs.row5.value": "0.1W（デジタル制御）",
    "hifu.specs.row6.label": "立ち上がり/立ち下がり時間",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "デューティサイクル",
    "hifu.specs.row7.value": "0-100%（CWまたはパルス）",
    "hifu.specs.row8.label": "出力インピーダンス",
    "hifu.specs.row8.value": "50Ω公称",
    "hifu.specs.row9.label": "VSWR保護",
    "hifu.specs.row9.value": "3:1で自動シャットダウン",
    "hifu.specs.row10.label": "制御インターフェース",
    "hifu.specs.row10.value": "USB（ASCIIコマンド）",
    "hifu.specs.row11.label": "冷却",
    "hifu.specs.row11.value": "強制空冷/水冷オプション",
    "hifu.specs.row12.label": "MRI互換性",
    "hifu.specs.row12.value": "シールドバージョン（オプション）",
    "hifu.specs.cta": "完全な仕様を依頼",
    "hifu.specs.avail": "利用可能：100W、250W、500Wモデル",
    "hifu.why.tag": "JJ&A Instrumentsを選ぶ理由",
    "hifu.why.title": "HIFUジェネレーターの優位性",
    "hifu.why.desc": "医療機器開発者が求める信頼性とサポートを備えた治療用超音波専用設計。",
    "hifu.why.quality.title": "医療グレードの品質",
    "hifu.why.quality.desc": "ISO 13485認証製造。HIFUシステムのFDA 510(k)およびCEマーキング申請をサポートする設計と文書化。",
    "hifu.why.support.title": "アプリケーションエンジニアリング",
    "hifu.why.support.desc": "当社のRFエンジニアはHIFU用途を理解しています。トランスデューサマッチング、熱管理、システム統合の専門サポートを受けられます。",
    "hifu.why.global.title": "グローバル対応",
    "hifu.why.global.desc": "北米、欧州、アジア太平洋地域でのローカルサポート付き世界配送。適格なプロジェクト向けに評価用機器を提供。",
    "hifu.why.api.title": "包括的なAPI",
    "hifu.why.api.desc": "文書化されたAPIによる完全なソフトウェア制御。LabVIEW VI、Pythonライブラリ、C/C++ SDKを付属。制御システムとの迅速な統合。",
    "hifu.why.longterm.title": "長期サポート",
    "hifu.why.longterm.desc": "5年間の製品供給保証。延長保証オプション。システムを稼働させ続けるための校正・メンテナンスサービス。",
    "hifu.why.custom.title": "カスタム構成",
    "hifu.why.custom.desc": "特定の周波数、出力レベル、フォームファクターが必要ですか？当社のエンジニアリングチームがお客様固有の要件に合わせてジェネレーターをカスタマイズ。",
    "hifu.faq.tag": "よくある質問",
    "hifu.faq.title": "HIFUジェネレーターFAQ",
    "hifu.faq.q1": "HIFUとは何ですか？どのように機能しますか？",
    "hifu.faq.a1": "高強度集束超音波（HIFU）は、集束された音響エネルギーを使用してターゲット組織を非侵襲的に加熱・破壊します。RFパワージェネレーターは電気エネルギーを超音波に変換する圧電トランスデューサを駆動します。これらの波は虫眼鏡で太陽光を集めるように体内の正確な点に集束され、60-85°Cの温度に達し、周囲の構造を温存しながらターゲット組織を熱焼灼します。",
    "hifu.faq.q2": "私のHIFU用途にはどの周波数を使用すべきですか？",
    "hifu.faq.a2": "周波数選択は治療深度とターゲット組織に依存します。<strong>低周波（0.5-1 MHz）</strong>はより深く浸透し（最大15 cm）、肝臓、腎臓、前立腺の腫瘍焼灼に使用。<strong>中間周波（1-3 MHz）</strong>は神経学的HIFUと一般的な治療用途に一般的。<strong>高周波（3-7 MHz）</strong>は皮膚層をターゲットにした美容治療向けに精密で浅い浸透を提供。当社チームがお客様の特定の用途に最適な周波数を選択するお手伝いをします。",
    "hifu.faq.q3": "ジェネレーターはMRI環境と互換性がありますか？",
    "hifu.faq.a3": "はい。MRガイド集束超音波（MRgFUS）用途向けにEMIシールドと非磁性構造を備えたMRI対応バージョンを提供しています。これらのジェネレーターはイメージングを妨げることなくMRI室内で動作できます。シールドバージョンは1.5Tおよび3T磁場強度で検証済み。具体的なMRI統合要件についてはお問い合わせください。",
    "hifu.faq.q4": "ジェネレーターはフェーズドアレイトランスデューサを駆動できますか？",
    "hifu.faq.a4": "はい。フェーズドアレイトランスデューサ向けに最大256の独立制御チャネルを持つマルチチャネル構成を提供しています。各チャネルは電子ビームステアリングと焦点調整用の個別振幅・位相制御を提供。マルチチャネルシステムにはコヒーレント動作用の同期機能が含まれます。シングルエレメントおよびアニュラアレイトランスデューサも完全にサポート。",
    "hifu.faq.q5": "どのような安全機能が含まれていますか？",
    "hifu.faq.a5": "安全はすべてのジェネレーターに内蔵：<strong>VSWR保護</strong>は反射電力が安全限界を超えると自動的に出力を低減（トランスデューサ損傷を防止）。<strong>過温度保護</strong>は内部温度を監視し過熱前にシャットダウン。<strong>アーク検出</strong>はRF経路でアーキングが検出されると即座に電力を遮断。<strong>ハードウェアインターロック</strong>は外部安全スイッチと緊急停止をサポート。<strong>ソフトウェア制限</strong>でアプリケーション固有の出力と持続時間の制限を定義可能。",
    "hifu.faq.q6": "どのような規制文書が利用可能ですか？",
    "hifu.faq.a6": "規制申請をサポートする包括的な文書を提供：仕様、試験レポート、トレーサビリティを含む<strong>設計履歴ファイル</strong>。ISO 14971に基づく<strong>リスク分析</strong>。IEC 60601-1-2に基づく<strong>EMC試験レポート</strong>。IEC 60601-1に基づく<strong>電気安全試験</strong>。適合および校正<strong>証明書</strong>。当社の薬事チームがFDA 510(k)およびCEマーキングの質問をサポート。",
    "hifu.faq.q7": "OEM統合とカスタム構成をサポートしていますか？",
    "hifu.faq.a7": "はい。OEMプロジェクトでHIFUシステム開発者と緊密に協力：トランスデューサに合わせた<strong>カスタム周波数</strong>。システム筐体への統合用の<strong>改変フォームファクター</strong>。<strong>カスタムインターフェース</strong>と制御プロトコル。<strong>プライベートラベリング</strong>可能。生産数量向け<strong>ボリュームプライシング</strong>。設計導入サポート、プロトタイプ、評価用エンジニアリングサンプルも提供可能。",
    "hifu.faq.q8": "保証とサポートポリシーは何ですか？",
    "hifu.faq.a8": "標準保証は部品と労務を含む2年間。最大5年間の延長保証オプションあり。サポートには：営業時間中の<strong>電話およびメールによる技術サポート</strong>。ネットワーク接続による<strong>リモート診断</strong>。当社施設での<strong>修理および校正サービス</strong>。修理中の適格な顧客向け<strong>代替機</strong>。追加料金で<strong>オンサイトサービス</strong>。",
    "hifu.contact.desc": "HIFUアプリケーションへの電力供給の準備はできましたか？価格、仕様、またはプロジェクト要件についてエンジニアリングチームとの相談はお問い合わせください。",
    "footer.applications": "アプリケーション",
    "hifu.apps.oncology.short": "腫瘍焼灼",
    "hifu.apps.neuro.short": "神経学",
    "hifu.apps.aesthetic.short": "美容",
    "hifu.apps.rnd.short": "研究",
    "nav.compliance": "QA＆コンプライアンス",
    "footer.recertification": "ファントム再認証",
    "nav.faq": "FAQ",
    "footer.docs": "技術文書",
    "footer.protocols": "QAプロトコル",
    "nav.specs": "仕様",
    "nav.home": "ホーム",
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
    "doppler.hero.badge": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन समाधान",
    "doppler.hero.title": "डॉप्लर फैंटम &<br><em>अल्ट्रासाउंड QA</em>",
    "doppler.hero.subtitle": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन में स्वर्ण मानक। हमारा Mark V डॉप्लर फैंटम क्लिनिकल QA कार्यक्रमों, नियामक अनुपालन और अनुसंधान अनुप्रयोगों के लिए NIST-ट्रेसेबल सटीकता प्रदान करता है—विश्व भर के अस्पतालों, OEM और शैक्षणिक संस्थानों द्वारा विश्वसनीय।",
    "doppler.hero.cta1": "कोटेशन का अनुरोध करें",
    "doppler.hero.cta2": "QA और अनुपालन",
    "doppler.whatis.tag": "मेडिकल अल्ट्रासाउंड QA को समझना",
    "doppler.whatis.title": "अल्ट्रासाउंड गुणवत्ता आश्वासन क्या है?",
    "doppler.whatis.lead": "मेडिकल अल्ट्रासाउंड गुणवत्ता आश्वासन (QA) परीक्षण और सत्यापन का एक व्यवस्थित कार्यक्रम है जो सुनिश्चित करता है कि डायग्नोस्टिक अल्ट्रासाउंड उपकरण रोगी देखभाल के लिए सटीक और सुसंगत रूप से कार्य करता है।",
    "doppler.whatis.p1": "<strong>अल्ट्रासाउंड QA में शामिल है</strong> नियमित प्रदर्शन परीक्षण, कैलिब्रेशन सत्यापन और अमेरिकन कॉलेज ऑफ रेडियोलॉजी (ACR), इंटरसोसाइटल एक्रिडिटेशन कमीशन (IAC) जैसी प्रत्यायन संस्थाओं और FDA सहित नियामक एजेंसियों द्वारा आवश्यक दस्तावेज़ीकरण। एक व्यापक QA कार्यक्रम रोगियों की रक्षा करता है, डायग्नोस्टिक सटीकता सुनिश्चित करता है और स्वास्थ्य सेवा मानकों के अनुपालन को बनाए रखता है।",
    "doppler.whatis.p2": "<strong>डॉप्लर वेग कैलिब्रेशन</strong> अल्ट्रासाउंड QA का एक महत्वपूर्ण घटक है। सटीक रक्त प्रवाह वेग माप वैस्कुलर रोग की गंभीरता का निदान करने, हृदय क्रिया का आकलन करने, भ्रूण की भलाई की निगरानी करने और उपचार निर्णयों का मार्गदर्शन करने के लिए आवश्यक है। JJ&A Instruments Mark V डॉप्लर फैंटम आपके अल्ट्रासाउंड सिस्टम की वेग माप सटीकता को सत्यापित करने के लिए आवश्यक NIST-ट्रेसेबल संदर्भ मानक प्रदान करता है।",
    "doppler.whatis.p3": "<strong>QA क्यों महत्वपूर्ण है:</strong> अध्ययन दर्शाते हैं कि अन-कैलिब्रेटेड अल्ट्रासाउंड सिस्टम 10-20% वेग माप त्रुटियां उत्पन्न कर सकते हैं, जो संभावित रूप से कैरोटिड स्टेनोसिस या कार्डियक वाल्व रोग जैसी स्थितियों के गलत निदान का कारण बन सकते हैं। कैलिब्रेटेड फैंटम के साथ नियमित QA परीक्षण सुनिश्चित करता है कि आपकी क्लिनिकल माप स्वीकार्य सटीकता सीमाओं के भीतर रहें।",
    "doppler.whatis.diagram.title": "अल्ट्रासाउंड QA कार्यक्रम घटक",
    "doppler.whatis.step1.title": "डॉप्लर वेग सत्यापन",
    "doppler.whatis.step1.desc": "कैलिब्रेटेड स्ट्रिंग फैंटम का उपयोग करके रक्त प्रवाह वेग सटीकता सत्यापित करें",
    "doppler.whatis.step2.title": "छवि गुणवत्ता मूल्यांकन",
    "doppler.whatis.step2.desc": "टिश्यू फैंटम के साथ स्थानिक रिज़ॉल्यूशन, कंट्रास्ट, एकरूपता का परीक्षण करें",
    "doppler.whatis.step3.title": "ट्रांसड्यूसर प्रदर्शन",
    "doppler.whatis.step3.desc": "प्रोब संवेदनशीलता, डेड एलिमेंट और ध्वनिक आउटपुट का मूल्यांकन करें",
    "doppler.whatis.step4.title": "दस्तावेज़ीकरण और अनुपालन",
    "doppler.whatis.step4.desc": "ACR, IAC, ICAVL, Joint Commission ऑडिट के लिए रिकॉर्ड बनाए रखें",
    "doppler.product.tag": "हमारे उत्पाद",
    "doppler.product.title": "Mark V डॉप्लर फैंटम",
    "doppler.product.desc": "डॉप्लर वेग कैलिब्रेशन और अल्ट्रासाउंड गुणवत्ता आश्वासन के लिए उद्योग मानक। विश्व भर की क्लिनिकल सुविधाओं, OEM निर्माताओं और अनुसंधान संस्थानों द्वारा विश्वसनीय।",
    "doppler.features.range.title": "क्लिनिकल वेग सीमा",
    "doppler.features.range.desc": "10-200 cm/s शिरापरक प्रवाह से धमनी सिस्टोल शिखर तक सभी क्लिनिकल रक्त प्रवाह वेगों को कवर करता है, वैस्कुलर, कार्डियक, ऑब्स्टेट्रिक और ट्रांसक्रैनियल डॉप्लर QA का समर्थन करता है।",
    "doppler.features.accuracy.title": "NIST-ट्रेसेबल सटीकता",
    "doppler.features.accuracy.desc": "±1% वेग सटीकता नेशनल इंस्टीट्यूट ऑफ स्टैंडर्ड्स एंड टेक्नोलॉजी के लिए ट्रेसेबल कैलिब्रेशन प्रमाणपत्र के साथ—नियामक अनुपालन के लिए आवश्यक।",
    "doppler.features.compliance.title": "अनुपालन तैयार",
    "doppler.features.compliance.desc": "ACR, IAC, ICAVL, AIUM और Joint Commission अल्ट्रासाउंड QA आवश्यकताओं को पूरा करने के लिए डिज़ाइन किया गया। प्रत्यायन-तैयार प्रारूपों में दस्तावेज़ निर्यात करें।",
    "doppler.features.setup.title": "5-मिनट सेटअप",
    "doppler.features.setup.desc": "रक्त-अनुकरण तरल तैयारी, तापमान स्थिरीकरण या जटिल संरेखण की आवश्यकता नहीं। तेज़ सेटअप QA परीक्षण दक्षता को अधिकतम करता है।",
    "doppler.features.angles.title": "मल्टी-एंगल परीक्षण",
    "doppler.features.angles.desc": "एकीकृत पोजिशनिंग गाइड का उपयोग करके 30°, 45° और 60° कोणों पर डॉप्लर एंगल करेक्शन सटीकता सत्यापित करें—उचित वेग गणना के लिए महत्वपूर्ण।",
    "doppler.features.export.title": "USB डेटा निर्यात",
    "doppler.features.export.desc": "PDF और CSV प्रारूपों में कैलिब्रेशन परिणाम निर्यात करें। सुव्यवस्थित दस्तावेज़ीकरण और ऑडिट ट्रेल के लिए QA प्रबंधन सिस्टम के साथ एकीकृत करें।",
    "doppler.compliance.tag": "नियामक अनुपालन",
    "doppler.compliance.title": "अल्ट्रासाउंड अनुपालन और प्रत्यायन",
    "doppler.compliance.desc": "दस्तावेज़ीकृत डॉप्लर वेग कैलिब्रेशन के साथ प्रमुख प्रत्यायन संस्थाओं और नियामक एजेंसियों की गुणवत्ता आश्वासन आवश्यकताओं को पूरा करें।",
    "doppler.compliance.row1": "वार्षिक डॉप्लर QA आवश्यक",
    "doppler.compliance.row2": "इको और वैस्कुलर मानक",
    "doppler.compliance.row3": "वेग सटीकता सत्यापन",
    "doppler.compliance.row4": "उपकरण प्रबंधन मानक",
    "doppler.compliance.row5": "गुणवत्ता प्रणाली विनियमन",
    "doppler.compliance.row6": "अल्ट्रासाउंड फील्ड विशेषता",
    "doppler.compliance.row7": "अभ्यास दिशानिर्देश अनुपालन",
    "doppler.compliance.row8": "मेडिकल डिवाइस QMS",
    "doppler.compliance.cta": "अनुपालन सहायता प्राप्त करें",
    "doppler.compliance.doclabel": "प्रत्यायन-तैयार दस्तावेज़ीकरण",
    "doppler.services.tag": "व्यावसायिक सेवाएं",
    "doppler.services.title": "अल्ट्रासाउंड कैलिब्रेशन सेवाएं",
    "doppler.services.desc": "डॉप्लर अल्ट्रासाउंड उपकरण के लिए व्यापक NIST-ट्रेसेबल कैलिब्रेशन सेवाएं। विशेषज्ञ गुणवत्ता आश्वासन के साथ क्लिनिकल सुविधाओं, OEM निर्माताओं और अनुसंधान संस्थानों का समर्थन।",
    "doppler.services.onsite.title": "ऑन-साइट कैलिब्रेशन",
    "doppler.services.onsite.desc": "हमारे तकनीशियन कैलिब्रेटेड संदर्भ उपकरण के साथ आपकी सुविधा में आते हैं। डाउनटाइम को न्यूनतम करते हुए सुनिश्चित करें कि आपके अल्ट्रासाउंड सिस्टम सटीकता विनिर्देशों को पूरा करते हैं।",
    "doppler.services.depot.title": "डिपो कैलिब्रेशन",
    "doppler.services.depot.desc": "व्यापक कैलिब्रेशन के लिए अपना फैंटम हमारी ISO 17025-अनुपालक प्रयोगशाला में भेजें। विस्तृत प्रमाणन दस्तावेज़ीकरण के साथ 5-7 व्यावसायिक दिन का टर्नअराउंड।",
    "doppler.services.accreditation.title": "प्रत्यायन सहायता",
    "doppler.services.accreditation.desc": "ACR, IAC, ICAVL और Joint Commission ऑडिट के लिए पूर्ण दस्तावेज़ीकरण पैकेज। QA प्रोटोकॉल टेम्पलेट और अनुपालन परामर्श उपलब्ध।",
    "doppler.services.recert.title": "वार्षिक पुन: प्रमाणन",
    "doppler.services.recert.desc": "वार्षिक पुन: प्रमाणन सेवाओं के साथ अपने फैंटम को NIST-ट्रेसेबल रखें। प्रत्यायन आवश्यकताओं के अनुपालन को बनाए रखें और निरंतर सटीकता सुनिश्चित करें।",
    "doppler.services.training.title": "QA प्रशिक्षण",
    "doppler.services.training.desc": "आपके सोनोग्राफर और QA स्टाफ के लिए ऑन-साइट प्रशिक्षण। उचित फैंटम संचालन, परीक्षण प्रोटोकॉल और दस्तावेज़ीकरण प्रक्रियाएं सीखें।",
    "doppler.services.emergency.title": "आपातकालीन सेवा",
    "doppler.services.emergency.desc": "तत्काल आवश्यकताओं के लिए 48-घंटे त्वरित कैलिब्रेशन उपलब्ध। उपकरण समस्याओं को अपने प्रत्यायन या रोगी देखभाल में देरी न करने दें।",
    "doppler.research.tag": "क्लिनिकल से परे",
    "doppler.research.title": "उत्पादन और अनुसंधान अनुप्रयोग",
    "doppler.research.desc": "हमारे डॉप्लर फैंटम अल्ट्रासाउंड निर्माण गुणवत्ता नियंत्रण, शैक्षणिक अनुसंधान और मेडिकल डिवाइस विकास में महत्वपूर्ण भूमिका निभाते हैं।",
    "doppler.research.oem.title": "OEM निर्माण QA",
    "doppler.research.oem.desc": "अल्ट्रासाउंड निर्माता उत्पादन लाइन परीक्षण और अंतिम QA सत्यापन के लिए हमारे फैंटम पर निर्भर करते हैं। NIST-ट्रेसेबल संदर्भ मानकों के साथ सुनिश्चित करें कि प्रत्येक शिप की गई इकाई डॉप्लर वेग विनिर्देशों को पूरा करती है। ISO 13485 और FDA 21 CFR Part 820 अनुपालन का समर्थन।",
    "doppler.research.rnd.title": "R&D और उत्पाद विकास",
    "doppler.research.rnd.desc": "नए डॉप्लर एल्गोरिदम, सिग्नल प्रोसेसिंग तकनीकों और इमेजिंग मोडैलिटीज़ का विकास और सत्यापन करें। हमारे फैंटम मात्रात्मक अनुसंधान और नियामक प्रस्तुतियों के लिए आवश्यक सुसंगत, दोहराने योग्य वेग संदर्भ प्रदान करते हैं।",
    "doppler.research.academic.title": "शैक्षणिक अनुसंधान",
    "doppler.research.academic.desc": "विश्वविद्यालय और अनुसंधान संस्थान हीमोडायनामिक अध्ययन, कार्डियोवैस्कुलर इमेजिंग अनुसंधान और सोनोग्राफी शिक्षा के लिए हमारे फैंटम का उपयोग करते हैं। प्रकाशित वेग सटीकता डेटा पीयर-रिव्यूड अनुसंधान विश्वसनीयता का समर्थन करता है।",
    "doppler.research.service.title": "सेवा संगठन",
    "doppler.research.service.desc": "बायोमेडिकल उपकरण सेवा कंपनियां पोस्ट-रिपेयर सत्यापन और निवारक रखरखाव परीक्षण के लिए हमारे फैंटम का उपयोग करती हैं। ग्राहकों को प्रदर्शित करें कि मरम्मत किए गए उपकरण मूल प्रदर्शन विनिर्देशों को पूरा करते हैं।",
    "doppler.apps.tag": "क्लिनिकल अनुप्रयोग",
    "doppler.apps.title": "रक्त प्रवाह वेग कैलिब्रेशन",
    "doppler.apps.desc": "किसी भी सुविधा के लिए आवश्यक जो डॉप्लर अल्ट्रासाउंड परीक्षाएं करती है जहां सत्यापित रक्त प्रवाह वेग सटीकता रोगी निदान और उपचार को प्रभावित करती है।",
    "doppler.apps.vascular.title": "वैस्कुलर लेबोरेटरी QA",
    "doppler.apps.vascular.desc": "NASCET/ECST मानदंडों के अनुसार स्टेनोसिस ग्रेडिंग के लिए महत्वपूर्ण कैरोटिड धमनी वेग माप सत्यापित करें। DVT निदान और धमनी रोग मूल्यांकन के लिए परिधीय धमनी और शिरापरक डॉप्लर सटीकता सुनिश्चित करें।",
    "doppler.apps.echo.title": "इकोकार्डियोग्राफी",
    "doppler.apps.echo.desc": "कार्डियक आउटपुट गणना के लिए ट्रांसमिट्रल और ट्रांसएओर्टिक फ्लो वेग को मान्य करें। ASE दिशानिर्देशों के अनुसार सटीक E/A अनुपात, वाल्व ग्रेडिएंट माप और हीमोडायनामिक मूल्यांकन के लिए आवश्यक।",
    "doppler.apps.ob.title": "ऑब्स्टेट्रिक डॉप्लर",
    "doppler.apps.ob.desc": "अम्बिलिकल आर्टरी और मिडल सेरेब्रल आर्टरी माप को कैलिब्रेट करें। भ्रूण भलाई मूल्यांकन, IUGR पहचान और उच्च जोखिम गर्भावस्था निगरानी के लिए सटीक वेग और अनुपात महत्वपूर्ण हैं।",
    "doppler.apps.tcd.title": "ट्रांसक्रैनियल डॉप्लर",
    "doppler.apps.tcd.desc": "स्ट्रोक जोखिम मूल्यांकन, SAH रोगियों में वैसोस्पैज़म निगरानी, ब्रेन डेथ निर्धारण प्रोटोकॉल और सिकल सेल रोग स्क्रीनिंग कार्यक्रमों के लिए TCD वेग सटीकता सत्यापित करें।",
    "doppler.apps.acceptance.title": "उपकरण स्वीकृति परीक्षण",
    "doppler.apps.acceptance.desc": "नए अल्ट्रासाउंड सिस्टम इंस्टॉलेशन के लिए बेसलाइन डॉप्लर कैलिब्रेशन। क्लिनिकल उपयोग से पहले सत्यापित करें कि प्रदर्शन निर्माता विनिर्देशों को पूरा करता है—पूंजी उपकरण सत्यापन के लिए आवश्यक।",
    "doppler.apps.compliance.title": "प्रत्यायन अनुपालन",
    "doppler.apps.compliance.desc": "दस्तावेज़ीकृत डॉप्लर वेग कैलिब्रेशन और व्यापक QA प्रोटोकॉल के साथ ACR, IAC, ICAVL और Joint Commission अल्ट्रासाउंड प्रत्यायन आवश्यकताओं को पूरा करें।",
    "doppler.specs.tag": "तकनीकी विवरण",
    "doppler.specs.title": "Mark V विनिर्देश",
    "doppler.specs.desc": "क्लिनिकल अल्ट्रासाउंड QA और नियामक अनुपालन परीक्षण की मांग वाली आवश्यकताओं को पूरा करने के लिए इंजीनियर किया गया।",
    "doppler.specs.velocity.title": "वेग प्रदर्शन",
    "doppler.specs.velocity.desc": "<strong>सीमा:</strong> 10 – 200 cm/s<br><strong>सटीकता:</strong> रीडिंग का ±1%<br><strong>रिज़ॉल्यूशन:</strong> 0.1 cm/s<br><strong>स्थिरता:</strong> 8 घंटे में ±0.5%",
    "doppler.specs.physical.title": "भौतिक विनिर्देश",
    "doppler.specs.physical.desc": "<strong>आयाम:</strong> 45 × 25 × 18 cm<br><strong>वजन:</strong> 5.2 kg (11.5 lbs)<br><strong>स्ट्रिंग:</strong> 0.1mm नायलॉन मोनोफिलामेंट<br><strong>टैंक:</strong> डीगैस्ड वाटर बाथ",
    "doppler.specs.acoustic.title": "ध्वनिक गुण",
    "doppler.specs.acoustic.desc": "<strong>विंडो:</strong> TPX मेम्ब्रेन 60×120mm<br><strong>प्रोब संगतता:</strong> 2-15 MHz<br><strong>डॉप्लर एंगल:</strong> 30°, 45°, 60° गाइड<br><strong>गहराई:</strong> 2-8 cm समायोज्य",
    "doppler.specs.standards.title": "अनुपालन और मानक",
    "doppler.specs.standards.desc": "<strong>मानक:</strong> IEC 62359, FDA QSR<br><strong>पावर:</strong> 100-240V AC, 50/60Hz<br><strong>प्रमाणन:</strong> CE मार्क्ड<br><strong>वारंटी:</strong> 2 वर्ष व्यापक",
    "doppler.faq.tag": "सामान्य प्रश्न",
    "doppler.faq.title": "अल्ट्रासाउंड QA FAQ",
    "doppler.faq.q1": "डॉप्लर अल्ट्रासाउंड उपकरण को कितनी बार कैलिब्रेट किया जाना चाहिए?",
    "doppler.faq.a1": "अमेरिकन कॉलेज ऑफ रेडियोलॉजी (ACR) और इंटरसोसाइटल एक्रिडिटेशन कमीशन (IAC) कम से कम वार्षिक डॉप्लर वेग सत्यापन की सिफारिश करते हैं। कई प्रमाणित वैस्कुलर प्रयोगशालाएं अपने गुणवत्ता आश्वासन कार्यक्रम के हिस्से के रूप में त्रैमासिक कैलिब्रेशन जांच करती हैं। उपकरण सेवा, सॉफ्टवेयर अपडेट, ट्रांसड्यूसर प्रतिस्थापन के बाद या जब भी माप सटीकता पर सवाल उठाया जाए, अतिरिक्त परीक्षण की सिफारिश की जाती है।",
    "doppler.faq.q2": "कौन से प्रत्यायन मानकों को अल्ट्रासाउंड QA परीक्षण की आवश्यकता है?",
    "doppler.faq.a2": "कई प्रत्यायन संस्थाओं को दस्तावेज़ीकृत अल्ट्रासाउंड गुणवत्ता आश्वासन कार्यक्रमों की आवश्यकता होती है: <strong>ACR</strong> (अमेरिकन कॉलेज ऑफ रेडियोलॉजी) को वार्षिक फैंटम परीक्षण की आवश्यकता है; <strong>IAC</strong> (इंटरसोसाइटल एक्रिडिटेशन कमीशन) इकोकार्डियोग्राफी और वैस्कुलर परीक्षण को कवर करता है; <strong>ICAVL</strong> (वैस्कुलर लेबोरेटरीज के प्रत्यायन के लिए इंटरसोसाइटल कमीशन) को वेग सटीकता सत्यापन की आवश्यकता है; <strong>Joint Commission</strong> उपकरण प्रबंधन और QA कार्यक्रमों को अनिवार्य करता है; और <strong>AIUM</strong> (अमेरिकन इंस्टीट्यूट ऑफ अल्ट्रासाउंड इन मेडिसिन) अभ्यास दिशानिर्देश प्रकाशित करता है। हमारा फैंटम और दस्तावेज़ीकरण इन सभी मानकों का समर्थन करते हैं।",
    "doppler.faq.q3": "स्ट्रिंग फैंटम और फ्लो फैंटम में क्या अंतर है?",
    "doppler.faq.a3": "स्ट्रिंग फैंटम सटीक नियंत्रित वेगों पर चलने वाले फिलामेंट का उपयोग करते हैं, रक्त-अनुकरण तरल तापमान, विस्कोसिटी और कण एकाग्रता जैसे चरों को समाप्त करते हैं। यह न्यूनतम रखरखाव के साथ अधिक सुसंगत, पुनरुत्पादनीय कैलिब्रेशन परिणाम प्रदान करता है। रक्त-अनुकरण तरल वाले फ्लो फैंटम स्कैटरिंग जैसी कुछ ध्वनिक गुणों का बेहतर अनुकरण कर सकते हैं, लेकिन तापमान नियंत्रण, नियमित तरल प्रतिस्थापन और अधिक जटिल सेटअप की आवश्यकता होती है। डॉप्लर वेग कैलिब्रेशन के लिए, स्ट्रिंग फैंटम बेहतर सटीकता और व्यावहारिकता प्रदान करते हैं।",
    "doppler.faq.q4": "क्या Mark V मेरे अल्ट्रासाउंड सिस्टम के साथ संगत है?",
    "doppler.faq.a4": "हां। Mark V डॉप्लर फैंटम डॉप्लर क्षमता वाले सभी डायग्नोस्टिक अल्ट्रासाउंड सिस्टम के साथ संगत है, जिसमें GE, Philips, Siemens, Canon (Toshiba), Samsung, Fujifilm, Mindray और अन्य निर्माता शामिल हैं। 2-15 MHz प्रोब संगतता वैस्कुलर, कार्डियक, ऑब्स्टेट्रिक और सामान्य इमेजिंग अनुप्रयोगों में उपयोग किए जाने वाले लगभग सभी क्लिनिकल ट्रांसड्यूसर को कवर करती है।",
    "doppler.faq.q5": "मैं कौन से रक्त प्रवाह वेगों का परीक्षण कर सकता हूं?",
    "doppler.faq.a5": "Mark V 10-200 cm/s को कवर करता है, क्लिनिकल रक्त प्रवाह वेगों की पूरी श्रृंखला को फैलाता है: शिरापरक प्रवाह (10-30 cm/s), सामान्य धमनी प्रवाह (30-100 cm/s), और स्टेनोटिक वाहिकाओं या कार्डियक अनुप्रयोगों में पीक सिस्टोलिक वेग (200 cm/s और उससे अधिक तक)। यह सीमा कैरोटिड स्टेनोसिस ग्रेडिंग, परिधीय वैस्कुलर मूल्यांकन, कार्डियक वाल्व मूल्यांकन, ऑब्स्टेट्रिक डॉप्लर और ट्रांसक्रैनियल डॉप्लर अनुप्रयोगों का समर्थन करती है।",
    "doppler.faq.q6": "NIST-ट्रेसेबल कैलिब्रेशन कैसे काम करता है?",
    "doppler.faq.a6": "NIST-ट्रेसेबल कैलिब्रेशन का मतलब है कि हमारे फैंटम की वेग सटीकता को नेशनल इंस्टीट्यूट ऑफ स्टैंडर्ड्स एंड टेक्नोलॉजी तक तुलनाओं की एक अटूट श्रृंखला के माध्यम से दस्तावेज़ीकृत किया जा सकता है। प्रत्येक Mark V माप अनिश्चितता और ट्रेसेबिलिटी दिखाने वाले कैलिब्रेशन प्रमाणपत्र के साथ शिप होता है। वार्षिक पुन: प्रमाणन इस ट्रेसेबिलिटी को बनाए रखता है—नियामक अनुपालन और प्रत्यायन ऑडिट के लिए आवश्यक।",
    "doppler.faq.q7": "प्रत्यायन के लिए कौन से दस्तावेज़ प्रदान किए जाते हैं?",
    "doppler.faq.a7": "प्रत्येक Mark V NIST मानकों के लिए ट्रेसेबल कैलिब्रेशन प्रमाणपत्र के साथ शिप होता है। यूनिट ACR, IAC, ICAVL और Joint Commission प्रत्यायन आवश्यकताओं के साथ संगत PDF और CSV प्रारूपों में परीक्षण परिणाम निर्यात करती है। हम टेम्पलेट QA प्रोटोकॉल, परीक्षण प्रक्रिया दस्तावेज़ीकरण और प्रयोगशाला प्रत्यायन प्रस्तुतियों के लिए मार्गदर्शन भी प्रदान करते हैं। हमारी सहायता टीम विशिष्ट प्रत्यायन दस्तावेज़ीकरण आवश्यकताओं में सहायता कर सकती है।",
    "doppler.faq.q8": "क्या आप OEM और अनुसंधान अनुप्रयोगों का समर्थन करते हैं?",
    "doppler.faq.a8": "हां। हम उत्पादन परीक्षण और QA के लिए अल्ट्रासाउंड OEM निर्माताओं को, R&D और नियामक प्रस्तुतियों के लिए मेडिकल डिवाइस डेवलपर्स को, और अनुसंधान और शिक्षा के लिए शैक्षणिक संस्थानों को डॉप्लर फैंटम की आपूर्ति करते हैं। OEM और संस्थागत ग्राहकों के लिए वॉल्यूम प्राइसिंग और कस्टम कॉन्फ़िगरेशन उपलब्ध हैं। अपनी विशिष्ट आवश्यकताओं पर चर्चा करने के लिए हमसे संपर्क करें।",
    // HIFU Page
    "hifu.hero.badge": "पूर्ण HIFU ड्राइविंग सिस्टम",
    "hifu.hero.title": "HIFU RF<br><em>पावर सिस्टम</em>",
    "hifu.hero.subtitle": "एक पूर्ण, उपयोग के लिए तैयार HIFU ड्राइविंग सिस्टम—बस अपना ट्रांसड्यूसर जोड़ें। फ्रीक्वेंसी जनरेटर, प्रिसिजन टाइमिंग सर्किट, पावर एम्पलीफायर, सेफ्टी सिस्टम और पूर्ण सिस्टम कंट्रोल सभी एक यूनिट में एकीकृत। एक USB पोर्ट के माध्यम से सरल ASCII कमांड। पावर ऑन करें और उपचार शुरू करें।",
    "hifu.hero.cta2": "विनिर्देश देखें",
    "hifu.trust.usb": "USB पोर्ट",
    "hifu.trust.allinone.num": "ऑल-इन-वन",
    "hifu.trust.allinone.label": "पूर्ण सिस्टम",
    "hifu.trust.power": "अधिकतम पावर",
    "hifu.whatis.tag": "HIFU तकनीक को समझना",
    "hifu.whatis.title": "हाई-इंटेंसिटी फोकस्ड अल्ट्रासाउंड क्या है?",
    "hifu.whatis.lead": "हाई-इंटेंसिटी फोकस्ड अल्ट्रासाउंड (HIFU) एक गैर-आक्रामक चिकित्सीय तकनीक है जो शरीर के अंदर गहरे ऊतकों को सटीक रूप से गर्म करने और नष्ट करने के लिए फोकस्ड ध्वनिक ऊर्जा का उपयोग करती है—बिना चीरों या विकिरण के।",
    "hifu.whatis.p1": "<strong>एक पूर्ण सिस्टम, सिर्फ एक एम्पलीफायर नहीं:</strong> हमारा HIFU RF पावर सिस्टम आपके ट्रांसड्यूसर को चलाने के लिए आवश्यक सब कुछ एकीकृत करता है: प्रिसिजन फ्रीक्वेंसी जनरेटर, टाइमिंग और गेटिंग सर्किट, हाई-पावर RF एम्पलीफायर, व्यापक सेफ्टी सिस्टम और पूर्ण डिजिटल कंट्रोल। बस अपना ट्रांसड्यूसर कनेक्ट करें और आप तैयार हैं।",
    "hifu.whatis.p2": "<strong>सरल USB कंट्रोल:</strong> कोई जटिल इंटरफेस या प्रोप्राइटरी सॉफ्टवेयर नहीं। फ्रीक्वेंसी, पावर, पल्स टाइमिंग और सभी सिस्टम फंक्शन को कंट्रोल करने के लिए एक USB पोर्ट के माध्यम से सरल ASCII टेक्स्ट कमांड भेजें। किसी भी प्रोग्रामिंग लैंग्वेज या टर्मिनल प्रोग्राम के साथ काम करता है। पूर्ण दस्तावेज़ीकरण शामिल।",
    "hifu.whatis.p3": "<strong>बिल्ट-इन सेफ्टी:</strong> VSWR प्रोटेक्शन, ओवर-टेम्परेचर शटडाउन, आर्क डिटेक्शन और हार्डवेयर इंटरलॉक सभी एकीकृत हैं। अपने एप्लीकेशन पर ध्यान केंद्रित करें—सेफ्टी सिस्टम बाकी संभालते हैं।",
    "hifu.whatis.diagram.title": "क्या शामिल है",
    "hifu.whatis.step1.title": "फ्रीक्वेंसी जनरेटर",
    "hifu.whatis.step1.desc": "प्रिसिजन DDS सिंथेसिस, 0.5-7 MHz रेंज",
    "hifu.whatis.step2.title": "टाइमिंग और गेटिंग सर्किट",
    "hifu.whatis.step2.desc": "प्रोग्रामेबल पल्स कंट्रोल, <10 μs रिस्पॉन्स",
    "hifu.whatis.step3.title": "RF पावर एम्पलीफायर",
    "hifu.whatis.step3.desc": "500W कंटीन्यूअस तक, इम्पीडेंस मैच्ड",
    "hifu.whatis.step4.title": "सेफ्टी सिस्टम",
    "hifu.whatis.step4.desc": "VSWR, थर्मल, आर्क प्रोटेक्शन और इंटरलॉक",
    "hifu.whatis.step5.title": "USB कंट्रोल इंटरफेस",
    "hifu.whatis.step5.desc": "सरल ASCII कमांड, किसी भी सॉफ्टवेयर के साथ काम करता है",
    "hifu.whatis.diagram.footer": "आप प्रदान करें: आपका ट्रांसड्यूसर",
    "hifu.features.tag": "पूर्ण सिस्टम फीचर्स",
    "hifu.features.title": "आपको जो चाहिए, एकीकृत",
    "hifu.features.desc": "एक टर्नकी HIFU ड्राइविंग सॉल्यूशन—अपना ट्रांसड्यूसर कनेक्ट करें, USB प्लग इन करें, और आप तैयार हैं। कोई एक्सटर्नल सिग्नल जनरेटर, एम्पलीफायर या कंट्रोल सिस्टम की आवश्यकता नहीं।",
    "hifu.features.power.title": "हाई पावर आउटपुट",
    "hifu.features.power.desc": "500W कंटीन्यूअस वेव (CW) या पल्स्ड आउटपुट तक। विभिन्न क्लिनिकल अनुप्रयोगों के लिए 100W से मल्टी-किलोवाट सिस्टम तक स्केलेबल कॉन्फ़िगरेशन।",
    "hifu.features.freq.title": "वाइड फ्रीक्वेंसी रेंज",
    "hifu.features.freq.desc": "0.5 MHz से 7 MHz सभी HIFU अनुप्रयोगों को कवर करता है—डीप टिश्यू एब्लेशन (0.5-1 MHz) से सुपरफिशियल एस्थेटिक ट्रीटमेंट (3-7 MHz) तक।",
    "hifu.features.array.title": "मल्टी-चैनल एरे",
    "hifu.features.array.desc": "256 स्वतंत्र रूप से नियंत्रित चैनलों तक के साथ फेज्ड एरे ट्रांसड्यूसर के लिए सपोर्ट। इलेक्ट्रॉनिक बीम स्टीयरिंग और फोकल पॉइंट एडजस्टमेंट।",
    "hifu.features.response.title": "फास्ट रिस्पॉन्स टाइम",
    "hifu.features.response.desc": "प्रिसाइज पल्स्ड ऑपरेशन के लिए <10 μs राइज/फॉल टाइम। टेम्परेचर-गाइडेड थेरेपी और मोशन ट्रैकिंग के लिए रियल-टाइम पावर कंट्रोल।",
    "hifu.features.safety.title": "बिल्ट-इन सेफ्टी सिस्टम",
    "hifu.features.safety.desc": "VSWR प्रोटेक्शन, ओवर-टेम्परेचर शटडाउन और आर्क डिटेक्शन। हार्डवेयर इंटरलॉक और सॉफ्टवेयर लिमिट सुरक्षित ऑपरेशन सुनिश्चित करते हैं।",
    "hifu.features.control.title": "सरल ASCII कंट्रोल",
    "hifu.features.control.desc": "एक USB पोर्ट। सरल ASCII टेक्स्ट कमांड। किसी भी टर्मिनल या प्रोग्रामिंग लैंग्वेज से फ्रीक्वेंसी, पावर, टाइमिंग—सब कुछ कंट्रोल करें। कोई प्रोप्राइटरी सॉफ्टवेयर की जरूरत नहीं।",
    "hifu.apps.tag": "क्लिनिकल और रिसर्च अनुप्रयोग",
    "hifu.apps.title": "HIFU अनुप्रयोग",
    "hifu.apps.desc": "हमारे RF पावर जनरेटर फोकस्ड अल्ट्रासाउंड अनुप्रयोगों के पूर्ण स्पेक्ट्रम का समर्थन करते हैं—जीवन बचाने वाले ट्यूमर एब्लेशन से लेकर अत्याधुनिक रिसर्च तक।",
    "hifu.apps.oncology.title": "ऑन्कोलॉजी और ट्यूमर एब्लेशन",
    "hifu.apps.oncology.desc": "प्रोस्टेट, लीवर, ब्रेस्ट, किडनी और हड्डी में सॉलिड ट्यूमर का गैर-आक्रामक उपचार। HIFU उन रोगियों के लिए सर्जरी का विकल्प प्रदान करता है जो सर्जिकल कैंडिडेट नहीं हैं। 2024 ऑन्कोलॉजी सेगमेंट वैश्विक HIFU बाजार का 41% प्रतिनिधित्व करता है, FDA-क्लियर्ड सिस्टम जैसे Focal One® अपनाने को बढ़ावा दे रहे हैं।",
    "hifu.apps.neuro.title": "न्यूरोलॉजी और ब्रेन थेरेपी",
    "hifu.apps.neuro.desc": "एसेंशियल ट्रेमर, पार्किंसंस डिजीज ट्रेमर और न्यूरोपैथिक पेन के लिए MRI-गाइडेड फोकस्ड अल्ट्रासाउंड। HIFU खोपड़ी खोले बिना गहरी मस्तिष्क संरचनाओं में सटीक लीजन बना सकता है—इनवेसिव न्यूरोसर्जरी का एक सफलतापूर्ण विकल्प। हमारे MRI-कम्पैटिबल जनरेटर MRgFUS प्लेटफॉर्म के साथ एकीकरण को सक्षम करते हैं।",
    "hifu.apps.aesthetic.title": "एस्थेटिक और कॉस्मेटिक",
    "hifu.apps.aesthetic.desc": "गैर-आक्रामक स्किन टाइटनिंग, रिंकल रिडक्शन और बॉडी कंटूरिंग। हायर फ्रीक्वेंसी HIFU (3-7 MHz) सर्जरी के बिना कॉस्मेटिक सुधार के लिए SMAS लेयर और सबक्यूटेनियस फैट को टारगेट करता है। एस्थेटिक HIFU सेगमेंट सबसे तेजी से बढ़ने वाला बाजार है, जो मिनिमली इनवेसिव ट्रीटमेंट की उपभोक्ता मांग से प्रेरित है।",
    "hifu.apps.rnd.title": "रिसर्च और डेवलपमेंट",
    "hifu.apps.rnd.desc": "अकादमिक और औद्योगिक R&D के लिए फ्लेक्सिबल कॉन्फ़िगरेशन। नए HIFU अनुप्रयोग विकसित करें, ट्रीटमेंट प्रोटोकॉल वैलिडेट करें और ट्रांसड्यूसर परफॉर्मेंस कैरेक्टराइज करें। हमारे जनरेटर बेंच एक्सपेरिमेंट से प्रीक्लिनिकल स्टडीज और रेगुलेटरी सबमिशन तक पूर्ण रिसर्च साइकिल का समर्थन करते हैं।",
    "hifu.apps.oem.title": "OEM सिस्टम इंटीग्रेशन",
    "hifu.apps.oem.desc": "कमर्शियल HIFU सिस्टम में इंटीग्रेशन के लिए डिज़ाइन किया गया। कॉम्पैक्ट फॉर्म फैक्टर, कम्प्रीहेंसिव API और रेगुलेटरी डॉक्यूमेंटेशन FDA 510(k) और CE मार्किंग सबमिशन का समर्थन करते हैं। OEM पार्टनरशिप के लिए वॉल्यूम प्राइसिंग और डिज़ाइन-इन सपोर्ट।",
    "hifu.apps.drug.title": "ड्रग डिलीवरी और सोनोपोरेशन",
    "hifu.apps.drug.desc": "एन्हांस्ड ड्रग डिलीवरी, ब्लड-ब्रेन बैरियर ओपनिंग और सोनोडायनामिक थेरेपी रिसर्च के लिए लो-इंटेंसिटी पल्स्ड HIFU। प्रिसाइज पल्स कंट्रोल थर्मल एब्लेशन से परे बायोइफेक्ट्स की जांच को सक्षम करता है।",
    "hifu.specs.tag": "तकनीकी विवरण",
    "hifu.specs.title": "पूर्ण सिस्टम विनिर्देश",
    "hifu.specs.desc": "ऑल-इन-वन सिस्टम में फ्रीक्वेंसी जनरेटर, टाइमिंग सर्किट, एम्पलीफायर, सेफ्टी सिस्टम और USB कंट्रोल शामिल है। बस अपना ट्रांसड्यूसर कनेक्ट करें।",
    "hifu.specs.row1.label": "फ्रीक्वेंसी रेंज",
    "hifu.specs.row1.value": "0.5 – 7.0 MHz",
    "hifu.specs.row2.label": "फ्रीक्वेंसी स्थिरता",
    "hifu.specs.row2.value": "±10 ppm",
    "hifu.specs.row3.label": "आउटपुट पावर (CW)",
    "hifu.specs.row3.value": "100W / 250W / 500W मॉडल",
    "hifu.specs.row4.label": "आउटपुट पावर (पल्स्ड)",
    "hifu.specs.row4.value": "1000W पीक तक",
    "hifu.specs.row5.label": "पावर रिज़ॉल्यूशन",
    "hifu.specs.row5.value": "0.1W (डिजिटल कंट्रोल)",
    "hifu.specs.row6.label": "राइज/फॉल टाइम",
    "hifu.specs.row6.value": "<10 μs",
    "hifu.specs.row7.label": "ड्यूटी साइकिल",
    "hifu.specs.row7.value": "0-100% (CW या पल्स्ड)",
    "hifu.specs.row8.label": "आउटपुट इम्पीडेंस",
    "hifu.specs.row8.value": "50Ω नॉमिनल",
    "hifu.specs.row9.label": "VSWR प्रोटेक्शन",
    "hifu.specs.row9.value": "3:1 पर ऑटो-शटडाउन",
    "hifu.specs.row10.label": "कंट्रोल इंटरफेस",
    "hifu.specs.row10.value": "USB (ASCII कमांड)",
    "hifu.specs.row11.label": "कूलिंग",
    "hifu.specs.row11.value": "फोर्स्ड एयर / वाटर ऑप्शन",
    "hifu.specs.row12.label": "MRI संगतता",
    "hifu.specs.row12.value": "ऑप्शनल शील्डेड वर्जन",
    "hifu.specs.cta": "पूर्ण विनिर्देश का अनुरोध करें",
    "hifu.specs.avail": "उपलब्ध: 100W, 250W, 500W मॉडल",
    "hifu.why.tag": "JJ&A Instruments क्यों",
    "hifu.why.title": "HIFU जनरेटर का लाभ",
    "hifu.why.desc": "मेडिकल डिवाइस डेवलपर्स की मांग के अनुसार विश्वसनीयता और समर्थन के साथ थेराप्यूटिक अल्ट्रासाउंड के लिए उद्देश्य-निर्मित।",
    "hifu.why.quality.title": "मेडिकल-ग्रेड गुणवत्ता",
    "hifu.why.quality.desc": "ISO 13485 प्रमाणित मैन्युफैक्चरिंग। आपके HIFU सिस्टम के FDA 510(k) और CE मार्किंग सबमिशन का समर्थन करने के लिए डिज़ाइन और दस्तावेज़ीकृत।",
    "hifu.why.support.title": "एप्लीकेशन इंजीनियरिंग",
    "hifu.why.support.desc": "हमारे RF इंजीनियर HIFU अनुप्रयोगों को समझते हैं। ट्रांसड्यूसर मैचिंग, थर्मल मैनेजमेंट और सिस्टम इंटीग्रेशन के लिए विशेषज्ञ सहायता प्राप्त करें।",
    "hifu.why.global.title": "वैश्विक उपलब्धता",
    "hifu.why.global.desc": "उत्तरी अमेरिका, यूरोप और एशिया-पैसिफिक में स्थानीय समर्थन के साथ विश्वव्यापी शिपिंग। योग्य प्रोजेक्ट के लिए इवैल्यूएशन यूनिट उपलब्ध।",
    "hifu.why.api.title": "कम्प्रीहेंसिव APIs",
    "hifu.why.api.desc": "डॉक्यूमेंटेड APIs के माध्यम से पूर्ण सॉफ्टवेयर कंट्रोल। LabVIEW VIs, Python लाइब्रेरी और C/C++ SDK शामिल। आपके कंट्रोल सिस्टम के साथ तेज़ इंटीग्रेशन।",
    "hifu.why.longterm.title": "लॉन्ग-टर्म सपोर्ट",
    "hifu.why.longterm.desc": "5 वर्ष प्रोडक्ट उपलब्धता गारंटी। एक्सटेंडेड वारंटी ऑप्शन। आपके सिस्टम को चालू रखने के लिए कैलिब्रेशन और मेंटेनेंस सेवाएं।",
    "hifu.why.custom.title": "कस्टम कॉन्फ़िगरेशन",
    "hifu.why.custom.desc": "किसी विशिष्ट फ्रीक्वेंसी, पावर लेवल या फॉर्म फैक्टर की आवश्यकता है? हमारी इंजीनियरिंग टीम आपकी अनूठी आवश्यकताओं के लिए जनरेटर को कस्टमाइज़ कर सकती है।",
    "hifu.faq.tag": "सामान्य प्रश्न",
    "hifu.faq.title": "HIFU जनरेटर FAQ",
    "hifu.faq.q1": "HIFU क्या है और यह कैसे काम करता है?",
    "hifu.faq.a1": "हाई-इंटेंसिटी फोकस्ड अल्ट्रासाउंड (HIFU) फोकस्ड ध्वनिक ऊर्जा का उपयोग करके लक्षित ऊतक को गैर-आक्रामक रूप से गर्म और नष्ट करता है। एक RF पावर जनरेटर पीज़ोइलेक्ट्रिक ट्रांसड्यूसर को चलाता है जो विद्युत ऊर्जा को अल्ट्रासाउंड तरंगों में बदलते हैं। ये तरंगें शरीर में एक सटीक बिंदु पर केंद्रित होती हैं—जैसे मैग्निफाइंग ग्लास के माध्यम से सूर्य की रोशनी—जहां तापमान 60-85°C तक पहुंचता है, जो आसपास की संरचनाओं को बचाते हुए लक्ष्य ऊतक का थर्मल एब्लेशन करता है।",
    "hifu.faq.q2": "मेरे HIFU अनुप्रयोग के लिए मुझे कौन सी फ्रीक्वेंसी का उपयोग करना चाहिए?",
    "hifu.faq.a2": "फ्रीक्वेंसी चयन ट्रीटमेंट डेप्थ और टारगेट टिश्यू पर निर्भर करता है। <strong>लोअर फ्रीक्वेंसी (0.5-1 MHz)</strong> गहरे (15 cm तक) पेनेट्रेट करती है और लीवर, किडनी और प्रोस्टेट में ट्यूमर एब्लेशन के लिए उपयोग की जाती है। <strong>मिड-रेंज फ्रीक्वेंसी (1-3 MHz)</strong> न्यूरोलॉजिकल HIFU और जनरल थेराप्यूटिक अनुप्रयोगों के लिए आम है। <strong>हायर फ्रीक्वेंसी (3-7 MHz)</strong> स्किन लेयर्स को टारगेट करने वाले एस्थेटिक ट्रीटमेंट के लिए प्रिसाइज, शैलो पेनेट्रेशन प्रदान करती है। हमारी टीम आपके विशिष्ट अनुप्रयोग के लिए इष्टतम फ्रीक्वेंसी चुनने में मदद कर सकती है।",
    "hifu.faq.q3": "क्या जनरेटर MRI वातावरण के साथ संगत है?",
    "hifu.faq.a3": "हां। हम MR-गाइडेड फोकस्ड अल्ट्रासाउंड (MRgFUS) अनुप्रयोगों के लिए EMI शील्डिंग और नॉन-मैग्नेटिक कंस्ट्रक्शन के साथ MRI-कम्पैटिबल वर्जन प्रदान करते हैं। ये जनरेटर इमेजिंग में हस्तक्षेप किए बिना MRI सुइट के अंदर काम कर सकते हैं। शील्डेड वर्जन 1.5T और 3T फील्ड स्ट्रेंथ पर वैलिडेट किया गया है। अपनी विशिष्ट MRI इंटीग्रेशन आवश्यकताओं पर चर्चा करने के लिए हमसे संपर्क करें।",
    "hifu.faq.q4": "क्या जनरेटर फेज्ड एरे ट्रांसड्यूसर चला सकता है?",
    "hifu.faq.a4": "हां। हम फेज्ड एरे ट्रांसड्यूसर के लिए 256 स्वतंत्र रूप से नियंत्रित चैनलों तक के साथ मल्टी-चैनल कॉन्फ़िगरेशन प्रदान करते हैं। प्रत्येक चैनल इलेक्ट्रॉनिक बीम स्टीयरिंग और फोकल पॉइंट एडजस्टमेंट के लिए इंडिविजुअल एम्प्लीट्यूड और फेज कंट्रोल प्रदान करता है। मल्टी-चैनल सिस्टम में कोहेरेंट ऑपरेशन के लिए सिंक्रोनाइज़ेशन फीचर शामिल हैं। सिंगल-एलिमेंट और एन्युलर एरे ट्रांसड्यूसर भी पूर्ण रूप से समर्थित हैं।",
    "hifu.faq.q5": "कौन सी सेफ्टी फीचर शामिल हैं?",
    "hifu.faq.a5": "सेफ्टी हर जनरेटर में बिल्ट-इन है: <strong>VSWR प्रोटेक्शन</strong> अगर रिफ्लेक्टेड पावर सेफ लिमिट से अधिक हो तो ऑटोमैटिकली पावर कम करता है (ट्रांसड्यूसर डैमेज रोकता है)। <strong>ओवर-टेम्परेचर प्रोटेक्शन</strong> इंटरनल टेम्परेचर मॉनिटर करता है और ओवरहीटिंग से पहले शटडाउन करता है। <strong>आर्क डिटेक्शन</strong> RF पाथ में आर्किंग डिटेक्ट होने पर तुरंत पावर कट करता है। <strong>हार्डवेयर इंटरलॉक</strong> एक्सटर्नल सेफ्टी स्विच और इमरजेंसी स्टॉप सपोर्ट करते हैं। <strong>सॉफ्टवेयर लिमिट</strong> आपको एप्लीकेशन-स्पेसिफिक पावर और ड्यूरेशन लिमिट डिफाइन करने देती हैं।",
    "hifu.faq.q6": "कौन से रेगुलेटरी डॉक्यूमेंटेशन उपलब्ध हैं?",
    "hifu.faq.a6": "हम आपके रेगुलेटरी सबमिशन को सपोर्ट करने के लिए कम्प्रीहेंसिव डॉक्यूमेंटेशन प्रदान करते हैं: स्पेसिफिकेशन, टेस्ट रिपोर्ट और ट्रेसेबिलिटी सहित <strong>डिज़ाइन हिस्ट्री फाइल</strong>। ISO 14971 के अनुसार <strong>रिस्क एनालिसिस</strong>। IEC 60601-1-2 के अनुसार <strong>EMC टेस्ट रिपोर्ट</strong>। IEC 60601-1 के अनुसार <strong>इलेक्ट्रिकल सेफ्टी टेस्टिंग</strong>। कनफॉर्मेंस और कैलिब्रेशन <strong>सर्टिफिकेट</strong>। हमारी रेगुलेटरी अफेयर्स टीम FDA 510(k) और CE मार्किंग प्रश्नों में सहायता कर सकती है।",
    "hifu.faq.q7": "क्या आप OEM इंटीग्रेशन और कस्टम कॉन्फ़िगरेशन सपोर्ट करते हैं?",
    "hifu.faq.a7": "हां। हम OEM प्रोजेक्ट पर HIFU सिस्टम डेवलपर्स के साथ निकटता से काम करते हैं: आपके ट्रांसड्यूसर से मैच की गई <strong>कस्टम फ्रीक्वेंसी</strong>। आपके सिस्टम एनक्लोज़र में इंटीग्रेशन के लिए <strong>मॉडिफाइड फॉर्म फैक्टर</strong>। <strong>कस्टम इंटरफेस</strong> और कंट्रोल प्रोटोकॉल। <strong>प्राइवेट लेबलिंग</strong> उपलब्ध। प्रोडक्शन क्वांटिटी के लिए <strong>वॉल्यूम प्राइसिंग</strong>। हम इवैल्यूएशन के लिए डिज़ाइन-इन सपोर्ट, प्रोटोटाइप और इंजीनियरिंग सैंपल भी प्रदान कर सकते हैं।",
    "hifu.faq.q8": "वारंटी और सपोर्ट पॉलिसी क्या है?",
    "hifu.faq.a8": "स्टैंडर्ड वारंटी 2 वर्ष है जो पार्ट्स और लेबर को कवर करती है। 5 वर्ष तक की एक्सटेंडेड वारंटी ऑप्शन उपलब्ध हैं। सपोर्ट में शामिल है: बिज़नेस आवर्स के दौरान <strong>फोन और ईमेल टेक्निकल सपोर्ट</strong>। नेटवर्क कनेक्शन के माध्यम से <strong>रिमोट डायग्नोस्टिक्स</strong>। हमारी फैसिलिटी में <strong>रिपेयर और कैलिब्रेशन सर्विसेज</strong>। रिपेयर के दौरान योग्य कस्टमर्स के लिए <strong>लोनर यूनिट</strong> उपलब्ध। अतिरिक्त शुल्क पर <strong>ऑन-साइट सर्विस</strong> उपलब्ध।",
    "hifu.contact.desc": "अपने HIFU अनुप्रयोग को पावर देने के लिए तैयार हैं? प्राइसिंग, स्पेसिफिकेशन के लिए हमसे संपर्क करें, या हमारी इंजीनियरिंग टीम के साथ अपनी प्रोजेक्ट आवश्यकताओं पर चर्चा करें।",
    "footer.applications": "अनुप्रयोग",
    "hifu.apps.oncology.short": "ट्यूमर एब्लेशन",
    "hifu.apps.neuro.short": "न्यूरोलॉजी",
    "hifu.apps.aesthetic.short": "एस्थेटिक्स",
    "hifu.apps.rnd.short": "रिसर्च",
    "nav.compliance": "QA और अनुपालन",
    "footer.recertification": "फैंटम पुन: प्रमाणन",
    "nav.faq": "FAQ",
    "footer.docs": "तकनीकी दस्तावेज़",
    "footer.protocols": "QA प्रोटोकॉल",
    "nav.specs": "विनिर्देश",
    "nav.home": "होम",
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
      this.detectCountry().then((lang) => {
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
    this.apiBase = window.BLOG_API_URL || "https://jja-instruments-website-production.up.railway.app/api";

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
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) {
    mainImage.src = src;
    mainImage.alt = element.querySelector("img").alt;
  }

  // Update active thumbnail
  document.querySelectorAll(".product-image-gallery .thumbnail").forEach((thumb) => {
    thumb.classList.remove("active");
  });
  element.classList.add("active");
}
