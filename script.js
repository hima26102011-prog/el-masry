/**
 * منصة أ. محمد المصري - العلوم والعلوم المتكاملة
 * ملف الجافاسكريبت التفاعلي الكامل
 */

// Phone number constant (Mr. Mohamed El-Masry direct WhatsApp)
const TEACHER_PHONE = "201010081353";
const TEACHER_NAME = "أ. محمد المصري";

// State Management
const AppState = {
  student: {
    name: "",
    phone: "",
    parentPhone: "",
    grade: ""
  },
  audioEnabled: true
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initStudentProfile();
  initMouseEffects();
  initScienceCanvas();
  initNavbar();
  initExcellenceChart();
  initBookingForm();
  initFloatingWhatsApp();
  initSoundEffects();
  initScrollProgress();
  initBackToTop();
  initStatsCounter();
  lucide.createIcons();
});

/* ========================================================
   1. نظام تسجيل بيانات الطالب السريع (Local Storage)
   ======================================================== */
function initStudentProfile() {
  const savedData = localStorage.getItem("elmasry_student_profile");
  if (savedData) {
    try {
      AppState.student = JSON.parse(savedData);
      updateUserInterfaceForLoggedStudent();
    } catch (e) {
      console.error("Error reading student profile", e);
    }
  }

  // Profile modal triggers
  const openLoginBtn = document.getElementById("open-login-btn");
  const loginModal = document.getElementById("login-modal");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const studentForm = document.getElementById("student-login-form");

  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener("click", () => {
      // Pre-fill form if data exists
      if (AppState.student.name) {
        document.getElementById("login-name").value = AppState.student.name;
        document.getElementById("login-phone").value = AppState.student.phone;
        document.getElementById("login-parent-phone").value = AppState.student.parentPhone || "";
      }
      loginModal.classList.remove("hidden");
      loginModal.classList.add("flex");
    });
  }

  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener("click", () => {
      loginModal.classList.add("hidden");
      loginModal.classList.remove("flex");
    });
  }

  // Close on outside click
  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.classList.add("hidden");
        loginModal.classList.remove("flex");
      }
    });
  }

  // Save profile
  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("login-name").value.trim();
      const phone = document.getElementById("login-phone").value.trim();
      const parentPhone = document.getElementById("login-parent-phone").value.trim();

      if (!name || !phone) {
        showToast("يرجى إدخال الاسم ورقم الهاتف", "error");
        return;
      }

      AppState.student.name = name;
      AppState.student.phone = phone;
      AppState.student.parentPhone = parentPhone;

      localStorage.setItem("elmasry_student_profile", JSON.stringify(AppState.student));
      updateUserInterfaceForLoggedStudent();
      
      if (typeof gtag === "function") {
        gtag("event", "sign_up", { method: "LocalProfile" });
      }

      loginModal.classList.add("hidden");
      loginModal.classList.remove("flex");

      showToast(`أهلاً بك يا بطل العلوم، ${name}! تم حفظ بياناتك بنجاح ✨`, "success");
      playNotificationSound();
    });
  }
}

function updateUserInterfaceForLoggedStudent() {
  const openLoginBtn = document.getElementById("open-login-btn");
  const studentWelcome = document.getElementById("student-welcome-badge");
  
  if (AppState.student.name) {
    if (openLoginBtn) {
      openLoginBtn.innerHTML = `
        <i data-lucide="user-check" class="w-4 h-4 text-amber-400"></i>
        <span class="truncate max-w-[120px]">${AppState.student.name}</span>
      `;
    }
    if (studentWelcome) {
      studentWelcome.classList.remove("hidden");
      studentWelcome.querySelector("#student-name-display").textContent = AppState.student.name;
    }
    
    // Auto-fill booking form fields if empty
    const bookName = document.getElementById("student-name");
    const bookPhone = document.getElementById("student-phone");
    const bookParentPhone = document.getElementById("parent-phone");

    if (bookName && !bookName.value) bookName.value = AppState.student.name;
    if (bookPhone && !bookPhone.value) bookPhone.value = AppState.student.phone;
    if (bookParentPhone && !bookParentPhone.value && AppState.student.parentPhone) {
      bookParentPhone.value = AppState.student.parentPhone;
    }

    lucide.createIcons();
  }
}

/* ========================================================
   2. تأثيرات الماوس الفاخرة (Mouse Spotlight & Cursor Trail)
   ======================================================== */
function initMouseEffects() {
  const spotlight = document.getElementById("mouse-spotlight");
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateSpotlight() {
    // Smooth easing
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animateSpotlight);
  }

  animateSpotlight();
}

/* ========================================================
   3. خلفية ذرات وجزيئات العلوم التفاعلية (Canvas)
   ======================================================== */
function initScienceCanvas() {
  const canvas = document.getElementById("science-bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 50);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      color: Math.random() > 0.4 ? "rgba(59, 130, 246, 0.25)" : "rgba(245, 158, 11, 0.2)"
    });
  }

  let canvasAnimationId = null;
  let isCanvasVisible = true;

  function draw() {
    if (!isCanvasVisible) return;
    
    ctx.clearRect(0, 0, width, height);

    // Draw lines between close particles (Atom / Molecular bonds)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });

    canvasAnimationId = requestAnimationFrame(draw);
  }

  // Pause canvas when scrolled out of viewport
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasVisible = entry.isIntersecting;
      if (isCanvasVisible && !canvasAnimationId) {
        canvasAnimationId = requestAnimationFrame(draw);
      }
    });
  }, { threshold: 0 });

  canvasObserver.observe(canvas);

  // Also pause when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isCanvasVisible = false;
      if (canvasAnimationId) {
        cancelAnimationFrame(canvasAnimationId);
        canvasAnimationId = null;
      }
    } else {
      // Only resume if canvas is in viewport
      const rect = canvas.getBoundingClientRect();
      isCanvasVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (isCanvasVisible) {
        canvasAnimationId = requestAnimationFrame(draw);
      }
    }
  });

  draw();
}

/* ========================================================
   4. شريط التنقل والقائمة المتجاوبة (Navbar & Mobile Menu)
   ======================================================== */
function initNavbar() {
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Smooth scroll helper
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/* ========================================================
   5. رسم بياني لتصاعد مستوى الطلاب (Chart.js AreaChart)
   ======================================================== */
function initExcellenceChart() {
  const ctx = document.getElementById("excellenceChart");
  if (!ctx) return;

  const chartContext = ctx.getContext("2d");

  // Create royal blue and gold gradients
  const gradient = chartContext.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(245, 158, 11, 0.45)");
  gradient.addColorStop(0.5, "rgba(29, 78, 216, 0.25)");
  gradient.addColorStop(1, "rgba(29, 78, 216, 0.0)");

  new Chart(chartContext, {
    type: "line",
    data: {
      labels: [
        "بداية العام (تقييم تشخيصي)",
        "الشهر الأول (تأسيس وتجارب)",
        "الشهر الثاني (فهم عميق)",
        "امتحانات نصف العام",
        "المراجعات النهائية",
        "الامتحان الختامي (الدرجة النهائية)"
      ],
      datasets: [
        {
          label: "معدل درجات طلاب أ. محمد المصري",
          data: [64, 82, 91, 96, 99, 100],
          borderColor: "#f59e0b",
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fbbf24",
          pointBorderColor: "#040814",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#f59e0b"
        },
        {
          label: "متوسط الدرجات العادية للطلاب بدون المنصة",
          data: [60, 65, 68, 72, 74, 76],
          borderColor: "#64748b",
          borderWidth: 2,
          borderDash: [5, 5],
          backgroundColor: "transparent",
          tension: 0.4,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#cbd5e1",
            font: {
              family: "Alexandria",
              size: 13
            },
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          rtl: true,
          textDirection: "rtl",
          backgroundColor: "rgba(13, 23, 49, 0.95)",
          titleFont: { family: "Alexandria", size: 14 },
          bodyFont: { family: "Cairo", size: 13 },
          borderColor: "rgba(245, 158, 11, 0.4)",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)"
          },
          ticks: {
            color: "#94a3b8",
            font: {
              family: "Cairo",
              size: 12
            }
          }
        },
        y: {
          min: 50,
          max: 100,
          grid: {
            color: "rgba(255, 255, 255, 0.05)"
          },
          ticks: {
            color: "#94a3b8",
            font: {
              family: "Cairo",
              size: 12
            },
            callback: function (val) {
              return val + "%";
            }
          }
        }
      }
    }
  });
}

/* ========================================================
   6. تكامل نموذج الحجز المباشر بالواتساب (Booking Form Integration)
   ======================================================== */
function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const studentName = document.getElementById("student-name").value.trim();
    const studentGrade = document.getElementById("student-grade").value;
    const studentPhone = document.getElementById("student-phone").value.trim();
    const parentPhone = document.getElementById("parent-phone").value.trim();
    const attendanceMode = document.querySelector('input[name="attendance_mode"]:checked')?.value || "مقر المعتصم مع الحلو (طنطا)";
    const studentNotes = document.getElementById("student-notes")?.value.trim() || "لا توجد ملاحظات إضافية";

    // Validation
    if (!studentName) {
      showToast("يرجى كتابة اسم الطالب ثلاثي", "error");
      document.getElementById("student-name").focus();
      return;
    }

    if (!studentGrade) {
      showToast("يرجى اختيار الصف الدراسي", "error");
      document.getElementById("student-grade").focus();
      return;
    }

    if (!studentPhone || studentPhone.length < 10) {
      showToast("يرجى إدخال رقم هاتف صحيح للطالب", "error");
      document.getElementById("student-phone").focus();
      return;
    }

    if (!parentPhone || parentPhone.length < 10) {
      showToast("يرجى إدخال رقم هاتف صحيح لولي الأمر", "error");
      document.getElementById("parent-phone").focus();
      return;
    }

    // Save to AppState and LocalStorage
    AppState.student.name = studentName;
    AppState.student.phone = studentPhone;
    AppState.student.parentPhone = parentPhone;
    AppState.student.grade = studentGrade;
    localStorage.setItem("elmasry_student_profile", JSON.stringify(AppState.student));
    updateUserInterfaceForLoggedStudent();

    // Construct formatted WhatsApp message
    const whatsappMessage = 
`*طلب حجز رسمي - منصة أ. محمد المصري* 🧪✨
-----------------------------------------
👤 *اسم الطالب:* ${studentName}
📚 *الصف الدراسي:* ${studentGrade}
📱 *هاتف الطالب:* ${studentPhone}
👨‍👩‍👦 *هاتف ولي الأمر:* ${parentPhone}
📍 *المقر / طريقة الحضور:* ${attendanceMode}
💬 *ملاحظات الطالب:* ${studentNotes}
-----------------------------------------
السلام عليكم ورحمة الله وبركاته يا مستر محمد، أنا قادم من المنصة الإلكترونية وأرغب في تأكيد حجز مقعدي معكم في مادة العلوم / العلوم المتكاملة. أرجو إفادتي بالمواعيد وتأكيد الحجز. وشكراً لحضرتك!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${TEACHER_PHONE}?text=${encodedMessage}`;

    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        grade: studentGrade,
        branch: attendanceMode
      });
    }

    // Show celebration and redirect
    showToast("جاري توجيهك إلى الواتساب لإرسال تفاصيل الحجز مباشرة...", "success");
    playNotificationSound();

    window.location.href = whatsappUrl;
  });
}

// Function to select course directly from courses cards
window.selectCourse = function(gradeName) {
  const gradeSelect = document.getElementById("student-grade");
  if (gradeSelect) {
    gradeSelect.value = gradeName;
  }
  const formElement = document.getElementById("booking-section");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth" });
  }
  showToast(`تم تحديد "${gradeName}" في نموذج الحجز بنجاح!`, "info");
};

// Function to select branch directly from branches cards
window.selectBranch = function(branchName) {
  const formElement = document.getElementById("booking-section");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth" });
  }
  const radio = document.querySelector(`input[name="attendance_mode"][value="${branchName}"]`);
  if (radio) {
    radio.checked = true;
    showToast(`تم اختيار "${branchName}" في نموذج الحجز بنجاح!`, "success");
  } else {
    showToast(`يرجى تحديد المقر المطلوب في نموذج الحجز`, "info");
  }
};

// Interactive Branch Switcher for Google Maps
window.switchMapBranch = function(branchKey) {
  const iframe = document.getElementById("branches-map-iframe");
  const badgeText = document.getElementById("branch-map-badge-text");
  const tabs = document.querySelectorAll(".branch-map-tab");

  tabs.forEach(tab => {
    tab.className = "branch-map-tab px-3.5 py-2 rounded-xl text-xs font-bold glass-card text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer";
  });

  const activeTab = document.getElementById(`tab-${branchKey}`);
  if (activeTab) {
    activeTab.className = "branch-map-tab active px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 text-royal-950 transition-all cursor-pointer shadow-md";
  }

  let mapQuery = "";
  let title = "";

  if (branchKey === "moatasem") {
    mapQuery = "طنطا شارع المعتصم مع الحلو";
    title = "مقر المعتصم مع الحلو - طنطا";
  } else if (branchKey === "embabi") {
    mapQuery = "طنطا شارع الامبابي مع رشدي";
    title = "مقر الامبابي مع رشدي - طنطا";
  } else if (branchKey === "othman") {
    mapQuery = "طنطا شارع عثمان مع يوسف الصديق";
    title = "مقر عثمان مع يوسف الصديق - طنطا";
  }

  if (iframe && mapQuery) {
    iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }
  if (badgeText) {
    badgeText.textContent = title;
  }
  if (window.lucide) {
    lucide.createIcons();
  }
};

/* ========================================================
   7. الأزرار المباشرة للتواصل بالواتساب (Hero & Floating Button)
   ======================================================== */
function initFloatingWhatsApp() {
  const heroWhatsappBtn = document.getElementById("hero-whatsapp-btn");
  const floatingWhatsappBtn = document.getElementById("floating-whatsapp-btn");

  function handleWhatsAppClick(btn, source) {
    let message = "";
    if (AppState.student && AppState.student.name) {
      message = 
`السلام عليكم ورحمة الله وبركاته يا مستر محمد المصري 🧪
أنا الطالب: ${AppState.student.name}
رقم هاتفي: ${AppState.student.phone || "مسجل عبر المنصة"}
${AppState.student.parentPhone ? `رقم ولي الأمر: ${AppState.student.parentPhone}` : ""}
أنا قادم من منصتكم الإلكترونية (العلوم والمصري) وأود الاستفسار والتواصل بخصوص الحصص والتفاصيل. أرجو الرد وشكراً لحضرتك!`;
    } else {
      message = 
`السلام عليكم ورحمة الله وبركاته يا مستر محمد 🧪
أنا قادم من خلال منصتكم التعليمية الرسمية (العلوم والمصري) وأود الاستفسار عن تفاصيل الحجز ومواعيد الحصص في مقرات طنطا أو أونلاين. أرجو الرد وشكراً لحضرتك!`;
    }

    const url = `https://wa.me/${TEACHER_PHONE}?text=${encodeURIComponent(message)}`;
    if (typeof gtag === "function") {
      gtag("event", "contact", { method: "WhatsApp", button_source: source });
    }

    if (btn) {
      btn.href = url;
    }
  }

  if (heroWhatsappBtn) {
    heroWhatsappBtn.addEventListener("click", () => handleWhatsAppClick(heroWhatsappBtn, "hero"));
  }

  if (floatingWhatsappBtn) {
    floatingWhatsappBtn.addEventListener("click", () => handleWhatsAppClick(floatingWhatsappBtn, "floating"));
  }
}

/* ========================================================
   8. نظام الإشعارات والتنبيهات المودرن (Toast Notification)
   ======================================================== */
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-300 p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium ${
    type === "success"
      ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-100"
      : type === "error"
      ? "bg-rose-950/90 border-rose-500/50 text-rose-100"
      : "bg-blue-950/90 border-amber-500/50 text-amber-100"
  }`;

  const iconName = type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info";
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <p class="flex-1">${message}</p>
  `;

  toastContainer.appendChild(toast);
  lucide.createIcons();

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* ========================================================
   9. المؤثرات الصوتية التقنية الخفيفة (Web Audio API)
   ======================================================== */
function initSoundEffects() {
  // Simple subtle chime for buttons
  const buttons = document.querySelectorAll(".btn-gold, .btn-royal, .btn-whatsapp");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      playSubtleClick();
    });
  });
}

function playSubtleClick() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
  } catch (e) {
    // Silently ignore if blocked by browser policy
  }
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);
  } catch (e) {
    // Ignore
  }
}

/* ========================================================
   10. ميزات التفاعل المتقدمة والعمق البصري
   ======================================================== */

// 1. شريط تقدم التمرير الذهبي/السياني (Scroll Progress Bar)
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress-bar");
  if (!progressBar) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
          const progress = (scrollTop / scrollHeight) * 100;
          progressBar.style.width = `${progress}%`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 2. زر العودة للأعلى الانسيابي (Floating Back to Top)
function initBackToTop() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 3. أداء قائمة الأسئلة الشائعة التفاعلية (Accordion FAQ)
window.toggleFaq = function(element) {
  if (!element) return;
  const isAlreadyActive = element.classList.contains("active");

  // Close all other items
  document.querySelectorAll(".faq-item").forEach(item => {
    item.classList.remove("active");
  });

  if (!isAlreadyActive) {
    element.classList.add("active");
    playSubtleClick();
  }
};

// 4. عداد الأرقام والإحصائيات التفاعلي المتحرك (Live Stats Counters)
function initStatsCounter() {
  const counters = document.querySelectorAll(".stat-counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute("data-target")) || 0;
        const duration = 1500; // ms
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeProgress * target;

          if (isDecimal) {
            counter.textContent = currentVal.toFixed(1);
          } else {
            counter.textContent = Math.floor(currentVal);
          }

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = isDecimal ? target.toFixed(1) : target;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}
