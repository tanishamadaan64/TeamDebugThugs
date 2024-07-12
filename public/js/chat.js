
const socket = io();

// DOM elements
const $messageForm = document.querySelector("#chatForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $chatMain = document.querySelector("#chat_main");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Function to change background on message sent
const changeBackgroundOnMessage = () => {
    $chatMain.classList.remove('default-background'); // Remove default background
    $chatMain.classList.add('message-sent-background'); // Apply message sent background
};

// Function to reset background to default
const resetBackground = () => {
    $chatMain.classList.remove('message-sent-background'); // Remove message sent background
    $chatMain.classList.add('default-background'); // Apply default background
};

// Function to handle auto scrolling
const autoScroll = () => {
    const $newMessage = $messages.lastElementChild;
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messages.offsetHeight;
    const containerHeight = $messages.scrollHeight;
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

// Handle incoming message event
socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
    changeBackgroundOnMessage(); // Change background on message received
});

// Handle location message event
socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
    changeBackgroundOnMessage(); // Change background on location message received
});

// Handle room data event
socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    });
    document.querySelector("#sidebar").innerHTML = html;
});

// Handle message form submission
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.chat.value;

    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Message delivered");
        resetBackground(); // Reset background after message sent
    });
});

// Handle location button click
$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            "location",
            {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            () => {
                $sendLocationButton.removeAttribute("disabled");
                console.log("Location shared");
                resetBackground(); // Reset background after location shared
            }
        );
    });
});

// Join room on socket connection
socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
    console.log("Successfully joined room!");
});
// DOM elements (existing code...)

// Handle wishlist button click
// Handle wishlist button click
document.querySelector("#send-wishlist").addEventListener("click", () => {
    const url = "https://www.myntra.com/wishlist"; // URL to be sent
    const hyperlink = `<a href="${url}" target="_blank">Wishlist Link</a>`; // URL as hyperlink

    socket.emit("sendMessage", hyperlink, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log("Wishlist link sent");
        resetBackground(); // Reset background after message sent
    });
});

