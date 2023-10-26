export function genderToText(value) {
    switch (value) {
        case 1:
            return 'male';
        case 0:
            return 'female';
        case 2:
            return 'other';
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function countPlays(posts) {
    let counter = 0;
    posts.forEach((post) => {
        counter += post.plays;
    })
    return counter
}


// Labels
export const labels = {
    en: {
        'email': 'Email',
        'password': 'Password',
        'login': 'Login',
        'dashboard': 'Dashboard',
        'logout': 'Logout',
        'back-to-app': 'Back to app',
        'plays': 'Plays',
        'followers': 'Followers',
        'posts': 'Posts',
        'recently-uploaded': 'Recently uploaded',
        'recently-followed': 'Recently followed',
        'id': 'ID',
        'title': 'Title',
        'description': 'Description',
        'date': 'Date',
        'post': 'Post',
        'file-path': 'File path',
        'cancel': 'Cancel',
        'update': 'Update',
        'updating': 'Updating',
        'edit-post': 'Edit post',
        'delete-sure': 'Are you sure you want to delete this post?',
        'delete-sure-desc': 'This action cannot be undone.',
        'delete': 'Delete',
        'edit': 'Edit',
    },
    es: {
        'email': 'Correo electrónico',
        'password': 'Contraseña',
        'login': 'Iniciar Sesión',
        'dashboard': 'Panel de Control',
        'logout': 'Cerrar Sesión',
        'back-to-app': 'Volver a la aplicación',
        'plays': 'Reproducciones',
        'followers': 'Seguidores',
        'posts': 'Publicaciones',
        'recently-uploaded': 'Recientemente subido',
        'recently-followed': 'Recientemente seguido',
        'id': 'ID',
        'title': 'Título',
        'description': 'Descripción',
        'date': 'Fecha',
        'post': 'Publicación',
        'file-path': 'Ruta del archivo',
        'cancel': 'Cancelar',
        'update': 'Actualizar',
        'updating': 'Actualizando',
        'edit-post': 'Editar publicación',
        'delete-sure': '¿Está seguro de que desea eliminar esta publicación?',
        'delete-sure-desc': 'Esta acción no se puede deshacer.',
        'delete': 'Eliminar',
        'edit': 'Editar',
    }
}


export const windowLang = (window.navigator.language.split('-')[0] === 'es' || window.navigator.language.split('-')[0] === 'en') ? window.navigator.language.split('-')[0] : 'en';