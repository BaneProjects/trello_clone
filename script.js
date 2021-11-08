const addCard = document.getElementsByClassName("add_card"),
  openForm = document.getElementsByClassName("form"),
  cancleBtn = document.getElementsByClassName("cancel_btn");
//console.log(containers);
for (let i = 0; i < addCard.length; i++) {
  addCard[i].addEventListener("click", () => {
    openForm[i].style.display = "block";
    addCard[i].style.display = "none";
  });
}
for (let i = 0; i < cancleBtn.length; i++) {
  cancleBtn[i].addEventListener("click", () => {
    openForm[i].style.display = "none";
    addCard[i].style.display = "flex";
  });
}
document.querySelectorAll(".add_btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    let container =
      e.target.parentElement.parentElement.parentElement.parentElement;
    let openAddCard = e.target.parentElement.parentElement.nextElementSibling;
    //console.log(e.target.parentElement.parentElement.nextElementSibling);
    let value = container.querySelector(".textarea").value;
    let closeArea = e.target.parentElement.parentElement;

    if (value != "") {
      let parent = document.createElement("div");
      parent.className = "list_card_parent draggable";
      parent.setAttribute("draggable", "true");
      let newItem = document.createElement("div");
      newItem.classList.add("list_card");
      newItem.textContent = value;
      currentList = container.querySelector(".container_list");
      currentList.append(newItem);
      container.querySelector(".textarea").value = "";
      var delete_img = document.createElement("img");
      delete_img.src = "images/delete_icon.png";
      delete_img.className = "deleteCard";
      currentList.appendChild(delete_img);
      parent.append(newItem);
      parent.append(delete_img);
      currentList.append(parent);
      closeArea.style.display = "none";
      openAddCard.style.display = "flex";
      LocalStorageData();
      deleteCurrentList();
      Drag_Drop();
    } else {
      alert("The field can not be empty!");
    }
  });
});

function deleteCurrentList() {
  deleteCard = document.querySelectorAll(".deleteCard");
  deleteCard.forEach((btn) => {
    btn.addEventListener("click", (el) => {
      currList = el.target.parentElement;
      currList.remove();

      LocalStorageData();
    });
  });
}
//deleteCurrentList();

//Drag & Drop
function Drag_Drop() {
  let draggables = document.querySelectorAll(".draggable");
  let containers = document.querySelectorAll(".container");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
      LocalStorageData();
    });
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

function LocalStorageData() {
  const data = [];
  const all_column = document.querySelectorAll(".item");

  all_column.forEach((column, index) => {
    const title = column.querySelector(".heading").textContent;
    const cardItems = column.querySelectorAll(".list_card_parent");

    const cardItemsContent = [];

    cardItems.forEach((item) => {
      return cardItemsContent.push(item.textContent);
    });
    data.push({ title: title, items: cardItemsContent });
  });
  localStorage.setItem("data", JSON.stringify(data));
}

window.addEventListener("load", function () {
  const dataFromStorage = localStorage.getItem("data");
  const parsedData = JSON.parse(dataFromStorage);
  const columns = document.querySelectorAll(".title");
  parsedData.forEach((column, index) => {
    const currAddACard = columns.item(index).querySelector(".container");
    column.items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.innerHTML = `<div class="list_card_parent draggable" draggable="true"><div class="list_card">${item}
      </div>
      <img src="images/delete_icon.png" class="deleteCard">
      </div>`;
      columns.item(index).insertBefore(itemDiv, currAddACard);
    });
    Drag_Drop();
    deleteCurrentList();
  });
});
