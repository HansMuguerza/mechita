const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 * @param {string} medida the description of the Task
 */
const saveTask = (title, description, medida) =>
  db.collection("tasks").doc().set({
    title,
    description,
    medida,
  });

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      /* tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary" id="card-product">
    <h3 class="h5">${task.title.toUpperCase()}</h3>
    <div class="precio-table">
      <p>S/ ${task.description.toUpperCase()}</p>
    </div>
    <div class="medida-table">
      <p>${task.medida.toUpperCase()}</p>
    </div>
    <div>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
          🖉 Editar
        </button>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Borrar
      </button>
    </div>
  </div>`;
    }); */

      tasksContainer.innerHTML += `<tr>
    <td>${task.title.toUpperCase()}</td>
    <td class="precio"><span class="moneda">S/ </span>${task.description.toUpperCase()}</td>
    <td>${task.medida.toUpperCase()}</td>
    <div>
      <td><button class="boton btn-edit" data-id="${doc.id}"><span class="material-icons">create</span>Editar
      </button></td>
      <td><button class="boton btn-delete" data-id="${doc.id}"><span class="material-icons">delete</span></button></td>
    </tr>
    </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-title"].value = task.title;
          taskForm["task-description"].value = task.description;
          taskForm["task-medida"].value = task.medida;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Actualizar";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const medida = taskForm["task-medida"];

  try {
    if (!editStatus) {
      await saveTask(title.value, description.value, medida.value);
    } else {
      await updateTask(id, {
        title: title.value,
        description: description.value,
        medida: medida.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Guardar';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});




function sumar() {
  const $total = document.getElementById('total');
  let subtotal = 0;
  [...document.getElementsByClassName("monto")].forEach(function (element) {
    if (element.value !== '') {
      subtotal += parseFloat(element.value);
    }
  });

  $total.value = subtotal.toFixed(2);
}

function calcularVuelto() {
  try {
    var a = parseFloat(document.getElementById("pago").value) || 0,
      b = parseFloat(document.getElementById("total").value) || 0;

    document.getElementById("vuelto").value = a - b.toFixed(2);
  } catch (e) {}
}