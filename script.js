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

// Firebase real-time listeners
classes.forEach(className => {
  items.forEach(item => {
    const ref = database.ref(`${className}/${item}`);
    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log(`[${new Date().toLocaleTimeString()}] Update for ${className}/${item}:`, data);

      const card = document.getElementById(`${className}-${item}`);
      const statusElement = card.querySelector(".status-circle");
      const timestampElement = card.querySelector(".timestamp");

      if (data && data.status === "requested") {
        statusElement.classList.remove("available");
        statusElement.classList.add("requested");
      } else {
        statusElement.classList.remove("requested");
        statusElement.classList.add("available");
      }
      timestampElement.textContent = data && data.timestamp ? 
        `Last updated: ${new Date(data.timestamp).toLocaleTimeString()}` : "Last updated: Never";
    }, (error) => {
      console.error(`Firebase error for ${className}/${item}: ${error}`);
    });
  });
});

// Function to handle class renaming
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
