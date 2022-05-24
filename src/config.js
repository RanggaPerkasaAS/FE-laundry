const baseUrl = "http://localhost:8000"
const formatNumber = (num) => {
    return parseFloat(num).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

const authorization = {
    headers :{
        Authorization : `Bearer ${localStorage.getItem("token")}`
    }
}
const formatDate = (tanggal) => {
    return new Date(tanggal).toLocaleDateString()
}
export{
    baseUrl, formatNumber, authorization, formatDate
}