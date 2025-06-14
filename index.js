// document.addEventListener("DOMContentLoaded", () => {
//     const videoOverlay = document.getElementById("video-overlay");
//     const mainContent = document.getElementById("main-content");
//     const introVideo = document.getElementById("intro-video");

//     // Show content when the video ends
//     introVideo.addEventListener("ended", () => {
//         videoOverlay.style.display = "none"; // Hide the video overlay
//         mainContent.style.display = "block"; // Show the main content
//     });
// });

async function sendContactUs(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phoneNo = document.getElementById("Phone_no").value;
    const address = document.getElementById("Address").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch('http://localhost:5011/api/contact/contactus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                phoneNo,
                address,
                email,
                message
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Optionally clear form fields
            document.getElementById("contactusform").reset();
        } else {
            alert(data.message || 'Failed to submit the form. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

// JavaScript to fetch unique resources and categories
async function fetchUniqueResources() {
    try {
        const response = await fetch('http://localhost:5011/api/resources/unique-resources'); // Corrected URL
        const data = await response.json();
        if (data.success) {
            const resourceSelect = document.getElementById('resource-type');
            data.resourceTypes.forEach(resource => {
                const option = document.createElement('option');
                option.value = resource;
                option.textContent = resource;
                resourceSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
    }
}

async function fetchUniqueCategories() {
    try {
        const response = await fetch('http://localhost:5011/api/resources/unique-categories'); // Corrected URL
        const data = await response.json();
        if (data.success) {
            const categorySelect = document.getElementById('category');
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function checkAvailability(event) {
    event.preventDefault();

    const hospitalName = document.getElementById("hospital-name").value;
    const category = document.getElementById("category").value;
    const resourceType = document.getElementById("resource-type").value;

    const resultContent = document.querySelector(".result-content");
    resultContent.innerHTML = ""; // Clear previous results

    if (!hospitalName || !category || !resourceType) {
        alert("Please fill out all required fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5011/api/resources/availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ hospitalName, category, resourceType }),
        });

        if (!response.ok) {
            const error = await response.json();
            resultContent.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            return;
        }

        const data = await response.json();

        // Injecting the results into the result-content div
        resultContent.innerHTML = `
        <div style="display: block; align-items: center;">
            <div style="text-align: left; font-size: 20px; color: #000000; font-weight: bold;">
                Total ${resourceType}:
                <span style="display: block; font-size: 100px; color: #1F89E5;">
                    ${data.total}
                </span>
            </div>
            <div style="text-align: right; font-size: 20px; color: #000000; font-weight: bold;">
                Available ${resourceType}:
                <span style="display: block; position:relative; right:5px; bottom:5px; font-size: 100px; color: #1F89E5;">
                    ${data.available}
                </span>
            </div>
        </div>
    `;
    } catch (error) {
        console.error("Error checking availability:", error);
        resultContent.innerHTML = `<p style="color: red;">An error occurred while checking resource availability.</p>`;
    }
}

// Back to Top Button Logic
const backToTopBtn = document.querySelector('.back-to-top-btn');

// Show or hide the back-to-top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

// Scroll to the top when the button is clicked
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle function to open/close the chatbot
function toggleChatbot() {
    const chatbotContainer = document.getElementById("chatbot-container");
    if (chatbotContainer.style.display === "block") {
        chatbotContainer.style.display = "none";
    } else {
        chatbotContainer.style.display = "block";
    }
}

// Close the chatbot explicitly
function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}

async function sendMessage() {
    const input = document.getElementById("chatbot-input").value;
    if (input.trim() === "") return;

    // Display user's message in the chat window
    const messages = document.getElementById("chatbot-messages");
    messages.innerHTML += `<div style="text-align:right; color:#1F89E5; margin:5px;">${input}</div>`;

    // Send message to backend API
    const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    // Display bot's reply
    messages.innerHTML += `<div style="text-align:left; margin:5px; background:#1F89E5; border-radius:10px; padding:5px;">${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
    document.getElementById("chatbot-input").value = ""; // Clear the input field
}

// Redirect to the login page
function redirectToLogin() {
    window.location.href = "./login.html"; // Replace 'login.html' with your login page URL
}

// Scroll to the bed availability section
function scrollToBedAvailability() {
    const bedAvailabilitySection = document.getElementById("bedavailabilitymain");
    if (bedAvailabilitySection) {
        bedAvailabilitySection.scrollIntoView({ behavior: "smooth" });
    } else {
        console.error("Element with id 'bedavailabilitymain' not found.");
    }
}

window.onload = function () {
    fetchUniqueResources();
    fetchUniqueCategories();
};

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".bloodtypelist a");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            // Extract the target section from the href
            const href = link.getAttribute("href");
            if (href.includes("#")) {
                const [page, id] = href.split("#");
                sessionStorage.setItem("scrollTo", id);
                window.location.href = page; // Redirect to bloodtype.html
            }
        });
    });
});

// Placeholder function for Chatbot
function openChatbot() {
    document.getElementById("chatbot-container").style.display = "block";
}

function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}

async function sendMessage() {
    const input = document.getElementById("chatbot-input").value;
    if (input.trim() === "") return;

    // Append user's message to the messages area
    const messages = document.getElementById("chatbot-messages");
    messages.innerHTML += `<div style="text-align:right; margin:5px;">${input}</div>`;

    // Send message to backend API
    const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
    });
    const data = await response.json();

    // Append chatbot's response
    messages.innerHTML += `<div style="text-align:left; margin:5px; background:#f1f1f1; border-radius:10px; padding:5px;">${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}

fetch("../Html/footer.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load footer");
        }
        return response.text();
    })
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Error loading footer:", err));
