let tasks = [];
while (true) {
  let command = prompt("Enter a command:\nadd / view / delete");
  if (command === "add") {
    let newTask = prompt("Enter a new task:");
    tasks.push(newTask);
    alert(`"${newTask}" added to your list.`);
  }
  else if (command === "view") {
    if (tasks.length === 0) {
      alert("No tasks to show.");
    } else {
      let list = "Your Tasks:\n";
      for (let i = 0; i < tasks.length; i++) {
        list += `${i}: ${tasks[i]}\n`;
      }
      alert(list);
    }
  }
  else if (command === "delete") {
    let index = prompt("Enter the index of the task to delete:");
    if (index >= 0 && index < tasks.length) {
      let removed = tasks.splice(index, 1);
      alert(`Deleted: "${removed[0]}"`);
    } else {
      alert("Invalid index!");
    }
  }
  else {
    alert("Unknown command.");
  }
}
