// 전역 변수
let currentSlideIndex = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 슬라이더 초기화
    initializeSlider();
    
    // 네비게이션 스크롤 효과
    initializeNavigation();
    
    // 갤러리 애니메이션
    initializeGalleryAnimation();
    
    // 모바일 메뉴
    initializeMobileMenu();
    
    // 부드러운 스크롤
    initializeSmoothScroll();
});

// 슬라이더 초기화
function initializeSlider() {
    if (slides.length === 0) return;
    
    // 자동 슬라이드 시작
    startSlideShow();
    
    // 슬라이더에 마우스 호버 시 자동 슬라이드 정지
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideShow);
        sliderContainer.addEventListener('mouseleave', startSlideShow);
    }
}

// 슬라이드 쇼 시작
function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000); // 5초마다 자동 슬라이드
}

// 슬라이드 쇼 정지
function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// 다음 슬라이드
function nextSlide() {
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

// 이전 슬라이드
function previousSlide() {
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
    
    // 자동 슬라이드 재시작
    stopSlideShow();
    startSlideShow();
}

// 특정 슬라이드로 이동
function currentSlide(n) {
    currentSlideIndex = n - 1;
    showSlide(currentSlideIndex);
    
    // 자동 슬라이드 재시작
    stopSlideShow();
    startSlideShow();
}

// 슬라이드 표시
function showSlide(index) {
    // 모든 슬라이드 숨기기
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 현재 슬라이드 표시
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    // 현재 도트 활성화
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// 네비게이션 스크롤 효과
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
}

// 갤러리 애니메이션
function initializeGalleryAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Intersection Observer로 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// 모바일 메뉴
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// 부드러운 스크롤
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 네비게이션 높이 고려하여 스크롤
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴가 열려있다면 닫기
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
}

// 견적 문의 폼 제출
function submitQuote(event) {
    event.preventDefault();
    
    // 폼 데이터 수집
    const formData = new FormData(event.target);
    const quoteData = {};
    
    // 기본 폼 데이터
    for (let [key, value] of formData.entries()) {
        if (key === 'menu') {
            if (!quoteData[key]) quoteData[key] = [];
            quoteData[key].push(value);
        } else {
            quoteData[key] = value;
        }
    }
    
    // 체크박스 데이터 추가 처리
    const menuCheckboxes = document.querySelectorAll('input[name="menu"]:checked');
    quoteData.selectedMenus = Array.from(menuCheckboxes).map(cb => cb.value);
    
    // 유효성 검사
    if (!validateQuoteForm(quoteData)) {
        return;
    }
    
    // 성공 메시지
    showSuccessMessage();
    
    // 실제 서버 전송 로직은 여기에 추가
    console.log('견적 문의 데이터:', quoteData);
    
    // 폼 리셋 (선택사항)
    event.target.reset();
}

// 견적 폼 유효성 검사
function validateQuoteForm(data) {
    // 필수 필드 검사
    const requiredFields = ['eventType', 'customerName', 'eventDate', 'eventTime', 'peopleCount', 'powerSupply', 'phone', 'address', 'payment'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`${getFieldLabel(field)} 항목을 입력해주세요.`);
            return false;
        }
    }
    
    // 전화번호 형식 검사 (간단한 검사)
    const phonePattern = /^[0-9-+\s()]+$/;
    if (!phonePattern.test(data.phone)) {
        alert('올바른 전화번호 형식으로 입력해주세요.');
        return false;
    }
    
    // 날짜 검사 (과거 날짜 불가)
    const selectedDate = new Date(data.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('행사 날짜는 오늘 이후로 선택해주세요.');
        return false;
    }
    
    // 메뉴 선택 검사
    if (!data.selectedMenus || data.selectedMenus.length === 0) {
        alert('희망하는 메뉴를 하나 이상 선택해주세요.');
        return false;
    }
    
    return true;
}

// 필드 라벨 반환
function getFieldLabel(field) {
    const labels = {
        'eventType': '활동 주체',
        'customerName': '담당자 성함',
        'eventDate': '희망 날짜',
        'eventTime': '희망 시간',
        'peopleCount': '예상 인원',
        'powerSupply': '전원 공급',
        'phone': '연락처',
        'address': '행사 장소',
        'payment': '결제 방법'
    };
    
    return labels[field] || field;
}

// 성공 메시지 표시
function showSuccessMessage() {
    // 간단한 성공 메시지
    const message = `
        ✅ 견적 문의가 성공적으로 전송되었습니다!
        
        24시간 내에 연락드리겠습니다.
        감사합니다! ❤️
    `;
    
    alert(message);
    
    // 또는 더 예쁜 모달을 사용할 수 있습니다
    // showModal('success', message);
}

// 페이지 로딩 시 애니메이션
function animateOnLoad() {
    const elements = document.querySelectorAll('.service-card, .gallery-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 스크롤 이벤트로 네비게이션 활성 메뉴 업데이트
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (window.pageYOffset >= sectionTop - navbarHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 이미지 지연 로딩 (성능 최적화)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// 페이지 완전 로드 후 추가 초기화
window.addEventListener('load', function() {
    animateOnLoad();
    updateActiveNavigation();
    initializeLazyLoading();
});

// 키보드 접근성 지원
document.addEventListener('keydown', function(e) {
    // ESC 키로 모바일 메뉴 닫기
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
    
    // 슬라이더 키보드 조작
    if (e.key === 'ArrowLeft') {
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// 터치 이벤트 지원 (모바일)
function initializeTouchEvents() {
    const slider = document.querySelector('.slider-container');
    let startX = 0;
    let endX = 0;
    
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        slider.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const difference = startX - endX;
        const threshold = 50; // 최소 스와이프 거리
        
        if (Math.abs(difference) > threshold) {
            if (difference > 0) {
                nextSlide(); // 오른쪽 스와이프 (다음 슬라이드)
            } else {
                previousSlide(); // 왼쪽 스와이프 (이전 슬라이드)
            }
        }
    }
}

// 터치 이벤트 초기화
document.addEventListener('DOMContentLoaded', initializeTouchEvents);