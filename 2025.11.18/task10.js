const container = document.getElementById("container");

const square = document.createElement("div");
square.style.width = "200px";
square.style.height = "200px";
square.style.backgroundColor = "blue";
square.style.position = "relative";

const circle = document.createElement("div");
circle.style.width = "100px";
circle.style.height = "100px";
circle.style.border = "5px solid white"; 
circle.style.borderRadius = "50%";
circle.style.position = "absolute";
circle.style.top = "50%";
circle.style.left = "50%";
circle.style.transform = "translate(-50%, -50%)";

square.appendChild(circle);

container.appendChild(square);
