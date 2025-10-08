// Registrasi plugin ScrollTrigger GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const openButton = document.getElementById('open-invitation');
    const guestNameElement = document.getElementById('guest-name');
    const music = document.getElementById('wedding-music');
    const musicToggle = document.getElementById('music-toggle');
    const targetDate = new Date("Nov 17, 2025 08:00:00").getTime(); // Tanggal Acara
    let isPlaying = false; 

    // --- 1. MEMBACA NAMA TAMU DARI URL ---
    function getGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        // Cek parameter 'to' atau 'tamu'
        const guest = urlParams.get('to') || urlParams.get('tamu'); 
        if (guest) {
            // Hilangkan karakter non-alfanumerik selain spasi dan ganti '+'
            const cleanedGuest = guest.replace(/\+/g, ' ').replace(/[^a-zA-Z0-9\s]/g, '');
            guestNameElement.textContent = cleanedGuest;
        }
    }
    getGuestName();

    // --- 2. FUNGSI AUDIO DAN TOMBOL BUKA ---
    function toggleMusic() {
        if (isPlaying) {
            music.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
            musicToggle.classList.remove('playing');
        } else {
            music.play().catch(error => console.log("Audio Play Gagal:", error));
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    }
    musicToggle.addEventListener('click', toggleMusic);

    openButton.addEventListener('click', () => {
        // 1. Scroll ke Countdown atau Love Story
        gsap.to(window, { duration: 1.5, scrollTo: "#countdown-section", ease: "power2.inOut" });
        
        // 2. Putar musik (setelah interaksi pengguna)
        if (!isPlaying) {
            music.play().catch(error => console.log("Gagal memutar audio setelah interaksi:", error));
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
        }

        // 3. Hilangkan nama tamu (opsional)
        // guestNameElement.remove();
    });

    // --- 3. ANIMASI LOADING SCREEN & WELCOME ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Fade out loading screen
            gsap.to(loadingScreen, { opacity: 0, duration: 1, onComplete: () => {
                loadingScreen.style.visibility = 'hidden';
            }});

            // Animasi Welcome Section (Staggered Fade In Up)
            gsap.fromTo('.fade-in-up', 
                { opacity: 0, y: 50 }, 
                { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", stagger: 0.2 }
            );
            gsap.fromTo('.golden-border',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out", delay: 0.5 }
            );

        }, 1000); 
    });

    // --- 4. COUNTDOWN TIMER ---
    const updateCountdown = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.getElementById("countdown-timer").innerHTML = "<span>Acara Sedang Berlangsung!</span>";
        }
    }, 1000);

    // --- 5. ANIMASI GSAP: STORY (Split Scroll Parallax) ---
    document.querySelectorAll('.story-item').forEach((item) => {
        const image = item.querySelector('.story-image');
        const text = item.querySelector('.story-text');
        const isLeftToRight = item.classList.contains('left-to-right');

        // Animasi Fade-in umum saat item muncul di viewport
        gsap.fromTo(item, 
            { opacity: 0, y: 50 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            }
        );

        // Efek Split Scroll Parallax
        gsap.to(image, {
            yPercent: isLeftToRight ? -20 : 20, // Gambar bergerak berlawanan dengan scroll
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
         
        gsap.to(text, {
            yPercent: isLeftToRight ? 20 : -20, // Teks bergerak searah dengan scroll
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });
    });

    // --- 6. ANIMASI GSAP: EVENT & GIFT (Fade Up) ---
    gsap.utils.toArray(".event-fade").forEach((card, i) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 70 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                delay: i * 0.2, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#event-details",
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    });

    gsap.fromTo(".gift-box", 
        { opacity: 0, scale: 0.9 }, 
        { 
            opacity: 1, 
            scale: 1, 
            duration: 1, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#gift",
                start: "top 75%",
                toggleActions: "play none none reverse",
            }
        }
    );

    // --- 7. ANIMASI GSAP: GALLERY (Split Parallax Lanjutan) ---
    document.querySelectorAll('.gallery-split-item').forEach((item) => {
        const image = item.querySelector('.split-image');
        const caption = item.querySelector('.gallery-caption');

        // Split Parallax: Gambar bergerak lambat ke bawah, Teks bergerak lambat ke atas
        gsap.to(image, {
            yPercent: -15, // Gerakan gambar
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        });

        gsap.fromTo(caption, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: item,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    });

    // --- 8. ANIMASI GSAP: PENUTUP (Closing) ---
    const closingTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#closing",
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    });

    closingTl.fromTo(".closing-thanks", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    )
    .fromTo(".closing-quote", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, 
        "-=0.6" 
    )
    .fromTo(".couple-name-signature", 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 
        "-=0.5"
    );

    // --- 9. SUBMIT FORM RSVP (Simulasi) ---
    const rsvpForm = document.getElementById('rsvp-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulasikan proses pengiriman
        console.log(`Ucapan dari ${document.getElementById('name').value}: ${document.getElementById('message').value}`);
        
        rsvpForm.reset(); 
        
        thankYouMessage.style.display = 'block';
        gsap.fromTo(thankYouMessage, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 });

        setTimeout(() => {
            gsap.to(thankYouMessage, { opacity: 0, duration: 0.5, onComplete: () => {
                thankYouMessage.style.display = 'none';
            }});
        }, 5000);
    });
    
    // --- 10. FUNGSI SALIN NOMOR REKENING ---
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Berhasil Disalin!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Gagal menyalin:', err);
            });
        });
    });

});