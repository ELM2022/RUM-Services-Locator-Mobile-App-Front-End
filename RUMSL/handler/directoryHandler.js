import axios from "axios";

export const getAllOffices = () => {
    return axios
        .get(`https://rumsl-backend.herokuapp.com/offices/active`)
        .then( response => {
            return response
        })
        .catch(err => {
            return err.response
        })
}

export const getAutoComplete = (inputKeyword) => {
    return axios
        .get(`https://rumserviceslocator.search.windows.net/indexes/offices/docs/autocomplete?search="`+inputKeyword+`"&$top=5&suggesterName=sg&api-version=2020-06-30`,{
            headers:{
                'api-key':'0E5B5634DA650124E372C7E75EEFD9C7'
            }
        })
        .then( response => {
            return response
        })
        .catch(err => {
            return err.response
        })
}
export const getServices = (inputKeyword) => {
    return axios
        .get(`https://rumserviceslocator.search.windows.net/indexes/offices/docs/?search="`+inputKeyword+`"&api-version=2020-06-30`,{
            headers:{
                'api-key':'0E5B5634DA650124E372C7E75EEFD9C7'
            }
        })
        .then( response => {
            return response
        })
        .catch(err => {
            return err.response
        })
}

export const getAllOfficesByCategories = () => {
    return axios
    .get(`https://rumsl-backend.herokuapp.com/offices/category/membership`)
    .then((response) => {
        return response;
    })
    .catch((err) => {
        return err.response;
    })
}

export const getOfficeByID = (officeID) => {
    return axios
    .get(`https://rumsl-backend.herokuapp.com/offices/${officeID}`)
    .then((response) => {
        return response;
    })
    .catch((err) => {
        return err.response;
    })
}





