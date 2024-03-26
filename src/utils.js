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
        'my-profile': 'My profile',
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
        'valid-user-length': 'Username must be atleast 3 characters long',
        'valid-user-exist': 'Username already exists',
        'valid-password-match': 'Passwords do not match',
        'preferences': 'Preferences',
        'nsfw': 'NSFW',
        'nsfw-sub': 'Show NSFW post(must be considered of legal age in your place of residence)',
        'theme': 'Theme',
        'theme-sub': 'Set theme of app(setted as navigator by default)',
        'theme-selector-options': { 'automatic': { val: 'default', label: 'automatic' }, 'light': { val: 'light', label: 'light' }, 'dark': { val: 'dark', label: 'dark' } },
        'profile': 'profile',
        'profiles': 'profile\'s',
        'username': 'username',
        'description': 'description',
        'password': 'password',
        'cpassword': 'confirm password',
        'upload': 'upload',
        'title': 'title',
        'tags': 'tags',
        'category': 'category',
        'visibility': 'visibility',
        'visibility-options': { 'public': { label: 'available for everyone' }, 'private': { label: 'available for no one' }, 'no-listed': { label: 'available using link' } },
        'categories': { 'audiobook': { label: 'audiobook', value: 'audiobook' }, 'effects': { label: 'effects', value: 'effects' }, 'general': { label: 'general', value: 'general' }, 'music': { label: 'music', value: 'music' } },
        'posts': 'posts',
        'plays': 'plays',
        'follower': 'follower',
        'recent-posts': 'recent posts',
        'latest-posts': 'latests posts',
        'latest-followers': 'latest followers',
        'comments': 'comments',
        'no-posts': 'no posts',
        'no-comments': 'no comments',
        'no-followers': 'no followers',
        'go-back-app': 'Go back app',
        'profile': 'Profile',
        'settings': 'settings'
    },
    es: {
        'my-profile': 'Mi perfil',
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
        'valid-user-length': 'El nombre de usuario debe tener al menos 3 caracteres',
        'valid-user-exist': 'El nombre de usuario ya existe',
        'valid-password-match': 'Las contraseñas no coinciden',
        'preferences': 'Preferencias',
        'nsfw': 'NSFW',
        'nsfw-sub': 'Mostrar publicaciones NSFW(debes ser considerado mayor de edad)',
        'theme': 'Tema',
        'theme-sub': 'Aplica el tema(Aplicado del navegador por defecto)',
        'theme-selector-options': { 'automatic': { val: 'default', label: 'automatico' }, 'light': { val: 'light', label: 'claro' }, 'dark': { val: 'dark', label: 'obscuro' } },
        'profile': 'perfile',
        'profiles': 'perfil de',
        'username': 'nombre de usuario',
        'description': 'description',
        'password': 'password',
        'cpassword': 'confirm password',
        'upload': 'subir',
        'title': 'título',
        'tags': 'etiquetas',
        'category': 'categorias',
        'visibility': 'visibilidad',
        'visibility-options': { 'public': { label: 'disponible para todos' }, 'private': { label: 'no disponible para nadie' }, 'no-listed': { label: 'disponible solo atravez de vinculo' } },
        'categories': { 'audiobook': { label: 'audio libro', value: 'audiobook' }, 'effects': { label: 'efectos', value: 'effects' }, 'general': { label: 'general', value: 'general' }, 'music': { label: 'musica', value: 'music' } },
        'posts': 'publicaciones',
        'plays': 'reproducciones',
        'follower': 'seguidor',
        'recent-posts': 'publicaciones recientes',
        'latest-posts': 'últimas publicaciones',
        'latest-followers': 'últimos seguidores',
        'comments': 'comentarios',
        'no-posts': 'sin publicaciones',
        'no-comments': 'sin comentarios',
        'no-followers': 'sin seguidores',
        'go-back-app': 'Regresar',
        'profile': 'Perfil',
        'settings': 'configuraciones'
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