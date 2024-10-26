// URL base del backend
const BASE_URL = 'http://localhost:3001/api';

// Verificar si el usuario está autenticado
let currentUser = null;

function updateUI() {
  const loginContainer = document.getElementById('loginContainer');
  const dashboardContainer = document.getElementById('dashboardContainer');

  if (currentUser && currentUser.nombre) {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    document.getElementById('welcomeMessage').textContent = `Bienvenido, ${currentUser.nombre}`;
  } else {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
  }
}

// Manejo del formulario de inicio de sesión
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        
        currentUser = await response.json();
        
        updateUI();
        await initializeDashboard();
      } else {
        const errorText = await response.text();
        loginError.textContent = errorText;
      }
    } catch (error) {
      loginError.textContent = 'Error en el servidor';
    }
  });
}

// Inicializar el dashboard
async function initializeDashboard() {
  await fetchTasks();
  await fetchActivities();
  await fetchUsers();
}

// Manejo de la página de tareas
if (document.getElementById('tasksContainer')) {
  const tasksContainer = document.getElementById('tasksContainer');
  const taskFormContainer = document.getElementById('taskFormContainer');
  const taskForm = document.getElementById('taskForm');
  const taskError = document.getElementById('taskError');
  const logoutButton = document.getElementById('logoutButton');
  const addTaskButton = document.getElementById('addTaskButton');
  const cancelButton = document.getElementById('cancelButton');
  const activitySelect = document.getElementById('activitySelect');
  const userSelect = document.getElementById('userSelect');
  let isEditing = false;
  let editingTaskId = null;

  // Obtener el estado de autenticación al cargar la página
  // window.onload = async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/auth/me`, {
  //       method: 'GET',
  //       credentials: 'include'
  //     });

  //     if (response.ok) {
  //       currentUser = await response.json();
  //       updateUI();
  //       await initializeDashboard();
  //     } else {
  //       updateUI();
  //     }
  //   } catch (error) {
  //     updateUI();
  //   }
  // };

  // Función para obtener y renderizar las tareas
  async function fetchTasks() {
    try {
      const response = await fetch(`${BASE_URL}/tarea`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const tasks = await response.json();
        renderTasks(tasks);
      } else {
        tasksContainer.textContent = 'Error al cargar las tareas';
      }
    } catch (error) {
      tasksContainer.textContent = 'Error en el servidor';
    }
  }

  // Función para obtener y poblar las actividades
  async function fetchActivities() {
    try {
      const response = await fetch(`${BASE_URL}/actividad`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const activities = await response.json();
        populateActivities(activities);
      } else {
        activitySelect.innerHTML = '<option value="">Error al cargar actividades</option>';
      }
    } catch (error) {
      activitySelect.innerHTML = '<option value="">Error en el servidor</option>';
    }
  }

  function populateActivities(activities) {
    activitySelect.innerHTML = '<option value="">Seleccione una actividad</option>';
    activities.forEach((activity) => {
      const option = document.createElement('option');
      option.value = activity._id;
      option.textContent = activity.nombre;
      activitySelect.appendChild(option);
    });
  }

  // Función para obtener y poblar los usuarios
  async function fetchUsers() {
    try {
      const response = await fetch(`${BASE_URL}/usuario`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const users = await response.json();
        populateUsers(users);
      } else {
        userSelect.innerHTML = '<option value="">Error al cargar usuarios</option>';
      }
    } catch (error) {
      userSelect.innerHTML = '<option value="">Error en el servidor</option>';
    }
  }

  function populateUsers(users) {
    userSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
    users.forEach((user) => {
      const option = document.createElement('option');
      option.value = user._id;
      option.textContent = `${user.nombre} ${user.apellido}`;
      userSelect.appendChild(option);
    });
  }

  // Renderizar tareas en la página
  function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach((task) => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');

      const taskInfo = document.createElement('div');
      taskInfo.classList.add('task-info');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completado;
      checkbox.addEventListener('change', () => toggleTaskCompletion(task._id, checkbox.checked));

      const taskName = document.createElement('span');
      taskName.textContent = task.nombre;
      if (task.completado) {
        taskName.style.textDecoration = 'line-through';
        taskName.style.color = '#aaa';
      }

      taskInfo.appendChild(checkbox);
      taskInfo.appendChild(taskName);

      const taskActions = document.createElement('div');
      taskActions.classList.add('task-actions');

      const editButton = document.createElement('button');
      editButton.classList.add('edit-btn');
      editButton.innerHTML = '✏️';
      editButton.addEventListener('click', () => editTask(task));

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-btn');
      deleteButton.innerHTML = '🗑️';
      deleteButton.addEventListener('click', () => deleteTask(task._id));

      const commentButton = document.createElement('button');
      commentButton.classList.add('comment-btn');
      commentButton.innerHTML = '💬';
      commentButton.addEventListener('click', () => viewTaskDetails(task));

      taskActions.appendChild(editButton);
      taskActions.appendChild(deleteButton);
      taskActions.appendChild(commentButton);

      taskItem.appendChild(taskInfo);
      taskItem.appendChild(taskActions);

      tasksContainer.appendChild(taskItem);
    });
  }

  // Añadir nueva tarea
  addTaskButton.addEventListener('click', () => {
    isEditing = false;
    editingTaskId = null;
    taskForm.reset();
    document.getElementById('formTitle').textContent = 'Añadir Nueva Tarea';
    taskFormContainer.style.display = 'block';
  });

  // Cancelar acción
  cancelButton.addEventListener('click', () => {
    taskFormContainer.style.display = 'none';
    taskError.textContent = '';
  });

  // Manejo del formulario de tareas (Crear/Editar)
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const activityId = activitySelect.value;
    const userId = userSelect.value;

    const taskData = {
      nombre: taskName,
      descripcion: taskDescription,
      actividad: activityId,
      empleado: userId,
      administrador: currentUser._id
    };

    try {
      let response;
      if (isEditing) {
        response = await fetch(`${BASE_URL}/tarea/${editingTaskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(taskData)
        });
      } else {
        response = await fetch(`${BASE_URL}/tarea`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(taskData)
        });
      }

      if (response.ok) {
        await fetchTasks();
        taskForm.reset();
        taskFormContainer.style.display = 'none';
        taskError.textContent = '';
      } else {
        const errorText = await response.text();
        taskError.textContent = errorText;
      }
    } catch (error) {
      taskError.textContent = 'Error en el servidor';
    }
  });

  // Función para editar tarea
  function editTask(task) {
    isEditing = true;
    editingTaskId = task._id;
    document.getElementById('taskName').value = task.nombre;
    document.getElementById('taskDescription').value = task.descripcion || '';
    activitySelect.value = task.actividad ? task.actividad._id : '';
    userSelect.value = task.empleado ? task.empleado._id : '';
    document.getElementById('formTitle').textContent = 'Editar Tarea';
    taskFormContainer.style.display = 'block';
  }

  // Función para eliminar tarea
  async function deleteTask(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        const response = await fetch(`${BASE_URL}/tarea/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          await fetchTasks();
        } else {
          alert('Error al eliminar la tarea');
        }
      } catch (error) {
        alert('Error en el servidor');
      }
    }
  }

  // Función para marcar tarea como completada
  async function toggleTaskCompletion(id, completed) {
    try {
      const response = await fetch(`${BASE_URL}/tarea/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completado: completed })
      });

      if (response.ok) {
        await fetchTasks();
      } else {
        alert('Error al actualizar la tarea');
      }
    } catch (error) {
      alert('Error en el servidor');
    }
  }

  // Función para ver detalles de la tarea
  function viewTaskDetails(task) {
    alert(`Descripción: ${task.descripcion || 'Sin descripción'}`);
  }

  // Manejo del botón de cerrar sesión
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        currentUser = null;
        updateUI();
      } else {
        alert('Error al cerrar sesión');
      }
    } catch (error) {
      alert('Error en el servidor');
    }
  });
}
