// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH5c9ePeBLC-G00gV-aBZuw6MvH0CeU-A",
  authDomain: "exam-center-1ccfa.firebaseapp.com",
  databaseURL: "https://exam-center-1ccfa-default-rtdb.firebaseio.com",
  projectId: "exam-center-1ccfa",
  storageBucket: "exam-center-1ccfa.appspot.com",
  messagingSenderId: "your-sender-id", // Replace with your sender ID
  appId: "your-app-id" // Replace with your app ID
};

// Initialize Firebase with error handling
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const database = firebase.database();

// Load custom class names from local storage or use defaults
const defaultClassNames = { "class1": "Class 1", "class2": "Class 2" };
const classNames = {
  "class1": localStorage.getItem("class1-name") || defaultClassNames["class1"],
  "class2": localStorage.getItem("class2-name") || defaultClassNames["class2"]
};

// Apply initial class names
document.getElementById("class1-name").textContent = classNames["class1"];
document.getElementById("class2-name").textContent = classNames["class2"];

const items = ["pen", "extra_sheet", "threads", "tea", "paper"];
const classes = ["class1", "class2"];

// Firebase real-time listeners with enhanced debugging
classes.forEach(className => {
  items.forEach(item => {
    const ref = database.ref(`${className}/${item}`);
    console.log(`Setting listener for ${className}/${item}`);
    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log(`[${new Date().toLocaleTimeString()}] Update received for ${className}/${item}:`, data);

      const card = document.getElementById(`${className}-${item}`);
      if (!card) {
        console.error(`Card not found for ${className}-${item}`);
        return;
      }

      const statusElement = card.querySelector(".status-circle");
      const timestampElement = card.querySelector(".timestamp");
      if (!statusElement || !timestampElement) {
        console.error(`Status or timestamp element missing for ${className}-${item}`);
        return;
      }

      if (data && data.status === "requested") {
        console.log(`Setting ${className}/${item} to requested`);
        statusElement.classList.remove("available");
        statusElement.classList.add("requested");
      } else {
        console.log(`Setting ${className}/${item} to available`);
        statusElement.classList.remove("requested");
        statusElement.classList.add("available");
      }
      
      timestampElement.textContent = data && data.timestamp ? 
        `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}` : "Last updated: Never";
    }, (error) => {
      console.error(`Firebase listener error for ${className}/${item}:`, error);
    });
  });
});

// Rename class function
function renameClass(classId) {
  const currentName = classNames[classId];
  const newName = prompt(`Enter new name for ${currentName}:`, currentName);
  
  if (newName && newName.trim() !== "") {
    classNames[classId] = newName.trim();
    document.getElementById(`${classId}-name`).textContent = newName.trim();
    localStorage.setItem(`${classId}-name`, newName.trim());
    console.log(`Renamed ${classId} to ${newName}`);
  } else if (newName !== null) {
    alert("Class name cannot be empty!");
  }
}
