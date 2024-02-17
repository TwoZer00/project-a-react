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
        'register': 'Register',
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
        'welcome-login': 'Welcome back',
        'welcome-login1': 'Please login to your account',
        'welcome-register': 'Welcome',
        'welcome-register1': 'Please create an account',
    },
    es: {
        'email': 'Correo electrónico',
        'password': 'Contraseña',
        'register': 'Registrarse',
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
        'welcome-login': 'Bienvenido de nuevo',
        'welcome-login1': 'Por favor inicie sesión en su cuenta',
        'welcome-register': 'Bienvenido',
        'welcome-register1': 'Por favor cree una cuenta',
    }
}

export const firebaseErrorsMessages = {
    en: {
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email',
        'auth/user-not-found': 'User not found',
        'auth/wrong-password': 'Wrong password',
        'auth/too-many-requests': 'Too many requests',
        'auth/user-disabled': 'User disabled',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Weak password',
        'auth/internal-error': 'Internal error',
        'auth/invalid-phone-number': 'Invalid phone number',
        'auth/invalid-verification-code': 'Invalid verification code',
        'auth/missing-phone-number': 'Missing phone number',
        'auth/missing-verification-code': 'Missing verification code',
        'auth/credential-already-in-use': 'Credential already in use',
        'auth/invalid-credential': 'Invalid credential',
        'auth/operation-not-supported-in-this-environment': 'Operation not supported in this environment',
        'auth/invalid-api-key': 'Invalid API key',
        'auth/invalid-user-token': 'Invalid user token',
        'auth/app-deleted': 'App deleted',
    },
    es: {
        'auth/email-already-in-use': 'Email ya en uso',
        'auth/invalid-email': 'Email invalido',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',

    }
}


export const windowLang = (window.navigator.language.split('-')[0] === 'es' || window.navigator.language.split('-')[0] === 'en') ? window.navigator.language.split('-')[0] : 'en';