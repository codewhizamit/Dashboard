const client = new Paho.MQTT.Client("broker.hivemq.com", 8000, "clientId-" + Math.random().toString(36).substr(2, 9));
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect, onFailure: onFailure, keepAliveInterval: 30 });

const topics = ["exam/pen", "exam/extra_sheet", "exam/threads", "exam/tea", "exam/paper"];
let timeouts = {};

function onConnect() {
  console.log("Connected to MQTT broker");
  topics.forEach(topic => client.subscribe(topic));
}

function onFailure(error) {
  console.log("Connection failed: " + error.errorMessage);
}

function onConnectionLost(response) {
  console.log("Connection lost: " + response.errorMessage);
  setTimeout(() => client.connect({ onSuccess: onConnect, keepAliveInterval: 30 }), 1000);
}

function onMessageArrived(message) {
  const topic = message.destinationName;
  const task = topic.split('/')[1];
  const card = document.getElementById(task);
  const statusElement = card.querySelector(".status");
  const timestampElement = card.querySelector(".timestamp");

  // Update status to requested (red)
  statusElement.classList.remove("available");
  statusElement.classList.add("requested");

  // Update timestamp
  const time = new Date().toLocaleTimeString();
  timestampElement.textContent = `Last requested: ${time}`;

  // Clear existing timeout
  if (timeouts[task]) clearTimeout(timeouts[task]);

  // Revert to available (green) after 5 seconds
  timeouts[task] = setTimeout(() => {
    statusElement.classList.remove("requested");
    statusElement.classList.add("available");
    // Timestamp persists until next request
    delete timeouts[task];
  }, 5000);
}