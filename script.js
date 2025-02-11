

const RUTA_ACCESO = "C:/Users/50683/Desktop/EscManejo/version3/produccion/admin/login/index.html";
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc3VsZnd3amxlbmhxYnh3bXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODQzMjcsImV4cCI6MjA0NDM2MDMyN30.gzUiqwnfWMxwKB8s2VH13gE8NKgu92D0ZatnmsPZ-58';
const USUARIO = 'escusuario456@yahoo.com';
const API_URL = 'https://adsulfwwjlenhqbxwmyo.supabase.co/auth/v1/token?grant_type=password';
const API_URL2 = 'https://adsulfwwjlenhqbxwmyo.supabase.co/auth/v1/user?';
const API_URL3 = 'https://adsulfwwjlenhqbxwmyo.supabase.co/rest/v1/rpc/actualizar_clave';



const idDivKey = document.getElementById('id-div-key');
const idDivChange = document.getElementById('id-div-change');
const typeChange = document.getElementById('typeChange');
const btnUpdate = document.getElementById('update');
const btnCancel = document.getElementById('cancel');
//const rutaAcceso = 'C:/Users/50683/Desktop/api/admin/login.html';
const sesionTerminada = {
    terminada: false
};


let referencia = {
    opcion: 0
};


document.getElementById('changeExamen').addEventListener('click', () => {
    idDivKey.style.display = 'none';
    idDivChange.style.display = 'block';

    document.getElementById("etiqueta1").innerHTML = "Ingresa la clave actual";

    document.getElementById("id-actual-key").value = '';
    let temp = document.getElementById("examKey").innerText;
    typeChange.innerHTML = "Clave actual del cliente: " + ` <b id="actualKey">${temp}</b>`;
    referencia.opcion = 1;

});



document.getElementById('changeAdmin').addEventListener('click', () => {
    idDivKey.style.display = 'none';
    idDivChange.style.display = 'block';
    let etiqueta1 = document.getElementById("etiqueta1");
    etiqueta1.innerHTML = "Ingresa la nueva clave";
    let temp = document.getElementById("adminKey").innerText;
    typeChange.innerHTML = "Clave actual del administrador: " + ` <b id="actualKey">${temp}</b>`;
    referencia.opcion = 2;

});



btnUpdate.addEventListener("click", () => {
    let temp2 = document.getElementById("id-actual-key").value;

    if (referencia.opcion === 1) {



        changePassword(USUARIO, temp2, "cliente");



    } else {

        changePassword('', temp2, "administrador");


    }



});



btnCancel.addEventListener("click", () => {
    idDivChange.style.display = 'none';
    idDivKey.style.display = 'block';
});



async function accessUser(email, password) {

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': APIKEY

            },
            body: JSON.stringify({ email, password })
        });
        /*
                if (response.status === 429) {
                    alert("Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo más tarde.");
                    return;
                }*/

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Actualización fallida');
        }

        const data = await response.json();
        const token = data.access_token;
        // Guardar el token en localStorage
        localStorage.setItem('accessToken', token);
    } catch (error) {
        console.error('Error durante el cambio:', error);
        alert('Error en la contraseña actual');
    }
}

// Función para cambiar la contraseña
// Función para cambiar la contraseña
const changePassword = async (username, newPassword, user) => {
    let token = null;

    if (newPassword.length < 6) {
        alert('La clave debe más de 6 carácteres');
        return;
    }

    try {
        // Obtener token según el tipo de usuario
        if (user === 'cliente') {
            token = localStorage.getItem('AdminAccessToken'); // Token para admin

            const response = await fetch(API_URL3, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': APIKEY,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ p_clave: newPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud.');
            }else{
                alert('Clave de usuario cambiada con éxito');
            }

        } else {
            // Admin
            token = localStorage.getItem('AdminAccessToken'); // Token para admin


            // Verificar si el token se obtuvo correctamente
            if (!token) {
                throw new Error('No se ha encontrado un token de autenticación.');
            }

            // Hacer la solicitud PATCH/PUT para cambiar la contraseña
            const response = await fetch(API_URL2, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': APIKEY,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud.');
            }

            // Si la respuesta fue exitosa
            const data = await response.json();
            alert('Clave cambiada con éxito');

        }
        // Mostrar alerta de éxito

        // Actualizar la UI con la nueva clave
        typeChange.innerHTML = `Clave actual del ${user}: <b id="actualKey">${newPassword}</b>`;

        if (referencia.opcion === 1) {
            document.getElementById("examKey").innerHTML = newPassword;
        } else {
            document.getElementById("adminKey").innerHTML = newPassword;
        }

    } catch (error) {
        // Manejar errores
        alert('Error al cambiar la clave');
        console.error('Error:', error.message);
    }

};


// Ejemplo de uso


function isTokenExpired() {
    const token = localStorage.getItem('AdminAccessToken');
    if (!token) {
        return true;
    }

    const decoded = jwt_decode(token);
    if (decoded.role !== 'authenticated') {
        return true;
    }
    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // Convertir a segundos
        return decoded.exp < currentTime;
    } catch (e) {
        console.error('Error al decodificar el token:', e);
        return true;
    }
}

// Función para manejar el logout
function handleLogout() {
    localStorage.removeItem('AdminAccessToken');
    localStorage.removeItem('accessToken');

    window.location.href = RUTA_ACCESO; // Redirigir al contenido protegido
}

// Verificar el token al cargar la página
function checkToken() {


    if (isTokenExpired()) {
        localStorage.removeItem('AdminAccessToken');
        localStorage.removeItem('accessToken');
        window.location.href = RUTA_ACCESO; // Redirigir al contenido protegido
    }
}

document.addEventListener('DOMContentLoaded', checkToken);

// Verificar el token cuando la página se vuelve visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        checkToken();
    }
});

// Manejo del logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
    handleLogout();
});



document.getElementById('cerrar')?.addEventListener('click', () => {
    handleLogout();
});

