class Api {
    constructor() {

    }

    getDataFromApi() {
        return fetch('https://covid19.mathdro.id/api/confirmed');
    }


}
