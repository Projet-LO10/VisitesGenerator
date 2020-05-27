import fetch from 'node-fetch'

const fetchMuseums = (ville) => {
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-et-localisation-des-musees-de-france&q=&rows=-1&facet=departement&facet=region&refine.ville=${ville.toUpperCase()}`
    ).then((x) => x.json())
}

const fetchMonuments = (ville) => {
    const refine = ville.toUpperCase() === 'PARIS' ? 'dpt_lettre' : 'commune'
    return fetch(
        `https://data.culture.gouv.fr/api/records/1.0/search/?dataset=liste-des-immeubles-proteges-au-titre-des-monuments-historiques&q=&facet=reg&facet=dpt_lettre&refine.${refine}=${ville}`
    ).then((x) => x.json())
}

const fetchWeather = (lat, lon) => {
    return fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&country=FR&lang=fr&key=e4669577bb74436e9dd4bba4fd820014`).then((x) =>
        x.json()
    )
}

/**
 * Retourne une promesse :
 * resolve (then) quand tous les fetch ont été accomplis. Le premier paramètre du then est un objet content les résultats des différents fetch @see keys
 * reject (catch) quand le nombre de promesses n'est pas respecté
 * @param {*} ville 
 * @param {*} lat 
 * @param {*} lon 
 */
const fetchAll = (ville, lat, lon) => {
    // Les clés présentes dans l'objet présent dans le then
    const keys = ['weather', 'museums', 'monuments']
    const promises = [fetchWeather(lat, lon), fetchMuseums(ville), fetchMonuments(ville)]
    return Promise.all(promises).then(
        (array) =>
            new Promise((resolve, reject) => {
                array.length !== promises.length && keys.length != promises.length && reject('Nombre de promesses incorrect')
                resolve(
                    keys.reduce((acc, curr, i) => {
                        acc[curr] = array[i]
                        return acc
                    }, {})
                )
            })
    )
}

export { fetchAll }