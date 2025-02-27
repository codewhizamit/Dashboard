// Firebase configuration with your provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyCH5c9ePeBLC-G00gV-aBZuw6MvH0CeU-A",
  authDomain: "exam-center-1ccfa.firebaseapp.com",
  databaseURL: "https://exam-center-1ccfa-default-rtdb.firebaseio.com",
  projectId: "exam-center-1ccfa",
  storageBucket: "exam-center-1ccfa.appspot.com",
  messagingSenderId: "your-sender-id", // Replace with your sender ID
  appId: "your-app-id" // Replace with your app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const items = ["pen", "extra_sheet", "threads", "tea", "paper"];

items.forEach(item => {
  const ref = database.ref(item);
  ref.on("value", (snapshot) => {
    const data = snapshot.val();
    console.log(`Update for ${item}:`, data); // Debug log
    
    const card = document.getElementById(item);
    const statusElement = card.querySelector(".status");
    const timestampElement = card.querySelector(".timestamp");

    if (data && data.status === "requested") {
      statusElement.classList.remove("available");
      statusElement.classList.add("requested");
      const time = new Date(data.timestamp).toLocaleTimeString();
      timestampElement.textContent = `Last requested: ${time}`;
    } else {
      statusElement.classList.remove("requested");
      statusElement.classList.add("available");
      timestampElement.textContent = data && data.timestamp ? `Last requested: ${new Date(data.timestamp).toLocaleTimeString()}` : "Last requested: Never";
    }
  }, (error) => {
    console.log("Firebase error for " + item + ": " + error);
  });
});
