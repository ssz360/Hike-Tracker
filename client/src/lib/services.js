window.shouldCallApi = true;
const GetAddressFromPoint = (lat, lng) => new Promise((resolve, reject) => {
    if (!window.shouldCallApi) return;
    // it prevents the api to be called several times (each call must be 2 seconds gap)
    window.shouldCallApi = false;
    setTimeout(() => {
        window.shouldCallApi = true;
    }, 2000);

    try {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`).then(res => res.json())
            .then(res => {
                resolve(res);
            }).catch(reject);
    } catch (error) {
        reject(error);
    }
})

const services = { GetAddressFromPoint };
export default services;
