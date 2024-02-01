export const getTime = (date) => {
    const d = new Date(date).toLocaleTimeString().split(" ")
    const hr = d[0].split(":")[0]
    const min = d[0].split(":")[1]
    return (`${hr}:${min} ${d[1]}`)
}