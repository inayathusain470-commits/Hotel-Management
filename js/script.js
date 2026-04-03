// --- Admin Room Image Upload Logic ---
const defaultRoomImages = {
    single: "images/room.png",
    double: "images/room (2).png",
    deluxe: "images/room (3).png"
};

function showAdminRoomImageButtons() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.type === 'admin') {
        document.getElementById('edit-single-room-img').style.display = 'block';
        document.getElementById('edit-double-room-img').style.display = 'block';
        document.getElementById('edit-deluxe-room-img').style.display = 'block';
    }
}

function loadRoomImages() {
    ['single','double','deluxe'].forEach(type => {
        const imgUrl = localStorage.getItem(type+'RoomImg') || defaultRoomImages[type];
        const imgElem = document.getElementById(type+'-room-img');
        if (imgElem) imgElem.src = imgUrl;
    });
}

let currentRoomType = null;
let roomCropImg = null;
let roomCropScale = 1;
let roomCropOffsetX = 0;
let roomCropOffsetY = 0;
let roomDragging = false;
let roomDragStartX = 0;
let roomDragStartY = 0;

function getRoomCropCanvas() {
    return document.getElementById('roomCropCanvas');
}

function drawRoomCropCanvas() {
    const canvas = getRoomCropCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!roomCropImg) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Select image, then drag/zoom to crop', canvas.width / 2, canvas.height / 2);
        return;
    }

    const baseScale = Math.max(canvas.width / roomCropImg.width, canvas.height / roomCropImg.height);
    const scale = baseScale * roomCropScale;
    const drawW = roomCropImg.width * scale;
    const drawH = roomCropImg.height * scale;
    const x = (canvas.width - drawW) / 2 + roomCropOffsetX;
    const y = (canvas.height - drawH) / 2 + roomCropOffsetY;
    ctx.drawImage(roomCropImg, x, y, drawW, drawH);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
}

function loadRoomImageForCrop(file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
        const img = new Image();
        img.onload = function() {
            roomCropImg = img;
            roomCropScale = 1;
            roomCropOffsetX = 0;
            roomCropOffsetY = 0;
            drawRoomCropCanvas();
            previewRoomCrop();
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

function getRoomCroppedData(maxBytes) {
    if (!roomCropImg) return null;
    const canvas = getRoomCropCanvas();
    if (!canvas) return null;

    const baseScale = Math.max(canvas.width / roomCropImg.width, canvas.height / roomCropImg.height);
    const scale = baseScale * roomCropScale;
    const drawW = roomCropImg.width * scale;
    const drawH = roomCropImg.height * scale;
    const x = (canvas.width - drawW) / 2 + roomCropOffsetX;
    const y = (canvas.height - drawH) / 2 + roomCropOffsetY;

    const out = document.createElement('canvas');
    out.width = 800;
    out.height = 400;
    const octx = out.getContext('2d');
    const sx = (-x) / canvas.width * 800;
    const sy = (-y) / canvas.height * 400;
    const sW = (drawW / canvas.width) * 800;
    const sH = (drawH / canvas.height) * 400;
    octx.fillStyle = '#f3f4f6';
    octx.fillRect(0, 0, 800, 400);
    octx.drawImage(roomCropImg, sx, sy, sW, sH);

    let quality = 0.92;
    let dataUrl = out.toDataURL('image/jpeg', quality);
    while (dataUrl.length > maxBytes && quality > 0.45) {
        quality -= 0.07;
        dataUrl = out.toDataURL('image/jpeg', quality);
    }
    return dataUrl;
}

function previewRoomCrop() {
    const preview = document.getElementById('roomImagePreview');
    const data = getRoomCroppedData(3000000);
    if (!data || !preview) return;
    preview.src = data;
    preview.style.display = 'block';
}

function openRoomImageModal(roomType) {
    currentRoomType = roomType;
    document.getElementById('roomImageModal').style.display = 'flex';
    document.getElementById('modalRoomTitle').textContent = `Upload ${roomType.charAt(0).toUpperCase()+roomType.slice(1)} Room Photo`;
    document.getElementById('roomImageInput').value = '';
    const zoom = document.getElementById('roomZoomRange');
    if (zoom) zoom.value = '1';
    roomCropImg = null;
    roomCropScale = 1;
    roomCropOffsetX = 0;
    roomCropOffsetY = 0;
    drawRoomCropCanvas();
    document.getElementById('roomImagePreview').style.display = 'none';
}
function closeRoomImageModal() {
    document.getElementById('roomImageModal').style.display = 'none';
    document.getElementById('roomImageInput').value = '';
    document.getElementById('roomImagePreview').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {
    // Only run on rooms.html
    if (window.location.pathname.includes('rooms.html')) {
        showAdminRoomImageButtons();
        loadRoomImages();
    }
    // Preview selected image
    const input = document.getElementById('roomImageInput');
    if (input) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                loadRoomImageForCrop(file);
            }
        });
    }

    const zoom = document.getElementById('roomZoomRange');
    if (zoom) {
        zoom.addEventListener('input', function() {
            roomCropScale = parseFloat(this.value) || 1;
            drawRoomCropCanvas();
        });
    }

    const canvas = getRoomCropCanvas();
    if (canvas) {
        canvas.addEventListener('mousedown', function(e) {
            roomDragging = true;
            roomDragStartX = e.clientX;
            roomDragStartY = e.clientY;
            canvas.classList.add('dragging');
        });
        window.addEventListener('mousemove', function(e) {
            if (!roomDragging) return;
            roomCropOffsetX += e.clientX - roomDragStartX;
            roomCropOffsetY += e.clientY - roomDragStartY;
            roomDragStartX = e.clientX;
            roomDragStartY = e.clientY;
            drawRoomCropCanvas();
        });
        window.addEventListener('mouseup', function() {
            roomDragging = false;
            canvas.classList.remove('dragging');
        });
    }
});
function saveRoomImage() {
    const imageData = getRoomCroppedData(900000);
    if (!imageData || !currentRoomType) {
        alert('Please select and crop an image first.');
        return;
    }
    localStorage.setItem(currentRoomType+'RoomImg', imageData);
    document.getElementById(currentRoomType+'-room-img').src = imageData;
    closeRoomImageModal();
}
// Check if user is logged in
function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function applyDarkModePreference() {
    const enabled = localStorage.getItem('darkModeEnabled') === 'true';
    document.body.classList.toggle('dark-mode', enabled);
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.classList.toggle('active', enabled);
    }
}

function toggleDarkMode() {
    const next = !(localStorage.getItem('darkModeEnabled') === 'true');
    localStorage.setItem('darkModeEnabled', String(next));
    applyDarkModePreference();
}

const API_BASE_URL = 'http://localhost:5000/api';

async function apiRequest(path, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || `${method} ${path} failed`);
    }
    return payload;
}

async function apiGet(path) {
    return apiRequest(path, 'GET');
}

async function apiPost(path, body) {
    return apiRequest(path, 'POST', body);
}

async function apiPut(path, body) {
    return apiRequest(path, 'PUT', body);
}

window.HMS_API = {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    baseUrl: API_BASE_URL
};

applyDarkModePreference();

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.remove('active');
    });

    // Close mobile menu when clicking a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Legacy page form references (keep names unique to avoid collision with inline page scripts)
const legacyBookingForm = document.getElementById('booking-form');
const legacyBookingConfirmation = document.getElementById('confirmation');

const legacyContactForm = document.getElementById('contact-form');
const legacyContactConfirmation = document.getElementById('contact-confirmation');

if (legacyContactForm) {
    legacyContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Simple validation
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Hide form and show confirmation
        legacyContactForm.style.display = 'none';
        legacyContactConfirmation.classList.remove('hidden');

        // Store contact message in backend
        const contact = { name, email, message };
        await apiPost('/contacts', contact);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Utility: convert USD to INR
function usdToInr(usd) {
    return Math.round(Number(usd) || 0);
}

// Handle "Book Now" clicks to pass room details
document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const room = this.dataset.room;
        const price = parseFloat(this.dataset.price);
        if (room && price) {
            // store in localStorage
            localStorage.setItem('selectedRoom', room);
            localStorage.setItem('selectedPrice', price);
        }
        window.location.href = 'booking.html';
    });
});

// ===== COUPON CODE VALIDATION =====
let appliedCoupon = null;
let coupoonDiscount = 0;

async function validateCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    const message = document.getElementById('coupon-message');
    const discountAmount = document.getElementById('discount-amount');
    const couponDiscount = document.getElementById('coupon-discount');
    const priceDisplay = document.getElementById('price-display');

    message.style.display = 'none';

    if (!couponCode) {
        message.textContent = '❌ Please enter a coupon code';
        message.style.color = '#e74c3c';
        message.style.display = 'block';
        return;
    }

    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const currentPrice = priceDisplay.textContent.match(/₹(\d+)/)?.[1] || 0;
        
        const res = await fetch('http://localhost:5000/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: couponCode,
                bookingAmount: parseInt(currentPrice)
            })
        });

        const data = await res.json();
        
        if (!res.ok) {
            message.textContent = '❌ ' + (data.error || 'Invalid coupon code');
            message.style.color = '#e74c3c';
            message.style.display = 'block';
            appliedCoupon = null;
            return;
        }

        appliedCoupon = data.coupon;
        const discount = data.discount;
        discountAmount.textContent = '₹' + discount;
        couponDiscount.style.display = 'inline-block';
        
        message.textContent = `✅ Coupon applied! You save ₹${discount}`;
        message.style.color = '#27ae60';
        message.style.display = 'block';
    } catch (error) {
        message.textContent = '❌ Error validating coupon: ' + error.message;
        message.style.color = '#e74c3c';
        message.style.display = 'block';
    }
}

// ===== REVIEWS SYSTEM =====
document.addEventListener('DOMContentLoaded', function() {
    const ratingInput = document.getElementById('review-rating');
    if (ratingInput) {
        ratingInput.addEventListener('change', function() {
            updateStarDisplay();
        });
    }
});

function updateStarDisplay() {
    const rating = parseInt(document.getElementById('review-rating')?.value || 5);
    const stars = '⭐'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - rating));
    const starDisplay = document.getElementById('star-display');
    if (starDisplay) starDisplay.textContent = stars;
}

async function submitReview() {
    const roomType = document.getElementById('review-room-type')?.value;
    const rating = parseInt(document.getElementById('review-rating')?.value || 5);
    const title = document.getElementById('review-title')?.value?.trim();
    const comment = document.getElementById('review-comment')?.value?.trim();
    const message = document.getElementById('review-message');

    if (!message) return;

    if (!roomType || !title || !comment) {
        message.textContent = '❌ Please fill in all fields';
        message.style.color = '#e74c3c';
        message.style.display = 'block';
        return;
    }

    if (rating < 1 || rating > 5) {
        message.textContent = '❌ Rating must be between 1 and 5';
        message.style.color = '#e74c3c';
        message.style.display = 'block';
        return;
    }

    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const res = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: currentUser.name,
                customerEmail: currentUser.email,
                roomType: roomType,
                rating: rating,
                title: title,
                comment: comment
            })
        });

        if (!res.ok) throw new Error('Failed to submit review');

        message.textContent = '✅ Review submitted successfully!';
        message.style.color = '#27ae60';
        message.style.display = 'block';

        // Clear form
        setTimeout(() => {
            document.getElementById('review-room-type').value = '';
            document.getElementById('review-rating').value = '5';
            document.getElementById('review-title').value = '';
            document.getElementById('review-comment').value = '';
            updateStarDisplay();
            message.style.display = 'none';
            
            // Reload reviews
            loadReviews();
        }, 1500);
    } catch (error) {
        message.textContent = '❌ Error submitting review: ' + error.message;
        message.style.color = '#e74c3c';
        message.style.display = 'block';
    }
}

async function loadReviews() {
    const display = document.getElementById('reviews-display');
    if (!display) return;

    try {
        const res = await fetch('http://localhost:5000/api/reviews');
        if (!res.ok) throw new Error('Failed to load reviews');
        
        const reviews = await res.json();
        
        if (reviews.length === 0) {
            display.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">No reviews yet. Be the first to review!</div>';
            return;
        }

        display.innerHTML = reviews.map(review => `
            <div style="padding:15px;background:#f9f9f9;margin-bottom:12px;border-left:4px solid #f39c12;border-radius:4px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                    <div>
                        <strong>${review.title}</strong>
                        <div style="font-size:0.9rem;color:#666;">by ${review.customerName}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:1.1rem;">${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <small style="color:#999;">${review.roomType}</small>
                    </div>
                </div>
                <p style="margin:10px 0;color:#333;">${review.comment}</p>
                <small style="color:#999;">${new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        display.innerHTML = '<div style="color:#e74c3c;">Error loading reviews</div>';
    }
}

// Load reviews on page load
if (document.getElementById('reviews-display')) {
    loadReviews();
}





// On booking page populate details if available
if (legacyBookingForm) {
    const storedRoom = localStorage.getItem('selectedRoom');
    const storedPrice = localStorage.getItem('selectedPrice');
    const roomSelect = document.getElementById('room-type');
    const priceDisplay = document.getElementById('price-display');

    function updatePriceDisplay(priceUsd) {
        if (priceDisplay) {
            const inr = usdToInr(priceUsd);
            priceDisplay.textContent = `Price: ₹${inr} per night`;
        }
    }

    // if stored data exists, set form values
    if (storedRoom && roomSelect) {
        // find option by text or value
        [...roomSelect.options].forEach(opt => {
            if (opt.text.includes(storedRoom) || opt.value === storedRoom.toLowerCase().split(' ')[0]) {
                opt.selected = true;
                const priceUsd = parseFloat(opt.dataset.price);
                updatePriceDisplay(priceUsd);
            }
        });
    }

    // clear storage after using
    localStorage.removeItem('selectedRoom');
    localStorage.removeItem('selectedPrice');

    // when user changes room type, update price display
    if (roomSelect) {
        roomSelect.addEventListener('change', () => {
            const selectedOpt = roomSelect.options[roomSelect.selectedIndex];
            if (selectedOpt && selectedOpt.dataset.price) {
                updatePriceDisplay(parseFloat(selectedOpt.dataset.price));
            } else {
                priceDisplay.textContent = '';
            }
        });
    }
}



// ===== AI CHATBOT FOR HOTEL QUESTIONS (ChatGPT-like) =====
const HOTEL_INFO = {
    name: "Royal Plaza Hotel",
    location: "Axis Knowledge City, Hathipur, Rooma, NH-2, Milestone - 478, Kanpur - 209402, Uttar Pradesh, India",
    contact: "(123) 456-7890",
    email: "info@luxuryhotel.com",
    rooms: {
        single: "₹1/night - Perfect for solo travelers with AC, WiFi, TV, and premium bedding",
        double: "₹1/night - Ideal for couples with double bed, AC, WiFi, TV, and modern amenities",
        deluxe: "₹1/night - Luxury room with premium furniture, AC, WiFi, TV, and special features"
    },
    amenities: ["Swimming Pool", "Gym", "Restaurant", "Bar", "Free WiFi", "24/7 Room Service", "Conference Rooms", "Spa", "Parking Facility"],
    services: ["Room Service", "Housekeeping", "Laundry", "Chef Service", "Event Management", "Travel Assistance"],
    facilities: ["Restaurant", "Bar", "Gym", "Swimming Pool", "Conference Rooms", "Parking"],
    checkin: "2:00 PM",
    checkout: "11:00 AM"
};

let conversationHistory = []; // Store conversation context

function tokenize(text) {
    return text.toLowerCase().split(/\s+/);
}

function findBestMatch(question, keywords) {
    const tokens = tokenize(question);
    let maxMatches = 0;
    let bestCategory = null;
    
    for (const [category, kws] of Object.entries(keywords)) {
        const matches = tokens.filter(token => kws.some(kw => kw.includes(token) || token.includes(kw))).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = category;
        }
    }
    
    return bestCategory;
}

function generateContextualResponse(question, category) {
    const q = question.toLowerCase();
    
    // Rooms - detailed response
    if (category === 'rooms') {
        if (q.includes('single')) {
            return `🛏️ **Single Room**\n\n${HOTEL_INFO.rooms.single}\n\n✅ Features:\n• Comfortable single bed\n• Air conditioning\n• Modern en-suite bathroom\n• Flat-screen TV\n• Free high-speed WiFi\n• Work desk\n• 24/7 room service\n\n📍 Perfect for business travelers or solo guests.\n\n💳 Ready to book? Click "Book Now" or call ${HOTEL_INFO.contact}`;
        } else if (q.includes('double') || q.includes('couple')) {
            return `🛏️ **Double Room**\n\n${HOTEL_INFO.rooms.double}\n\n✅ Features:\n• Premium double bed\n• Air conditioning\n• Luxurious bathroom with amenities\n• Flat-screen TV with streaming\n• Free high-speed WiFi\n• Spacious seating area\n• Room service & housekeeping\n\n💕 Ideal for couples and romantic getaways!\n\n💳 Ready to book? Click "Book Now" or call ${HOTEL_INFO.contact}`;
        } else if (q.includes('deluxe') || q.includes('luxury')) {
            return `✨ **Deluxe Room**\n\n${HOTEL_INFO.rooms.deluxe}\n\n✅ Premium Features:\n• Premium king-size bed\n• Air conditioning with temperature control\n• Luxury en-suite bathroom\n• Flat-screen TV with premium channels\n• Free ultra-speed WiFi\n• Mini bar & coffee maker\n• Executive work desk\n• Personalized room service\n\n👑 Experience ultimate luxury!\n\n💳 Ready to book? Click "Book Now" or call ${HOTEL_INFO.contact}`;
        } else {
            return `🏨 **Our Room Types:**\n\n${HOTEL_INFO.rooms.single}\n\n${HOTEL_INFO.rooms.double}\n\n${HOTEL_INFO.rooms.deluxe}\n\n💡 **Can't decide?** Tell me:\n• How many people?\n• Budget preference?\n• Special requirements?\n\nI'll help you choose! 😊`;
        }
    }
    
    // Amenities
    if (category === 'amenities') {
        return `✨ **What We Offer:**\n\n🏊 **Recreation:**\n• Swimming Pool\n• Fully-equipped Gym\n• Spa & Wellness Center\n\n🍽️ **Dining & Beverage:**\n• Multi-cuisine Restaurant\n• Premium Bar\n• 24/7 Room Service\n\n💼 **Business:**\n• Complimentary WiFi\n• Conference Rooms\n• Business Center\n\n🚗 **Convenience:**\n• Ample Parking\n• Laundry Service\n• Concierge Service\n\n🌟 *All amenities available to our valued guests!*`;
    }
    
    // Contact
    if (category === 'contact') {
        return `📱 **Get in Touch with Us:**\n\n📍 **Address:**\n${HOTEL_INFO.location}\n\n📞 **Phone:**\n${HOTEL_INFO.contact}\n\n📧 **Email:**\n${HOTEL_INFO.email}\n\n🕐 **Hours:**\n• Front Desk: 24/7\n• Reservations: 9 AM - 11 PM\n\n💬 **Quick Links:**\n• Live Chat (Right here!)\n• Book Online\n• Call our team\n\n✈️ We're always ready to assist you!`;
    }
    
    // Services
    if (category === 'services') {
        return `🔔 **Available Services:**\n\n🛏️ **Room Services:**\n• In-room dining\n• Housekeeping (daily/on-demand)\n• Laundry & dry cleaning\n• Room maintenance\n\n🎉 **Guest Services:**\n• Concierge assistance\n• Airport transfers\n• Travel arrangements\n• Event & banquet management\n\n👨‍🍳 **Culinary:**\n• In-room chef service\n• Customized meal plans\n• Special dietary accommodations\n\n💼 **Business Services:**\n• Meeting room rentals\n• Catering services\n• Business equipment\n\n📞 Just call extension 0 or visit the front desk!`;
    }
    
    // Check-in/Check-out
    if (category === 'checkin' || category === 'checkout') {
        return `🕐 **Check-in & Check-out Times:**\n\n✅ **Check-in:** ${HOTEL_INFO.checkin}\n❌ **Check-out:** ${HOTEL_INFO.checkout}\n\n📌 **Important Notes:**\n\n📅 **Early Check-in:**\n• Subject to availability\n• Often complimentary\n• Contact us: ${HOTEL_INFO.contact}\n\n⏱️ **Late Check-out:**\n• Available for additional fee\n• Arrange in advance\n• Depends on next booking\n\n🎒 **Luggage Storage:**\n• Free storage before check-in\n• Free storage after check-out\n• Available 24/7\n\n💡 **Pro Tip:** Mention your arrival/departure times during booking for better arrangements!`;
    }
    
    // Pricing
    if (category === 'price') {
        return `💰 **Pricing Information:**\n\n${HOTEL_INFO.rooms.single}\n\n${HOTEL_INFO.rooms.double}\n\n${HOTEL_INFO.rooms.deluxe}\n\n💳 **What's Included:**\n✅ Free WiFi\n✅ Breakfast (varies by room)\n✅ 24/7 room service\n✅ Access to all facilities\n\n🎟️ **Special Offers:**\n• Group bookings: 10-20% discount\n• Extended stays: Negotiable rates\n• Corporate rates: Available\n• Seasonal packages: Check website\n\n💌 Subscribe to our newsletter for exclusive deals!\n\n📍 Ready to book? Use our online portal or call ${HOTEL_INFO.contact}`;
    }
    
    // Booking
    if (category === 'booking' || q.includes('book') || q.includes('reservation')) {
        return `🎫 **How to Book with Us:**\n\n**Method 1: Online Booking**\n1. Click "Book Now" button\n2. Select check-in/check-out dates\n3. Choose room type\n4. Add any extras\n5. Apply coupon code (if available)\n6. Complete payment\n\n**Method 2: Phone Booking**\n• Call: ${HOTEL_INFO.contact}\n• Email: ${HOTEL_INFO.email}\n• Our team will assist you 24/7\n\n**Payment Options:**\n💳 Credit/Debit Card\n📱 UPI/Mobile Payment\n🏦 Bank Transfer\n\n**Instant Confirmation:**\n✅ Email confirmation\n✅ Mobile app booking\n✅ Cancellation up to 24 hours\n\n🎁 **Pro Tip:** Apply coupon codes for extra savings!\n\nAny other questions? I'm here to help! 😊`;
    }
    
    return null;
}

function getAIResponse(question) {
    const q = question.toLowerCase();
    
    // Add to conversation history
    conversationHistory.push({ role: 'user', content: question });
    
    // Greeting handlers
    if (q.match(/^(hello|hi|hey|greetings|namaste|salaam)/)) {
        const responses = [
            `👋 Hello! Welcome to ${HOTEL_INFO.name}!\n\nI'm your AI Assistant, here 24/7 to help. I can answer questions about:\n\n🏨 Our rooms & pricing\n✨ Amenities & facilities\n📞 Contact information\n🔔 Services & offerings\n🕐 Check-in/Check-out times\n📖 Hotel policies\n\nWhat would you like to know?`,
            `🎉 Hi there! Thanks for choosing ${HOTEL_INFO.name}!\n\nI'm powered by AI to help you with:\n\n✅ Room information & availability\n✅ Amenities & services\n✅ Booking assistance\n✅ General inquiries\n✅ Contact details\n\nFeel free to ask me anything! How can I assist? 😊`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Thank you handlers
    if (q.match(/thank|thanks|thankyou|grateful|appreciate/)) {
        const responses = [
            `😊 You're most welcome! Happy to help.\n\nIf you have any more questions, just ask. I'm here 24/7! 🎉`,
            `🙏 Happy to assist! Feel free to ask me anything else about our hotel.\n\nLooking forward to your stay with us! ✨`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Help handlers
    if (q.match(/help|assist|support|what can you do|how do you work/)) {
        return `🆘 **I Can Help With:**\n\n🏨 **Accommodation**\n• Room types and features\n• Pricing & special offers\n• Booking process\n\n✨ **Facilities & Services**\n• Amenities list\n• Available services\n• Special requests\n\n📍 **Information**\n• Contact details & location\n• Hotel policies\n• Check-in/Check-out details\n\n💡 **Travel Assistance**\n• Local recommendations\n• Transportation info\n• Event planning\n\n**Just ask me anything!** I'm here to make your experience amazing! 🌟`;
    }
    
    // Find best matching category
    const KEYWORDS = {
        'rooms': ['room', 'accommodation', 'stay', 'sleep', 'bed', 'bedroom', 'types', 'available', 'booking', 'single', 'double', 'deluxe', 'suite'],
        'amenities': ['amenity', 'amenities', 'facilities', 'pool', 'gym', 'fitness', 'wifi', 'internet', 'restaurant', 'bar', 'spa', 'parking', 'laundry'],
        'contact': ['phone', 'call', 'contact', 'number', 'address', 'location', 'where', 'directions', 'email', 'reach', 'connect', 'message'],
        'services': ['service', 'room service', 'laundry', 'housekeeping', 'events', 'catering', 'help', 'assist', 'organize'],
        'checkin': ['check-in', 'checkin', 'arrive', 'arrival', 'time in', 'when check', 'arrival time'],
        'checkout': ['check-out', 'checkout', 'depart', 'departure', 'leave', 'time out', 'when leave'],
        'booking': ['book', 'reservation', 'reserve', 'how to book', 'booking process', 'payment', 'method'],
        'price': ['price', 'cost', 'rate', 'paying', 'how much', 'per night', 'charges', 'expensive', 'cheap', 'discount', 'offer']
    };
    
    const bestCategory = findBestMatch(question, KEYWORDS);
    
    if (bestCategory) {
        const response = generateContextualResponse(question, bestCategory);
        if (response) return response;
    }
    
    // Fallback intelligent response
    const fallbacks = [
        `💭 Interesting question! Let me help...\n\nFor specific inquiries about:\n• Room types → Ask about single, double, or deluxe\n• Facilities → Ask what amenities we offer\n• Booking → Ask how to reserve\n• Pricing → Ask about rates\n\nWhat would you like to know? 😊`,
        `🤔 That's a great question!\n\nWhile I'm trained on hotel information, let me suggest some topics I can definitely help with:\n\n1️⃣ 🏨 **Rooms** - Types, features, pricing\n2️⃣ ✨ **Amenities** - What we offer\n3️⃣ 📞 **Contact Us** - How to reach us\n4️⃣ 📅 **Booking** - How to reserve\n5️⃣ 🕐 **Check-in/out** - Timings\n\nPick any topic or ask something specific! 🎯`,
        `🌟 Thanks for your question!\n\nFor detailed answers, I recommend:\n• **Call us:** ${HOTEL_INFO.contact}\n• **Email:** ${HOTEL_INFO.email}\n\nOr ask me about:\n✅ Rooms & pricing\n✅ Hotel amenities\n✅ Booking process\n✅ Services\n\nHow else can I help? 😊`
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function openAIChat() {
    const chatbot = document.getElementById('ai-chatbot');
    const toggle = document.getElementById('ai-chat-toggle');
    if (chatbot && toggle) {
        chatbot.style.width = '360px';
        chatbot.style.height = '480px';
        chatbot.style.opacity = '1';
        toggle.style.display = 'none';
        
        // Add welcome message if first time
        const messagesDiv = document.getElementById('ai-chat-messages');
        if (messagesDiv && messagesDiv.children.length === 0) {
            addAIChatMessage(`👋 Welcome!\n\nI'm your AI Assistant. Ask me anything about our hotel! How can I help?`, 'bot');
            addSuggestedQuestions();
        }
        
        document.getElementById('ai-question').focus();
    }
}

function closeAIChat() {
    const chatbot = document.getElementById('ai-chatbot');
    const toggle = document.getElementById('ai-chat-toggle');
    if (chatbot && toggle) {
        chatbot.style.width = '0';
        chatbot.style.height = '0';
        chatbot.style.opacity = '0';
        toggle.style.display = 'flex';
    }
}

function addAIChatMessage(text, sender) {
    const messagesDiv = document.getElementById('ai-chat-messages');
    if (!messagesDiv) return;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        padding: 8px 10px;
        border-radius: 10px;
        max-width: 85%;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        font-size: 13px;
        line-height: 1.4;
        animation: slideIn 0.3s ease;
        ${sender === 'user' ? 'background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%); color: white; align-self: flex-end; border-bottom-right-radius: 3px;' : 'background: #e8e8e8; color: #333; align-self: flex-start; border-bottom-left-radius: 3px;'}
    `;
    messageEl.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSuggestedQuestions() {
    const messagesDiv = document.getElementById('ai-chat-messages');
    if (!messagesDiv) return;
    
    const suggestionsEl = document.createElement('div');
    suggestionsEl.id = 'ai-suggestions';
    suggestionsEl.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 8px;
    `;
    
    const suggestions = [
        'Tell me about rooms',
        'What amenities?',
        'How to book?',
        'Contact us'
    ];
    
    suggestions.forEach(suggestion => {
        const btn = document.createElement('button');
        btn.textContent = suggestion;
        btn.style.cssText = `
            padding: 5px 8px;
            background: #e0e7f1;
            border: 1px solid #ccc;
            border-radius: 14px;
            cursor: pointer;
            font-size: 11px;
            text-align: left;
            transition: all 0.2s;
            word-break: break-word;
            max-width: 100%;
        `;
        btn.onmouseover = () => btn.style.background = '#d0dfe8';
        btn.onmouseout = () => btn.style.background = '#e0e7f1';
        btn.onclick = () => {
            document.getElementById('ai-question').value = suggestion.replace('?', '');
            askAI();
        };
        suggestionsEl.appendChild(btn);
    });
    
    messagesDiv.appendChild(suggestionsEl);
}

function showTypingIndicator() {
    const messagesDiv = document.getElementById('ai-chat-messages');
    if (!messagesDiv) return;
    
    const typingEl = document.createElement('div');
    typingEl.id = 'typing-indicator';
    typingEl.style.cssText = `
        display: flex;
        gap: 3px;
        padding: 8px 10px;
        background: #e8e8e8;
        border-radius: 10px;
        align-self: flex-start;
        width: fit-content;
    `;
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            width: 5px;
            height: 5px;
            background: #999;
            border-radius: 50%;
            animation: bounce 1.4s infinite;
            animation-delay: ${i * 0.2}s;
        `;
        typingEl.appendChild(dot);
    }
    
    messagesDiv.appendChild(typingEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function askAI() {
    const input = document.getElementById('ai-question');
    const question = input.value.trim();
    
    if (!question) return;
    
    // Remove suggestions if exist
    const suggestions = document.getElementById('ai-suggestions');
    if (suggestions) suggestions.remove();
    
    // Add user message
    addAIChatMessage(question, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response after a short delay (simulating thinking)
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(question);
        addAIChatMessage(response, 'bot');
    }, 500 + Math.random() * 1000);
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const aiInput = document.getElementById('ai-question');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                askAI();
            }
        });
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes bounce {
            0%, 80%, 100% {
                transform: scale(1);
            }
            40% {
                transform: scale(1.3);
            }
        }
    `;
    document.head.appendChild(style);
});