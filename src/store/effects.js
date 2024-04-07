export const getNotifyPermission = () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            new Notification('Clean.com Notification System', {
                tag: 'permission',
                body: 'Thank you for acception!',
                icon: 'https://www.gostudy.cz/favicon-32x32.png?v=025734c42a541ac752312c6e0c898446'
            })   
        }

        window.location.reload()
    })
}

export const buildNotification = (text = '', prefix = 'System', isReload = true) => {
    const notification = new Notification(`Clean.com | ${prefix}`, {
        tag: 'feedback',
        body: text,
        icon: 'https://img.icons8.com/color/48/museum.png'
    })

    setTimeout(() => {
        notification.close()

        if (isReload) {
            window.location.reload()
        }  
    }, 3e3)     
}